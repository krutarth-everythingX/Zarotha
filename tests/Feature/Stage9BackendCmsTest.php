<?php

namespace Tests\Feature;

use App\Enums\InquiryActivityType;
use App\Enums\PublishStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\ContactInformation;
use App\Models\Client;
use App\Models\HomepageSection;
use App\Models\HomepageSectionBanner;
use App\Models\Inquiry;
use App\Models\InquiryActivity;
use App\Models\MediaAsset;
use App\Models\MediaVariant;
use App\Models\Page;
use App\Models\Product;
use App\Models\Redirect;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class Stage9BackendCmsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_role_backed_users_expose_cms_capabilities(): void
    {
        $superAdmin = $this->userFor(UserRole::SuperAdministrator);
        $contentEditor = $this->userFor(UserRole::ContentEditor);
        $inquiryManager = $this->userFor(UserRole::InquiryManager);

        $this->assertTrue($superAdmin->canAccessCms());
        $this->assertTrue($superAdmin->canManageContent());
        $this->assertTrue($superAdmin->canManageInquiries());
        $this->assertTrue($contentEditor->canManageContent());
        $this->assertFalse($contentEditor->canManageInquiries());
        $this->assertTrue($inquiryManager->canManageInquiries());
        $this->assertFalse($inquiryManager->canManageContent());
    }

    public function test_stage_9_policies_match_role_boundaries(): void
    {
        $superAdmin = $this->userFor(UserRole::SuperAdministrator);
        $contentEditor = $this->userFor(UserRole::ContentEditor);
        $inquiryManager = $this->userFor(UserRole::InquiryManager);
        $category = Category::factory()->create();
        $product = Product::factory()->create();
        $inquiry = Inquiry::factory()->create();

        $this->assertTrue(Gate::forUser($contentEditor)->allows('create', Product::class));
        $this->assertFalse(Gate::forUser($inquiryManager)->allows('create', Product::class));
        $this->assertTrue(Gate::forUser($inquiryManager)->allows('update', $inquiry));
        $this->assertFalse(Gate::forUser($contentEditor)->allows('update', $inquiry));
        $this->assertTrue(Gate::forUser($superAdmin)->allows('delete', $category));
        $this->assertFalse(Gate::forUser($contentEditor)->allows('delete', $category));
        $this->assertTrue(Gate::forUser($superAdmin)->allows('manageUsers', User::class));
        $this->assertFalse(Gate::forUser($contentEditor)->allows('manageUsers', User::class));
        $this->assertTrue(Gate::forUser($contentEditor)->allows('viewAny', Product::class));
        $this->assertFalse(Gate::forUser($inquiryManager)->allows('viewAny', Category::class));
    }

    public function test_category_delete_is_blocked_when_products_reference_it(): void
    {
        $admin = $this->userFor(UserRole::SuperAdministrator);
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $product->category));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHasErrors('category');
        $this->assertDatabaseHas('categories', ['id' => $product->category_id]);
    }

    public function test_product_store_validates_without_collection_fields(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $category = Category::factory()->create();

        $response = $this->actingAs($editor)->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'name' => 'Hand Carved Panel',
            'slug' => 'hand-carved-panel',
            'short_description' => 'A catalogue-ready product summary.',
            'full_description' => 'Longer catalogue description.',
            'dimensions' => '24 x 18 in',
            'material' => 'Wood',
            'finish' => 'Natural',
            'status' => PublishStatus::Draft->value,
            'sort_order' => 2,
            'is_featured' => false,
            'is_best_selling' => false,
            'is_latest' => true,
            'robots_index' => true,
            'robots_follow' => true,
            'regular_price' => 0,
            'is_track_inventory' => false,
        ]);

        $product = Product::query()->where('slug', 'hand-carved-panel')->firstOrFail();

        $response->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'category_id' => $category->id,
            'created_by_user_id' => $editor->id,
        ]);
    }

    public function test_inquiry_status_update_creates_activity(): void
    {
        $manager = $this->userFor(UserRole::InquiryManager);
        $inquiry = Inquiry::factory()->create();

        $response = $this->actingAs($manager)->post(route('admin.inquiries.update-status', $inquiry), [
            'status' => 'replied',
        ]);

        $response->assertRedirect(route('admin.inquiries.show', $inquiry));
        $this->assertDatabaseHas('inquiries', [
            'id' => $inquiry->id,
            'status' => 'replied',
        ]);
        $this->assertDatabaseHas('inquiry_activities', [
            'inquiry_id' => $inquiry->id,
            'actor_user_id' => $manager->id,
            'activity_type' => InquiryActivityType::StatusChanged->value,
            'old_status' => 'unread',
            'new_status' => 'replied',
        ]);
    }

    public function test_inquiry_export_with_no_matching_rows_does_not_create_orphan_activity(): void
    {
        $manager = $this->userFor(UserRole::InquiryManager);

        $response = $this->actingAs($manager)->post(route('admin.inquiries.export'), [
            'status' => 'archived',
        ]);

        $response->assertOk();
        $this->assertSame(0, InquiryActivity::query()->count());
    }

    public function test_inquiry_export_includes_project_fields_and_uploaded_images(): void
    {
        $manager = $this->userFor(UserRole::InquiryManager);

        Inquiry::factory()->create([
            'name' => 'Project Lead',
            'email' => 'lead@example.com',
            'phone' => '9999999999',
            'subject' => 'Office furniture',
            'project_location' => 'Surat, Gujarat',
            'project_state' => 'Gujarat',
            'project_country' => 'India',
            'budget_range' => 'Rs. 3 lakh+',
            'expected_project_start' => '2026-09-15',
            'uploaded_images' => [
                [
                    'name' => 'floor-plan.png',
                    'path' => 'inquiries/2026/07/floor-plan.png',
                    'url' => '/storage/inquiries/2026/07/floor-plan.png',
                    'mime_type' => 'image/png',
                    'size' => 12345,
                ],
            ],
        ]);

        $response = $this->actingAs($manager)->post(route('admin.inquiries.export'));

        $response->assertOk();

        ob_start();
        $response->sendContent();
        $csv = (string) ob_get_clean();

        $this->assertStringContainsString('"Inquiry Type","Project Location","Project State","Project Country","Budget Range","Expected Project Start",Message,"Uploaded Images"', $csv);
        $this->assertStringContainsString('"Office furniture","Surat, Gujarat",Gujarat,India,"Rs. 3 lakh+",2026-09-15', $csv);
        $this->assertStringContainsString('floor-plan.png', $csv);
    }

    public function test_redirect_self_and_two_hop_loops_are_rejected(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        Redirect::factory()->create([
            'source_path' => '/old',
            'target_path' => '/new',
        ]);

        $selfLoop = $this->actingAs($editor)->from(route('admin.redirects.index'))->post(route('admin.redirects.store'), [
            'source_path' => '/same',
            'target_path' => '/same',
            'redirect_type' => 'manual',
            'http_status' => 301,
            'is_active' => true,
        ]);

        $selfLoop->assertRedirect(route('admin.redirects.index'));
        $selfLoop->assertSessionHasErrors('target_path');

        $twoHopLoop = $this->actingAs($editor)->from(route('admin.redirects.index'))->post(route('admin.redirects.store'), [
            'source_path' => '/new',
            'target_path' => '/old',
            'redirect_type' => 'manual',
            'http_status' => 301,
            'is_active' => true,
        ]);

        $twoHopLoop->assertRedirect(route('admin.redirects.index'));
        $twoHopLoop->assertSessionHasErrors('redirect');
    }

    public function test_super_admin_only_settings_update_and_admin_pages_resolve(): void
    {
        $superAdmin = $this->userFor(UserRole::SuperAdministrator);
        $contentEditor = $this->userFor(UserRole::ContentEditor);

        $this->actingAs($contentEditor)->patch(route('admin.settings.update'), [
            'site_name' => 'Zarokha Wooden Arts',
        ])->assertForbidden();

        $this->actingAs($superAdmin)->patch(route('admin.settings.update'), [
            'site_name' => 'Zarokha Wooden Arts',
        ])->assertRedirect(route('admin.settings.edit'));

        $this->actingAs($contentEditor)->get(route('admin.products.index'))->assertOk();
        $this->actingAs($contentEditor)->get(route('admin.redirects.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('admin.users.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('admin.activity.index'))->assertOk();
    }

    public function test_homepage_cms_save_validates_caps_and_persists_typed_content(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $media = $this->processedMedia();

        $this->actingAs($editor)->get(route('admin.homepage.edit'))->assertOk();

        $response = $this->actingAs($editor)->patch(route('admin.homepage.update'), [
            'hero' => [
                'heading' => 'Custom homepage heading',
                'subtext' => 'CMS hero subtext.',
                'desktop_media_id' => $media->id,
                'mobile_media_id' => $media->id,
                'primary_button_label' => 'View Products',
                'primary_button_url' => '/products',
                'secondary_button_label' => 'Contact',
                'secondary_button_url' => '/contact',
                'overlay_opacity' => 30,
                'text_theme' => 'light',
                'is_visible' => true,
                'items' => [
                    [
                        'imageMediaId' => $media->id,
                        'sortOrder' => 0,
                        'isVisible' => true,
                    ],
                ],
            ],
            'turnkey' => [
                'eyebrow' => 'Complete custom',
                'title' => 'Furniture solutions from CMS',
                'subtitle' => 'CMS turnkey copy.',
                'button_url' => 'https://www.youtube.com/watch?v=abcDEF12345',
                'is_visible' => true,
                'items' => [
                    [
                        'heading' => 'CMS Service',
                        'body_text' => 'CMS service text.',
                        'sort_order' => 0,
                        'is_active' => true,
                    ],
                ],
            ],
            'aboutPreview' => [
                'eyebrow' => 'About CMS',
                'title' => 'About section from CMS',
                'subtitle' => 'CMS about intro.',
                'body' => 'CMS about body.',
                'primary_button_label' => 'Read about us',
                'primary_button_url' => '/about-us',
                'secondary_button_label' => 'Talk to us',
                'secondary_button_url' => '/contact',
                'background_media_id' => $media->id,
                'is_visible' => true,
                'points' => [
                    [
                        'heading' => 'CMS quality point',
                        'body_text' => '',
                        'sort_order' => 0,
                        'is_active' => true,
                    ],
                ],
            ],
            'latest' => [
                'title' => 'Latest Products',
                'subtitle' => 'Recently published.',
                'max_items' => 10,
                'view_all_label' => 'View All Products',
                'view_all_url' => '/products',
                'is_visible' => true,
            ],
            'industryStats' => [
                'title' => '#1 Furniture Manufacturing Industry.',
                'highlight' => 'Manufacturing',
                'subtitle' => 'Factory-built confidence.',
                'body' => 'Need support? :contact or :more',
                'contact_label' => 'contact us',
                'contact_url' => '/contact',
                'more_label' => 'View More',
                'more_url' => '/products',
                'is_visible' => true,
                'items' => [
                    [
                        'heading' => '7000',
                        'body_text' => 'Residential Projects',
                        'sort_order' => 0,
                        'is_active' => true,
                    ],
                ],
            ],
            'quickInquiry' => [
                'title' => 'Quick Inquiry',
                'subtitle' => 'Send a note.',
                'button_label' => 'Inquiry',
                'button_url' => '/contact',
                'background_media_id' => $media->id,
                'background_color' => '#ffffff',
                'is_visible' => true,
                'items' => [
                    [
                        'imageMediaId' => $media->id,
                        'sortOrder' => 0,
                        'isVisible' => true,
                    ],
                ],
            ],
            'settings' => [
                'whatsapp_text' => 'Hello CMS',
                'whatsapp_number' => '+919999999999',
            ],
        ]);

        $response->assertRedirect(route('admin.homepage.edit'));
        $this->assertDatabaseHas('hero_banners', [
            'headline' => 'Custom homepage heading',
            'desktop_media_id' => $media->id,
            'secondary_cta_label' => 'Contact',
            'overlay_opacity' => 30,
        ]);
        $this->assertDatabaseHas('homepage_section_banners', [
            'homepage_section_id' => HomepageSection::query()->where('section_key', 'hero')->firstOrFail()->id,
            'media_asset_id' => $media->id,
            'is_visible' => true,
        ]);
        $this->assertDatabaseHas('contact_information', [
            'whatsapp_number' => '+919999999999',
            'whatsapp_text' => 'Hello CMS',
        ]);
        $turnkeySection = HomepageSection::query()->where('section_key', 'turnkey_solutions')->firstOrFail();
        $this->assertSame('Furniture solutions from CMS', $turnkeySection->section_title);
        $this->assertSame('https://www.youtube.com/watch?v=abcDEF12345', $turnkeySection->cta_url);
        $this->assertNull($turnkeySection->background_media_id);
        $this->assertDatabaseHas('why_choose_us_items', [
            'homepage_section_id' => $turnkeySection->id,
            'heading' => 'CMS Service',
            'body_text' => 'CMS service text.',
        ]);
        $aboutPreviewSection = HomepageSection::query()->where('section_key', 'about_preview')->firstOrFail();
        $this->assertSame('About section from CMS', $aboutPreviewSection->section_title);
        $this->assertDatabaseHas('why_choose_us_items', [
            'homepage_section_id' => $aboutPreviewSection->id,
            'heading' => 'CMS quality point',
        ]);
        $this->assertDatabaseHas('homepage_section_banners', [
            'homepage_section_id' => HomepageSection::query()->where('section_key', 'quick_inquiry')->firstOrFail()->id,
            'media_asset_id' => $media->id,
            'is_visible' => true,
        ]);
        $industryStatsSection = HomepageSection::query()->where('section_key', 'industry_stats')->firstOrFail();
        $this->assertSame('#1 Furniture Manufacturing Industry.', $industryStatsSection->section_title);
        $this->assertDatabaseHas('why_choose_us_items', [
            'homepage_section_id' => $industryStatsSection->id,
            'heading' => '7000',
            'body_text' => 'Residential Projects',
        ]);
        $this->assertSame(2, HomepageSectionBanner::query()->count());
    }

    public function test_homepage_cms_rejects_over_limits_invalid_ids_and_script_urls(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);

        $this->actingAs($editor)->get(route('admin.homepage.edit'))->assertOk();

        $payload = [
            'hero' => [
                'heading' => 'Heading',
                'subtext' => null,
                'desktop_media_id' => 999999,
                'mobile_media_id' => null,
                'primary_button_label' => 'Bad',
                'primary_button_url' => 'javascript:alert(1)',
                'secondary_button_label' => null,
                'secondary_button_url' => null,
                'overlay_opacity' => 90,
                'text_theme' => 'light',
                'is_visible' => true,
                'items' => [],
            ],
            'latest' => [
                'title' => 'Latest',
                'subtitle' => null,
                'max_items' => 11,
                'view_all_label' => 'View',
                'view_all_url' => '/products',
                'is_visible' => true,
            ],
            'turnkey' => [
                'eyebrow' => 'Complete custom',
                'title' => 'Furniture',
                'subtitle' => null,
                'button_url' => 'https://vimeo.com/12345',
                'is_visible' => true,
                'items' => [],
            ],
            'quickInquiry' => [
                'title' => 'Inquiry',
                'subtitle' => null,
                'button_label' => 'Contact',
                'button_url' => 'javascript:alert(1)',
                'background_media_id' => null,
                'background_color' => '#ffffff',
                'is_visible' => true,
                'items' => [],
            ],
            'settings' => [
                'whatsapp_text' => '',
                'whatsapp_number' => '',
            ],
        ];

        $this->actingAs($editor)
            ->from(route('admin.homepage.edit'))
            ->patch(route('admin.homepage.update'), $payload)
            ->assertRedirect(route('admin.homepage.edit'))
            ->assertSessionHasErrors([
                'hero.desktop_media_id',
                'hero.primary_button_url',
                'hero.overlay_opacity',
                'latest.max_items',
                'turnkey.button_url',
                'quickInquiry.button_url',
            ]);
    }

    public function test_clients_cms_page_creates_updates_and_removes_clients(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $media = $this->processedMedia();

        $this->actingAs($editor)->get(route('admin.clients.index'))->assertOk();

        $createResponse = $this->actingAs($editor)->post(route('admin.clients.store'), [
            'name' => 'New-Tech Industries',
            'website_url' => 'https://example.com',
            'logo_media_id' => $media->id,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $client = Client::query()->where('name', 'New-Tech Industries')->firstOrFail();

        $createResponse->assertRedirect(route('admin.clients.index'));
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'logo_media_id' => $media->id,
            'created_by_user_id' => $editor->id,
        ]);

        $this->actingAs($editor)->patch(route('admin.clients.update', $client), [
            'name' => 'New-Tech Industries',
            'website_url' => 'https://example.org',
            'logo_media_id' => $media->id,
            'sort_order' => 3,
            'is_active' => false,
        ])->assertRedirect(route('admin.clients.index'));

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'website_url' => 'https://example.org',
            'sort_order' => 3,
            'is_active' => false,
        ]);

        $this->actingAs($editor)
            ->from(route('admin.clients.index'))
            ->post(route('admin.clients.store'), [
                'name' => 'Bad Link',
                'website_url' => 'javascript:alert(1)',
                'logo_media_id' => $media->id,
                'sort_order' => 4,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.clients.index'))
            ->assertSessionHasErrors('website_url');

        $this->actingAs($editor)->delete(route('admin.clients.destroy', $client))->assertRedirect(route('admin.clients.index'));
        $this->assertDatabaseMissing('clients', ['id' => $client->id]);
    }

    public function test_contact_page_cms_persists_map_socials_and_form_options(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);

        $this->actingAs($editor)->get(route('admin.pages.contact.edit'))->assertOk();

        $this->actingAs($editor)->patch(route('admin.pages.contact.update'), [
            'business_name' => 'Zarokha Wooden Arts',
            'phone_primary' => '+91 90000 11111',
            'phone_secondary' => '',
            'email_primary' => 'studio@example.com',
            'email_secondary' => '',
            'whatsapp_number' => '+919000011111',
            'whatsapp_text' => 'Hello from contact CMS',
            'page_title' => 'Contact Form CMS',
            'page_intro' => 'CMS controlled contact intro.',
            'form_title' => 'Start a custom conversation',
            'submit_label' => 'Send request',
            'inquiry_type_options' => ['Showroom visit', '', 'Custom furniture'],
            'location_kicker' => 'Visit Us',
            'location_title' => 'CMS Location',
            'location_body' => 'CMS location body.',
            'address_label' => 'Showroom',
            'map_embed_url' => 'https://maps.google.com/maps?q=Zarokha&z=14&output=embed',
            'map_link_url' => 'https://maps.google.com/?q=Zarokha',
            'contact_social_links' => [
                ['label' => 'Instagram', 'url' => 'https://instagram.com/zarokha'],
                ['label' => '', 'url' => 'https://example.com/empty-label'],
                ['label' => 'WhatsApp', 'url' => 'https://wa.me/919000011111'],
            ],
            'address_line_1' => 'CMS Road',
            'address_line_2' => 'Second floor',
            'city' => 'Ahmedabad',
            'state' => 'Gujarat',
            'postal_code' => '380001',
            'country' => 'India',
            'show_address' => true,
            'show_phone' => true,
            'show_email' => true,
            'show_whatsapp' => true,
            'contact_intro' => 'Legacy intro',
            'form_helper_text' => 'CMS helper copy.',
            'success_message' => 'CMS success message.',
            'consent_text' => 'CMS consent text.',
        ])->assertRedirect(route('admin.pages.contact.edit'));

        $contact = ContactInformation::query()->firstOrFail();
        $this->assertSame('Contact Form CMS', $contact->page_title);
        $this->assertSame(['Showroom visit', 'Custom furniture'], $contact->inquiry_type_options);
        $this->assertSame('https://maps.google.com/maps?q=Zarokha&z=14&output=embed', $contact->map_embed_url);
        $this->assertSame([
            ['label' => 'Instagram', 'url' => 'https://instagram.com/zarokha'],
            ['label' => 'WhatsApp', 'url' => 'https://wa.me/919000011111'],
        ], $contact->contact_social_links);

        $this->get('/contact')
            ->assertOk()
            ->assertSee('Contact Form CMS')
            ->assertSee('Showroom visit')
            ->assertSee('https://maps.google.com/maps?q=Zarokha&amp;z=14&amp;output=embed', false)
            ->assertSee('Instagram')
            ->assertSee('home-clients', false);
    }

    public function test_about_page_cms_persists_structured_details_and_rejects_non_youtube_video(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $media = $this->processedMedia();
        Page::factory()->create([
            'page_key' => 'about_us',
            'slug' => 'about-us',
            'title' => 'About Us',
        ]);

        $this->actingAs($editor)->patch(route('admin.pages.update', 'about-us'), [
            'title' => 'About Us',
            'navigation_label' => 'About Us',
            'intro_title' => 'Intro',
            'intro_body' => 'Intro body',
            'body_html' => '',
            'hero_media_id' => $media->id,
            'cta_label' => 'Explore Products',
            'cta_url' => '/products',
            'status' => PublishStatus::Published->value,
            'published_at' => now()->toDateTimeString(),
            'robots_index' => true,
            'robots_follow' => true,
            'about_details' => [
                'video_url' => 'https://youtu.be/abcDEF12345',
                'who_we_are_title' => 'CMS about heading',
                'why_items' => ['Quality checks'],
                'gallery_media_ids' => [$media->id],
                'stats' => [
                    ['value' => '12+', 'label' => 'Years'],
                ],
                'skills' => [
                    ['label' => 'Project planning', 'percent' => 91],
                ],
            ],
        ])->assertRedirect(route('admin.pages.edit', 'about-us'));

        $page = Page::query()->where('page_key', 'about_us')->firstOrFail();
        $this->assertSame('CMS about heading', $page->about_details['who_we_are_title']);
        $this->assertSame([$media->id], $page->about_details['gallery_media_ids']);

        $this->actingAs($editor)
            ->from(route('admin.pages.edit', 'about-us'))
            ->patch(route('admin.pages.update', 'about-us'), [
                'title' => 'About Us',
                'status' => PublishStatus::Published->value,
                'published_at' => now()->toDateTimeString(),
                'robots_index' => true,
                'robots_follow' => true,
                'about_details' => [
                    'video_url' => 'https://vimeo.com/12345',
                ],
            ])
            ->assertRedirect(route('admin.pages.edit', 'about-us'))
            ->assertSessionHasErrors('about_details.video_url');
    }

    private function userFor(UserRole $role): User
    {
        return User::factory()->create([
            'role_id' => Role::idFor($role),
        ]);
    }

    private function processedMedia(): MediaAsset
    {
        $media = MediaAsset::factory()->create([
            'status' => 'processed',
            'directory' => 'media',
            'filename' => 'homepage-image.jpg',
        ]);

        MediaVariant::factory()->create([
            'media_asset_id' => $media->id,
            'variant_key' => 'homepage',
            'path' => 'media/variants/homepage.webp',
            'width' => 1200,
            'height' => 900,
        ]);

        return $media;
    }
}
