@props(['section', 'products'])

<section class="home-section home-section--latest" aria-labelledby="latest-products-title">
    <div class="home-section__heading">
        <div>
            <h2 id="latest-products-title">{{ $section?->section_title ?: 'Latest Products' }}</h2>
            @if ($section?->section_intro)
                <p>{{ $section->section_intro }}</p>
            @endif
        </div>
        <div class="slider-controls">
            <button type="button" data-slider-prev aria-label="Previous latest products">Previous</button>
            <button type="button" data-slider-next aria-label="Next latest products">Next</button>
        </div>
    </div>
    <div class="product-slider" data-slider>
        <div class="product-slider__track" data-slider-track>
            @foreach ($products as $product)
                <div class="product-slider__slide">
                    <x-public.product-card
                        :product="$product"
                        image-only
                        sizes="(min-width: 1600px) 21vw, (min-width: 1280px) 29vw, (min-width: 1024px) 31vw, (min-width: 768px) 48vw, 48vw"
                    />
                </div>
            @endforeach
        </div>
    </div>
</section>
