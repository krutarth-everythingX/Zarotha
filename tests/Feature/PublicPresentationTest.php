<?php

namespace Tests\Feature;

use App\Enums\PublishStatus;
use App\Models\Category;
use App\Models\Client;
use App\Models\HomepageSection;
use App\Models\HomepageSectionBanner;
use App\Models\Inquiry;
use App\Models\MediaAsset;
use App\Models\MediaVariant;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class PublicPresentationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_homepage_and_catalogue_render_without_collections_navigation(): void
    {
        $category = Category::factory()->create(['name' => 'Wall Decor', 'slug' => 'wall-decor']);
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Carved Wall Panel',
            'slug' => 'carved-wall-panel',
            'status' => PublishStatus::Published,
            'published_at' => now(),
            'is_featured' => true,
            'featured_media_id' => $this->processedMedia()->id,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('Latest Products')
            ->assertSee('home-industry-stats', false)
            ->assertSee('Furniture made at scale')
            ->assertSee('finished with care')
            ->assertSee('6000')
            ->assertSee('Residential Projects')
            ->assertSee($product->name)
            ->assertDontSee('Collections');

        $this->get('/products')
            ->assertOk()
            ->assertSee($product->name)
            ->assertSee('Products');
    }

    public function test_homepage_clients_section_renders_with_default_or_cms_logos(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('home-clients', false)
            ->assertSee('Our <strong>Clients</strong>', false)
            ->assertSee('home-clients__fallback', false)
            ->assertSee('ZW');

        $media = $this->processedMedia();
        Client::factory()->create([
            'name' => 'Veer Infra Pvt Ltd',
            'website_url' => 'https://example.com',
            'logo_media_id' => $media->id,
            'sort_order' => 0,
            'is_active' => true,
        ]);
        Client::factory()->create([
            'name' => 'Inactive Client',
            'is_active' => false,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('Veer Infra Pvt Ltd')
            ->assertSee('https://example.com')
            ->assertDontSee('Inactive Client');
    }

    public function test_homepage_latest_products_render_as_six_item_gallery_with_products_cta(): void
    {
        $category = Category::factory()->create(['name' => 'Wooden Art', 'slug' => 'wooden-art']);
        $media = $this->processedMedia();

        Product::factory()
            ->count(7)
            ->sequence(fn ($sequence) => [
                'category_id' => $category->id,
                'name' => 'Latest Gallery Product '.($sequence->index + 1),
                'slug' => 'latest-gallery-product-'.($sequence->index + 1),
                'status' => PublishStatus::Published,
                'published_at' => now()->subMinutes($sequence->index),
                'featured_media_id' => $media->id,
            ])
            ->create();

        $response = $this->get('/')
            ->assertOk()
            ->assertSee('latest-products__grid', false)
            ->assertSee('latest-products__view-all', false)
            ->assertSee('href="'.route('public.products.index').'"', false);

        $content = $response->getContent();
        $latestSectionStart = strpos($content, 'home-section home-section--latest');
        $latestSectionEnd = strpos($content, '</section>', $latestSectionStart);
        $latestSection = substr($content, $latestSectionStart, $latestSectionEnd - $latestSectionStart);

        $this->assertSame(6, substr_count($latestSection, 'class="latest-products__item"'));
        $this->assertStringContainsString('View Latest Gallery Product 1', $latestSection);
        $this->assertStringContainsString('View Latest Gallery Product 6', $latestSection);
        $this->assertStringNotContainsString('View Latest Gallery Product 7', $latestSection);
        $this->assertStringNotContainsString('data-slider-prev', $latestSection);
        $this->assertStringNotContainsString('data-slider-next', $latestSection);
    }

    public function test_about_page_renders_cms_details_youtube_and_clients_before_footer(): void
    {
        $media = $this->processedMedia('about-workshop.jpg');
        $clientMedia = $this->processedMedia('client-logo.jpg');
        Client::factory()->create([
            'name' => 'Studio Client',
            'logo_media_id' => $clientMedia->id,
            'is_active' => true,
        ]);

        Page::factory()->create([
            'page_key' => 'about_us',
            'slug' => 'about-us',
            'title' => 'About Us',
            'intro_title' => 'About intro',
            'intro_body' => 'Intro body',
            'status' => PublishStatus::Published,
            'published_at' => now(),
            'hero_media_id' => $media->id,
            'about_details' => [
                'video_url' => 'https://www.youtube.com/watch?v=abcDEF12345',
                'video_title' => 'About video',
                'who_we_are_kicker' => 'Who we are',
                'who_we_are_title' => 'Custom wooden furniture studio',
                'who_we_are_body' => 'CMS managed about body.',
                'why_title' => 'Why choose us?',
                'why_items' => ['Workshop quality', 'Clear project communication'],
                'gallery_media_ids' => [$media->id],
                'vision_title' => 'Vision & Mission',
                'vision_body' => 'CMS managed vision.',
                'mission_title' => 'Our mission',
                'mission_body' => 'CMS managed mission.',
                'aim_title' => 'Our aim is to promote',
                'aim_body' => 'CMS managed aim.',
                'stats' => [
                    ['value' => '10+', 'label' => 'Categories'],
                ],
                'strength_title' => 'Our Strength',
                'strength_body' => 'CMS managed strength.',
                'strength_media_id' => $media->id,
                'skills' => [
                    ['label' => 'Craft quality', 'percent' => 96],
                ],
                'client_title' => 'Our Clients',
            ],
        ]);

        $response = $this->get('/about-us')
            ->assertOk()
            ->assertSee('about-story', false)
            ->assertSee('https://www.youtube-nocookie.com/embed/abcDEF12345', false)
            ->assertSee('Who we are')
            ->assertSee('Custom wooden furniture studio')
            ->assertSee('Why choose us?')
            ->assertSee('Vision &amp; Mission', false)
            ->assertSee('Our Strength')
            ->assertSee('home-clients', false)
            ->assertSee('Studio Client');

        $content = $response->getContent();
        $this->assertLessThan(strpos($content, 'site-footer'), strpos($content, 'home-clients'));
    }

    public function test_homepage_hero_uses_default_banners_until_cms_banners_exist(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('images/default-hero-wooden-art-1.svg')
            ->assertSee('images/default-hero-wooden-art-2.svg')
            ->assertSee('images/default-hero-wooden-art-3.svg');

        $heroSection = HomepageSection::query()->create([
            'section_key' => 'hero',
            'section_title' => 'Hero',
            'source_mode' => 'manual',
            'sort_order' => 0,
            'is_visible' => true,
        ]);
        $media = $this->processedMedia('cms-hero-banner.jpg');

        HomepageSectionBanner::query()->create([
            'homepage_section_id' => $heroSection->id,
            'media_asset_id' => $media->id,
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('media/variants/cms-hero-banner.webp')
            ->assertDontSee('images/default-hero-wooden-art-1.svg')
            ->assertDontSee('images/default-hero-wooden-art-2.svg')
            ->assertDontSee('images/default-hero-wooden-art-3.svg');
    }

    public function test_homepage_turnkey_uses_cms_youtube_video_when_available(): void
    {
        $turnkey = HomepageSection::factory()->create([
            'section_key' => 'turnkey_solutions',
            'section_title' => 'CMS Turnkey Video',
            'section_intro' => 'CMS turnkey video caption.',
            'cta_url' => 'https://youtu.be/abcDEF12345',
            'is_visible' => true,
        ]);

        $response = $this->get('/')
            ->assertOk()
            ->assertSee('CMS Turnkey Video')
            ->assertSee('CMS turnkey video caption.')
            ->assertSee('https://www.youtube-nocookie.com/embed/abcDEF12345', false);

        $this->assertMatchesRegularExpression(
            '/home-turnkey__media[\s\S]*https:\/\/www\.youtube-nocookie\.com\/embed\/abcDEF12345/',
            $response->getContent(),
        );

        $turnkey->update(['cta_url' => null]);

        $response = $this->get('/')
            ->assertOk()
            ->assertSee('images/custom-commissions-workshop.webp');

        $this->assertStringNotContainsString('https://www.youtube-nocookie.com/embed/abcDEF12345', $response->getContent());
        $this->assertMatchesRegularExpression(
            '/home-turnkey__media[\s\S]*images\/custom-commissions-workshop\.webp/',
            $response->getContent(),
        );
    }

    public function test_product_search_category_filter_and_hidden_drafts(): void
    {
        $visibleCategory = Category::factory()->create(['slug' => 'visible-category']);
        $otherCategory = Category::factory()->create(['slug' => 'other-category']);
        $visibleProduct = Product::factory()->create([
            'category_id' => $visibleCategory->id,
            'name' => 'Visible Wooden Elephant',
            'slug' => 'visible-wooden-elephant',
            'status' => PublishStatus::Published,
            'published_at' => now(),
            'featured_media_id' => $this->processedMedia()->id,
        ]);
        Product::factory()->create([
            'category_id' => $otherCategory->id,
            'name' => 'Draft Wooden Elephant',
            'slug' => 'draft-wooden-elephant',
            'status' => PublishStatus::Draft,
            'published_at' => null,
        ]);

        $this->get('/products?search=Visible&category=visible-category')
            ->assertOk()
            ->assertSee($visibleProduct->name)
            ->assertDontSee('Draft Wooden Elephant');

        $this->get('/products/'.$visibleProduct->slug)
            ->assertOk()
            ->assertSee('Product inquiry')
            ->assertSee($visibleProduct->category->name);
    }

    public function test_quick_inquiry_cta_is_shared_across_products_product_detail_and_about(): void
    {
        $category = Category::factory()->create(['slug' => 'quick-inquiry-category']);
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Synced Inquiry Product',
            'slug' => 'synced-inquiry-product',
            'status' => PublishStatus::Published,
            'published_at' => now(),
        ]);

        $quickInquiry = HomepageSection::factory()->create([
            'section_key' => 'quick_inquiry',
            'section_title' => 'Synced Commission CTA',
            'section_intro' => 'This copy is controlled from the homepage quick inquiry CMS section.',
            'cta_label' => 'Plan My Piece',
            'cta_url' => '/contact',
            'is_visible' => true,
        ]);

        foreach (['/products', '/products/'.$product->slug, '/about-us'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('quick-inquiry', false)
                ->assertSee('Synced Commission CTA')
                ->assertSee('Plan My Piece')
                ->assertSee('href="/contact"', false);
        }

        $quickInquiry->update(['is_visible' => false]);

        foreach (['/products', '/products/'.$product->slug, '/about-us'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertDontSee('quick-inquiry', false)
                ->assertDontSee('Synced Commission CTA')
                ->assertDontSee('Plan My Piece');
        }
    }

    public function test_products_index_supports_gallery_json_pagination_without_duplicates_from_drafts(): void
    {
        $category = Category::factory()->create(['slug' => 'gallery-category']);
        $media = $this->processedMedia();

        $publishedProducts = Product::factory()
            ->count(19)
            ->sequence(fn ($sequence) => [
                'category_id' => $category->id,
                'name' => 'Gallery Product '.($sequence->index + 1),
                'slug' => 'gallery-product-'.($sequence->index + 1),
                'status' => PublishStatus::Published,
                'published_at' => now()->subMinutes($sequence->index),
                'featured_media_id' => $media->id,
            ])
            ->create();

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Hidden Draft Product',
            'slug' => 'hidden-draft-product',
            'status' => PublishStatus::Draft,
            'published_at' => null,
        ]);

        $response = $this->getJson('/products?page=2&sort=newest');

        $response
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('products', 1)
                ->where('products.0.name', $publishedProducts->sortByDesc('published_at')->values()->get(18)?->name)
                ->where('pagination.currentPage', 2)
                ->where('pagination.hasMorePages', false)
                ->where('pagination.total', 19)
                ->where('pagination.nextPageUrl', null)
                ->etc());

        $response->assertDontSee('Hidden Draft Product');
    }

    public function test_contact_inquiry_submission_creates_workflow_records(): void
    {
        $response = $this->post('/contact', [
            'name' => 'Inquiry Sender',
            'email' => 'sender@example.com',
            'phone' => '1234567890',
            'subject' => 'Catalogue question',
            'message' => 'Please share more information.',
            'consent_confirmed' => '1',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('inquiries', [
            'name' => 'Inquiry Sender',
            'email' => 'sender@example.com',
            'source_page_key' => 'contact',
        ]);
        $this->assertSame(1, Inquiry::query()->firstOrFail()->activities()->count());
    }

    public function test_sitemap_excludes_collections_and_collection_urls_redirect(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertDontSee('/collections');

        $this->get('/collections')->assertRedirect('/products');
        $this->get('/collections/old-slug')->assertRedirect('/products');
    }

    private function processedMedia(string $filename = 'image.jpg'): MediaAsset
    {
        $media = MediaAsset::factory()->create([
            'status' => 'processed',
            'directory' => 'media',
            'filename' => $filename,
        ]);

        MediaVariant::factory()->create([
            'media_asset_id' => $media->id,
            'variant_key' => 'product_card',
            'path' => 'media/variants/'.pathinfo($filename, PATHINFO_FILENAME).'.webp',
            'width' => 700,
            'height' => 875,
        ]);

        return $media;
    }
}
