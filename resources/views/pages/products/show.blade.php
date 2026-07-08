@extends('layouts.public')

@section('title', ($product->meta_title ?: $product->name) . ' | ' . config('app.name'))
@section('meta_description', $product->meta_description ?: $product->short_description ?: 'Published product detail page.')
@section('body_class', 'product-detail-page')

@php
    $hasInquiryErrors = $errors->any();
    $isInquiryAvailable = true;
    $rawDetails = is_array($product->details) ? $product->details : [];
    $descriptionText = html_entity_decode((string) $product->full_description, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $descriptionText = preg_replace('/<li\b[^>]*>/i', "\n- ", $descriptionText) ?? $descriptionText;
    $descriptionText = preg_replace('/<br\s*\/?>/i', "\n", $descriptionText) ?? $descriptionText;
    $descriptionText = preg_replace('/<\/(p|div|li|h[1-6]|section|article)>/i', "\n\n", $descriptionText) ?? $descriptionText;
    $plainDescription = trim(html_entity_decode(strip_tags($descriptionText), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

    $formatPrice = function ($price) {
        if (! filled($price)) {
            return null;
        }

        $price = (float) $price;
        $decimals = floor($price) === $price ? 0 : 2;

        return 'Rs. ' . number_format($price, $decimals);
    };

    $regularPrice = $formatPrice($product->regular_price);
    $salePrice = $formatPrice($product->sale_price);
    $currentPrice = $salePrice ?: $regularPrice;
    $hasOriginalPrice = filled($regularPrice)
        && filled($salePrice)
        && (float) $product->regular_price !== (float) $product->sale_price;
    $shouldShowPrice = $product->show_price && filled($currentPrice);

    $formatDetailValue = function ($value) {
        if (is_bool($value)) {
            return $value ? 'Yes' : 'No';
        }

        if (is_array($value)) {
            return collect($value)
                ->flatten()
                ->filter(fn ($item) => filled($item))
                ->implode(', ');
        }

        return filled($value) ? (string) $value : null;
    };

    $additionalRows = collect();

    if (array_is_list($rawDetails)) {
        $additionalRows = collect($rawDetails)
            ->filter(fn ($detail) => is_array($detail))
            ->map(function ($detail) use ($formatDetailValue) {
                $title = $detail['title'] ?? $detail['key'] ?? null;
                $value = $formatDetailValue($detail['value'] ?? null);

                return filled($title) || filled($value)
                    ? ['title' => filled($title) ? (string) $title : 'Detail', 'value' => $value ?? '']
                    : null;
            })
            ->filter();
    } elseif (array_key_exists('dynamic_specs', $rawDetails)) {
        $additionalRows = collect($rawDetails['dynamic_specs'] ?? [])
            ->filter(fn ($detail) => is_array($detail))
            ->map(function ($detail) use ($formatDetailValue) {
                $title = $detail['title'] ?? $detail['key'] ?? null;
                $value = $formatDetailValue($detail['value'] ?? null);

                return filled($title) || filled($value)
                    ? ['title' => filled($title) ? (string) $title : 'Detail', 'value' => $value ?? '']
                    : null;
            })
            ->filter();
    }
@endphp

@section('content')
    <div class="product-purchase" data-product-detail>
        <nav class="product-purchase__breadcrumbs" aria-label="Breadcrumb">
            <a href="{{ route('public.home') }}">Home</a>
            <span>/</span>
            <a href="{{ route('public.products.index') }}">Products</a>
            <span>/</span>
            <span>{{ $product->name }}</span>
        </nav>

        <section class="product-purchase__shell" aria-labelledby="product-detail-title">
            <div class="product-purchase__media-lock">
                <div @class(['product-purchase__gallery', 'product-purchase__gallery--single' => $gallery->count() <= 1]) data-product-gallery>
                    <div class="product-purchase__gallery-viewport">
                        <div class="product-purchase__gallery-track" data-product-gallery-track>
                            @forelse ($gallery as $media)
                                <figure class="product-purchase__media" data-product-gallery-slide>
                                    <x-public.image
                                        :media="$media"
                                        sizes="(min-width: 1280px) 64vw, (min-width: 900px) 66vw, 100vw"
                                        class="product-purchase__image"
                                        :loading="$loop->first ? 'eager' : 'lazy'"
                                    />
                                </figure>
                            @empty
                                <figure class="product-purchase__media" data-product-gallery-slide>
                                    <div class="image-fallback product-purchase__image">
                                        <span>Image pending</span>
                                    </div>
                                </figure>
                            @endforelse
                        </div>

                        @if ($gallery->count() > 1)
                            <div class="product-purchase__gallery-controls" aria-label="Product image controls">
                                <button class="product-purchase__gallery-button" type="button" data-product-gallery-prev aria-label="Previous product image">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>
                                <span class="product-purchase__gallery-count" aria-live="polite">
                                    <span data-product-gallery-current>1</span> / {{ $gallery->count() }}
                                </span>
                                <button class="product-purchase__gallery-button" type="button" data-product-gallery-next aria-label="Next product image">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                        <path d="m9 6 6 6-6 6" />
                                    </svg>
                                </button>
                            </div>
                        @endif
                    </div>

                    @if ($gallery->isNotEmpty())
                        <div class="product-purchase__thumbnails" aria-label="Product image thumbnails">
                            @foreach ($gallery as $media)
                                <button
                                    class="product-purchase__thumbnail"
                                    type="button"
                                    data-product-gallery-thumb
                                    data-product-gallery-index="{{ $loop->index }}"
                                    aria-label="Show product image {{ $loop->iteration }}"
                                    @if ($loop->first) aria-current="true" @endif
                                >
                                    <x-public.image
                                        :media="$media"
                                        sizes="(min-width: 1024px) 8vw, (min-width: 640px) 12vw, 18vw"
                                        class="product-purchase__thumbnail-image"
                                        loading="lazy"
                                    />
                                </button>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>

            <aside class="product-purchase__details" aria-labelledby="product-detail-title">
                <div class="product-purchase__details-scroll">
                    <section class="product-purchase__panel product-purchase__panel--summary">
                        <p class="product-purchase__kicker">{{ $product->category->name }}</p>
                        <h1 id="product-detail-title">{{ $product->name }}</h1>
                        @if ($product->short_description)
                            <p class="product-purchase__lead">{{ $product->short_description }}</p>
                        @endif
                    </section>

                    @if ($shouldShowPrice)
                        <section class="product-purchase__panel product-purchase__panel--prices">
                            <div class="product-purchase__price-stack">
                                @if ($hasOriginalPrice)
                                    <del class="product-purchase__price-original">{{ $regularPrice }}</del>
                                @endif
                                <strong class="product-purchase__price-current">{{ $currentPrice }}</strong>
                            </div>
                        </section>
                    @endif

                    @if ($isInquiryAvailable)
                        <section class="product-purchase__cta" aria-labelledby="product-inquiry-title">
                            <h2 id="product-inquiry-title">Interested in this product?</h2>
                            <button class="product-purchase__button" type="button" data-inquiry-open>
                                Product inquiry
                            </button>
                            @if ($contactInformation?->show_whatsapp && $contactInformation->whatsapp_number)
                                <a class="product-purchase__link-button" href="https://wa.me/{{ preg_replace('/\D+/', '', $contactInformation->whatsapp_number) }}">
                                    WhatsApp
                                </a>
                            @endif
                        </section>
                    @endif

                    <section class="product-purchase__panel product-purchase__panel--description" aria-labelledby="product-story-title">
                        <h2 id="product-story-title">Description</h2>
                        <div class="product-story__copy">
                            @if ($plainDescription !== '')
                                @foreach (preg_split('/\R{2,}/', $plainDescription) as $paragraph)
                                    @if (trim($paragraph) !== '')
                                        <p>{{ trim($paragraph) }}</p>
                                    @endif
                                @endforeach
                            @else
                                <p>{{ $product->short_description ?: $product->name }}</p>
                            @endif
                        </div>
                    </section>

                    @if ($additionalRows->isNotEmpty())
                        <section class="product-purchase__panel product-purchase__panel--details" aria-labelledby="product-specification-title">
                            <h2 id="product-specification-title">Additional details</h2>
                            <dl class="product-purchase__detail-list">
                                @foreach ($additionalRows as $detail)
                                    <div class="product-purchase__detail-row">
                                        <dt>{{ $detail['title'] }}</dt>
                                        <dd>{{ $detail['value'] }}</dd>
                                    </div>
                                @endforeach
                            </dl>
                        </section>
                    @endif
                </div>
            </aside>
        </section>

        <section class="product-showcase" aria-labelledby="related-products-title">
            <div class="product-showcase__heading">
                <p class="product-purchase__kicker">Same products</p>
                <h2 id="related-products-title">More from {{ $product->category->name }}</h2>
            </div>
            <div class="product-showcase__grid">
                @forelse ($relatedProducts as $relatedProduct)
                    <x-public.product-card :product="$relatedProduct" :image-only="true" sizes="(min-width: 1024px) 18vw, 45vw" />
                @empty
                    <div class="empty-state">Related products will appear when more published products share this category.</div>
                @endforelse
            </div>
        </section>

        @if ($otherProducts->isNotEmpty())
            <section class="product-showcase" aria-labelledby="other-products-title">
                <div class="product-showcase__heading">
                    <p class="product-purchase__kicker">Other products</p>
                    <h2 id="other-products-title">Explore more furniture pieces</h2>
                </div>
                <div class="product-showcase__grid">
                    @foreach ($otherProducts as $otherProduct)
                        <x-public.product-card :product="$otherProduct" :image-only="true" sizes="(min-width: 1024px) 18vw, 45vw" />
                    @endforeach
                </div>
            </section>
        @endif
    </div>

    @if (($quickInquirySection?->is_visible ?? true) && $isInquiryAvailable)
        <x-public.home.quick-inquiry
            :section="$quickInquirySection"
            :contactInformation="$contactInformation"
        />
    @endif

    @if ($isInquiryAvailable)
        <div
            class="product-inquiry-modal"
            data-inquiry-modal
            @if (! $hasInquiryErrors) hidden @endif
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-inquiry-modal-title"
        >
            <button class="product-inquiry-modal__backdrop" type="button" data-inquiry-close aria-label="Close inquiry form"></button>
            <div class="product-inquiry-modal__panel">
                <button class="product-inquiry-modal__close" type="button" data-inquiry-close aria-label="Close inquiry form">
                    <span></span>
                </button>
                <div class="product-inquiry-modal__content">
                    <p class="product-purchase__kicker">Inquiry</p>
                    <h2 id="product-inquiry-modal-title">Ask about {{ $product->name }}</h2>
                    @include('partials.inquiry-form', ['action' => route('public.inquiries.product.submit', $product->slug), 'product' => $product, 'compact' => true])
                </div>
            </div>
        </div>
    @endif
@endsection
