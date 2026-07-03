@extends('layouts.public')

@section('body_class', 'homepage')
@section('title', $siteSettings?->default_meta_title ?? config('app.name'))

@section('content')
    @php
        $heroVisible = ($heroSection?->is_visible ?? true) && $heroBanners->isNotEmpty();
        $heroTheme = $heroBanners->first()?->text_theme === 'dark' ? 'dark' : 'light';
        $heroOverlay = min(max((int) ($heroBanners->first()?->overlay_opacity ?? 35), 0), 80) / 100;

        $latestVisible = ($latestSection?->is_visible ?? true) && $latestProducts->isNotEmpty();
        $testimonialsVisible = ($testimonialsSection?->is_visible ?? false) && $testimonials->isNotEmpty();
        $quickInquiryVisible = $quickInquirySection?->is_visible ?? true;
    @endphp

    @if ($heroVisible)
        <x-public.home.hero
            :heroBanners="$heroBanners"
            :heroSection="$heroSection"
            :siteSettings="$siteSettings"
            :contactInformation="$contactInformation"
            :socialLinks="$socialLinks"
            :theme="$heroTheme"
            :overlayOpacity="$heroOverlay"
        />
    @endif

    <x-public.home.turnkey-solutions />

    <x-public.home.about-preview />

    @if ($latestVisible)
        <x-public.home.latest-products
            :section="$latestSection"
            :products="$latestProducts"
        />
    @endif

    @if ($testimonialsVisible)
        <x-public.home.testimonials
            :section="$testimonialsSection"
            :testimonials="$testimonials"
        />
    @endif

    @if ($quickInquiryVisible)
        <x-public.home.quick-inquiry
            :section="$quickInquirySection"
            :contactInformation="$contactInformation"
        />
    @endif
@endsection
