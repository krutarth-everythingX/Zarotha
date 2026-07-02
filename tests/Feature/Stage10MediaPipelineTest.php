<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Jobs\GenerateMediaVariants;
use App\Models\Category;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Services\Media\MediaLibrary;
use App\Services\Media\MediaVariantPlan;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class Stage10MediaPipelineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
        Storage::fake('public');
        config([
            'media.disk' => 'public',
            'media.min_width' => 1,
            'media.min_height' => 1,
            'media.max_width' => 8000,
            'media.max_height' => 8000,
            'media.max_upload_kb' => 8,
        ]);
    }

    public function test_authorized_upload_stores_metadata_and_generates_webp_variants(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);

        $response = $this->actingAs($editor)->post(route('admin.media.store'), [
            'file' => $this->validWebpUpload('valid-product.webp'),
            'alt_text' => 'Carved wooden panel detail',
            'caption' => 'Studio product image',
        ]);

        $response->assertRedirect(route('admin.media.index'));
        $media = MediaAsset::query()->firstOrFail();

        $this->assertSame('processed', $media->status);
        $this->assertSame('image/webp', $media->mime_type);
        $this->assertSame('Carved wooden panel detail', $media->alt_text);
        $this->assertCount(6, $media->variants);
        $this->assertTrue($media->variants->every(fn ($variant): bool => $variant->format === 'webp'));
        Storage::disk('public')->assertExists($media->path());
        Storage::disk('public')->assertExists($media->variants->first()->path);
    }

    public function test_invalid_mime_oversized_and_unauthorized_uploads_are_rejected(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $inquiryManager = $this->userFor(UserRole::InquiryManager);

        $invalidMime = $this->actingAs($editor)->post(route('admin.media.store'), [
            'file' => UploadedFile::fake()->createWithContent('script.jpg', 'not an image'),
        ]);

        $invalidMime->assertRedirect();
        $invalidMime->assertSessionHasErrors('file');
        $this->assertSame(0, MediaAsset::query()->count());

        $oversized = $this->actingAs($editor)->post(route('admin.media.store'), [
            'file' => UploadedFile::fake()->createWithContent('too-large.webp', $this->webpBytes().str_repeat('a', 10_000)),
        ]);

        $oversized->assertRedirect();
        $oversized->assertSessionHasErrors('file');
        $this->assertSame(0, MediaAsset::query()->count());

        $unauthorized = $this->actingAs($inquiryManager)->post(route('admin.media.store'), [
            'file' => $this->validWebpUpload('blocked.webp'),
        ]);

        $unauthorized->assertForbidden();
        $this->assertSame(0, MediaAsset::query()->count());
    }

    public function test_replacement_regenerates_variants_and_preserves_record_identity(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $media = app(MediaLibrary::class)->storeUpload($this->validWebpUpload('original.webp'), $editor->id);
        $oldPath = $media->path();
        $oldVariantDirectory = 'media/variants/'.$media->id;

        $response = $this->actingAs($editor)->post(route('admin.media.replace', $media), [
            'file' => $this->validWebpUpload('replacement.webp'),
        ]);

        $media->refresh();

        $response->assertRedirect(route('admin.media.index'));
        $this->assertSame('replacement.webp', $media->original_filename);
        $this->assertSame('processed', $media->status);
        $this->assertNotSame($oldPath, $media->path());
        Storage::disk('public')->assertMissing($oldPath);
        $this->assertFalse(collect(Storage::disk('public')->allFiles($oldVariantDirectory))->contains(fn (string $path): bool => str_contains($path, pathinfo($oldPath, PATHINFO_FILENAME))));
        $this->assertCount(6, $media->variants);
    }

    public function test_reference_safe_delete_blocks_referenced_media(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $media = app(MediaLibrary::class)->storeUpload($this->validWebpUpload('referenced.webp'), $editor->id);
        $product = Product::factory()->create([
            'featured_media_id' => $media->id,
        ]);

        $response = $this->actingAs($editor)->delete(route('admin.media.destroy', $media));

        $response->assertRedirect(route('admin.media.index'));
        $response->assertSessionHasErrors('media');
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'featured_media_id' => $media->id,
        ]);
        $this->assertFalse($media->fresh()->trashed());
    }

    public function test_product_gallery_attach_reorder_feature_and_detach_are_deterministic(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        $product = Product::factory()->create([
            'category_id' => Category::factory()->create()->id,
        ]);
        $first = app(MediaLibrary::class)->storeUpload($this->validWebpUpload('first.webp'), $editor->id);
        $second = app(MediaLibrary::class)->storeUpload($this->validWebpUpload('second.webp', [70, 90, 130]), $editor->id);

        $this->actingAs($editor)->post(route('admin.products.gallery.attach', $product), [
            'media_asset_id' => $first->id,
        ])->assertRedirect(route('admin.products.gallery.index', $product));

        $this->actingAs($editor)->post(route('admin.products.gallery.attach', $product), [
            'media_asset_id' => $second->id,
            'alt_text_override' => 'Side angle',
        ])->assertRedirect(route('admin.products.gallery.index', $product));

        $this->actingAs($editor)->post(route('admin.products.gallery.reorder', $product), [
            'media' => [
                ['id' => $first->id, 'sort_order' => 5],
                ['id' => $second->id, 'sort_order' => 1],
            ],
        ])->assertRedirect(route('admin.products.gallery.index', $product));

        $this->actingAs($editor)->post(route('admin.products.gallery.featured', $product), [
            'media_asset_id' => $second->id,
        ])->assertRedirect(route('admin.products.gallery.index', $product));

        $this->actingAs($editor)->delete(route('admin.products.gallery.detach', [$product, $first]))
            ->assertRedirect(route('admin.products.gallery.index', $product));

        $product->refresh();

        $this->assertSame($second->id, $product->featured_media_id);
        $this->assertDatabaseHas('product_media', [
            'product_id' => $product->id,
            'media_asset_id' => $second->id,
            'sort_order' => 1,
            'alt_text_override' => 'Side angle',
        ]);
        $this->assertDatabaseMissing('product_media', [
            'product_id' => $product->id,
            'media_asset_id' => $first->id,
        ]);
    }

    public function test_variant_job_marks_corrupt_image_as_failed(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        Storage::disk('public')->put('media/originals/corrupt.png', 'not an image');
        $media = MediaAsset::factory()->create([
            'disk' => 'public',
            'directory' => 'media/originals',
            'filename' => 'corrupt.png',
            'mime_type' => 'image/png',
            'extension' => 'png',
            'created_by_user_id' => $editor->id,
            'updated_by_user_id' => $editor->id,
            'status' => 'uploaded',
        ]);

        try {
            app(GenerateMediaVariants::class, ['mediaAssetId' => $media->id])->handle(app(MediaVariantPlan::class));
            $this->fail('Corrupt image processing should fail.');
        } catch (RuntimeException) {
            $this->assertSame('failed', $media->fresh()->status);
        }
    }

    public function test_orphan_cleanup_removes_old_failed_unreferenced_uploads(): void
    {
        $editor = $this->userFor(UserRole::ContentEditor);
        Storage::disk('public')->put('media/originals/orphan.webp', $this->webpBytes());
        $orphan = MediaAsset::factory()->create([
            'disk' => 'public',
            'directory' => 'media/originals',
            'filename' => 'orphan.webp',
            'status' => 'failed',
            'created_at' => now()->subDays(2),
            'created_by_user_id' => $editor->id,
            'updated_by_user_id' => $editor->id,
        ]);

        $deleted = app(MediaLibrary::class)->pruneOrphanUploads();

        $this->assertSame(1, $deleted);
        $this->assertDatabaseMissing('media_assets', ['id' => $orphan->id]);
        Storage::disk('public')->assertMissing('media/originals/orphan.webp');
    }

    private function userFor(UserRole $role): User
    {
        return User::factory()->create([
            'role_id' => Role::idFor($role),
        ]);
    }

    /**
     * @param  array{0:int,1:int,2:int}  $color
     */
    private function validWebpUpload(string $name, array $color = [160, 120, 80]): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, $this->webpBytes($color));
    }

    /**
     * @param  array{0:int,1:int,2:int}  $color
     */
    private function webpBytes(array $color = [160, 120, 80]): string
    {
        $fixtures = [
            '160,120,80' => 'UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQABAAAUAiJZACdLoABQIAAP4TH/Abr4tvG/3BmfV2wAAA',
            '70,90,130' => 'UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQABAAAUAiJYgCdLoABDAAAP7wxAv7gzPq7HDzXxAtwAAA',
        ];

        return base64_decode($fixtures[implode(',', $color)], true) ?: '';
    }
}
