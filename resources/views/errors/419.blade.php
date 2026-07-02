@extends('layouts.public')

@section('title', 'Page expired')
@section('meta_robots', 'noindex,nofollow')

@section('content')
    <main class="flex min-h-[70vh] items-center justify-center">
        <div class="max-w-xl space-y-4 text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-public-muted">419</p>
            <h1 class="font-serif text-5xl text-public-ink">Page expired</h1>
            <p class="text-lg leading-8 text-public-muted">Your session expired. Please refresh and try again.</p>
        </div>
    </main>
@endsection
