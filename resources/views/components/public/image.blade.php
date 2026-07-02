@props([
    'media' => null,
    'sizes' => '100vw',
    'class' => '',
    'loading' => 'lazy',
])

@php
    $image = $media?->responsiveImage($sizes);
@endphp

@if ($media && $image && $image['src'])
    <img
        src="{{ $image['src'] }}"
        srcset="{{ $image['srcset'] }}"
        sizes="{{ $image['sizes'] }}"
        width="{{ $image['width'] }}"
        height="{{ $image['height'] }}"
        alt="{{ $image['alt'] }}"
        loading="{{ $loading }}"
        class="{{ $class }}"
    >
@else
    <div class="image-fallback {{ $class }}" aria-hidden="true">
        <span>Image pending</span>
    </div>
@endif
