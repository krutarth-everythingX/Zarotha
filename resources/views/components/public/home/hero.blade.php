@props(['heroBanners', 'heroSection', 'theme', 'overlayOpacity', 'siteSettings', 'contactInformation', 'socialLinks'])

<section class="home-hero home-hero--{{ $theme }}" data-hero-slider>
    <div class="home-hero__bg-left"></div>
    
    <div class="home-hero__container">
        <div class="home-hero__slider group">
            @if($heroBanners->isNotEmpty())
                <div class="home-hero__media-container">
                    @foreach($heroBanners as $index => $banner)
                        <picture class="home-hero__media {{ $index === 0 ? 'is-active' : '' }}" aria-hidden="true" data-slide="{{ $index }}">
                            @if ($banner->desktopMedia)
                                @php $desktopImage = $banner->desktopMedia->responsiveImage('100vw'); @endphp
                                @if ($desktopImage['src'])
                                    <img
                                        src="{{ $desktopImage['src'] }}"
                                        srcset="{{ $desktopImage['srcset'] }}"
                                        sizes="{{ $desktopImage['sizes'] }}"
                                        width="{{ $desktopImage['width'] }}"
                                        height="{{ $desktopImage['height'] }}"
                                        alt=""
                                        loading="{{ $index === 0 ? 'eager' : 'lazy' }}"
                                    >
                                @endif
                            @else
                                <img
                                    src="{{ $banner->fallback_image_url ?? asset('images/default-hero-wooden-art-1.svg') }}"
                                    width="1600"
                                    height="900"
                                    alt="{{ $banner->fallback_image_alt ?? '' }}"
                                    loading="{{ $index === 0 ? 'eager' : 'lazy' }}"
                                >
                            @endif
                        </picture>
                    @endforeach
                </div>
            @endif

            {{-- Slider Arrows --}}
            @if($heroBanners->count() > 1)
                <button type="button" class="home-hero__arrow home-hero__arrow--prev" data-hero-prev aria-label="Previous banner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button type="button" class="home-hero__arrow home-hero__arrow--next" data-hero-next aria-label="Next banner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            @endif


        </div>
    </div>

    {{-- Side Widgets (WhatsApp & Socials) --}}
    @if ($contactInformation?->whatsapp_number)
        {{-- Desktop: Floating vertical widget --}}
        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $contactInformation->whatsapp_number) }}?text={{ urlencode($contactInformation->whatsapp_text ?? '') }}" target="_blank" rel="noopener noreferrer" class="hero-widget hero-widget--whatsapp hero-widget--whatsapp-desktop">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span class="vertical-text">Ask for your Furniture Project!</span>
        </a>
        {{-- Mobile: Inquiry button with WhatsApp icon --}}
        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $contactInformation->whatsapp_number) }}?text={{ urlencode($contactInformation->whatsapp_text ?? '') }}" target="_blank" rel="noopener noreferrer" class="hero-widget hero-widget--whatsapp-mobile">
            <span class="hero-widget__inquiry-text">Inquiry</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
    @endif

    @if ($siteSettings?->show_social_links_on_hero && $socialLinks->isNotEmpty())
        <div class="hero-widget hero-widget--socials">
            @foreach($socialLinks as $link)
                <a href="{{ $link->url }}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on {{ $link->platform_key ?? $link->platform }}">
                    @php
                        $platform = strtolower($link->platform_key ?? $link->platform);
                    @endphp
                    @switch($platform)
                        @case('facebook')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            @break
                        @case('instagram')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            @break
                        @case('twitter')
                        @case('x')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            @break
                        @case('youtube')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.1C2.5 7.1 2 9.4 2 12c0 2.6.5 4.9.5 4.9 0 0 2.2 2.1 4.8 2.1H16.7c2.6 0 4.8-2.1 4.8-2.1.5 0 1-2.3 1-4.9 0-2.6-.5-4.9-.5-4.9C22 7.1 19.8 5 17.2 5H6.8C4.2 5 2.5 7.1 2.5 7.1z"/><path d="m9.5 8 6 4-6 4z"/></svg>
                            @break
                        @case('linkedin')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            @break
                        @case('pinterest')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.853 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.133-4.515 4.34 0 .859.331 1.781.745 2.281.082.099.094.188.069.286-.078.315-.25 1.02-.284 1.164-.045.188-.152.23-.344.14-1.283-.598-2.083-2.47-2.083-3.978 0-3.238 2.353-6.213 6.786-6.213 3.565 0 6.335 2.541 6.335 5.938 0 3.545-2.234 6.398-5.337 6.398-1.043 0-2.024-.543-2.358-1.18l-.64 2.438c-.23.882-.855 1.986-1.272 2.658C10.05 23.822 11.01 24 12 24c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                            @break
                        @case('whatsapp')
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                            @break
                        @default
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    @endswitch
                </a>
            @endforeach
        </div>
    @endif
</section>
