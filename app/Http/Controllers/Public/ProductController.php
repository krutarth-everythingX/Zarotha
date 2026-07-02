<?php

namespace App\Http\Controllers\Public;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\Concerns\BuildsPublicViewData;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ProductController extends Controller
{
    use BuildsPublicViewData;

    public function index(Request $request): View|JsonResponse
    {
        $sort = (string) $request->query('sort', 'sort_order');
        $sort = in_array($sort, ['sort_order', 'newest', 'oldest', 'name_az', 'name_za'], true) ? $sort : 'sort_order';

        $products = Product::query()
            ->with([
                'featuredMedia.variants',
                'media' => fn ($query) => $query->wherePivot('is_gallery_visible', true),
                'media.variants',
            ])
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());

        match ($sort) {
            'newest' => $products->orderByDesc('published_at')->orderByDesc('id'),
            'oldest' => $products->orderBy('published_at')->orderBy('id'),
            'name_az' => $products->orderBy('name')->orderBy('id'),
            'name_za' => $products->orderByDesc('name')->orderByDesc('id'),
            default => $products->orderBy('sort_order')->orderByDesc('published_at')->orderByDesc('id'),
        };

        $paginatedProducts = $products->paginate(20)->withQueryString();

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'products' => $paginatedProducts->getCollection()->map(fn (Product $product) => $this->galleryProductPayload($product)),
                'pagination' => [
                    'currentPage' => $paginatedProducts->currentPage(),
                    'hasMorePages' => $paginatedProducts->hasMorePages(),
                    'nextPageUrl' => $paginatedProducts->nextPageUrl(),
                    'total' => $paginatedProducts->total(),
                ],
            ]);
        }

        return view('pages.products.index', [
            ...$this->sharedPublicData(),
            'products' => $paginatedProducts,
            'sort' => $sort,
            'sortOptions' => [
                'sort_order' => 'CMS order',
                'newest' => 'Newest',
                'oldest' => 'Oldest',
                'name_az' => 'Name A-Z',
                'name_za' => 'Name Z-A',
            ],
        ]);
    }

    public function show(string $productSlug): View
    {
        $product = Product::query()
            ->with(['category', 'featuredMedia.variants', 'media.variants'])
            ->where('slug', $productSlug)
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->firstOrFail();

        $relatedProducts = Product::query()
            ->with(['category', 'featuredMedia.variants'])
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->orderBy('sort_order')
            ->limit(4)
            ->get();

        return view('pages.products.show', [
            ...$this->sharedPublicData(),
            'product' => $product,
            'gallery' => $product->media->isNotEmpty() ? $product->media : collect([$product->featuredMedia])->filter(),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function galleryProductPayload(Product $product): array
    {
        $media = $product->featuredMedia ?: $product->media->first();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'url' => route('public.products.show', $product->slug),
            'image' => $this->galleryImagePayload($media),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function galleryImagePayload(?MediaAsset $media): ?array
    {
        if (! $media) {
            return null;
        }

        $image = $media->responsiveImage('(min-width: 1536px) 22vw, (min-width: 1280px) 24vw, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 48vw');

        return [
            'src' => $image['src'],
            'srcset' => $image['srcset'],
            'sizes' => $image['sizes'],
            'width' => $image['width'],
            'height' => $image['height'],
            'alt' => $image['alt'],
        ];
    }
}
