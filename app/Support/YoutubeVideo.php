<?php

namespace App\Support;

class YoutubeVideo
{
    /**
     * @return array{id:string,url:string,embed_url:string,thumbnail_url:string}|null
     */
    public static function fromUrl(?string $url): ?array
    {
        $url = trim((string) $url);

        if ($url === '') {
            return null;
        }

        $videoId = self::idFromUrl($url);

        if ($videoId === null) {
            return null;
        }

        return [
            'id' => $videoId,
            'url' => $url,
            'embed_url' => 'https://www.youtube-nocookie.com/embed/'.$videoId,
            'thumbnail_url' => 'https://img.youtube.com/vi/'.$videoId.'/hqdefault.jpg',
        ];
    }

    public static function isYoutubeUrl(?string $url): bool
    {
        return self::idFromUrl($url) !== null;
    }

    private static function idFromUrl(?string $url): ?string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return null;
        }

        $parseableUrl = $url;

        if (! preg_match('#^https?://#i', $parseableUrl)
            && preg_match('#^(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)/#i', $parseableUrl)) {
            $parseableUrl = 'https://'.$parseableUrl;
        }

        $parts = parse_url($parseableUrl);
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

        return $videoId;
    }
}
