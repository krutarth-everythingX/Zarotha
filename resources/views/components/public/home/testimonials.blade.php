@props(['section', 'testimonials'])

@php
    $testimonialStyles = [];
    if ($section?->background_color) {
        $testimonialStyles[] = '--section-bg-color: '.$section->background_color;
    }
    if ($section?->backgroundMedia) {
        $testimonialImage = $section->backgroundMedia->responsiveImage('100vw');
        if ($testimonialImage['src']) {
            $testimonialStyles[] = "--section-bg-image: url('".$testimonialImage['src']."')";
        }
    }
@endphp
<section class="testimonial-section" style="{{ implode('; ', $testimonialStyles) }}" aria-labelledby="testimonials-title">
    <div class="home-section__heading">
        <div>
            <h2 id="testimonials-title">{{ $section?->section_title ?: 'Testimonials' }}</h2>
            @if ($section?->section_intro)
                <p>{{ $section->section_intro }}</p>
            @endif
        </div>
        <div class="slider-controls">
            <button type="button" data-slider-prev aria-label="Previous testimonials">Previous</button>
            <button type="button" data-slider-next aria-label="Next testimonials">Next</button>
        </div>
    </div>
    <div class="testimonial-slider" data-slider>
        <div class="testimonial-slider__track" data-slider-track>
            @foreach ($testimonials as $testimonial)
                <article class="testimonial-card">
                    <p class="testimonial-card__quote">{{ $testimonial->body_text }}</p>
                    <div class="testimonial-card__author">
                        @if ($testimonial->imageMedia)
                            <x-public.image :media="$testimonial->imageMedia" sizes="96px" class="testimonial-card__image" />
                        @else
                            <div class="testimonial-card__image testimonial-card__image--default">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                        @endif
                        <div class="testimonial-card__author-info">
                            <h3>{{ $testimonial->customer_name }}</h3>
                            @if ($testimonial->location_or_role)
                                <p>{{ $testimonial->location_or_role }}</p>
                            @endif
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
