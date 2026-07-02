@extends('layouts.public')

@section('title', 'Service unavailable')
@section('meta_robots', 'noindex,nofollow')

@section('content')
    <main class="flex min-h-[70vh] items-center justify-center">
        <div class="max-w-xl space-y-4 text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-public-muted">503</p>
            <h1 class="font-serif text-5xl text-public-ink">Service unavailable</h1>
            <p class="text-lg leading-8 text-public-muted">The application is temporarily unavailable. Please check back shortly.</p>
        </div>
    </main>
@endsection
