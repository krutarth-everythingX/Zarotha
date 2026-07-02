@php
    $aboutTitle = $page?->title ?: 'About Us';
    $introTitle = $page?->intro_title ?: 'The philosophy of quiet industry';
    $introBody = $page?->intro_body ?: 'Zarokha Wooden Arts is shaped around calm material choices, patient handwork, and pieces that feel settled in the spaces they inhabit.';
    $ctaLabel = $page?->cta_label ?: 'Explore Products';
    $ctaUrl = $page?->cta_url ?: route('public.products.index');

    $aboutImages = [
        asset('storage/media/fake.webp'),
        asset('storage/media/inquiry-banner-1.jpg'),
        asset('storage/media/inquiry-banner-2.jpg'),
        asset('storage/media/inquiry-banner-0.jpg'),
    ];

    $pillars = [
        [
            'title' => 'Material Honesty',
            'body' => 'Natural grains, tactility, and visible character guide every selection before form begins.',
            'image' => $aboutImages[0],
        ],
        [
            'title' => 'Measured Making',
            'body' => 'Each piece moves through careful proportioning, finishing, and review before it is presented.',
            'image' => $aboutImages[1],
        ],
        [
            'title' => 'Graceful Utility',
            'body' => 'Objects are designed to feel decorative, useful, and quietly present in everyday rooms.',
            'image' => $aboutImages[2],
        ],
        [
            'title' => 'Cultural Warmth',
            'body' => 'Traditional craft cues are interpreted with restraint for contemporary homes and hospitality spaces.',
            'image' => $aboutImages[3],
        ],
        [
            'title' => 'Timeless Repair',
            'body' => 'Durability, upkeep, and long-term use matter more than short-lived trends.',
            'image' => $aboutImages[0],
        ],
    ];
@endphp

<section class="about-hero" aria-labelledby="about-hero-title">
    <div class="about-hero__inner">
        <div class="about-hero__media">
            <img src="{{ $aboutImages[0] }}" alt="Sunlit woodland landscape representing natural material origins" loading="eager" decoding="async">
            <aside class="about-hero__note" aria-label="Brand note">
                <p>Handcrafted decor for spaces that value warmth, texture, and permanence.</p>
                <span>Zarokha Wooden Arts</span>
            </aside>
        </div>

        <div class="about-hero__copy">
            <p class="about-kicker">About Zarokha</p>
            <h1 id="about-hero-title">{{ $introTitle }}</h1>
            <p>{{ $introBody }}</p>
            <p>Our approach begins with the character of the wood, then moves through proportion, finish, and the small decisions that make an object feel grounded.</p>
            <a href="{{ $ctaUrl }}" class="about-button">{{ $ctaLabel }}</a>
        </div>
    </div>
</section>

<section class="about-pillars" aria-labelledby="about-pillars-title">
    <div class="about-section-heading">
        <h2 id="about-pillars-title">Five columns of permanence</h2>
    </div>

    <div class="about-pillars__grid">
        @foreach ($pillars as $pillar)
            <article class="about-pillar">
                <span class="about-pillar__number">{{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                <h3>{{ $pillar['title'] }}</h3>
                <p>{{ $pillar['body'] }}</p>
                <img src="{{ $pillar['image'] }}" alt="" loading="lazy" decoding="async">
            </article>
        @endforeach
    </div>
</section>

<section class="about-sanctuary" aria-labelledby="about-sanctuary-title">
    <div class="about-sanctuary__inner">
        <div class="about-sanctuary__copy">
            <p class="about-kicker">Studio Ethos</p>
            <h2 id="about-sanctuary-title">A sanctuary of quiet industry</h2>
            <p>Layered craft, considered material, and a slower design rhythm come together in a studio language that favors presence over noise.</p>
            <a href="{{ route('public.contact.show') }}" class="about-button about-button--light">Make an Inquiry</a>
        </div>
        <img src="{{ $aboutImages[1] }}" alt="Quiet green valley landscape expressing calm studio rhythm" loading="lazy" decoding="async">
    </div>
</section>

<section class="about-visit" aria-labelledby="about-visit-title">
    <div class="about-visit__inner">
        <div class="about-visit__copy">
            <p class="about-kicker">Visit the Studio</p>
            <h2 id="about-visit-title">{{ $aboutTitle }}</h2>
            <p>Visits are arranged by appointment so every conversation can be personal, unhurried, and focused on the piece or space you are imagining.</p>

            <dl class="about-visit__details">
                <div>
                    <dt>Location</dt>
                    <dd>{{ $contactInformation?->show_address && $contactInformation?->address_line_1 ? $contactInformation->address_line_1 : 'Available by appointment' }}</dd>
                </div>
                <div>
                    <dt>Contact</dt>
                    <dd>
                        @if ($contactInformation?->show_email && $contactInformation->email_primary)
                            <a href="mailto:{{ $contactInformation->email_primary }}">{{ $contactInformation->email_primary }}</a>
                        @else
                            Send an inquiry to begin
                        @endif
                    </dd>
                </div>
            </dl>

            <a href="{{ route('public.contact.show') }}" class="about-button">Request a Studio Visit</a>
        </div>

        <div class="about-map" aria-label="Decorative map placeholder">
            <span class="about-map__pin"></span>
            <span class="about-map__label">Zarokha Studio</span>
        </div>
    </div>
</section>
