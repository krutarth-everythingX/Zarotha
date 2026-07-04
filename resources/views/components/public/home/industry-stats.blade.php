@props(['section' => null, 'stats' => collect()])

@php
    $heading = trim((string) ($section?->section_title ?? '')) ?: 'Furniture made at scale, finished with care.';
    $highlight = trim((string) ($section?->eyebrow ?? '')) ?: 'finished with care';
    $intro = trim((string) ($section?->section_intro ?? ''));
    $ctaLabel = trim((string) ($section?->cta_label ?? 'contact us')) ?: 'contact us';
    $ctaUrl = trim((string) ($section?->cta_url ?? '')) ?: route('public.contact.show');
    $secondaryLabel = trim((string) ($section?->secondary_cta_label ?? 'View More')) ?: 'View More';
    $secondaryUrl = trim((string) ($section?->secondary_cta_url ?? '')) ?: route('public.products.index');
    $body = trim((string) ($section?->section_body ?? "Don't hesitate, :contact for better help and products. :more"));
    $escapedHeading = e($heading);

    if ($highlight !== '' && str_contains($heading, $highlight)) {
        $headingMarkup = str_replace(e($highlight), '<span>'.e($highlight).'</span>', $escapedHeading);
    } else {
        $headingMarkup = $escapedHeading;
    }

    $contactLink = '<a href="'.e($ctaUrl).'">'.e($ctaLabel).'</a>';
    $moreLink = '<a href="'.e($secondaryUrl).'">'.e($secondaryLabel).'</a>';
    $ctaMarkup = str_replace([':contact', ':more'], [$contactLink, $moreLink], e($body));
    if (! str_contains($body, ':contact')) {
        $ctaMarkup .= ' '.$contactLink;
    }
    if (! str_contains($body, ':more')) {
        $ctaMarkup .= ' '.$moreLink;
    }

    $iconPaths = [
        '<path d="M3 10.5 12 4l9 6.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /><path d="M8.5 13h1.5M14 13h1.5" />',
        '<path d="M4 21V9h7v12" /><path d="M11 21V5h5v16" /><path d="M16 21v-8h4v8" /><path d="M7 12h1M7 16h1M14 9h1M14 13h1" />',
        '<circle cx="12" cy="12" r="8" /><path d="M8.5 11h.01M15.5 11h.01" /><path d="M8.5 14.5c1.65 1.8 5.35 1.8 7 0" />',
        '<path d="M5 5h14v14H5z" /><path d="M8 16c.55-2 2-3 4-3s3.45 1 4 3" /><circle cx="12" cy="10" r="2" /><path d="M16 8h2M16 12h2" />',
    ];
@endphp

<section class="home-industry-stats" aria-labelledby="home-industry-stats-title">
    <div class="home-industry-stats__inner" data-scroll-reveal>
        <div class="home-industry-stats__heading">
            <h2 id="home-industry-stats-title">{!! $headingMarkup !!}</h2>
            @if ($intro !== '')
                <p>{{ $intro }}</p>
            @endif
        </div>

        <div class="home-industry-stats__grid" aria-label="Zarokha manufacturing statistics">
            @foreach ($stats->take(4) as $index => $stat)
                <article class="home-industry-stats__item" data-scroll-reveal style="--reveal-delay: {{ ($index + 1) * 80 }}ms">
                    <span class="home-industry-stats__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                            {!! $iconPaths[$index] ?? $iconPaths[0] !!}
                        </svg>
                    </span>
                    <span class="home-industry-stats__dot" aria-hidden="true"></span>
                    <strong>{{ $stat['value'] }}</strong>
                    <span>{{ $stat['label'] }}</span>
                </article>
            @endforeach
        </div>

        <p class="home-industry-stats__cta">
            {!! $ctaMarkup !!}
        </p>
    </div>
</section>
