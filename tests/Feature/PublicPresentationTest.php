<?php

namespace Tests\Feature;

use App\Enums\PublishStatus;
use App\Models\Category;
use App\Models\Inquiry;
use App\Models\MediaAsset;
use App\Models\MediaVariant;
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
            ->assertSee('Featured products')
            ->assertSee($product->name)
            ->assertDontSee('Collections');

        $this->get('/products')
            ->assertOk()
            ->assertSee($product->name)
            ->assertSee('Products');
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

    private function processedMedia(): MediaAsset
    {
        $media = MediaAsset::factory()->create([
            'status' => 'processed',
            'directory' => 'media',
            'filename' => 'image.jpg',
        ]);

        MediaVariant::factory()->create([
            'media_asset_id' => $media->id,
            'variant_key' => 'product_card',
            'path' => 'media/variants/product-card.webp',
            'width' => 700,
            'height' => 875,
        ]);

        return $media;
    }
}
