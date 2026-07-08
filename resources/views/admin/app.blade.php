<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex,nofollow">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name') }} CMS</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="image" href="{{ asset('images/admin-sidebar-logo.webp') }}" type="image/webp" fetchpriority="high">
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
        <script>
            (function () {
                var fallbackKey = 'zarokha.admin.theme';
                var userKey = @auth
                    'zarokha.admin.theme.' + {{ auth()->id() }}
                @else
                    fallbackKey
                @endauth;
                var storedTheme = localStorage.getItem(userKey);
                var serverTheme = @auth
                    @json(auth()->user()->admin_theme ?? 'dark')
                @else
                    null
                @endauth;
                var theme = storedTheme === 'light' || storedTheme === 'dark'
                    ? storedTheme
                    : serverTheme === 'light' || serverTheme === 'dark'
                        ? serverTheme
                        : localStorage.getItem(fallbackKey) === 'light'
                            ? 'light'
                            : 'dark';

                document.documentElement.classList.toggle('dark', theme === 'dark');
                document.documentElement.dataset.adminTheme = theme;
                document.documentElement.style.colorScheme = theme;
            })();
        </script>
        @viteReactRefresh
        @vite(['resources/css/admin/app.css', 'resources/js/admin/app.tsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
