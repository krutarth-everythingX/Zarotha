@props(['section', 'testimonials'])

@php
    $testimonialStyles = [];
    if ($section?->background_color) {
        $testimonialStyles[] = '--testimonial-card-bg: '.$section->background_color;
    }

    $items = collect($testimonials ?? [])->values();
    if ($items->isEmpty()) {
        $items = collect([(object) [
            'body_text' => 'Customer testimonials will appear here soon.',
            'customer_name' => config('app.name', 'Zarokha Wooden Arts'),
            'location_or_role' => null,
            'rating' => 5,
            'imageMedia' => null,
        ]]);
    }

    $marqueeItems = collect();
    while ($marqueeItems->count() < max(8, $items->count())) {
        $marqueeItems = $marqueeItems->concat($items);
    }
    $marqueeItems = $marqueeItems->values();
@endphp

<section class="testimonial-section" style="{{ implode('; ', $testimonialStyles) }}" aria-labelledby="testimonials-title">
    <div class="testimonial-section__inner">
        <div class="home-section__heading">
            <div>
                <h2 id="testimonials-title">{{ $section?->section_title ?: 'Testimonials' }}</h2>
                @if ($section?->section_intro)
                    <p>{{ $section->section_intro }}</p>
                @endif
            </div>
        </div>
        <div class="testimonial-marquee" aria-label="Customer testimonials" data-mobile-marquee data-mobile-marquee-speed="30" data-mobile-marquee-pause="5000">
            <div class="testimonial-marquee__track" data-mobile-marquee-track>
            @foreach ([0, 1] as $copyIndex)
                <div class="testimonial-marquee__group" @if ($copyIndex === 1) aria-hidden="true" @endif>
                    @foreach ($marqueeItems as $testimonial)
                        @php
                            $rating = min(5, max(1, (int) ($testimonial->rating ?? 5)));
                        @endphp
                        <article class="testimonial-card">
                            <div class="testimonial-card__header">
                                @if ($testimonial->imageMedia)
                                    <x-public.image :media="$testimonial->imageMedia" sizes="88px" class="testimonial-card__image" />
                                @else
                                    <div class="testimonial-card__image testimonial-card__image--default">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                @endif
                                <div class="testimonial-card__author-info">
                                    <h3>{{ $testimonial->customer_name }}</h3>
                                    @if ($testimonial->location_or_role)
                                        <p>{{ $testimonial->location_or_role }}</p>
                                    @endif
                                    <div class="testimonial-card__rating" aria-label="{{ $rating }} out of 5 stars">
                                        @for ($star = 1; $star <= 5; $star++)
                                            <span @class(['is-filled' => $star <= $rating]) aria-hidden="true">★</span>
                                        @endfor
                                    </div>
                                </div>
                            </div>
                            <p class="testimonial-card__quote">{{ $testimonial->body_text }}</p>
                        </article>
                    @endforeach
                </div>
            @endforeach
            </div>
        </div>
    </div>
</section>
