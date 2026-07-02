@extends('layouts.public')

@section('title', ($product->meta_title ?: $product->name) . ' | ' . config('app.name'))
@section('meta_description', $product->meta_description ?: $product->short_description ?: 'Published product detail page.')

@section('content')
    <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="{{ route('public.home') }}">Home</a>
        <span>/</span>
        <a href="{{ route('public.products.index') }}">Products</a>
        <span>/</span>
        <span>{{ $product->name }}</span>
    </nav>

    <section class="product-detail">
        <div class="gallery" data-gallery>
            @foreach ($gallery as $media)
                <button class="gallery-item" type="button" data-lightbox-open>
                    <x-public.image :media="$media" sizes="(min-width: 1024px) 55vw, 100vw" class="gallery-image" :loading="$loop->first ? 'eager' : 'lazy'" />
                </button>
            @endforeach
        </div>
        <article class="product-summary">
            <p class="eyebrow">{{ $product->category->name }}</p>
            <h1>{{ $product->name }}</h1>
            @if ($product->short_description)
                <p>{{ $product->short_description }}</p>
            @endif
            <div class="button-row">
                <a class="button button-primary" href="#product-inquiry">Product inquiry</a>
                @if ($contactInformation?->show_whatsapp && $contactInformation->whatsapp_number)
                    <a class="button button-secondary" href="https://wa.me/{{ preg_replace('/\D+/', '', $contactInformation->whatsapp_number) }}">WhatsApp</a>
                @endif
            </div>
            <dl class="spec-list">
                @foreach (['dimensions' => 'Dimensions', 'material' => 'Material', 'finish' => 'Finish'] as $field => $label)
                    @if ($product->{$field})
                        <div><dt>{{ $label }}</dt><dd>{{ $product->{$field} }}</dd></div>
                    @endif
                @endforeach
                <div><dt>Category</dt><dd>{{ $product->category->name }}</dd></div>
            </dl>
        </article>
    </section>

    @if ($product->full_description)
        <section class="section reading">
            <h2>Product details</h2>
            <p>{{ $product->full_description }}</p>
        </section>
    @endif

    <section id="product-inquiry" class="section">
        @include('partials.inquiry-form', ['action' => route('public.inquiries.product.submit', $product->slug), 'product' => $product])
    </section>

    <section class="section">
        <div class="section-heading">
            <p class="eyebrow">Related products</p>
            <h2>More from {{ $product->category->name }}</h2>
        </div>
        <div class="product-grid">
            @forelse ($relatedProducts as $relatedProduct)
                <x-public.product-card :product="$relatedProduct" />
            @empty
                <div class="empty-state">Related products will appear when more published products share this category.</div>
            @endforelse
        </div>
    </section>

    <div class="lightbox" data-lightbox hidden>
        <button type="button" data-lightbox-close>Close</button>
        <img alt="" data-lightbox-image>
    </div>
@endsection
