<?php

namespace Tests\Feature;

use App\Enums\InquiryActivityType;
use App\Enums\PublishStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\HomepageFloatingProductItem;
use App\Models\HomepageSection;
use App\Models\Inquiry;
use App\Models\InquiryActivity;
use App\Models\MediaAsset;
use App\Models\MediaVariant;
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
        ]);

        $product = Product::query()->where('slug', 'hand-carved-panel')->firstOrFail();

        $response->assertRedirect(route('admin.products.edit', $product));
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
        $products = Product::factory()
            ->count(4)
            ->create([
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'featured_media_id' => $media->id,
            ]);

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
            ],
            'floating_products' => $products->values()->map(fn (Product $product, int $index): array => [
                'product_id' => $product->id,
                'image_media_id' => $media->id,
                'alt_text' => 'Floating '.$index,
                'position' => ['top-left', 'top-right', 'bottom-left', 'bottom-right'][$index],
                'tilt_preset' => 'full',
                'tap_label' => 'Tap to View',
                'is_visible' => true,
            ])->all(),
            'featured' => [
                'title' => 'Featured Products',
                'subtitle' => 'Selected items.',
                'view_all_label' => 'View All Products',
                'view_all_url' => '/products',
                'is_visible' => true,
                'products' => $products->take(3)->map(fn (Product $product): array => [
                    'product_id' => $product->id,
                ])->values()->all(),
            ],
            'latest' => [
                'title' => 'Latest Products',
                'subtitle' => 'Recently published.',
                'max_items' => 10,
                'view_all_label' => 'View All Products',
                'view_all_url' => '/products',
                'is_visible' => true,
            ],
            'testimonials' => [
                'title' => 'Testimonials',
                'subtitle' => 'Client words.',
                'background_media_id' => $media->id,
                'background_color' => '#d7d4cf',
                'is_visible' => true,
                'items' => [
                    [
                        'customer_name' => 'A Customer',
                        'location_or_role' => 'Homeowner',
                        'body_text' => 'A CMS managed testimonial.',
                        'image_media_id' => $media->id,
                        'status' => 'published',
                        'sort_order' => 1,
                        'is_visible' => true,
                    ],
                ],
            ],
            'quick_inquiry' => [
                'heading' => 'Quick Inquiry',
                'subtext' => 'Send a note.',
                'button_label' => 'Inquiry',
                'button_url' => '/contact',
                'background_media_id' => $media->id,
                'background_color' => '#ffffff',
                'is_visible' => true,
            ],
        ]);

        $response->assertRedirect(route('admin.homepage.edit'));
        $this->assertDatabaseHas('hero_banners', [
            'headline' => 'Custom homepage heading',
            'desktop_media_id' => $media->id,
            'secondary_cta_label' => 'Contact',
            'overlay_opacity' => 30,
        ]);
        $this->assertSame(4, HomepageFloatingProductItem::query()->count());
        $this->assertSame(3, HomepageSection::query()->where('section_key', 'featured_products')->firstOrFail()->featuredProducts()->count());
        $this->assertDatabaseHas('homepage_testimonials', [
            'customer_name' => 'A Customer',
            'status' => 'published',
        ]);
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
            ],
            'floating_products' => array_fill(0, 5, [
                'product_id' => null,
                'image_media_id' => null,
                'alt_text' => null,
                'position' => 'top-left',
                'tilt_preset' => 'full',
                'tap_label' => 'Tap to View',
                'is_visible' => true,
            ]),
            'featured' => [
                'title' => 'Featured',
                'subtitle' => null,
                'view_all_label' => 'View',
                'view_all_url' => '/products',
                'is_visible' => true,
                'products' => array_fill(0, 11, ['product_id' => 999999]),
            ],
            'latest' => [
                'title' => 'Latest',
                'subtitle' => null,
                'max_items' => 11,
                'view_all_label' => 'View',
                'view_all_url' => '/products',
                'is_visible' => true,
            ],
            'testimonials' => [
                'title' => 'Testimonials',
                'subtitle' => null,
                'background_media_id' => null,
                'background_color' => 'red',
                'is_visible' => true,
                'items' => [],
            ],
            'quick_inquiry' => [
                'heading' => 'Inquiry',
                'subtext' => null,
                'button_label' => 'Contact',
                'button_url' => 'javascript:alert(1)',
                'background_media_id' => null,
                'background_color' => '#ffffff',
                'is_visible' => true,
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
                'floating_products',
                'featured.products',
                'latest.max_items',
                'testimonials.background_color',
                'quick_inquiry.button_url',
            ]);
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
