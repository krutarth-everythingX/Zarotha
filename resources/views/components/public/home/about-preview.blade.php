@props(['section' => null, 'points' => collect()])

@php
    $eyebrow = trim((string) ($section?->eyebrow ?? '')) ?: 'About Zarokha';
    $heading = trim((string) ($section?->section_title ?? '')) ?: 'The leading furniture brand for thoughtful custom spaces.';
    $intro = trim((string) ($section?->section_intro ?? '')) ?: 'Zarokha brings together measured design, material knowledge, and workshop discipline to create furniture that fits the room, the routine, and the people who use it every day.';
    $body = trim((string) ($section?->section_body ?? '')) ?: 'From homes and workspaces to hospitality interiors, every project is shaped with practical details, careful finishing, and a clear conversation from idea to installation.';
    $primaryLabel = trim((string) ($section?->cta_label ?? 'View more')) ?: 'View more';
    $primaryUrl = trim((string) ($section?->cta_url ?? '')) ?: route('public.pages.about');
    $secondaryLabel = trim((string) ($section?->secondary_cta_label ?? 'Contact us')) ?: 'Contact us';
    $secondaryUrl = trim((string) ($section?->secondary_cta_url ?? '')) ?: route('public.contact.show');
    $media = $section?->backgroundMedia;
@endphp

<section class="home-about-preview" aria-labelledby="home-about-preview-title">
    <div class="home-about-preview__inner">
        <div class="home-about-preview__copy" data-scroll-reveal>
            <p class="home-about-preview__eyebrow">{{ $eyebrow }}</p>
            <h2 id="home-about-preview-title">{{ $heading }}</h2>
            <p>
                {{ $intro }}
            </p>
            <p>
                {{ $body }}
            </p>

            <ul class="home-about-preview__points" aria-label="Zarokha strengths">
                @foreach ($points->take(8) as $point)
                    <li>{{ $point }}</li>
                @endforeach
            </ul>

            <div class="home-about-preview__actions">
                <a class="home-about-preview__button home-about-preview__button--primary" href="{{ $primaryUrl }}">
                    {{ $primaryLabel }}
                </a>
                <a class="home-about-preview__button home-about-preview__button--secondary" href="{{ $secondaryUrl }}">
                    {{ $secondaryLabel }}
                </a>
            </div>
        </div>

        <div class="home-about-preview__media" data-scroll-reveal style="--reveal-delay: 120ms">
            @if ($media)
                <x-public.image
                    :media="$media"
                    sizes="(min-width: 1024px) 31vw, 88vw"
                    class=""
                />
            @else
                <img
                    src="{{ asset('images/custom-commissions-workshop.webp') }}"
                    width="1200"
                    height="800"
                    loading="lazy"
                    decoding="async"
                    alt="Zarokha artisan working on custom furniture in the workshop"
                >
            @endif
        </div>
    </div>
</section>
