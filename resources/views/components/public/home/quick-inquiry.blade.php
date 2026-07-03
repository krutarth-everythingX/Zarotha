@props(['section', 'contactInformation'])

@php
    $quickStyles = [];
    if ($section?->background_color) {
        $quickStyles[] = '--section-bg-color: '.$section->background_color;
    }
    $bannerUrls = [];
    if ($section?->banners && $section->banners->count() > 0) {
        foreach ($section->banners as $banner) {
            if ($banner->imageMedia && $url = $banner->imageMedia->url()) {
                $bannerUrls[] = $url;
            }
        }
    }

    if (empty($bannerUrls)) {
        if ($section?->backgroundMedia && $url = $section->backgroundMedia->url()) {
            $bannerUrls[] = $url;
        } else {
            $bannerUrls[] = asset('images/custom-commissions-workshop.webp');
        }
    }
    $quickStyles[] = "--section-bg-image: url('".$bannerUrls[0]."')";

    $whatsappNumber = preg_replace('/[^0-9]/', '', (string) ($contactInformation?->whatsapp_number ?? ''));
    $whatsappUrl = $whatsappNumber
        ? 'https://wa.me/'.$whatsappNumber.'?text='.urlencode($contactInformation?->whatsapp_text ?? '')
        : null;
    $ctaUrl = $whatsappUrl ?: ($section?->cta_url ?: route('public.contact.show'));
    $ctaTarget = $whatsappUrl ? '_blank' : null;
    $ctaRel = $whatsappUrl ? 'noopener noreferrer' : null;
    $storedLabel = trim((string) ($section?->cta_label ?? ''));
    $ctaLabel = in_array(strtolower($storedLabel), ['', 'inquiry', 'send inquiry'], true)
        ? 'Start a Conversation'
        : $storedLabel;
    $storedTitle = trim((string) ($section?->section_title ?? ''));
    $sectionTitle = in_array(strtolower($storedTitle), ['', 'quick inquiry'], true)
        ? 'Custom Commissions'
        : $storedTitle;
    $storedIntro = trim((string) ($section?->section_intro ?? ''));
    $legacyIntros = ['', 'need a custom piece or have a question?'];
    $sectionIntro = in_array(strtolower($storedIntro), $legacyIntros, true)
        ? 'Have a vision for a specific space? We collaborate with architects, designers, and homeowners to bring unique wooden dreams to life. Your heritage, our hands.'
        : $storedIntro;
@endphp
<section class="quick-inquiry" style="{{ implode('; ', $quickStyles) }}" data-inquiry-banners='@json($bannerUrls)'>
    <div class="quick-inquiry__inner">
        <span class="quick-inquiry__number">06</span>
        <h2>{{ $sectionTitle }}</h2>
        <p>{{ $sectionIntro }}</p>
        <div class="quick-inquiry__actions">
            <a class="button button-primary" href="{{ $ctaUrl }}" @if ($ctaTarget) target="{{ $ctaTarget }}" @endif @if ($ctaRel) rel="{{ $ctaRel }}" @endif aria-label="Start a WhatsApp conversation about a custom commission">
                {{ $ctaLabel }}
            </a>
        </div>
    </div>
</section>
