@props(['section', 'contactInformation'])

@php
    $quickStyles = [];
    if ($section?->background_color) {
        $quickStyles[] = '--section-bg-color: '.$section->background_color;
    }

    $backgroundMedia = $section?->backgroundMedia;
    $backgroundUrl = null;
    if ($backgroundMedia) {
        $backgroundImage = $backgroundMedia->responsiveImage('100vw');
        $backgroundUrl = $backgroundImage['src'] ?? $backgroundMedia->url();
    }

    if ($backgroundUrl) {
        $escapedBackgroundUrl = str_replace(["\\", "'", "\n", "\r"], ["\\\\", "\\'", '', ''], $backgroundUrl);
        $quickStyles[] = "--section-bg-image: url('".$escapedBackgroundUrl."')";
    }

    $whatsappNumber = preg_replace('/[^0-9]/', '', (string) ($contactInformation?->whatsapp_number ?? ''));
    $whatsappUrl = $whatsappNumber
        ? 'https://wa.me/'.$whatsappNumber.'?text='.urlencode($contactInformation?->whatsapp_text ?? '')
        : null;
    $primaryUrl = trim((string) ($section?->cta_url ?? '')) ?: route('public.contact.show');
    $ctaUrl = $whatsappUrl ?: $primaryUrl;
    $ctaTarget = $whatsappUrl ? '_blank' : null;
    $ctaRel = $whatsappUrl ? 'noopener noreferrer' : null;
    $ctaAriaLabel = $whatsappUrl
        ? 'Start a WhatsApp conversation about a custom commission'
        : 'Start a conversation about a custom commission';
    $ctaLabel = trim((string) ($section?->cta_label ?? ''));
    if ($ctaLabel === '' || strcasecmp($ctaLabel, 'Start a Conversation') === 0) {
        $ctaLabel = 'Inquiry';
    }
    $secondaryLabel = trim((string) ($section?->secondary_cta_label ?? '')) ?: 'View Products';
    $secondaryUrl = trim((string) ($section?->secondary_cta_url ?? '')) ?: route('public.products.index');
    $sectionTitle = trim((string) ($section?->section_title ?? ''));
    if ($sectionTitle === '' || in_array(mb_strtolower($sectionTitle), ['custom commissions', 'start your project'], true)) {
        $sectionTitle = 'GET IN TOUCH';
    }
    $sectionIntro = trim((string) ($section?->section_intro ?? ''));
    if ($sectionIntro === '' || str_contains($sectionIntro, 'Have a vision for a specific space?')) {
        $sectionIntro = 'Need a custom piece or have a question?';
    }

    $cardImages = ($section?->banners ?? collect())
        ->filter(fn ($banner): bool => $banner->is_visible && $banner->imageMedia !== null)
        ->take(3)
        ->values()
        ->map(function ($banner) {
            $image = $banner->imageMedia->responsiveImage('(min-width: 1024px) 16vw, 34vw');

            return [
                'src' => $image['src'] ?? $banner->imageMedia->url(),
                'srcset' => $image['srcset'] ?? '',
                'sizes' => $image['sizes'] ?? '(min-width: 1024px) 16vw, 34vw',
                'width' => $image['width'] ?? 700,
                'height' => $image['height'] ?? 875,
                'alt' => $image['alt'] ?? $banner->imageMedia->alt_text ?? 'Handcrafted wooden item',
            ];
        });

    $fallbackCards = collect([
        [
            'src' => asset('images/admin-login-handcrafted-bg.webp'),
            'srcset' => '',
            'sizes' => '(min-width: 1024px) 16vw, 34vw',
            'width' => 1293,
            'height' => 1616,
            'alt' => 'Carved wooden floral detail',
        ],
        [
            'src' => asset('images/custom-commissions-workshop.webp'),
            'srcset' => '',
            'sizes' => '(min-width: 1024px) 16vw, 34vw',
            'width' => 1600,
            'height' => 900,
            'alt' => 'Woodworker shaping a handcrafted piece',
        ],
        [
            'src' => asset('images/admin-login-handcrafted-bg.webp'),
            'srcset' => '',
            'sizes' => '(min-width: 1024px) 16vw, 34vw',
            'width' => 1293,
            'height' => 1616,
            'alt' => 'Carved wooden art detail',
        ],
    ]);

    $cardImages = $cardImages->isNotEmpty()
        ? $cardImages->concat($fallbackCards)->take(3)->values()
        : $fallbackCards;
@endphp
<section class="quick-inquiry{{ $backgroundUrl ? ' quick-inquiry--has-background' : '' }}" style="{{ implode('; ', $quickStyles) }}">
    <div class="quick-inquiry__inner">
        <div class="quick-inquiry__cards" aria-label="Handcrafted wooden item examples">
            @foreach ($cardImages as $cardImage)
                <figure class="quick-inquiry__card quick-inquiry__card--{{ $loop->iteration }}">
                    <img
                        src="{{ $cardImage['src'] }}"
                        @if ($cardImage['srcset']) srcset="{{ $cardImage['srcset'] }}" @endif
                        sizes="{{ $cardImage['sizes'] }}"
                        width="{{ $cardImage['width'] }}"
                        height="{{ $cardImage['height'] }}"
                        alt="{{ $cardImage['alt'] }}"
                        loading="lazy"
                        decoding="async"
                    >
                </figure>
            @endforeach
        </div>

        <div class="quick-inquiry__content">
            <h2>{{ $sectionTitle }}</h2>
            <p>{{ $sectionIntro }}</p>
            <div class="quick-inquiry__actions">
                <a class="button button-primary" href="{{ $ctaUrl }}" @if ($ctaTarget) target="{{ $ctaTarget }}" @endif @if ($ctaRel) rel="{{ $ctaRel }}" @endif aria-label="{{ $ctaAriaLabel }}">
                    {{ $ctaLabel }}
                </a>
                <a class="button button-secondary quick-inquiry__secondary-button" href="{{ $secondaryUrl }}">
                    {{ $secondaryLabel }}
                </a>
            </div>
        </div>
    </div>
</section>
