@props(['section', 'products'])

@php
    $displayProducts = $products->take(6);
@endphp

<section class="home-section home-section--latest" aria-labelledby="latest-products-title">
    <div class="home-section__heading">
        <div>
            <h2 id="latest-products-title">{{ $section?->section_title ?: 'Latest Products' }}</h2>
            @if ($section?->section_intro)
                <p>{{ $section->section_intro }}</p>
            @endif
        </div>
        <a class="latest-products__view-all" href="{{ route('public.products.index') }}" aria-label="View all products">
            <span class="latest-products__view-all-label">View All</span>
            <span class="latest-products__view-all-icon" aria-hidden="true"></span>
        </a>
    </div>
    <div class="latest-products__grid">
        @foreach ($displayProducts as $product)
            <div class="latest-products__item">
                <x-public.product-card
                    :product="$product"
                    image-only
                    sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 31vw, (min-width: 768px) 48vw, 50vw"
                />
            </div>
        @endforeach
    </div>
</section>
