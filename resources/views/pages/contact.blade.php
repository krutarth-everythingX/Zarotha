@extends('layouts.public')

@section('title', 'Contact | ' . config('app.name'))
@section('body_class', 'contact-page')

@section('content')
    @php
        $normalizePlatform = static function (?string $value): string {
            $platform = strtolower(trim((string) $value));

            return match (true) {
                $platform === 'facebook', str_contains($platform, 'facebook') => 'facebook',
                $platform === 'instagram', str_contains($platform, 'instagram') => 'instagram',
                $platform === 'pinterest', str_contains($platform, 'pinterest') => 'pinterest',
                $platform === 'linkedin', str_contains($platform, 'linkedin') => 'linkedin',
                $platform === 'youtube', str_contains($platform, 'youtube') => 'youtube',
                $platform === 'whatsapp', str_contains($platform, 'whatsapp') => 'whatsapp',
                in_array($platform, ['x', 'x-twitter', 'twitter-x'], true), str_contains($platform, 'twitter') => 'x',
                default => preg_replace('/[^a-z0-9]+/', '-', $platform) ?: 'social',
            };
        };
        $pageTitle = trim((string) ($contactInformation?->page_title ?? '')) ?: 'Contact Us';
        $pageIntro = trim((string) ($contactInformation?->page_intro ?? '')) ?: 'Share your inquiry and we will get back to you shortly.';
        $formTitle = trim((string) ($contactInformation?->form_title ?? '')) ?: 'Send an inquiry';
        $submitLabel = trim((string) ($contactInformation?->submit_label ?? '')) ?: 'Send Inquiry';
        $businessName = trim((string) ($contactInformation?->business_name ?? '')) ?: 'Zarokha Wooden Arts';
        $contactIntro = trim((string) ($contactInformation?->contact_intro ?? ''));
        $phone = $contactInformation?->show_phone && $contactInformation?->phone_primary
            ? $contactInformation->phone_primary
            : '+91 98765 43210';
        $secondaryPhone = $contactInformation?->show_phone ? $contactInformation?->phone_secondary : null;
        $email = $contactInformation?->show_email && $contactInformation?->email_primary
            ? $contactInformation->email_primary
            : 'hello@zarokha.com';
        $secondaryEmail = $contactInformation?->show_email ? $contactInformation?->email_secondary : null;
        $whatsapp = $contactInformation?->show_whatsapp && $contactInformation?->whatsapp_number
            ? $contactInformation->whatsapp_number
            : $phone;
        $whatsappDigits = preg_replace('/\D+/', '', $whatsapp);
        $whatsappUrl = $whatsappDigits
            ? 'https://wa.me/' . $whatsappDigits . '?text=' . urlencode($contactInformation?->whatsapp_text ?? 'Hi Zarokha, I want to discuss an inquiry.')
            : null;
        $addressLines = collect([
            $contactInformation?->show_address ? $contactInformation?->address_line_1 : 'Zarokha Showroom',
            $contactInformation?->show_address ? $contactInformation?->address_line_2 : null,
            $contactInformation?->show_address
                ? trim(collect([$contactInformation?->city, $contactInformation?->state, $contactInformation?->postal_code])->filter()->join(', '))
                : 'Vadodara, Gujarat, 390001',
            $contactInformation?->show_address ? $contactInformation?->country : 'India',
        ])->filter()->values();
        $addressText = $addressLines->join(', ');
        $addressLabel = trim((string) ($contactInformation?->address_label ?? '')) ?: 'Address';
        $mapLinkUrl = trim((string) ($contactInformation?->map_link_url ?? '')) ?: 'https://maps.google.com/?q=' . urlencode($addressText);
        $mapEmbedUrl = trim((string) ($contactInformation?->map_embed_url ?? '')) ?: 'https://maps.google.com/maps?q=' . urlencode($addressText) . '&z=14&output=embed';
        $inquiryOptions = collect($contactInformation?->inquiry_type_options ?? [])
            ->map(fn ($option) => trim((string) $option))
            ->filter()
            ->values();
        if ($inquiryOptions->isEmpty()) {
            $inquiryOptions = collect(['Home furniture', 'Office furniture', 'Custom wooden art', 'Commercial project', 'General inquiry']);
        }
        $cmsSocialLinks = collect($contactInformation?->contact_social_links ?? [])
            ->map(fn ($link) => [
                'label' => trim((string) ($link['label'] ?? '')),
                'platform' => $normalizePlatform((string) ($link['label'] ?? 'social')),
                'url' => trim((string) ($link['url'] ?? '')),
            ])
            ->filter(fn ($link) => $link['label'] !== '' && $link['url'] !== '')
            ->values();
        $publicSocialLinks = ($socialLinks ?? collect())
            ->map(fn ($link) => [
                'label' => trim((string) ($link->label ?: ucfirst((string) $link->platform_key))),
                'platform' => $normalizePlatform((string) ($link->platform_key ?? $link->platform ?? 'social')),
                'url' => trim((string) $link->url),
            ])
            ->filter(fn ($link) => $link['label'] !== '' && $link['url'] !== '')
            ->values();
        $contactSocialLinks = $cmsSocialLinks->merge($publicSocialLinks);
        if ($whatsappUrl) {
            $contactSocialLinks = $contactSocialLinks
                ->push(['label' => 'WhatsApp', 'platform' => 'whatsapp', 'url' => $whatsappUrl])
                ->unique(fn ($link) => $link['platform'] . '|' . $link['url'])
                ->values();
        }
        if ($contactSocialLinks->isEmpty()) {
            $contactSocialLinks = collect([
                ['label' => 'Instagram', 'platform' => 'instagram', 'url' => 'https://instagram.com/zarokha'],
                ['label' => 'Facebook', 'platform' => 'facebook', 'url' => 'https://facebook.com/zarokha'],
                ['label' => 'WhatsApp', 'platform' => 'whatsapp', 'url' => $whatsappUrl ?: '#contact-inquiry-form'],
            ]);
        }
    @endphp

    <section class="contact-shell" aria-labelledby="contact-page-title">
        <div class="contact-shell__inner">
            <header class="contact-heading">
                <p class="contact-kicker">Connect with us</p>
                <h1 id="contact-page-title">{{ $pageTitle }}</h1>
                <p>{{ $pageIntro }}</p>
            </header>

            <div class="contact-layout">
                <form id="contact-inquiry-form" class="contact-form-panel" method="post" action="{{ route('public.contact.submit') }}" data-inquiry-submit-form>
                    @csrf
                    <input type="text" name="website" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true">

                    <div class="contact-form-panel__title">
                        <h2>{{ $formTitle }}</h2>
                        @if ($contactInformation?->form_helper_text)
                            <p>{{ $contactInformation->form_helper_text }}</p>
                        @endif
                    </div>

                    <div class="contact-form-grid">
                        <label class="contact-field">
                            <span>Name *</span>
                            <input name="name" value="{{ old('name') }}" required autocomplete="name">
                        </label>

                        <label class="contact-field">
                            <span>Email</span>
                            <input name="email" value="{{ old('email') }}" type="email" autocomplete="email">
                        </label>

                        <label class="contact-field">
                            <span>Phone Number *</span>
                            <input name="phone" value="{{ old('phone') }}" required autocomplete="tel">
                        </label>

                        <label class="contact-field">
                            <span>Inquiry Type *</span>
                            <select name="subject" required>
                                <option value="">Select an inquiry type</option>
                                @foreach ($inquiryOptions as $subjectOption)
                                    <option value="{{ $subjectOption }}" @selected(old('subject') === $subjectOption)>{{ $subjectOption }}</option>
                                @endforeach
                            </select>
                        </label>

                        <label class="contact-field contact-field--full">
                            <span>Message *</span>
                            <textarea name="message" rows="7" required>{{ old('message') }}</textarea>
                        </label>

                        <input type="hidden" name="whatsapp_number" value="{{ old('whatsapp_number') }}">
                    </div>

                    @if ($errors->any())
                        <div class="form-errors contact-form-panel__errors" role="alert">
                            <p>Please review the highlighted fields and try again.</p>
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <button class="contact-submit" type="submit">{{ $submitLabel }}</button>
                </form>

                <aside class="contact-details" aria-labelledby="contact-details-title">
                    <div class="contact-details__grid">
                        <section class="contact-detail-card contact-detail-card--intro" aria-labelledby="contact-details-title">
                            <div class="contact-detail-card__head contact-detail-card__head--stacked">
                                <p class="contact-kicker">Contact details</p>
                                <h2 id="contact-details-title">{{ $businessName }}</h2>
                            </div>
                            @if ($contactIntro !== '')
                                <p class="contact-details__intro">{{ $contactIntro }}</p>
                            @endif
                        </section>

                        <section class="contact-detail-card contact-detail-card--email" aria-labelledby="contact-email-title">
                            <div class="contact-detail-card__head">
                                <h3 id="contact-email-title">Email</h3>
                            </div>
                            <div class="contact-detail-card__body">
                                <div class="contact-detail-card__row">
                                    <a class="contact-detail-card__value" href="mailto:{{ $email }}">{{ $email }}</a>
                                    <a class="contact-detail-action" href="mailto:{{ $email }}">Email</a>
                                </div>
                                @if ($secondaryEmail)
                                    <a href="mailto:{{ $secondaryEmail }}">{{ $secondaryEmail }}</a>
                                @endif
                            </div>
                        </section>

                        <section class="contact-detail-card contact-detail-card--phone" aria-labelledby="contact-phone-title">
                            <div class="contact-detail-card__head">
                                <h3 id="contact-phone-title">Phone</h3>
                            </div>
                            <div class="contact-detail-card__body">
                                <div class="contact-detail-card__row">
                                    <a class="contact-detail-card__value contact-detail-card__value--nowrap" href="tel:{{ preg_replace('/\s+/', '', $phone) }}">{{ $phone }}</a>
                                    <div class="contact-detail-card__actions">
                                        <a class="contact-detail-action" href="tel:{{ preg_replace('/\s+/', '', $phone) }}">Call</a>
                                        @if ($whatsappUrl)
                                            <a class="contact-detail-action" href="{{ $whatsappUrl }}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                                        @endif
                                    </div>
                                </div>
                                @if ($secondaryPhone)
                                    <a href="tel:{{ preg_replace('/\s+/', '', $secondaryPhone) }}">{{ $secondaryPhone }}</a>
                                @endif
                            </div>
                        </section>

                        <section class="contact-detail-card contact-detail-card--social" aria-labelledby="contact-social-title">
                            <div class="contact-detail-card__head">
                                <h3 id="contact-social-title">Connect with us</h3>
                            </div>
                            <nav class="contact-social-list" aria-label="Social media">
                                @foreach ($contactSocialLinks->take(6) as $link)
                                    <a class="contact-social-list__item contact-social-list__item--{{ $link['platform'] }}" href="{{ $link['url'] }}" target="_blank" rel="noopener noreferrer" aria-label="{{ $link['label'] }}">
                                        <span class="contact-socials__icon-slot" data-social-icon="{{ $link['platform'] }}" aria-hidden="true"></span>
                                        <span class="contact-social-list__label">{{ $link['label'] }}</span>
                                    </a>
                                @endforeach
                            </nav>
                        </section>

                        <section class="contact-visit-card" aria-labelledby="contact-address-title">
                            <div class="contact-visit-card__body">
                                <div class="contact-address">
                                    <span class="contact-address__icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/>
                                            <circle cx="12" cy="10" r="2.6"/>
                                        </svg>
                                    </span>
                                    <div class="contact-address__content">
                                        <h3 id="contact-address-title">{{ $addressLabel }}</h3>
                                        <address>
                                            @foreach ($addressLines as $addressLine)
                                                {{ $addressLine }}@unless ($loop->last)<br>@endunless
                                            @endforeach
                                        </address>
                                    </div>
                                </div>
                            </div>

                            <div class="contact-visit-card__media">
                                <div class="contact-map-card">
                                    <iframe
                                        src="{{ $mapEmbedUrl }}"
                                        title="{{ $addressLabel }} map preview"
                                        loading="lazy"
                                        referrerpolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                    <a href="{{ $mapLinkUrl }}" target="_blank" rel="noopener noreferrer" aria-label="Open {{ $addressLabel }} in maps"></a>
                                </div>
                            </div>
                        </section>
                    </div>
                </aside>
            </div>
        </div>
    </section>

    <div class="inquiry-submit-overlay" data-inquiry-submit-overlay hidden aria-hidden="true">
        <div class="inquiry-submit-overlay__panel" role="status" aria-live="polite">
            <div class="inquiry-submit-overlay__mark">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p class="inquiry-submit-overlay__title">Submitting your inquiry</p>
            <p class="inquiry-submit-overlay__text">Please wait while we send your details.</p>
        </div>
    </div>

    <x-public.home.clients :clients="$clients" title="Our Clients" />
@endsection
