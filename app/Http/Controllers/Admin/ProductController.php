<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Category;
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
        /** @var Product $product */
        $product = Product::query()->create([
            ...$request->validated(),
            'created_by_user_id' => $request->user()->id,
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('status', 'Product created.');
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load('category');

        return Inertia::render('Admin/Products/Form', $this->formPayload($product));
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('status', 'Product updated.');
    }

    public function publish(Product $product): RedirectResponse
    {
        $this->authorize('publish', $product);

        if ($product->featured_media_id === null) {
            return redirect()
                ->route('admin.products.edit', $product)
                ->withErrors([
                    'product' => 'A featured image is required before publishing a product.',
                ]);
        }

        $product->update([
            'status' => PublishStatus::Published,
            'published_at' => now(),
        ]);

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('status', 'Product published.');
    }

    public function archive(Product $product): RedirectResponse
    {
        $this->authorize('archive', $product);

        $product->update([
            'status' => PublishStatus::Archived,
        ]);

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('status', 'Product archived.');
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
            ],
            'categories' => Category::query()->orderBy('name')->get(['id', 'name'])->map(fn (Category $category) => [
                'id' => $category->id,
                'label' => $category->name,
            ]),
            'mediaPicker' => [
                'recent' => [],
            ],
        ];
    }
}
