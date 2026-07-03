<?php

namespace App\Http\Controllers\Public;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\Concerns\BuildsPublicViewData;
use App\Models\HeroBanner;
use App\Models\HomepageFeaturedProductItem;
use App\Models\HomepageFloatingProductItem;
use App\Models\HomepageSection;
use App\Models\HomepageTestimonial;
use App\Models\Product;
use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    use BuildsPublicViewData;

    public function __invoke(): View
    {
        $sections = HomepageSection::query()
            ->with([
                'backgroundMedia.variants',
                'mobileMedia.variants',
                'featuredProducts.product.category',
                'featuredProducts.product.featuredMedia.variants',
                'floatingProducts.product',
                'floatingProducts.imageMedia.variants',
                'testimonials.imageMedia.variants',
                'banners.imageMedia.variants',
            ])
            ->whereIn('section_key', ['hero', 'featured_products', 'latest_products', 'testimonials', 'quick_inquiry'])
            ->get()
            ->keyBy('section_key');

        $heroSection = $sections->get('hero');
        $featuredSection = $sections->get('featured_products');
        $latestSection = $sections->get('latest_products');
        $testimonialsSection = $sections->get('testimonials');
        $quickInquirySection = $sections->get('quick_inquiry');
        $heroBanners = HeroBanner::query()
            ->with(['desktopMedia.variants', 'mobileMedia.variants'])
            ->where('is_active', true)
            ->where(fn ($query) => $query->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn ($query) => $query->whereNull('ends_at')->orWhere('ends_at', '>=', now()))
            ->orderBy('sort_order')
            ->get();
        $latestLimit = min(max((int) ($latestSection ? $latestSection->max_items : 10), 1), 10);
        $selectedFeaturedProducts = $featuredSection?->featuredProducts
            ->filter(fn (HomepageFeaturedProductItem $item): bool => $item->product?->status === PublishStatus::Published && $item->product->published_at !== null)
            ->take(10)
            ->map(fn (HomepageFeaturedProductItem $item): Product => $item->product)
            ->values() ?? collect();

        return view('pages.home', [
            ...$this->sharedPublicData(),
            'heroBanners' => $heroBanners,
            'heroSection' => $heroSection,
            'floatingProducts' => $heroSection?->floatingProducts
                ->filter(fn (HomepageFloatingProductItem $item): bool => $item->is_visible && $item->product?->status === PublishStatus::Published)
                ->take(4)
                ->values() ?? collect(),
            'featuredSection' => $featuredSection,
            'featuredProducts' => $selectedFeaturedProducts->isNotEmpty()
                ? $selectedFeaturedProducts
                : Product::query()
                    ->with(['category', 'featuredMedia.variants'])
                    ->wherePublished()
                    ->where('is_featured', true)
                    ->orderBy('sort_order')
                    ->limit(10)
                    ->get(),
            'latestSection' => $latestSection,
            'latestProducts' => Product::query()
                ->with(['category', 'featuredMedia.variants'])
                ->wherePublished()
                ->orderByDesc('published_at')
                ->limit($latestLimit)
                ->get(),
            'testimonialsSection' => $testimonialsSection,
            'testimonials' => $testimonialsSection?->testimonials
                ->filter(fn (HomepageTestimonial $testimonial): bool => $testimonial->status === 'published' && $testimonial->is_visible)
                ->values() ?? collect(),
            'quickInquirySection' => $quickInquirySection,
        ]);
    }
}
