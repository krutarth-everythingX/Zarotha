@extends('layouts.public')

@section('body_class', 'homepage')
@section('title', $siteSettings?->default_meta_title ?? config('app.name'))

@section('content')
    @php
        $heroVisible = ($heroSection?->is_visible ?? true) && $hero;
        $heroTheme = $hero?->text_theme === 'dark' ? 'dark' : 'light';
        $heroOverlay = min(max((int) ($hero?->overlay_opacity ?? 35), 0), 80) / 100;
        
        $latestVisible = ($latestSection?->is_visible ?? true) && $latestProducts->isNotEmpty();
        $testimonialsVisible = ($testimonialsSection?->is_visible ?? false) && $testimonials->isNotEmpty();
        $quickInquiryVisible = $quickInquirySection?->is_visible ?? true;
    @endphp

    @if ($heroVisible)
        <x-public.home.hero 
            :hero="$hero" 
            :heroSection="$heroSection"
            :siteSettings="$siteSettings"
            :contactInformation="$contactInformation"
            :socialLinks="$socialLinks"
            :theme="$heroTheme" 
            :overlayOpacity="$heroOverlay" 
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

    <x-public.home.craft-story :contactInformation="$contactInformation" />

    @if ($quickInquiryVisible)
        <x-public.home.quick-inquiry 
            :section="$quickInquirySection"
            :contactInformation="$contactInformation"
        />
    @endif
@endsection
