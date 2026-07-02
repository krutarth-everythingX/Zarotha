<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductGallery\AttachProductMediaRequest;
use App\Http\Requests\Admin\ProductGallery\ReorderProductMediaRequest;
use App\Http\Requests\Admin\ProductGallery\SetFeaturedProductMediaRequest;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductGalleryController extends Controller
{
    public function index(Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load(['media.variants', 'featuredMedia']);

        return Inertia::render('Admin/Products/Gallery', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'featuredMediaId' => $product->featured_media_id,
                'gallery' => $product->media->map(fn (MediaAsset $asset) => [
                    'id' => $asset->id,
                    'originalFilename' => $asset->original_filename,
                    'altText' => $asset->getAttribute('pivot')?->getAttribute('alt_text_override') ?? $asset->alt_text,
                    'sortOrder' => (int) $asset->getAttribute('pivot')?->getAttribute('sort_order'),
                    'isVisible' => (bool) $asset->getAttribute('pivot')?->getAttribute('is_gallery_visible'),
                    'url' => $asset->status === 'processed' ? $asset->responsiveImage()['src'] : null,
                ]),
            ],
            'mediaOptions' => MediaAsset::query()
                ->where('status', 'processed')
                ->orderByDesc('created_at')
                ->limit(50)
                ->get(['id', 'original_filename', 'alt_text'])
                ->map(fn (MediaAsset $asset) => [
                    'id' => $asset->id,
                    'label' => $asset->original_filename,
                    'altText' => $asset->alt_text,
                ]),
        ]);
    }

    public function attach(AttachProductMediaRequest $request, Product $product): RedirectResponse
    {
        $mediaAssetId = (int) $request->validated('media_asset_id');
        $nextSortOrder = ((int) $product->media()->max('product_media.sort_order')) + 1;

        $product->media()->syncWithoutDetaching([
            $mediaAssetId => [
                'sort_order' => $nextSortOrder,
                'alt_text_override' => $request->validated('alt_text_override'),
                'is_gallery_visible' => true,
            ],
        ]);

        return redirect()
            ->route('admin.products.gallery.index', $product)
            ->with('status', 'Media attached to product gallery.');
    }

    public function reorder(ReorderProductMediaRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product): void {
            foreach ($request->validated('media') as $item) {
                $product->media()->updateExistingPivot($item['id'], [
                    'sort_order' => $item['sort_order'],
                ]);
            }
        });

        return redirect()
            ->route('admin.products.gallery.index', $product)
            ->with('status', 'Product gallery reordered.');
    }

    public function setFeatured(SetFeaturedProductMediaRequest $request, Product $product): RedirectResponse
    {
        $mediaAssetId = (int) $request->validated('media_asset_id');

        if (! $product->media()->whereKey($mediaAssetId)->exists()) {
            return redirect()
                ->route('admin.products.gallery.index', $product)
                ->withErrors(['media_asset_id' => 'The featured image must already be attached to this product gallery.']);
        }

        $product->update([
            'featured_media_id' => $mediaAssetId,
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.products.gallery.index', $product)
            ->with('status', 'Featured image selected.');
    }

    public function detach(Product $product, MediaAsset $media): RedirectResponse
    {
        $this->authorize('update', $product);

        if ($product->featured_media_id === $media->id) {
            return redirect()
                ->route('admin.products.gallery.index', $product)
                ->withErrors(['media' => 'The featured image cannot be detached until another featured image is selected.']);
        }

        $product->media()->detach($media->id);

        return redirect()
            ->route('admin.products.gallery.index', $product)
            ->with('status', 'Media detached from product gallery.');
    }
}
