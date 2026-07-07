<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @php
            $siteSettings = $siteSettings ?? null;
            $contactInformation = $contactInformation ?? null;
            $footerCategories = $footerCategories ?? collect();
            $socialLinks = $socialLinks ?? collect();
            $faviconMedia = $siteSettings?->darkLogo;
            $shareMedia = $faviconMedia ?? $siteSettings?->defaultOgImage;
            $faviconUrl = $faviconMedia ? url($faviconMedia->url()) : null;
            $shareImage = $shareMedia?->responsiveImage('1200px');
            $shareImageUrl = $shareImage && ($shareImage['src'] ?? null) ? url($shareImage['src']) : null;
        @endphp
        <meta name="description" content="@yield('meta_description', $siteSettings?->default_meta_description ?? 'Inquiry-based handcrafted wooden decor catalogue.')">
        <meta name="robots" content="@yield('meta_robots', ($siteSettings?->default_robots_index ?? true) ? 'index,follow' : 'noindex,nofollow')">
        <meta property="og:title" content="@yield('title', $siteSettings?->default_meta_title ?? config('app.name'))">
        <meta property="og:description" content="@yield('meta_description', $siteSettings?->default_meta_description ?? 'Inquiry-based handcrafted wooden decor catalogue.')">
        <meta property="og:url" content="@yield('canonical', url()->current())">
        <meta property="og:type" content="website">
        @if ($shareImageUrl)
            <meta property="og:image" content="{{ $shareImageUrl }}">
            <meta property="og:image:secure_url" content="{{ $shareImageUrl }}">
            @if ($shareImage['width'] ?? null)
                <meta property="og:image:width" content="{{ $shareImage['width'] }}">
            @endif
            @if ($shareImage['height'] ?? null)
                <meta property="og:image:height" content="{{ $shareImage['height'] }}">
            @endif
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:image" content="{{ $shareImageUrl }}">
        @else
            <meta name="twitter:card" content="summary">
        @endif
        <meta name="twitter:title" content="@yield('title', $siteSettings?->default_meta_title ?? config('app.name'))">
        <meta name="twitter:description" content="@yield('meta_description', $siteSettings?->default_meta_description ?? 'Inquiry-based handcrafted wooden decor catalogue.')">
        <link rel="canonical" href="@yield('canonical', url()->current())">
        @if ($faviconUrl)
            <link rel="icon" href="{{ $faviconUrl }}">
            <link rel="shortcut icon" href="{{ $faviconUrl }}">
            <link rel="apple-touch-icon" href="{{ $faviconUrl }}">
        @endif
        <title>@yield('title', $siteSettings?->default_meta_title ?? config('app.name'))</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
        @vite(['resources/css/public/app.css', 'resources/js/public/app.ts'])
    </head>
    <body class="@yield('body_class')">
        <a href="#main-content" class="skip-link">Skip to content</a>
        @if (session('status'))
            <div class="flash" role="status">{{ session('status') }}</div>
        @endif
        @include('partials.public.header')

        <main id="main-content">
            @yield('content')
        </main>

        @include('partials.public.footer')

        <script>
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                document.documentElement.classList.add('is-scrolling');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    document.documentElement.classList.remove('is-scrolling');
                }, 800);
            }, { passive: true });
        </script>
    </body>
</html>
