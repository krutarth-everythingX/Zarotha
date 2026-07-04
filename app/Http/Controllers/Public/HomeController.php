<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\Concerns\BuildsPublicViewData;
use App\Models\Client;
use App\Models\HeroBanner;
use App\Models\HomepageSection;
use App\Models\HomepageTestimonial;
use App\Models\Product;
use App\Models\WhyChooseUsItem;
use App\Support\YoutubeVideo;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;

class HomeController extends Controller
{
    use BuildsPublicViewData;

    public function __invoke(): View
    {
        $sections = HomepageSection::query()
            ->with([
                'backgroundMedia.variants',
                'mobileMedia.variants',
                'testimonials.imageMedia.variants',
                'banners.imageMedia.variants',
                'whyChooseUsItems',
            ])
            ->whereIn('section_key', [
                'hero',
                'turnkey_solutions',
                'about_preview',
                'industry_stats',
                'latest_products',
                'testimonials',
                'quick_inquiry',
            ])
            ->get()
            ->keyBy('section_key');

        $heroSection = $sections->get('hero');
        $turnkeySection = $sections->get('turnkey_solutions');
        $aboutPreviewSection = $sections->get('about_preview');
        $industryStatsSection = $sections->get('industry_stats');
        $latestSection = $sections->get('latest_products');
        $testimonialsSection = $sections->get('testimonials');
        $quickInquirySection = $sections->get('quick_inquiry');
        $heroSettings = HeroBanner::query()
            ->with(['desktopMedia.variants', 'mobileMedia.variants'])
            ->where('is_active', true)
            ->where(fn ($query) => $query->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn ($query) => $query->whereNull('ends_at')->orWhere('ends_at', '>=', now()))
            ->orderBy('sort_order')
            ->first();
        $sectionHeroBanners = $heroSection?->banners
            ->filter(fn ($banner): bool => $banner->is_visible && $banner->imageMedia !== null)
            ->values() ?? collect();
        $heroBanners = $sectionHeroBanners->isNotEmpty()
            ? $this->sectionBannersAsHeroBanners($sectionHeroBanners, $heroSettings)
            : $this->defaultHeroBanners($heroSettings);

        $latestLimit = 6;
        $latestProducts = Product::query()
            ->with(['category', 'featuredMedia.variants'])
            ->wherePublished()
            ->orderByDesc('published_at')
            ->limit($latestLimit)
            ->get();
        if ($latestProducts->isEmpty()) {
            $latestProducts = $this->defaultLatestProducts();
        }

        $testimonials = $testimonialsSection?->testimonials
            ->filter(fn (HomepageTestimonial $testimonial): bool => $testimonial->status === 'published' && $testimonial->is_visible)
            ->values() ?? collect();
        if ($testimonials->isEmpty()) {
            $testimonials = $this->defaultTestimonials();
        }

        return view('pages.home', [
            ...$this->sharedPublicData(includeQuickInquirySection: false),
            'heroBanners' => $heroBanners,
            'heroSection' => $heroSection,
            'turnkeySection' => $turnkeySection,
            'turnkeyServices' => $this->turnkeyServices($turnkeySection),
            'turnkeyVideo' => YoutubeVideo::fromUrl($turnkeySection?->cta_url),
            'aboutPreviewSection' => $aboutPreviewSection,
            'aboutPreviewPoints' => $this->aboutPreviewPoints($aboutPreviewSection),
            'industryStatsSection' => $industryStatsSection,
            'industryStats' => $this->industryStats($industryStatsSection),
            'latestSection' => $latestSection,
            'latestProducts' => $latestProducts,
            'testimonialsSection' => $testimonialsSection,
            'testimonials' => $testimonials,
            'quickInquirySection' => $quickInquirySection,
            'clients' => Client::query()
                ->with('logoMedia.variants')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(),
        ]);
    }

    /**
     * @param  Collection<int, \App\Models\HomepageSectionBanner>  $banners
     * @return Collection<int, object>
     */
    private function sectionBannersAsHeroBanners(Collection $banners, ?HeroBanner $hero): Collection
    {
        return $banners->map(fn ($banner) => (object) [
            'desktopMedia' => $banner->imageMedia,
            'mobileMedia' => null,
            'text_theme' => $hero?->text_theme ?? 'light',
            'overlay_opacity' => $hero?->overlay_opacity ?? 35,
        ]);
    }

    /**
     * @return Collection<int, object>
     */
    private function defaultHeroBanners(?HeroBanner $hero): Collection
    {
        return collect([
            'default-hero-wooden-art-1.svg',
            'default-hero-wooden-art-2.svg',
            'default-hero-wooden-art-3.svg',
        ])->map(fn (string $filename): object => (object) [
            'desktopMedia' => null,
            'mobileMedia' => null,
            'fallback_image_url' => asset('images/'.$filename),
            'fallback_image_alt' => 'Handcrafted wooden art and furniture detail',
            'headline' => 'Zarokha Wooden Arts',
            'body_text' => 'Custom wooden furniture and carved pieces for homes, workspaces, and hospitality interiors.',
            'primary_cta_label' => 'View Products',
            'primary_cta_url' => route('public.products.index'),
            'secondary_cta_label' => 'Contact',
            'secondary_cta_url' => route('public.contact.show'),
            'text_theme' => $hero?->text_theme ?? 'light',
            'overlay_opacity' => $hero?->overlay_opacity ?? 35,
        ]);
    }

