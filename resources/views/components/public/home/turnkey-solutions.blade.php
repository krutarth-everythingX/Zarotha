@props(['section' => null, 'services' => collect(), 'video' => null])

@php
    $eyebrow = trim((string) ($section?->eyebrow ?? '')) ?: 'A complete custom';
    $heading = trim((string) ($section?->section_title ?? '')) ?: 'furniture solution';
    $caption = trim((string) ($section?->section_intro ?? '')) ?: 'Crafted for homes, workspaces, and hospitality interiors with careful material choices.';
    $videoEmbedUrl = is_array($video) ? ($video['embed_url'] ?? null) : null;
    $defaultImage = asset('images/custom-commissions-workshop.webp');
    $serviceIcons = [
        '<path d="M3 10.6 12 3l9 7.6" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" />',
        '<path d="M4 4h16v17H4z" /><path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /><path d="M10 21v-3h4v3" />',
        '<path d="M5 10h14v11H5z" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M9 14h.01M15 14h.01M9 18h.01M15 18h.01" />',
        '<path d="M4 20h16" /><path d="M6 20V9l6-4 6 4v11" /><path d="M9 20v-6h6v6" /><path d="M8 9h8" />',
    ];
@endphp

<section class="home-turnkey" aria-labelledby="home-turnkey-title">
    <div class="home-turnkey__inner">
        <div class="home-turnkey__feature" data-scroll-reveal>
            <div class="home-turnkey__statement">
                <p>{!! str_replace('custom', '<strong>custom</strong>', e($eyebrow)) !!}</p>
                <h2 id="home-turnkey-title">{{ $heading }}</h2>
            </div>

            <div @class(['home-turnkey__media', 'home-turnkey__media--video' => $videoEmbedUrl]) aria-label="Watch the Zarokha turnkey furniture video">
                @if ($videoEmbedUrl)
                    <iframe
                        src="{{ $videoEmbedUrl }}"
                        title="{{ $heading }} video"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>
                @else
                    <img
                        src="{{ $defaultImage }}"
                        width="1200"
                        height="800"
                        loading="lazy"
                        decoding="async"
                        alt="Woodworking tools and custom furniture materials in the Zarokha workshop"
                    >
                @endif
                <span class="home-turnkey__play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </span>
            </div>

            <p class="home-turnkey__caption">
                {{ $caption }}
            </p>
        </div>

        <div class="home-turnkey__services" aria-label="Custom furniture services">
            @foreach ($services->take(4) as $index => $service)
                <article class="home-turnkey__service" data-scroll-reveal style="--reveal-delay: {{ ($index + 1) * 80 }}ms">
                    <span class="home-turnkey__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                            {!! $serviceIcons[$index] ?? $serviceIcons[0] !!}
                        </svg>
                    </span>
                    <h3>{{ $service['heading'] }}</h3>
                    <p>{{ $service['body_text'] }}</p>
                </article>
            @endforeach
        </div>
    </div>
</section>
