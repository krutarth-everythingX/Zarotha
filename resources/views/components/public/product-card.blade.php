@props([
    'product',
    'imageOnly' => false,
    'sizes' => '(min-width: 1024px) 25vw, 50vw',
])

<article @class(['product-card', 'product-card--image-only' => $imageOnly])>
    <a href="{{ route('public.products.show', $product->slug) }}" class="product-card__image" aria-label="View {{ $product->name }}">
        <x-public.image :media="$product->featuredMedia" :sizes="$sizes" class="product-card__img" />
    </a>
    @unless ($imageOnly)
        <div class="product-card__body">
            <p class="eyebrow">{{ $product->category->name }}</p>
            <h3><a href="{{ route('public.products.show', $product->slug) }}">{{ $product->name }}</a></h3>
            @if ($product->short_description)
                <p>{{ $product->short_description }}</p>
            @endif
            <div class="product-card__actions">
                <a href="{{ route('public.products.show', $product->slug) }}">View details</a>
                <a href="{{ route('public.contact.show', ['product' => $product->slug]) }}">Inquire</a>
            </div>
        </div>
    @endunless
</article>
