@extends('layouts.public')

@section('title', ($product->meta_title ?: $product->name) . ' | ' . config('app.name'))
@section('meta_description', $product->meta_description ?: $product->short_description ?: 'Published product detail page.')
@section('body_class', 'product-detail-page')

@php
    use Illuminate\Support\Str;

    $hasInquiryErrors = $errors->any();
    $details = collect(is_array($product->details) ? $product->details : []);

    $availabilityLabels = [
        'in_stock' => 'In stock',
        'out_of_stock' => 'Out of stock',
        'made_to_order' => 'Made to order',
        'pre_order' => 'Pre-order',
    ];

    $formatPrice = function ($price) {
        if (! filled($price)) {
            return null;
        }

        $price = (float) $price;
        $decimals = floor($price) === $price ? 0 : 2;

        return 'Rs. ' . number_format($price, $decimals);
    };

    $availability = filled($product->availability)
        ? ($availabilityLabels[$product->availability] ?? (string) Str::of($product->availability)->replace(['_', '-'], ' ')->title())
        : null;

    $woodType = $product->wood_type === 'Other' && filled($details->get('custom_wood_type'))
        ? $details->get('custom_wood_type')
        : $product->wood_type;

    $unitMap = [
        'inches' => 'in',
        'cm' => 'cm',
        'mm' => 'mm',
    ];
    $dimensionUnit = $unitMap[$details->get('dimensions_unit')] ?? $details->get('dimensions_unit');
    $withUnit = fn ($key) => filled($details->get($key)) ? trim($details->get($key) . ' ' . $dimensionUnit) : null;

    $dimensionParts = collect([
        'H' => $details->get('height'),
        'W' => $details->get('width'),
        'D' => $details->get('depth'),
    ])->filter(fn ($value) => filled($value));

    $dimensionSummary = $dimensionParts->isNotEmpty()
        ? $dimensionParts->map(fn ($value, $label) => $label . ' ' . $value)->implode(' x ') . (filled($dimensionUnit) ? ' ' . $dimensionUnit : '')
        : $product->dimensions;

    $priceRows = collect([
        'Sale price' => $formatPrice($product->sale_price),
        'Regular price' => $formatPrice($product->regular_price),
    ])->filter(fn ($value) => filled($value));

    $summarySpecs = collect([
        'Product type' => $product->product_type,
        'Category' => $product->category?->name,
        'Price' => $formatPrice($product->sale_price ?: $product->regular_price),
        'Availability' => $availability,
        'Wood' => $woodType,
        'Dimensions' => $dimensionSummary,
    ])->filter(fn ($value) => filled($value));

    $overviewRows = collect([
        'Product type' => $product->product_type,
        'Category' => $product->category?->name,
        'Style' => $product->style,
        'Availability' => $availability,
        'Stock quantity' => $product->is_track_inventory && filled($product->stock_quantity) ? $product->stock_quantity : null,
        'Inventory tracking' => $product->is_track_inventory ? 'Enabled' : null,
    ])->filter(fn ($value) => filled($value));

    $materialRows = collect([
        'Primary wood' => $woodType,
        'Material' => $product->material,
        'Material grade' => $details->get('material_grade'),
        'Wood source' => $details->get('wood_source'),
        'Finish' => $product->finish,
        'Style' => $product->style,
        'Reclaimed wood' => $details->has('is_reclaimed_wood') ? ($details->get('is_reclaimed_wood') ? 'Yes' : 'No') : null,
        'Sustainably sourced' => $details->has('is_sustainably_sourced') ? ($details->get('is_sustainably_sourced') ? 'Yes' : 'No') : null,
    ])->filter(fn ($value) => filled($value));

    $dimensionRows = collect([
        'Listed dimensions' => $product->dimensions,
        'Height' => $withUnit('height'),
        'Width' => $withUnit('width'),
        'Depth' => $withUnit('depth'),
        'Weight' => filled($details->get('weight')) ? $details->get('weight') . ' kg' : null,
    ])->filter(fn ($value) => filled($value));

    $dynamicSpecRows = collect($details->get('dynamic_specs', []))
        ->filter(fn ($spec) => filled($spec['key'] ?? null) || filled($spec['value'] ?? null))
        ->mapWithKeys(fn ($spec) => [($spec['key'] ?? 'Specification') => ($spec['value'] ?? '')]);

    $handledDetailKeys = [
        'custom_wood_type',
        'material_grade',
        'wood_source',
        'is_reclaimed_wood',
        'is_sustainably_sourced',
        'dimensions_unit',
        'height',
        'width',
        'depth',
        'weight',
        'dynamic_specs',
    ];

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

    $extraDetailRows = $details
        ->reject(fn ($value, $key) => in_array($key, $handledDetailKeys, true))
        ->mapWithKeys(function ($value, $key) use ($formatDetailValue) {
            $value = $formatDetailValue($value);

            return filled($value)
                ? [(string) Str::of($key)->replace(['_', '-'], ' ')->title() => $value]
                : [];
        });

    $detailGroups = collect([
        ['title' => 'Overview', 'items' => $overviewRows],
        ['title' => 'Price and availability', 'items' => $priceRows],
        ['title' => 'Material and finish', 'items' => $materialRows],
        ['title' => 'Dimensions and weight', 'items' => $dimensionRows],
        ['title' => 'Additional specifications', 'items' => $dynamicSpecRows],
        ['title' => 'More details', 'items' => $extraDetailRows],
    ])->filter(fn ($group) => $group['items']->isNotEmpty());
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

        <header class="product-purchase__title">
            <p>{{ $product->category->name }}</p>
            <h1>{{ $product->name }}</h1>
        </header>

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
                        <p class="product-purchase__kicker">Product details</p>
                        <h2 id="product-detail-title">Review the essentials before you inquire.</h2>
                        @if ($product->short_description)
                            <p>{{ $product->short_description }}</p>
                        @endif
                    </section>

                    @if ($summarySpecs->isNotEmpty())
                        <section class="product-purchase__panel" aria-label="Product summary">
                            <div class="product-purchase__summary-list">
                                @foreach ($summarySpecs as $label => $value)
                                    <div @class(['product-purchase__summary-item', 'product-purchase__summary-item--wide' => $label === 'Dimensions'])>
                                        <span>{{ $label }}</span>
                                        <strong>{{ $value }}</strong>
                                    </div>
                                @endforeach
                            </div>
                        </section>
                    @endif

                    <section class="product-purchase__cta" aria-labelledby="product-inquiry-title">
                        <h3 id="product-inquiry-title" class="sr-only">Ask about {{ $product->name }}</h3>
                        <button class="product-purchase__button" type="button" data-inquiry-open>
                            Product inquiry
                        </button>
                        @if ($contactInformation?->show_whatsapp && $contactInformation->whatsapp_number)
                            <a class="product-purchase__link-button" href="https://wa.me/{{ preg_replace('/\D+/', '', $contactInformation->whatsapp_number) }}">
                                WhatsApp
                            </a>
                        @endif
                    </section>
                </div>
            </aside>
        </section>

        <section class="product-story" aria-labelledby="product-story-title">
            <div>
                <p class="product-purchase__kicker">Product story</p>
                <h2 id="product-story-title">A closer look at the piece.</h2>
            </div>
            <div class="product-story__copy">
                @if ($product->full_description)
                    {!! $product->full_description !!}
                @else
                    <p>{{ $product->name }} is presented as an inquiry-based furniture piece. Share your space, finish preferences, and usage needs so the team can discuss the right direction before production.</p>
                @endif
            </div>
        </section>

        @if ($detailGroups->isNotEmpty())
            <section class="product-specification" aria-labelledby="product-specification-title">
                <div class="product-specification__heading">
                    <p class="product-purchase__kicker">All details</p>
                    <h2 id="product-specification-title">Everything saved for this product.</h2>
                </div>

                <div class="product-specification__groups">
                    @foreach ($detailGroups as $group)
                        <section class="product-specification__group">
                            <h3>{{ $group['title'] }}</h3>
                            <dl class="product-specification__list">
                                @foreach ($group['items'] as $label => $value)
                                    <div class="product-specification__item">
                                        <dt>{{ $label }}</dt>
                                        <dd>{{ $value }}</dd>
                                    </div>
                                @endforeach
                            </dl>
                        </section>
                    @endforeach
                </div>
            </section>
        @endif

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

    @if ($quickInquirySection?->is_visible ?? true)
        <x-public.home.quick-inquiry
            :section="$quickInquirySection"
            :contactInformation="$contactInformation"
        />
    @endif

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
@endsection