    /**
     * @return Collection<int, object>
     */
    private function defaultLatestProducts(): Collection
    {
        return collect([
            (object) [
                'name' => 'Carved Wooden Clock',
                'slug' => 'carved-wooden-clock',
                'isPlaceholder' => true,
                'featuredMedia' => null,
                'media' => collect(),
                'category' => (object) ['name' => 'Wooden Art'],
                'short_description' => 'A handcrafted wooden accent piece ready for CMS product details.',
            ],
            (object) [
                'name' => 'Decorative Wall Medallion',
                'slug' => 'decorative-wall-medallion',
                'isPlaceholder' => true,
                'featuredMedia' => null,
                'media' => collect(),
                'category' => (object) ['name' => 'Wooden Art'],
                'short_description' => 'Default content shown until published products are added.',
            ],
            (object) [
                'name' => 'Ornate Wooden Mirror',
                'slug' => 'ornate-wooden-mirror',
                'isPlaceholder' => true,
                'featuredMedia' => null,
                'media' => collect(),
                'category' => (object) ['name' => 'Wooden Art'],
                'short_description' => 'A placeholder product card so the section remains visible.',
            ],
        ]);
    }

    /**
     * @return Collection<int, object>
     */
    private function defaultTestimonials(): Collection
    {
        return collect([
            (object) [
                'body_text' => 'The wooden art pieces from Zarokha completely transformed my client\'s living space.',
                'customer_name' => 'Rahul Sharma',
                'location_or_role' => 'Interior Designer',
                'imageMedia' => null,
            ],
            (object) [
                'body_text' => 'We used Zarokha for a large commercial project. The craftsmanship and attention to detail were simply outstanding.',
                'customer_name' => 'Sarah Jenkins',
                'location_or_role' => 'Architect',
                'imageMedia' => null,
            ],
        ]);
    }

    /**
     * @return Collection<int, array{heading:string,body_text:string}>
     */
    private function turnkeyServices(?HomepageSection $section): Collection
    {
        $items = $section?->whyChooseUsItems
            ->filter(fn (WhyChooseUsItem $item): bool => $item->is_active)
            ->values() ?? collect();

        if ($items->isNotEmpty()) {
            return $items->map(fn (WhyChooseUsItem $item): array => [
                'heading' => $item->heading,
                'body_text' => $item->body_text,
            ]);
        }

        return collect([
            [
                'heading' => 'Home Furniture',
                'body_text' => 'Wardrobes, consoles, tables, and storage pieces tailored to the way your rooms are used.',
            ],
            [
                'heading' => 'Office Furniture',
                'body_text' => 'Desks, meeting tables, shelves, and focused storage for calm, efficient workspaces.',
            ],
            [
                'heading' => 'Hospitality Pieces',
                'body_text' => 'Reception counters, room furniture, and display units designed for durable daily use.',
            ],
            [
                'heading' => 'Institutional Work',
                'body_text' => 'Furniture and fixtures for studios, learning spaces, clinics, and public-facing interiors.',
            ],
        ]);
    }

    /**
     * @return Collection<int, string>
     */
    private function aboutPreviewPoints(?HomepageSection $section): Collection
    {
        $items = $section?->whyChooseUsItems
            ->filter(fn (WhyChooseUsItem $item): bool => $item->is_active)
            ->pluck('heading')
            ->filter()
            ->values() ?? collect();

        if ($items->isNotEmpty()) {
            return $items;
        }

        return collect([
            'Direct factory manufacturing',
            'Strict quality control',
            'Timely production',
            'Experienced team',
        ]);
    }

    /**
     * @return Collection<int, array{value:string,label:string}>
     */
    private function industryStats(?HomepageSection $section): Collection
    {
        $items = $section?->whyChooseUsItems
            ->filter(fn (WhyChooseUsItem $item): bool => $item->is_active)
            ->map(fn (WhyChooseUsItem $item): array => [
                'value' => trim($item->heading),
                'label' => trim($item->body_text),
            ])
            ->filter(fn (array $item): bool => $item['value'] !== '' && $item['label'] !== '')
            ->values() ?? collect();

        if ($items->isNotEmpty()) {
            return $items;
        }

        return collect([
            ['value' => '6000', 'label' => 'Residential Projects'],
            ['value' => '4100', 'label' => 'Commercial Projects'],
            ['value' => '25000', 'label' => 'Satisfied Customers'],
            ['value' => '18', 'label' => 'Years of Experience'],
        ]);
    }
}
