<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Homepage\UpdateHomepageRequest;
use App\Http\Requests\Admin\Homepage\UpdateHomepageSectionRequest;
use App\Models\HeroBanner;
use App\Models\HomepageSection;
use App\Models\HomepageSectionBanner;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\ContactInformation;
use App\Models\WhyChooseUsItem;
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
        $this->ensureDefaultSectionItems();
        $this->ensureHero();

        $sections = HomepageSection::query()
            ->with([
                'backgroundMedia.variants',
                'mobileMedia.variants',
                'banners.imageMedia.variants',
                'whyChooseUsItems',
            ])
            ->orderBy('sort_order')
            ->get();
        $sectionsByKey = $sections->keyBy('section_key');
        $hero = HeroBanner::query()
            ->with(['desktopMedia.variants', 'mobileMedia.variants'])
            ->orderBy('sort_order')
            ->firstOrFail();

        $contactInfo = ContactInformation::query()->first();

        return Inertia::render('Admin/Homepage/Index', [
            'homepage' => [
                'hero' => array_merge(
                    $this->heroPayload($hero, $sectionsByKey->get('hero')),
                    ['items' => $this->bannersPayload($sectionsByKey->get('hero'))['banners']]
                ),
                'turnkey' => $this->contentSectionPayload($sectionsByKey->get('turnkey_solutions'), true),
                'aboutPreview' => $this->contentSectionPayload($sectionsByKey->get('about_preview'), true),
                'industryStats' => $this->contentSectionPayload($sectionsByKey->get('industry_stats'), true),
                'latest' => $this->sectionPayload($sectionsByKey->get('latest_products')),
                'quickInquiry' => $this->bannersPayload($sectionsByKey->get('quick_inquiry')),
            ],
            'settings' => [
                'whatsapp_text' => $contactInfo?->whatsapp_text ?? '',
                'whatsapp_number' => $contactInfo?->whatsapp_number ?? '',
            ],
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
        $this->ensureDefaultSectionItems();
        $this->ensureHero();

        $validated = $request->validated();
        $userId = $request->user()->id;

        DB::transaction(function () use ($validated, $userId): void {
            $sections = HomepageSection::query()
                ->whereIn('section_key', [
                    'hero',
                    'turnkey_solutions',
                    'about_preview',
                    'industry_stats',
                    'latest_products',
                    'quick_inquiry',
                ])
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

            $contactInfo = ContactInformation::query()->firstOrCreate([], [
                'business_name' => config('app.name', 'Zarokha'),
                'show_address' => false,
                'show_phone' => true,
                'show_email' => true,
                'show_whatsapp' => true,
            ]);
            $settings = $validated['settings'] ?? [];
            $contactInfo->update([
                'whatsapp_number' => $settings['whatsapp_number'] ?? null,
                'whatsapp_text' => $settings['whatsapp_text'] ?? null,
            ]);

            if (array_key_exists('turnkey', $validated)) {
                $turnkey = $validated['turnkey'];
                $turnkeySection = $sections->get('turnkey_solutions');
                $this->updateSection($turnkeySection, [
                    'eyebrow' => $turnkey['eyebrow'] ?? null,
                    'section_title' => $turnkey['title'] ?? null,
                    'section_intro' => $turnkey['subtitle'] ?? null,
                    'cta_url' => $turnkey['button_url'] ?? null,
                    'background_media_id' => null,
                    'is_visible' => $turnkey['is_visible'] ?? true,
                ], $userId);
                if (array_key_exists('items', $turnkey)) {
                    $this->syncWhyChooseUsItems($turnkeySection, $turnkey['items'] ?? []);
                }
            }

            if (array_key_exists('aboutPreview', $validated)) {
                $aboutPreview = $validated['aboutPreview'];
                $aboutPreviewSection = $sections->get('about_preview');
                $this->updateSection($aboutPreviewSection, [
                    'eyebrow' => $aboutPreview['eyebrow'] ?? null,
                    'section_title' => $aboutPreview['title'] ?? null,
                    'section_intro' => $aboutPreview['subtitle'] ?? null,
                    'section_body' => $aboutPreview['body'] ?? null,
                    'cta_label' => $aboutPreview['primary_button_label'] ?? null,
                    'cta_url' => $aboutPreview['primary_button_url'] ?? null,
                    'secondary_cta_label' => $aboutPreview['secondary_button_label'] ?? null,
                    'secondary_cta_url' => $aboutPreview['secondary_button_url'] ?? null,
                    'background_media_id' => $aboutPreview['background_media_id'] ?? null,
                    'is_visible' => $aboutPreview['is_visible'] ?? true,
                ], $userId);
                if (array_key_exists('points', $aboutPreview)) {
                    $this->syncWhyChooseUsItems($aboutPreviewSection, $aboutPreview['points'] ?? []);
                }
            }

            if (array_key_exists('industryStats', $validated)) {
                $industryStats = $validated['industryStats'];
                $industryStatsSection = $sections->get('industry_stats');
                $this->updateSection($industryStatsSection, [
                    'eyebrow' => $industryStats['highlight'] ?? null,
                    'section_title' => $industryStats['title'] ?? null,
                    'section_intro' => $industryStats['subtitle'] ?? null,
                    'section_body' => $industryStats['body'] ?? null,
                    'cta_label' => $industryStats['contact_label'] ?? null,
                    'cta_url' => $industryStats['contact_url'] ?? null,
                    'secondary_cta_label' => $industryStats['more_label'] ?? null,
                    'secondary_cta_url' => $industryStats['more_url'] ?? null,
                    'is_visible' => $industryStats['is_visible'] ?? true,
                ], $userId);
                if (array_key_exists('items', $industryStats)) {
                    $this->syncWhyChooseUsItems($industryStatsSection, $industryStats['items'] ?? []);
                }
            }

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
            'turnkey_solutions' => [
                'eyebrow' => 'A complete custom',
                'title' => 'furniture solution',
                'intro' => 'Crafted for homes, workspaces, and hospitality interiors with careful material choices.',
                'cta_url' => null,
                'mode' => 'manual',
                'max' => 4,
                'visible' => true,
            ],
            'about_preview' => [
                'eyebrow' => 'About Zarokha',
                'title' => 'The leading furniture brand for thoughtful custom spaces.',
                'intro' => 'Zarokha brings together measured design, material knowledge, and workshop discipline to create furniture that fits the room, the routine, and the people who use it every day.',
                'body' => 'From homes and workspaces to hospitality interiors, every project is shaped with practical details, careful finishing, and a clear conversation from idea to installation.',
                'cta_label' => 'View more',
                'cta_url' => route('public.pages.about'),
                'secondary_cta_label' => 'Contact us',
                'secondary_cta_url' => route('public.contact.show'),
                'mode' => 'manual',
                'max' => 4,
                'visible' => true,
            ],
            'industry_stats' => [
                'eyebrow' => 'finished with care',
                'title' => 'Furniture made at scale, finished with care.',
                'intro' => null,
                'body' => "Don't hesitate, :contact for better help and products. :more",
                'cta_label' => 'contact us',
                'cta_url' => route('public.contact.show'),
                'secondary_cta_label' => 'View More',
                'secondary_cta_url' => route('public.products.index'),
                'mode' => 'manual',
                'max' => 4,
                'visible' => true,
            ],
            'latest_products' => ['title' => 'Latest Wooden Art', 'intro' => 'Freshly published designs.', 'mode' => 'publish_date', 'max' => 10, 'visible' => true],
            'quick_inquiry' => [
                'title' => 'Start your project',
                'intro' => 'Have a vision for a specific space? We collaborate with architects, designers, and homeowners to bring unique wooden dreams to life. Your heritage, our hands.',
                'cta_label' => 'Start a Conversation',
                'cta_url' => route('public.contact.show'),
                'mode' => 'manual',
                'max' => null,
                'visible' => true,
            ],
        ];

        DB::transaction(function () use ($sections): void {
            foreach (array_keys($sections) as $index => $key) {
                $defaults = $sections[$key];
                HomepageSection::query()->firstOrCreate(
                    ['section_key' => $key],
                    [
                        'eyebrow' => $defaults['eyebrow'] ?? null,
                        'section_title' => $defaults['title'],
                        'section_intro' => $defaults['intro'] ?? null,
                        'section_body' => $defaults['body'] ?? null,
                        'cta_label' => $defaults['cta_label'] ?? null,
                        'cta_url' => $defaults['cta_url'] ?? null,
                        'secondary_cta_label' => $defaults['secondary_cta_label'] ?? null,
                        'secondary_cta_url' => $defaults['secondary_cta_url'] ?? null,
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

    private function ensureDefaultSectionItems(): void
    {
        DB::transaction(function (): void {
            $this->ensureWhyChooseItems('turnkey_solutions', [
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

            $this->ensureWhyChooseItems('about_preview', [
                ['heading' => 'Direct factory manufacturing', 'body_text' => ''],
                ['heading' => 'Strict quality control', 'body_text' => ''],
                ['heading' => 'Timely production', 'body_text' => ''],
                ['heading' => 'Experienced team', 'body_text' => ''],
            ]);

            $this->ensureWhyChooseItems('industry_stats', [
                ['heading' => '6000', 'body_text' => 'Residential Projects'],
                ['heading' => '4100', 'body_text' => 'Commercial Projects'],
                ['heading' => '25000', 'body_text' => 'Satisfied Customers'],
                ['heading' => '18', 'body_text' => 'Years of Experience'],
            ]);
        });
    }

    /**
     * @param  array<int, array{heading:string,body_text:string}>  $items
     */
    private function ensureWhyChooseItems(string $sectionKey, array $items): void
    {
        $section = HomepageSection::query()->where('section_key', $sectionKey)->first();

        if (! $section || $section->whyChooseUsItems()->count() > 0) {
            return;
        }

        foreach ($items as $index => $item) {
            WhyChooseUsItem::query()->create([
                'homepage_section_id' => $section->id,
                'heading' => $item['heading'],
                'body_text' => $item['body_text'],
                'sort_order' => $index,
                'is_active' => true,
            ]);
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
    private function syncWhyChooseUsItems(?HomepageSection $section, array $items): void
    {
        if (! $section) {
            return;
        }

        $seenIds = [];

        foreach (array_values($items) as $index => $item) {
            $heading = trim((string) ($item['heading'] ?? ''));

            if ($heading === '') {
                continue;
            }

            $content = trim((string) ($item['body_text'] ?? ''));
            $whyChooseItem = WhyChooseUsItem::query()->updateOrCreate(
                [
                    'id' => $item['id'] ?? null,
                    'homepage_section_id' => $section->id,
                ],
                [
                    'heading' => $heading,
                    'body_text' => $content,
                    'sort_order' => $item['sort_order'] ?? $index,
                    'is_active' => $item['is_active'] ?? true,
                ],
            );

            $seenIds[] = $whyChooseItem->id;
        }

        WhyChooseUsItem::query()
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
            if (empty($item['imageMediaId'])) {
                continue;
            }

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
     * @return array<string, mixed>
     */
    private function sectionPayload(?HomepageSection $section): array
    {
        if (! $section) {
            return [
                'eyebrow' => null,
                'title' => null,
                'subtitle' => null,
                'body' => null,
                'viewAllLabel' => null,
                'viewAllUrl' => null,
                'primaryButtonLabel' => null,
                'primaryButtonUrl' => null,
                'secondaryButtonLabel' => null,
                'secondaryButtonUrl' => null,
                'buttonLabel' => null,
                'buttonUrl' => null,
                'maxItems' => 10,
                'backgroundMediaId' => null,
                'backgroundMedia' => null,
                'backgroundColor' => null,
                'isVisible' => false,
            ];
        }

        return [
            'eyebrow' => $section->eyebrow,
            'title' => $section->section_title,
            'subtitle' => $section->section_intro,
            'body' => $section->section_body,
            'viewAllLabel' => $section->cta_label,
            'viewAllUrl' => $section->cta_url,
            'primaryButtonLabel' => $section->cta_label,
            'primaryButtonUrl' => $section->cta_url,
            'secondaryButtonLabel' => $section->secondary_cta_label,
            'secondaryButtonUrl' => $section->secondary_cta_url,
            'buttonLabel' => $section->cta_label,
            'buttonUrl' => $section->cta_url,
            'maxItems' => $section->max_items ?? 10,
            'backgroundMediaId' => $section->background_media_id,
            'backgroundMedia' => $section->backgroundMedia ? $this->mediaPayload($section->backgroundMedia) : null,
            'backgroundColor' => $section->background_color,
            'isVisible' => $section->is_visible,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function contentSectionPayload(?HomepageSection $section, bool $includeItems = false): array
    {
        $payload = $this->sectionPayload($section);

        if (! $includeItems || ! $section) {
            return [
                ...$payload,
                'items' => [],
            ];
        }

        return [
            ...$payload,
            'items' => $section->whyChooseUsItems->values()->map(fn (WhyChooseUsItem $item) => [
                'id' => $item->id,
                'heading' => $item->heading,
                'bodyText' => $item->body_text,
                'sortOrder' => $item->sort_order,
                'isActive' => $item->is_active,
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
        $image = $media->responsiveImage('25vw');

        return [
            'id' => $media->id,
            'label' => $media->original_filename,
            'altText' => $media->alt_text,
            'url' => $image['src'] ?? $media->url(),
            'status' => $media->status,
        ];
    }
}
