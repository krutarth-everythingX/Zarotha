@extends('layouts.public')

@section('body_class', 'homepage')
@section('title', $siteSettings?->default_meta_title ?? config('app.name'))

@section('content')
    @php
        $heroVisible = ($heroSection?->is_visible ?? true) && $heroBanners->isNotEmpty();
        $heroTheme = $heroBanners->first()?->text_theme === 'dark' ? 'dark' : 'light';
        $heroOverlay = min(max((int) ($heroBanners->first()?->overlay_opacity ?? 35), 0), 80) / 100;

        $turnkeyVisible = $turnkeySection?->is_visible ?? true;
        $aboutPreviewVisible = $aboutPreviewSection?->is_visible ?? true;
        $industryStatsVisible = $industryStatsSection?->is_visible ?? true;
        $latestVisible = $latestSection?->is_visible ?? true;
        $testimonialsVisible = $testimonialsSection?->is_visible ?? true;
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

    @if ($turnkeyVisible)
        <x-public.home.turnkey-solutions
            :section="$turnkeySection"
            :services="$turnkeyServices"
            :video="$turnkeyVideo"
        />
    @endif

    @if ($aboutPreviewVisible)
        <x-public.home.about-preview
            :section="$aboutPreviewSection"
            :points="$aboutPreviewPoints"
        />
    @endif

    @if ($industryStatsVisible)
        <x-public.home.industry-stats
            :section="$industryStatsSection"
            :stats="$industryStats"
        />
    @endif

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

    <x-public.home.clients :clients="$clients" />
@endsection
