@extends('layouts.public')

@section('title', 'Page not found')
@section('meta_robots', 'noindex,nofollow')

@section('content')
    <main class="flex min-h-[70vh] items-center justify-center">
        <div class="max-w-xl space-y-4 text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-public-muted">404</p>
            <h1 class="font-serif text-5xl text-public-ink">Page not found</h1>
            <p class="text-lg leading-8 text-public-muted">The page you requested is unavailable or has moved.</p>
        </div>
    </main>
@endsection
