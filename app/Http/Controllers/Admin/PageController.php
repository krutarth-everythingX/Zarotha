<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Page\UpdatePageRequest;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    private const PAGE_MAP = [
        'about-us' => ['key' => 'about_us', 'title' => 'About Us'],
        'our-craftsmanship' => ['key' => 'our_craftsmanship', 'title' => 'Our Craftsmanship'],
        'privacy-policy' => ['key' => 'privacy_policy', 'title' => 'Privacy Policy'],
        'terms-and-conditions' => ['key' => 'terms_and_conditions', 'title' => 'Terms and Conditions'],
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
            'pageOptions' => array_keys(self::PAGE_MAP),
        ]);
    }

    public function update(UpdatePageRequest $request, string $pageSlug): RedirectResponse
    {
        $page = $this->pageForSlug($pageSlug);
        $page->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

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
}
