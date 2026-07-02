<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Homepage\UpdateHomepageRequest;
use App\Http\Requests\Admin\Homepage\UpdateHomepageSectionRequest;
use App\Models\HeroBanner;
use App\Models\HomepageFeaturedProductItem;
use App\Models\HomepageFloatingProductItem;
use App\Models\HomepageSection;
use App\Models\HomepageSectionBanner;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\ContactInformation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    public function edit(): Response
    {
        $this->authorize('viewAny', Product::class);
        $this->ensureSections();
        $this->ensureHero();
        $this->ensureFloatingItems();

        $sections = HomepageSection::query()
            ->with([
                'backgroundMedia.variants',
                'mobileMedia.variants',
                'featuredProducts.product',
                'floatingProducts.product',
                'floatingProducts.imageMedia.variants',
                'testimonials.imageMedia.variants',
                'banners.imageMedia.variants',
            ])
            ->withCount('featuredProducts')
            ->orderBy('sort_order')
            ->get();
        $sectionsByKey = $sections->keyBy('section_key');
        $hero = HeroBanner::query()
            ->with(['desktopMedia.variants', 'mobileMedia.variants'])
            ->orderBy('sort_order')
            ->firstOrFail();

        $siteSetting = SiteSetting::query()->first();
        $contactInfo = ContactInformation::query()->first();

        return Inertia::render('Admin/Homepage/Index', [
            'homepage' => [
                'hero' => array_merge(
                    $this->heroPayload($hero, $sectionsByKey->get('hero')),
                    ['items' => $this->bannersPayload($sectionsByKey->get('hero'))['banners']]
                ),
                'floatingProducts' => $this->floatingPayload($sectionsByKey->get('hero')),
                'featured' => $this->sectionPayload($sectionsByKey->get('featured_products')),
                'latest' => $this->sectionPayload($sectionsByKey->get('latest_products')),
                'quickInquiry' => $this->bannersPayload($sectionsByKey->get('quick_inquiry')),
            ],
            'settings' => [
                'whatsapp_text' => $contactInfo?->whatsapp_text ?? '',
                'whatsapp_number' => $contactInfo?->whatsapp_number ?? '',
                'show_social_links_on_hero' => (bool) $siteSetting?->show_social_links_on_hero,
            ],
            'productOptions' => Product::query()
                ->orderBy('name')
                ->limit(250)
                ->get(['id', 'name', 'status'])
                ->map(fn (Product $product) => [
                    'id' => $product->id,
                    'label' => $product->name,
                    'status' => $product->status->value,
                ]),
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->orderByDesc('created_at')
                ->limit(250)
                ->get()
                ->map(fn (MediaAsset $media) => $this->mediaPayload($media)),
        ]);
    }

    public function save(UpdateHomepageRequest $request): RedirectResponse
    {
        $this->ensureSections();
        $this->ensureHero();
        $this->ensureFloatingItems();

        $validated = $request->validated();
        $userId = $request->user()->id;

        DB::transaction(function () use ($validated, $userId): void {
            $sections = HomepageSection::query()
                ->whereIn('section_key', ['hero', 'featured_products', 'latest_products', 'testimonials', 'quick_inquiry'])
                ->get()
                ->keyBy('section_key');

            /** @var HeroBanner $hero */
            $hero = HeroBanner::query()->orderBy('sort_order')->firstOrFail();
            $heroData = $validated['hero'];

            $hero->update([
                'headline' => $heroData['heading'],
                'body_text' => $heroData['subtext'] ?? null,
                'primary_cta_label' => $heroData['primary_button_label'] ?? null,
                'primary_cta_url' => $heroData['primary_button_url'] ?? null,
                'secondary_cta_label' => $heroData['secondary_button_label'] ?? null,
                'secondary_cta_url' => $heroData['secondary_button_url'] ?? null,
                'desktop_media_id' => $heroData['desktop_media_id'] ?? null,
                'mobile_media_id' => $heroData['mobile_media_id'] ?? null,
                'overlay_opacity' => $heroData['overlay_opacity'],
                'text_theme' => $heroData['text_theme'],
                'is_active' => $heroData['is_visible'],
                'updated_by_user_id' => $userId,
            ]);

            $heroSection = $sections->get('hero');
            $this->updateSection($heroSection, [
                'is_visible' => $heroData['is_visible'],
            ], $userId);

            $this->syncBanners($heroSection, $heroData['items'] ?? [], $userId);

            $siteSetting = SiteSetting::query()->firstOrCreate([]);
            $siteSetting->update([
                'show_social_links_on_hero' => $validated['settings']['show_social_links_on_hero'] ?? false,
            ]);

            $contactInfo = ContactInformation::query()->firstOrCreate([]);
            $contactInfo->update([
                'whatsapp_number' => $validated['settings']['whatsapp_number'] ?? null,
                'whatsapp_text' => $validated['settings']['whatsapp_text'] ?? null,
            ]);

            $this->syncFloatingItems($sections->get('hero'), $validated['floating_products'], $userId);

            $featured = $validated['featured'];
            $featuredSection = $sections->get('featured_products');
            $this->updateSection($featuredSection, [
                'section_title' => $featured['title'] ?? null,
                'section_intro' => $featured['subtitle'] ?? null,
                'cta_label' => $featured['view_all_label'] ?? null,
                'cta_url' => $featured['view_all_url'] ?? null,
                'source_mode' => 'manual',
                'max_items' => 10,
                'is_visible' => $featured['is_visible'],
            ], $userId);
            $this->syncFeaturedProducts($featuredSection, $featured['products'] ?? []);

            $latest = $validated['latest'];
            $this->updateSection($sections->get('latest_products'), [
                'section_title' => $latest['title'] ?? null,
                'section_intro' => $latest['subtitle'] ?? null,
                'cta_label' => $latest['view_all_label'] ?? null,
                'cta_url' => $latest['view_all_url'] ?? null,
                'source_mode' => 'publish_date',
                'max_items' => $latest['max_items'],
                'is_visible' => $latest['is_visible'],
            ], $userId);

            $quickInquiry = $validated['quickInquiry'];
            $quickInquirySection = $sections->get('quick_inquiry');
            $this->updateSection($quickInquirySection, [
                'section_title' => $quickInquiry['title'] ?? null,
                'section_intro' => $quickInquiry['subtitle'] ?? null,
                'cta_label' => $quickInquiry['button_label'] ?? null,
                'cta_url' => $quickInquiry['button_url'] ?? null,
                'background_media_id' => $quickInquiry['background_media_id'] ?? null,
                'background_color' => $quickInquiry['background_color'] ?? null,
                'is_visible' => $quickInquiry['is_visible'],
            ], $userId);
            $this->syncBanners($quickInquirySection, $quickInquiry['items'] ?? [], $userId);
        });

        return redirect()
            ->route('admin.homepage.edit')
            ->with('status', 'Homepage saved.');
    }

    public function update(UpdateHomepageSectionRequest $request, HomepageSection $section): RedirectResponse
    {
        $section->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.homepage.edit')
            ->with('status', 'Homepage section updated.');
    }

    public function reorder(UpdateHomepageSectionRequest $request, HomepageSection $section): RedirectResponse
    {
        return $this->update($request, $section);
    }

    private function ensureSections(): void
    {
        $sections = [
            'hero' => ['title' => 'Hero', 'mode' => 'manual', 'max' => null, 'visible' => true],
            'featured_products' => ['title' => 'Featured Products', 'mode' => 'manual', 'max' => 10, 'visible' => true],
            'latest_products' => ['title' => 'Latest Products', 'mode' => 'publish_date', 'max' => 10, 'visible' => true],
            'testimonials' => ['title' => 'Testimonials', 'mode' => 'manual', 'max' => null, 'visible' => true],
            'quick_inquiry' => ['title' => 'Quick Inquiry', 'mode' => 'manual', 'max' => null, 'visible' => true],
        ];

        DB::transaction(function () use ($sections): void {
            foreach (array_keys($sections) as $index => $key) {
                $defaults = $sections[$key];
                HomepageSection::query()->firstOrCreate(
                    ['section_key' => $key],
                    [
                        'section_title' => $defaults['title'],
                        'source_mode' => $defaults['mode'],
                        'max_items' => $defaults['max'],
                        'sort_order' => $index * 10,
                        'is_visible' => $defaults['visible'],
                    ],
                );
            }
        });
    }

    private function ensureHero(): void
    {
        HeroBanner::query()->firstOrCreate(
            ['sort_order' => 0],
            [
                'headline' => 'Zarokha Wooden Arts',
                'body_text' => 'CMS-managed homepage hero copy.',
                'primary_cta_label' => 'View Products',
                'primary_cta_url' => route('public.products.index'),
                'secondary_cta_label' => 'Contact',
                'secondary_cta_url' => route('public.contact.show'),
                'overlay_opacity' => 35,
                'text_theme' => 'light',
                'is_active' => true,
            ],
        );
    }

    private function ensureFloatingItems(): void
    {
        $heroSection = HomepageSection::query()->where('section_key', 'hero')->firstOrFail();
        $positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

        foreach ($positions as $index => $position) {
            HomepageFloatingProductItem::query()->firstOrCreate(
                [
                    'homepage_section_id' => $heroSection->id,
                    'sort_order' => $index,
                ],
                [
                    'position' => $position,
                    'tilt_preset' => 'full',
                    'tap_label' => 'Tap to View',
                    'is_visible' => true,
                ],
            );
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function updateSection(?HomepageSection $section, array $data, int $userId): void
    {
        if (! $section) {
            return;
        }

        $section->update([
            ...$data,
            'updated_by_user_id' => $userId,
        ]);
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncFloatingItems(?HomepageSection $section, array $items, int $userId): void
    {
        if (! $section) {
            return;
        }

        foreach (array_values($items) as $index => $item) {
            HomepageFloatingProductItem::query()->updateOrCreate(
                [
                    'homepage_section_id' => $section->id,
                    'sort_order' => $index,
                ],
                [
                    'product_id' => $item['product_id'] ?? null,
                    'image_media_id' => $item['image_media_id'] ?? null,
                    'alt_text' => $item['alt_text'] ?? null,
                    'position' => $item['position'],
                    'tilt_preset' => $item['tilt_preset'],
                    'tap_label' => $item['tap_label'] ?? null,
                    'is_visible' => $item['is_visible'],
                    'updated_by_user_id' => $userId,
                ],
            );
        }
    }

    /**
     * @param  array<int, array{product_id:int}>  $products
     */
    private function syncFeaturedProducts(?HomepageSection $section, array $products): void
    {
        if (! $section) {
            return;
        }

        $section->featuredProducts()->delete();

        foreach (array_values($products) as $index => $product) {
            HomepageFeaturedProductItem::query()->create([
                'homepage_section_id' => $section->id,
                'product_id' => $product['product_id'],
                'sort_order' => $index,
                'created_at' => now(),
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncTestimonials(?HomepageSection $section, array $items, int $userId): void
    {
        if (! $section) {
            return;
        }

        $seenIds = [];

        foreach (array_values($items) as $index => $item) {
            $testimonial = HomepageTestimonial::query()->updateOrCreate(
                [
                    'id' => $item['id'] ?? null,
                    'homepage_section_id' => $section->id,
                ],
                [
                    'customer_name' => $item['customer_name'],
                    'location_or_role' => $item['location_or_role'] ?? null,
                    'body_text' => $item['body_text'],
                    'image_media_id' => $item['image_media_id'] ?? null,
                    'status' => $item['status'],
                    'sort_order' => $item['sort_order'] ?? $index,
                    'is_visible' => $item['is_visible'],
                    'updated_by_user_id' => $userId,
                ],
            );

            if (! $testimonial->wasRecentlyCreated) {
                $seenIds[] = $testimonial->id;
            } else {
                $testimonial->update(['created_by_user_id' => $userId]);
                $seenIds[] = $testimonial->id;
            }
        }

        HomepageTestimonial::query()
            ->where('homepage_section_id', $section->id)
            ->when($seenIds !== [], fn ($query) => $query->whereNotIn('id', $seenIds))
            ->delete();
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncBanners(?HomepageSection $section, array $items, int $userId): void
    {
        if (! $section) {
            return;
        }

        $seenIds = [];

        foreach (array_values($items) as $index => $item) {
            $banner = HomepageSectionBanner::query()->updateOrCreate(
                [
                    'id' => $item['id'] ?? null,
                    'homepage_section_id' => $section->id,
                ],
                [
                    'media_asset_id' => $item['imageMediaId'] ?? null,
                    'sort_order' => $item['sortOrder'] ?? $index,
                    'is_visible' => $item['isVisible'] ?? true,
                    'updated_by_user_id' => $userId,
                ],
            );

            if (! $banner->wasRecentlyCreated) {
                $seenIds[] = $banner->id;
            } else {
                $banner->update(['created_by_user_id' => $userId]);
                $seenIds[] = $banner->id;
            }
        }

        HomepageSectionBanner::query()
            ->where('homepage_section_id', $section->id)
            ->when($seenIds !== [], fn ($query) => $query->whereNotIn('id', $seenIds))
            ->delete();
    }

    /**
     * @return array<string, mixed>
     */
    private function heroPayload(HeroBanner $hero, ?HomepageSection $section): array
    {
        return [
            'heading' => $hero->headline,
            'subtext' => $hero->body_text,
            'desktopMediaId' => $hero->desktop_media_id,
            'mobileMediaId' => $hero->mobile_media_id,
            'primaryButtonLabel' => $hero->primary_cta_label,
            'primaryButtonUrl' => $hero->primary_cta_url,
            'secondaryButtonLabel' => $hero->secondary_cta_label,
            'secondaryButtonUrl' => $hero->secondary_cta_url,
            'overlayOpacity' => $hero->overlay_opacity,
            'textTheme' => $hero->text_theme,
            'isVisible' => $hero->is_active && ($section ? $section->is_visible : true),
            'desktopMedia' => $hero->desktopMedia ? $this->mediaPayload($hero->desktopMedia) : null,
            'mobileMedia' => $hero->mobileMedia ? $this->mediaPayload($hero->mobileMedia) : null,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function floatingPayload(?HomepageSection $section): array
    {
        if (! $section) {
            return [];
        }

        return $section->floatingProducts->values()->map(fn (HomepageFloatingProductItem $item) => [
            'id' => $item->id,
            'productId' => $item->product_id,
            'imageMediaId' => $item->image_media_id,
            'altText' => $item->alt_text,
            'position' => $item->position,
            'tiltPreset' => $item->tilt_preset,
            'tapLabel' => $item->tap_label,
            'isVisible' => $item->is_visible,
            'productName' => $item->product?->name,
            'imageMedia' => $item->imageMedia ? $this->mediaPayload($item->imageMedia) : null,
        ])->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function sectionPayload(?HomepageSection $section): array
    {
        if (! $section) {
            return [
                'title' => null,
                'subtitle' => null,
                'viewAllLabel' => null,
                'viewAllUrl' => null,
                'buttonLabel' => null,
                'buttonUrl' => null,
                'maxItems' => 10,
                'backgroundMediaId' => null,
                'backgroundColor' => null,
                'isVisible' => false,
                'products' => [],
            ];
        }

        return [
            'title' => $section->section_title,
            'subtitle' => $section->section_intro,
            'viewAllLabel' => $section->cta_label,
            'viewAllUrl' => $section->cta_url,
            'buttonLabel' => $section->cta_label,
            'buttonUrl' => $section->cta_url,
            'maxItems' => $section->max_items ?? 10,
            'backgroundMediaId' => $section->background_media_id,
            'backgroundColor' => $section->background_color,
            'isVisible' => $section->is_visible,
            'products' => $section->featuredProducts->values()->map(fn ($item) => [
                'productId' => $item->product_id,
                'productName' => $item->product?->name,
            ])->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function testimonialsPayload(?HomepageSection $section): array
    {
        if (! $section) {
            return [
                ...$this->sectionPayload(null),
                'items' => [],
            ];
        }

        return [
            ...$this->sectionPayload($section),
            'items' => $section->testimonials->values()->map(fn ($testimonial) => [
                'id' => $testimonial->id,
                'customerName' => $testimonial->customer_name,
                'locationOrRole' => $testimonial->location_or_role,
                'bodyText' => $testimonial->body_text,
                'imageMediaId' => $testimonial->image_media_id,
                'status' => $testimonial->status,
                'sortOrder' => $testimonial->sort_order,
                'isVisible' => $testimonial->is_visible,
                'imageMedia' => $testimonial->imageMedia ? $this->mediaPayload($testimonial->imageMedia) : null,
            ])->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function bannersPayload(?HomepageSection $section): array
    {
        if (! $section) {
            return [
                ...$this->sectionPayload(null),
                'banners' => [],
            ];
        }

        return [
            ...$this->sectionPayload($section),
            'banners' => $section->banners->values()->map(fn ($banner) => [
                'id' => $banner->id,
                'imageMediaId' => $banner->media_asset_id,
                'sortOrder' => $banner->sort_order,
                'isVisible' => $banner->is_visible,
                'imageMedia' => $banner->imageMedia ? $this->mediaPayload($banner->imageMedia) : null,
            ])->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaPayload(MediaAsset $media): array
    {
        return [
            'id' => $media->id,
            'label' => $media->original_filename,
            'altText' => $media->alt_text,
            'url' => $media->status === 'processed' ? $media->responsiveImage()['src'] : null,
            'status' => $media->status,
        ];
    }
}
