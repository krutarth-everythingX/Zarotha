@extends('layouts.public')

@section('title', 'Products | ' . config('app.name'))
@section('meta_description', 'Browse published handcrafted wooden decor catalogue products.')
@section('body_class', 'products-page')

@php
    $galleryImageSizes = '(min-width: 2000px) 300px, (min-width: 1200px) 375px, (min-width: 768px) 31vw, 48vw';

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
        <div class="products-gallery-page__container">
            <header class="products-gallery-page__header">
                <h1>Products</h1>

                <form class="products-gallery-page__sort" method="get" action="{{ route('public.products.index') }}">
                    <label for="products-sort">
                        <span>Sort</span>
                        <select id="products-sort" name="sort" data-products-sort-select>
                            @foreach ($sortOptions as $value => $label)
                                <option value="{{ $value }}" @selected($sort === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                    </label>
                </form>
            </header>

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
