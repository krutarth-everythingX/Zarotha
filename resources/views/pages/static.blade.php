@extends('layouts.public')

@php
    $fallbackTitles = [
        'about_us' => 'About Us',
        'our_craftsmanship' => 'Our Craftsmanship',
        'privacy_policy' => 'Privacy Policy',
        'terms_and_conditions' => 'Terms and Conditions',
    ];
@endphp

@section('title', ($page?->meta_title ?: $page?->title ?: $fallbackTitles[$pageKey]) . ' | ' . config('app.name'))
@section('meta_description', $page?->meta_description ?: $page?->intro_body ?: 'CMS-managed public page.')
@section('meta_robots', $page && $page->status->value === 'published' ? 'index,follow' : 'noindex,follow')
@section('body_class', $pageKey === 'about_us' ? 'about-page' : '')

@section('content')
    @if ($pageKey === 'about_us')
        @include('pages.partials.about-designed', ['page' => $page])
    @else
        <section class="page-hero">
            <p class="eyebrow">{{ str_replace('_', ' ', $pageKey) }}</p>
            <h1>{{ $page?->title ?? $fallbackTitles[$pageKey] }}</h1>
            <p>{{ $page?->intro_body ?? 'This page is ready for approved CMS content. Client facts and legal copy have not been invented.' }}</p>
        </section>

        @if ($page?->effective_date)
            <p class="effective-date">Effective date: {{ $page->effective_date->toFormattedDateString() }}</p>
        @endif

        <article class="reading">
            @if ($page?->body_html)
                {!! $page->body_html !!}
            @else
                <div class="empty-state">Approved content for this page is pending in the CMS.</div>
            @endif
        </article>

        @if ($pageKey === 'our_craftsmanship' && $page?->craftsmanshipSteps?->isNotEmpty())
            <section class="section">
                <div class="process-list">
                    @foreach ($page->craftsmanshipSteps as $step)
                        @if ($step->is_active)
                            <article>
                                <span>{{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                                <h2>{{ $step->title }}</h2>
                                <p>{{ $step->body_text }}</p>
                            </article>
                        @endif
                    @endforeach
                </div>
            </section>
        @endif
    @endif
@endsection
