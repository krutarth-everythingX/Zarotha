@props([
    'product',
    'imageOnly' => false,
    'sizes' => '(min-width: 1024px) 25vw, 50vw',
])

@php
    $isPlaceholder = (bool) data_get($product, 'isPlaceholder', false);
    $productUrl = $isPlaceholder ? route('public.products.index') : route('public.products.show', $product->slug);
    $inquiryUrl = $isPlaceholder ? route('public.contact.show') : route('public.contact.show', ['product' => $product->slug]);
@endphp

<article @class(['product-card', 'product-card--image-only' => $imageOnly])>
    <a href="{{ $productUrl }}" class="product-card__image" aria-label="View {{ $product->name }}">
        <x-public.image :media="$product->featuredMedia" :sizes="$sizes" class="product-card__img" />
    </a>
    @unless ($imageOnly)
        <div class="product-card__body">
            <p class="eyebrow">{{ $product->category->name }}</p>
            <h3><a href="{{ $productUrl }}">{{ $product->name }}</a></h3>
            @if ($product->short_description)
                <p>{{ $product->short_description }}</p>
            @endif
            <div class="product-card__actions">
                <a href="{{ $productUrl }}">View details</a>
                <a href="{{ $inquiryUrl }}">Inquire</a>
            </div>
        </div>
    @endunless
</article>
