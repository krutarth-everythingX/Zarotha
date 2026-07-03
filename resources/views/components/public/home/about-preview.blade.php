<section class="home-about-preview" aria-labelledby="home-about-preview-title">
    <div class="home-about-preview__inner">
        <div class="home-about-preview__copy" data-scroll-reveal>
            <p class="home-about-preview__eyebrow">About Zarokha</p>
            <h2 id="home-about-preview-title">The leading furniture brand for thoughtful custom spaces.</h2>
            <p>
                Zarokha brings together measured design, material knowledge, and workshop discipline to create
                furniture that fits the room, the routine, and the people who use it every day.
            </p>
            <p>
                From homes and workspaces to hospitality interiors, every project is shaped with practical details,
                careful finishing, and a clear conversation from idea to installation.
            </p>

            <ul class="home-about-preview__points" aria-label="Zarokha strengths">
                <li>Direct factory manufacturing</li>
                <li>Strict quality control</li>
                <li>Timely production</li>
                <li>Experienced team</li>
            </ul>

            <div class="home-about-preview__actions">
                <a class="home-about-preview__button home-about-preview__button--primary" href="{{ route('public.pages.about') }}">
                    View more
                </a>
                <a class="home-about-preview__button home-about-preview__button--secondary" href="{{ route('public.contact.show') }}">
                    Contact us
                </a>
            </div>
        </div>

        <div class="home-about-preview__media" data-scroll-reveal style="--reveal-delay: 120ms">
            <img
                src="{{ asset('images/custom-commissions-workshop.webp') }}"
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
                alt="Zarokha artisan working on custom furniture in the workshop"
            >
        </div>
    </div>
</section>
