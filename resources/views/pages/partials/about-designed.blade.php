@php
    $details = is_array($aboutDetails ?? null) ? $aboutDetails : [];
    $mediaById = collect($aboutMedia ?? []);
    $mediaFor = fn ($id) => is_numeric($id) ? $mediaById->get((int) $id) : null;

    $heroMedia = $mediaFor($page?->hero_media_id);
    $whyItems = collect($details['why_items'] ?? [])
        ->map(fn ($item) => trim((string) $item))
        ->filter()
        ->values();
    $stats = collect($details['stats'] ?? [])
        ->filter(fn ($item) => trim((string) ($item['value'] ?? '')) !== '' && trim((string) ($item['label'] ?? '')) !== '')
        ->values();
    $skills = collect($details['skills'] ?? [])
        ->filter(fn ($item) => trim((string) ($item['label'] ?? '')) !== '')
        ->values();
    $clientTitle = trim((string) ($details['client_title'] ?? ''));
    $hasStoryMedia = (bool) ($aboutYoutubeEmbedUrl || $heroMedia);
    $hasStats = $stats->isNotEmpty();
@endphp

<section @class(['about-story', 'about-story--with-media' => $hasStoryMedia, 'about-story--text-only' => ! $hasStoryMedia]) aria-labelledby="about-story-title">
    <div class="about-story__inner">
        @if ($hasStoryMedia)
            <div class="about-story__video">
                @if ($aboutYoutubeEmbedUrl)
                <iframe
                    src="{{ $aboutYoutubeEmbedUrl }}"
                    title="{{ $details['video_title'] ?? $page?->title ?? config('app.name') }}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
                @elseif ($heroMedia)
                    <x-public.image :media="$heroMedia" sizes="(min-width: 1024px) 42vw, 100vw" class="about-story__image" loading="eager" />
                @endif
            </div>
        @endif

        <div class="about-story__copy">
            @if (! empty($details['who_we_are_kicker']))
                <p class="about-kicker">{{ $details['who_we_are_kicker'] }}</p>
            @endif
            <h1 id="about-story-title">{{ $details['who_we_are_title'] ?? $page?->intro_title ?? $page?->title }}</h1>
            @if (! empty($details['who_we_are_body']) || $page?->intro_body)
                <p>{{ $details['who_we_are_body'] ?? $page->intro_body }}</p>
            @endif
            @if (! empty($details['hero_note']))
                <p class="about-story__note">{{ $details['hero_note'] }}</p>
            @endif
            @if ($page?->cta_label && $page?->cta_url)
                <a href="{{ $page->cta_url }}" class="about-button">{{ $page->cta_label }}</a>
            @endif
        </div>
    </div>
</section>

@if ($whyItems->isNotEmpty() || ! empty($details['catalog_title']) || ! empty($details['catalog_body']))
    <section class="about-proof about-proof--text-only" aria-labelledby="about-proof-title">
        <div class="about-proof__inner">
            <div class="about-proof__copy">
                @if (! empty($details['why_title']))
                    <h2 id="about-proof-title">{{ $details['why_title'] }}</h2>
                @endif

                @if ($whyItems->isNotEmpty())
                    <ul class="about-check-list">
                        @foreach ($whyItems as $item)
                            <li>{{ $item }}</li>
                        @endforeach
                    </ul>
                @endif

                @if (! empty($details['catalog_title']) || ! empty($details['catalog_body']))
                    <div class="about-catalog about-catalog--text-only">
                        <div>
                            @if (! empty($details['catalog_title']))
                                <h3>{{ $details['catalog_title'] }}</h3>
                            @endif
                            @if (! empty($details['catalog_body']))
                                <p>{{ $details['catalog_body'] }}</p>
                            @endif
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </section>
@endif

@if (! empty($details['vision_title']) || ! empty($details['vision_body']) || ! empty($details['mission_title']) || ! empty($details['mission_body']))
    <section class="about-vision about-vision--text-only" aria-labelledby="about-vision-title">
        <div class="about-vision__inner">
            <div class="about-vision__copy">
                @if (! empty($details['vision_title']))
                    <h2 id="about-vision-title">{{ $details['vision_title'] }}</h2>
                @endif
                @if (! empty($details['vision_body']))
                    <p>{{ $details['vision_body'] }}</p>
                @endif

                @if (! empty($details['mission_title']) || ! empty($details['mission_body']))
                    <div class="about-mission">
                        @if (! empty($details['mission_title']))
                            <h3>{{ $details['mission_title'] }}</h3>
                        @endif
                        @if (! empty($details['mission_body']))
                            <p>{{ $details['mission_body'] }}</p>
                        @endif
                    </div>
                @endif
            </div>
        </div>
    </section>
@endif

@if (! empty($details['aim_title']) || ! empty($details['aim_body']) || $stats->isNotEmpty())
    <section @class(['about-aim', 'about-aim--with-stats' => $hasStats, 'about-aim--text-only' => ! $hasStats]) aria-labelledby="about-aim-title">
        <div class="about-aim__inner">
            <div class="about-aim__copy">
                @if (! empty($details['aim_title']))
                    <h2 id="about-aim-title">{{ $details['aim_title'] }}</h2>
                @endif
                @if (! empty($details['aim_body']))
                    <p>{{ $details['aim_body'] }}</p>
                @endif
            </div>

            @if ($stats->isNotEmpty())
                <div class="about-stats">
                    @foreach ($stats as $stat)
                        <article>
                            <strong>{{ $stat['value'] }}</strong>
                            <span>{{ $stat['label'] }}</span>
                        </article>
                    @endforeach
                </div>
            @endif
        </div>
    </section>
@endif

@if (! empty($details['strength_title']) || ! empty($details['strength_body']) || $skills->isNotEmpty())
    <section class="about-strength about-strength--text-only" aria-labelledby="about-strength-title">
        <div class="about-strength__panel">
            <div class="about-strength__copy">
                @if (! empty($details['strength_kicker']))
                    <p class="about-kicker">{{ $details['strength_kicker'] }}</p>
                @endif
                @if (! empty($details['strength_title']))
                    <h2 id="about-strength-title">{{ $details['strength_title'] }}</h2>
                @endif
                @if (! empty($details['strength_body']))
                    <p>{{ $details['strength_body'] }}</p>
                @endif

                @if ($skills->isNotEmpty())
                    <div class="about-skill-list">
                        @foreach ($skills as $skill)
                            @php
                                $percent = min(max((int) ($skill['percent'] ?? 0), 0), 100);
                            @endphp
                            <div class="about-skill">
                                <div>
                                    <span>{{ $skill['label'] }}</span>
                                    <strong>{{ $percent }}%</strong>
                                </div>
                                <i style="--about-skill-width: {{ $percent }}%"></i>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        </div>
    </section>
@endif

<x-public.home.clients
    :clients="$clients"
    :title="$clientTitle"
/>
