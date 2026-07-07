<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $search = trim((string) $request->string('search'));
        $status = $request->query('status');
        $categoryId = $request->query('category_id');

        $products = Product::query()
            ->with('category')
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            }))
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->when($categoryId !== null && $categoryId !== '', fn ($query) => $query->where('category_id', (int) $categoryId))
            ->orderBy('sort_order')
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'filters' => [
                'search' => $search === '' ? null : $search,
                'status' => $status,
                'categoryId' => $categoryId,
            ],
            'categories' => Category::query()->orderBy('name')->get(['id', 'name'])->map(fn (Category $category) => [
                'id' => $category->id,
                'label' => $category->name,
            ]),
            'products' => [
                'data' => $products->getCollection()->map(fn (Product $product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                        'slug' => $product->category->slug,
                    ],
                    'status' => $product->status->value,
                    'publishedAt' => $product->published_at?->toAtomString(),
                    'sortOrder' => $product->sort_order,
                    'isFeatured' => $product->is_featured,
                    'isBestSelling' => $product->is_best_selling,
                    'isLatest' => $product->is_latest,
                    'updatedAt' => $product->updated_at?->toAtomString(),
                ]),
                'meta' => [
                    'currentPage' => $products->currentPage(),
                    'perPage' => $products->perPage(),
                    'total' => $products->total(),
                    'lastPage' => $products->lastPage(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('Admin/Products/Form', $this->formPayload(null));
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        /** @var Product $product */
        $product = Product::query()->create([
            ...$validated,
            'published_at' => ($validated['status'] ?? null) === PublishStatus::Published->value
                ? ($validated['published_at'] ?? now())
                : ($validated['published_at'] ?? null),
            'created_by_user_id' => $request->user()->id,
            'updated_by_user_id' => $request->user()->id,
        ]);

        $this->syncGalleryImages($product, $request->input('gallery_images', []));
        $this->enforceLatestProductLimit($product);

        return redirect()
            ->route('admin.products.index')
            ->with('status', 'Product created.');
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load('category', 'media');

        return Inertia::render('Admin/Products/Form', $this->formPayload($product));
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $product->update([
            ...$validated,
            'published_at' => ($validated['status'] ?? null) === PublishStatus::Published->value
                ? ($validated['published_at'] ?? $product->published_at ?? now())
                : ($validated['published_at'] ?? null),
            'updated_by_user_id' => $request->user()->id,
        ]);

        $this->syncGalleryImages($product, $request->input('gallery_images', []));
        $this->enforceLatestProductLimit($product);

        return redirect()
            ->route('admin.products.index')
            ->with('status', 'Product updated.');
    }

    public function publish(Product $product): RedirectResponse
    {
        $this->authorize('publish', $product);

        $product->update([
            'status' => PublishStatus::Published,
            'published_at' => $product->published_at ?? now(),
        ]);

        return redirect()
            ->back()
            ->with('status', 'Product published.');
    }

    public function archive(Product $product): RedirectResponse
    {
        $this->authorize('archive', $product);

        $product->update([
            'status' => PublishStatus::Archived,
        ]);

        return redirect()
            ->back()
            ->with('status', 'Product archived.');
    }

    public function toggle(Product $product): RedirectResponse
    {
        $this->authorize('publish', $product);

        if ($product->status === PublishStatus::Published) {
            $product->update([
                'status' => PublishStatus::Draft,
                'published_at' => null,
            ]);

            return redirect()
                ->back()
                ->with('status', 'Product made inactive.');
        }

        $product->update([
            'status' => PublishStatus::Published,
            'published_at' => $product->published_at ?? now(),
        ]);

        return redirect()
            ->back()
            ->with('status', 'Product made active.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('status', 'Product deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formPayload(?Product $product): array
    {
        $mediaOptions = MediaAsset::query()
            ->with('variants')
            ->orderByDesc('created_at')
            ->limit(250)
            ->get()
            ->map(fn (MediaAsset $media) => [
                'id' => $media->id,
                'label' => $media->original_filename,
                'altText' => $media->alt_text,
                'url' => $media->responsiveImage('25vw')['src'],
                'status' => $media->status,
            ]);

        return [
            'mode' => $product === null ? 'create' : 'edit',
            'product' => $product === null ? null : [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'categoryId' => $product->category_id,
                'shortDescription' => $product->short_description,
                'fullDescription' => $product->full_description,
                'dimensions' => $product->dimensions,
                'material' => $product->material,
                'finish' => $product->finish,
                'featuredMediaId' => $product->featured_media_id,
                'status' => $product->status->value,
                'publishedAt' => $product->published_at?->toDateTimeString(),
                'sortOrder' => $product->sort_order,
                'isFeatured' => $product->is_featured,
                'isBestSelling' => $product->is_best_selling,
                'isLatest' => $product->is_latest,
                'metaTitle' => $product->meta_title,
                'metaDescription' => $product->meta_description,
                'ogTitle' => $product->og_title,
                'ogDescription' => $product->og_description,
                'ogImageMediaId' => $product->og_image_media_id,
                'canonicalUrl' => $product->canonical_url,
                'robotsIndex' => $product->robots_index,
                'robotsFollow' => $product->robots_follow,

                // New fields
                'sku' => $product->sku,
                'productType' => $product->product_type,
                'woodType' => $product->wood_type,
                'style' => $product->style,
                'regularPrice' => $product->regular_price,
                'salePrice' => $product->sale_price,
                'isTrackInventory' => $product->is_track_inventory,
                'stockQuantity' => $product->stock_quantity,
                'availability' => $product->availability,
                'details' => $product->details ?? [],
                'galleryImages' => $product->media ? $product->media->map(fn($media) => [
                    'id' => $media->id,
                    'url' => $media->responsiveImage('25vw')['src'],
                    'label' => $media->original_filename,
                    'altText' => $media->alt_text,
                    'status' => $media->status,
                    'isPrimary' => $product->featured_media_id === $media->id,
                ]) : [],
            ],
            'categories' => Category::query()->orderBy('name')->get(['id', 'name'])->map(fn (Category $category) => [
                'id' => $category->id,
                'label' => $category->name,
            ]),
            'mediaPicker' => [
                'recent' => $mediaOptions,
            ],
        ];
    }

    /**
     * @param  array<int, int|string>  $mediaIds
     */
    private function syncGalleryImages(Product $product, array $mediaIds): void
    {
        $galleryData = [];

        foreach (array_values($mediaIds) as $index => $mediaId) {
            if ($mediaId === '' || $mediaId === null) {
                continue;
            }

            $galleryData[(int) $mediaId] = [
                'sort_order' => $index,
                'is_gallery_visible' => true,
            ];
        }

        $product->media()->sync($galleryData);
    }

    private function enforceLatestProductLimit(Product $product): void
    {
        if (! $product->is_latest) {
            return;
        }

        $latestProductIdsToKeep = Product::query()
            ->where('is_latest', true)
            ->orderByDesc('published_at')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->limit(6)
            ->pluck('id');

        Product::query()
            ->where('is_latest', true)
            ->whereNotIn('id', $latestProductIdsToKeep)
            ->update(['is_latest' => false]);
    }
}
