<?php

namespace App\Http\Controllers\Public;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect([
            route('public.home'),
            route('public.products.index'),
            route('public.pages.about'),
            route('public.pages.craftsmanship'),
            route('public.contact.show'),
        ]);

        $urls = $urls->merge(Product::query()
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->pluck('slug')
            ->map(fn (string $slug): string => route('public.products.show', $slug)));

        $urls = $urls->merge(Page::query()
            ->whereIn('page_key', ['privacy_policy', 'terms_and_conditions'])
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->pluck('page_key')
            ->map(fn (string $key): string => $key === 'privacy_policy' ? route('public.pages.privacy') : route('public.pages.terms')));

        return response()
            ->view('sitemap', ['urls' => $urls->unique()->values()])
            ->header('Content-Type', 'application/xml');
    }
}
