@extends('layouts.public')

@section('title', 'Too many requests')
@section('meta_robots', 'noindex,nofollow')

@section('content')
    <main class="flex min-h-[70vh] items-center justify-center">
        <div class="max-w-xl space-y-4 text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-public-muted">429</p>
            <h1 class="font-serif text-5xl text-public-ink">Too many requests</h1>
            <p class="text-lg leading-8 text-public-muted">Please wait a moment before trying again.</p>
        </div>
    </main>
@endsection
