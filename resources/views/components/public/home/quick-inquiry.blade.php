@props(['section', 'contactInformation'])

@php
    $quickStyles = [];
    if ($section?->background_color) {
        $quickStyles[] = '--section-bg-color: '.$section->background_color;
    }
    $bannerUrls = [];
    if ($section?->banners && $section->banners->count() > 0) {
        foreach ($section->banners->where('is_visible', true) as $banner) {
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
    $ctaAriaLabel = $whatsappUrl
        ? 'Start a WhatsApp conversation about a custom commission'
        : 'Start a conversation about a custom commission';
    $ctaLabel = trim((string) ($section?->cta_label ?? '')) ?: 'Start a Conversation';
    $sectionTitle = trim((string) ($section?->section_title ?? '')) ?: 'Custom Commissions';
    $sectionIntro = trim((string) ($section?->section_intro ?? '')) ?: 'Have a vision for a specific space? We collaborate with architects, designers, and homeowners to bring unique wooden dreams to life. Your heritage, our hands.';
@endphp
<section class="quick-inquiry" style="{{ implode('; ', $quickStyles) }}" data-inquiry-banners='@json($bannerUrls)'>
    <div class="quick-inquiry__inner">
        <span class="quick-inquiry__number">06</span>
        <h2>{{ $sectionTitle }}</h2>
        <p>{{ $sectionIntro }}</p>
        <div class="quick-inquiry__actions">
            <a class="button button-primary" href="{{ $ctaUrl }}" @if ($ctaTarget) target="{{ $ctaTarget }}" @endif @if ($ctaRel) rel="{{ $ctaRel }}" @endif aria-label="{{ $ctaAriaLabel }}">
                {{ $ctaLabel }}
            </a>
        </div>
    </div>
</section>
