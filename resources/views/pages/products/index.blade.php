@extends('layouts.public')

@section('title', 'Products | ' . config('app.name'))
@section('meta_description', 'Browse published handcrafted wooden decor catalogue products.')
@section('body_class', 'products-page')

@php
    $galleryImageSizes = '(min-width: 2000px) 300px, (min-width: 1200px) 375px, (min-width: 768px) 31vw, 48vw';
    $currentSortLabel = $sortOptions[$sort] ?? 'Newest';

    $galleryProducts = $products->getCollection()->map(function ($product) use ($galleryImageSizes) {
        $media = $product->featuredMedia ?: $product->media->first();
        $image = $media?->responsiveImage($galleryImageSizes);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'url' => route('public.products.show', $product->slug),
            'image' => $image && $image['src'] ? $image : null,
        ];
    });
@endphp

@section('content')
    <section
        class="products-gallery-page"
        data-products-gallery
        data-products-seen='@json($galleryProducts->pluck("id")->values())'
        data-products-next-url="{{ $products->nextPageUrl() ?? '' }}"
        data-products-has-more="{{ $products->hasMorePages() ? 'true' : 'false' }}"
    >
        <div class="products-gallery-page__intro">
            <header class="products-gallery-page__header">
                <h1>Products</h1>

                <form class="products-gallery-page__sort" method="get" action="{{ route('public.products.index') }}" data-products-sort-form>
                    <input type="hidden" name="sort" value="{{ $sort }}" data-products-sort-input>
                    <div class="products-gallery-page__sort-field">
                        <span class="products-gallery-page__sort-label" id="products-sort-label">Sort</span>
                        <div class="products-gallery-page__sort-menu" data-products-sort-menu>
                            <button
                                class="products-gallery-page__sort-trigger"
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded="false"
                                aria-labelledby="products-sort-label products-sort-current"
                                data-products-sort-toggle
                            >
                                <span id="products-sort-current" data-products-sort-current>{{ $currentSortLabel }}</span>
                                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                                    <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <div class="products-gallery-page__sort-options" role="listbox" aria-labelledby="products-sort-label" data-products-sort-options hidden>
                                @foreach ($sortOptions as $value => $label)
                                    <button
                                        class="products-gallery-page__sort-option"
                                        type="button"
                                        role="option"
                                        aria-selected="{{ $sort === $value ? 'true' : 'false' }}"
                                        data-products-sort-option
                                        data-products-sort-value="{{ $value }}"
                                    >{{ $label }}</button>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </form>
            </header>
        </div>

        <div class="products-gallery-page__container">
            @if ($galleryProducts->isEmpty())
                <div class="products-gallery-page__empty">Published products will appear here after they are added in the CMS.</div>
            @else
                <div class="products-gallery-page__grid" data-products-feed>
                    @foreach ($galleryProducts as $item)
                        <article class="products-gallery-item" data-product-card data-product-id="{{ $item['id'] }}">
                            <a href="{{ $item['url'] }}" class="products-gallery-item__link" aria-label="View {{ $item['name'] }}">
                                @if ($item['image'])
                                    <img
                                        src="{{ $item['image']['src'] }}"
                                        srcset="{{ $item['image']['srcset'] }}"
                                        sizes="{{ $item['image']['sizes'] }}"
                                        width="{{ $item['image']['width'] }}"
                                        height="{{ $item['image']['height'] }}"
                                        alt="{{ $item['image']['alt'] }}"
                                        class="products-gallery-item__image"
                                        loading="{{ $loop->index < 4 ? 'eager' : 'lazy' }}"
                                        decoding="async"
                                    >
                                @else
                                    <div class="products-gallery-item__fallback" aria-hidden="true">
                                        <span>Image pending</span>
                                    </div>
                                @endif
                                <span class="products-gallery-item__overlay">{{ $item['name'] }}</span>
                            </a>
                        </article>
                    @endforeach
                </div>

                <div class="products-gallery-page__footer">
                    <div class="products-gallery-page__sentinel" data-products-sentinel aria-hidden="true"></div>
                    <div class="products-gallery-page__loading" data-products-loading hidden>
                        <span class="products-gallery-page__loading-dot" aria-hidden="true"></span>
                        Loading
                    </div>
                    <p class="products-gallery-page__status" data-products-status role="status" aria-live="polite"></p>
                </div>
            @endif
        </div>
    </section>

    <template data-product-card-template>
        <article class="products-gallery-item" data-product-card>
            <a class="products-gallery-item__link">
                <img class="products-gallery-item__image" loading="lazy" decoding="async">
                <div class="products-gallery-item__fallback" aria-hidden="true">
                    <span>Image pending</span>
                </div>
                <span class="products-gallery-item__overlay"></span>
            </a>
        </article>
    </template>
@endsection
