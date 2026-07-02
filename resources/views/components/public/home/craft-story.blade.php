@props(['contactInformation'])

@php
    $storyImages = [
        asset('images/custom-commissions-workshop.webp'),
        asset('storage/media/fake.webp'),
        asset('storage/media/inquiry-banner-1.jpg'),
        asset('storage/media/inquiry-banner-2.jpg'),
    ];

    $phone = $contactInformation?->show_phone && $contactInformation?->phone_primary
        ? $contactInformation->phone_primary
        : '+91 98765 43210';
    $email = $contactInformation?->show_email && $contactInformation?->email_primary
        ? $contactInformation->email_primary
        : 'craft@zarokha.art';
    $address = $contactInformation?->show_address && $contactInformation?->address_line_1
        ? collect([
            $contactInformation->address_line_1,
            $contactInformation->city,
            $contactInformation->state,
        ])->filter()->join(', ')
        : 'Studio visits by appointment';

    $timeline = [
        [
            'number' => '01',
            'title' => 'Forest Memory',
            'body' => 'Every commission begins with grain, density, and the quiet irregularities that make timber feel alive.',
            'image' => $storyImages[1],
        ],
        [
            'number' => '02',
            'title' => 'Workshop Rhythm',
            'body' => 'Measured cuts, hand shaping, and patient finishing turn raw material into pieces that feel settled.',
            'image' => $storyImages[0],
        ],
        [
            'number' => '03',
            'title' => 'Cultural Warmth',
            'body' => 'Traditional craft cues are refined for homes, studios, and hospitality spaces that value permanence.',
            'image' => $storyImages[3],
        ],
    ];
@endphp

<section class="home-craft-story" aria-labelledby="home-craft-title">
    <div class="home-craft-story__statement">
        <div class="home-craft-story__statement-copy">
            <h2 id="home-craft-title">Craft is not decoration.</h2>
            <p>it is memory held in material.</p>
        </div>

        <div class="home-craft-story__image-stack" aria-label="Workshop details">
            @foreach ([$storyImages[0], $storyImages[0], $storyImages[0]] as $stackImage)
                <img src="{{ $stackImage }}" alt="" loading="lazy" decoding="async">
            @endforeach
        </div>

        <div class="home-craft-story__statement-note">
            <span>Material first</span>
            <p>Wood is never only a surface. It carries weather, weight, place, and the hand that learns how to reveal it.</p>
        </div>
    </div>

    <div class="home-craft-story__founder">
        <div class="home-craft-story__founder-copy">
            <span class="home-craft-story__number">01</span>
            <h3>The founder's hand</h3>
            <p>Every Zarokha piece is shaped by close looking: at the room, the ritual, and the timber itself. The result is furniture and decor with calm proportion, honest texture, and a sense of belonging.</p>
            <a href="{{ route('public.pages.about') }}">Read about us</a>
        </div>

        <div class="home-craft-story__founder-media">
            <img src="{{ $storyImages[0] }}" alt="Artisan working in a wooden workshop" loading="lazy" decoding="async">
            <img src="{{ $storyImages[1] }}" alt="" loading="lazy" decoding="async">
        </div>
    </div>

    <div class="home-material-timeline" aria-labelledby="home-material-title">
        <div class="home-material-timeline__heading">
            <p>From raw timber to finished heirloom</p>
            <h3 id="home-material-title">The material timeline</h3>
        </div>

        <div class="home-material-timeline__grid">
            @foreach ($timeline as $item)
                <article class="home-material-timeline__item">
                    <div>
                        <span>{{ $item['number'] }}</span>
                        <h4>{{ $item['title'] }}</h4>
                        <p>{{ $item['body'] }}</p>
                    </div>
                    <img src="{{ $item['image'] }}" alt="" loading="lazy" decoding="async">
                </article>
            @endforeach
        </div>
    </div>

    <div class="home-visit-strip" aria-labelledby="home-visit-title">
        <div>
            <span>About / Contact</span>
            <h3 id="home-visit-title">Bring the room, the idea, or the measurement.</h3>
            <p>We can talk through custom pieces, studio visits, material direction, and delivery details before a commission begins.</p>
        </div>

        <dl>
            <div>
                <dt>Studio</dt>
                <dd>{{ $address }}</dd>
            </div>
            <div>
                <dt>Email</dt>
                <dd><a href="mailto:{{ $email }}">{{ $email }}</a></dd>
            </div>
            <div>
                <dt>Phone</dt>
                <dd><a href="tel:{{ preg_replace('/\s+/', '', $phone) }}">{{ $phone }}</a></dd>
            </div>
        </dl>

        <a class="home-visit-strip__button" href="{{ route('public.contact.show') }}">Open contact page</a>
    </div>
</section>
