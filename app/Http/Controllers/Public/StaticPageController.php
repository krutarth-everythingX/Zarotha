<?php

namespace App\Http\Controllers\Public;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\Concerns\BuildsPublicViewData;
use App\Models\Client;
use App\Models\MediaAsset;
use App\Models\Page;
use Illuminate\Support\Collection;
use Illuminate\View\View;

class StaticPageController extends Controller
{
    use BuildsPublicViewData;

    public function show(string $pageKey): View
    {
        $page = Page::query()
            ->with('craftsmanshipSteps')
            ->where('page_key', $pageKey)
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->first();

        $aboutDetails = $pageKey === 'about_us' ? ($page?->about_details ?? []) : [];
        $aboutMedia = $pageKey === 'about_us' ? $this->aboutMedia($page, $aboutDetails) : collect();

        return view('pages.static', [
            ...$this->sharedPublicData(),
            'page' => $page,
            'pageKey' => $pageKey,
            'aboutDetails' => $aboutDetails,
            'aboutMedia' => $aboutMedia,
            'aboutYoutubeEmbedUrl' => $this->youtubeEmbedUrl($aboutDetails['video_url'] ?? null),
            'clients' => $pageKey === 'about_us'
                ? Client::query()
                    ->with('logoMedia.variants')
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->get()
                : collect(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $details
     * @return Collection<int, MediaAsset>
     */
    private function aboutMedia(?Page $page, array $details): Collection
    {
        $ids = collect([
            $page?->hero_media_id,
        ])
            ->filter(fn ($id): bool => is_numeric($id))
            ->map(fn ($id): int => (int) $id)
            ->unique()
            ->values();

        if ($ids->isEmpty()) {
            return collect();
        }

        return MediaAsset::query()
            ->with('variants')
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');
    }

    private function youtubeEmbedUrl(?string $url): ?string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return null;
        }

        $parts = parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));
        $path = trim((string) ($parts['path'] ?? ''), '/');
        $videoId = null;

        if (str_ends_with($host, 'youtu.be')) {
            $videoId = explode('/', $path)[0] ?? null;
        } elseif (str_contains($host, 'youtube.com') || str_contains($host, 'youtube-nocookie.com')) {
            if (str_starts_with($path, 'embed/')) {
                $videoId = explode('/', substr($path, 6))[0] ?? null;
            } elseif (str_starts_with($path, 'shorts/')) {
                $videoId = explode('/', substr($path, 7))[0] ?? null;
            } else {
                parse_str((string) ($parts['query'] ?? ''), $query);
                $videoId = $query['v'] ?? null;
            }
        }

        if (! is_string($videoId) || ! preg_match('/^[A-Za-z0-9_-]{6,20}$/', $videoId)) {
            return null;
        }

        return 'https://www.youtube-nocookie.com/embed/'.$videoId;
    }
}
