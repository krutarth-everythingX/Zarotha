<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Page\UpdatePageRequest;
use App\Models\MediaAsset;
use App\Models\Page;
use App\Models\Product;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    private const PAGE_MAP = [
        'about-us' => ['key' => 'about_us', 'title' => 'About Us'],
    ];

    public function edit(string $pageSlug): Response
    {
        $this->authorize('viewAny', Product::class);
        $page = $this->pageForSlug($pageSlug);

        return Inertia::render('Admin/Pages/Edit', [
            'page' => [
                'id' => $page->id,
                'pageKey' => $page->page_key,
                'slug' => $page->slug,
                'navigationLabel' => $page->navigation_label,
                'title' => $page->title,
                'introTitle' => $page->intro_title,
                'introBody' => $page->intro_body,
                'bodyHtml' => $page->body_html,
                'aboutDetails' => $page->about_details,
                'heroMediaId' => $page->hero_media_id,
                'ctaLabel' => $page->cta_label,
                'ctaUrl' => $page->cta_url,
                'effectiveDate' => $page->effective_date?->toDateString(),
                'status' => $page->status->value,
                'publishedAt' => $page->published_at?->toDateTimeString(),
                'metaTitle' => $page->meta_title,
                'metaDescription' => $page->meta_description,
                'ogTitle' => $page->og_title,
                'ogDescription' => $page->og_description,
                'ogImageMediaId' => $page->og_image_media_id,
                'canonicalUrl' => $page->canonical_url,
                'robotsIndex' => $page->robots_index,
                'robotsFollow' => $page->robots_follow,
            ],
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->orderByDesc('created_at')
                ->limit(250)
                ->get()
                ->map(fn (MediaAsset $media): array => $this->mediaPayload($media)),
            'pageOptions' => array_keys(self::PAGE_MAP),
        ]);
    }

    public function update(UpdatePageRequest $request, string $pageSlug): RedirectResponse
    {
        $page = $this->pageForSlug($pageSlug);
        $validated = $request->validated();

        $page->update([
            ...$validated,
            'body_html' => HtmlSanitizer::sanitize($validated['body_html'] ?? null),
            'updated_by_user_id' => $request->user()->id,
        ]);

        if ($request->routeIs('admin.settings.about.update')) {
            return redirect()
                ->route('admin.settings.about.edit')
                ->with('status', 'Page content updated.');
        }

        return redirect()
            ->route('admin.pages.edit', $pageSlug)
            ->with('status', 'Page content updated.');
    }

    private function pageForSlug(string $pageSlug): Page
    {
        abort_unless(isset(self::PAGE_MAP[$pageSlug]), 404);
        $definition = self::PAGE_MAP[$pageSlug];

        /** @var Page $page */
        $page = Page::query()->firstOrCreate(
            ['page_key' => $definition['key']],
            [
                'slug' => $pageSlug,
                'title' => $definition['title'],
                'status' => PublishStatus::Draft,
                'robots_index' => true,
                'robots_follow' => true,
                'created_by_user_id' => auth()->id(),
            ],
        );

        return $page;
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaPayload(MediaAsset $media): array
    {
        $image = $media->responsiveImage('320px');

        return [
            'id' => $media->id,
            'label' => $media->original_filename,
            'altText' => $media->alt_text,
            'url' => $image['src'] ?? null,
            'status' => $media->status,
            'width' => $image['width'] ?? $media->width,
            'height' => $image['height'] ?? $media->height,
        ];
    }
}
