@extends('layouts.public')

@section('title', 'Contact | ' . config('app.name'))
@section('body_class', 'contact-page')

@section('content')
    @php
        $pageTitle = trim((string) ($contactInformation?->page_title ?? '')) ?: 'Contact Form';
        $pageIntro = trim((string) ($contactInformation?->page_intro ?? '')) ?: 'Feel free to contact us through Instagram, Facebook, or WhatsApp if you prefer.';
        $formTitle = trim((string) ($contactInformation?->form_title ?? '')) ?: 'Tell us about your project';
        $submitLabel = trim((string) ($contactInformation?->submit_label ?? '')) ?: 'Send now';
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
            ? 'https://wa.me/' . $whatsappDigits . '?text=' . urlencode($contactInformation?->whatsapp_text ?? 'Hi Zarokha, I want to discuss a custom project.')
            : null;
        $addressLines = collect([
            $contactInformation?->show_address ? $contactInformation?->address_line_1 : '123 Woodcrafters Lane',
            $contactInformation?->show_address ? $contactInformation?->address_line_2 : null,
            $contactInformation?->show_address
                ? trim(collect([$contactInformation?->city, $contactInformation?->state, $contactInformation?->postal_code])->filter()->join(', '))
                : 'Jaipur, Rajasthan',
            $contactInformation?->show_address ? $contactInformation?->country : 'India',
        ])->filter()->values();
        $addressText = $addressLines->join(', ');
        $locationKicker = trim((string) ($contactInformation?->location_kicker ?? '')) ?: 'Contact Us';
        $locationTitle = trim((string) ($contactInformation?->location_title ?? '')) ?: 'Get In Touch!';
        $locationBody = trim((string) ($contactInformation?->location_body ?? '')) ?: 'We are available to discuss custom wooden art, furniture, and interior project requirements.';
        $addressLabel = trim((string) ($contactInformation?->address_label ?? '')) ?: 'Workshop';
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
                'url' => trim((string) ($link['url'] ?? '')),
            ])
            ->filter(fn ($link) => $link['label'] !== '' && $link['url'] !== '')
            ->values();
        $contactSocialLinks = $cmsSocialLinks->isNotEmpty()
            ? $cmsSocialLinks
            : collect([
                ['label' => 'Instagram', 'url' => 'https://instagram.com/zarokha'],
                ['label' => 'Facebook', 'url' => 'https://facebook.com/zarokha'],
                ['label' => 'WhatsApp', 'url' => $whatsappUrl ?: '#contact-inquiry-form'],
            ]);
    @endphp

    <section class="contact-form-section" aria-labelledby="contact-page-title">
        <div class="contact-form-section__inner">
            <div class="contact-form-section__heading">
                <h1 id="contact-page-title">{{ $pageTitle }}</h1>
                <p>{{ $pageIntro }}</p>
            </div>

            <form id="contact-inquiry-form" class="contact-form-panel" method="post" action="{{ route('public.contact.submit') }}">
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
                        <span>Your Name*</span>
                        <input name="name" value="{{ old('name') }}" required autocomplete="name">
                    </label>

                    <label class="contact-field">
                        <span>Your Email*</span>
                        <input name="email" value="{{ old('email') }}" type="email" required autocomplete="email">
                    </label>

                    <label class="contact-field">
                        <span>Phone Number*</span>
                        <input name="phone" value="{{ old('phone') }}" required autocomplete="tel">
                    </label>

                    <label class="contact-field contact-field--wide">
                        <span>Company Name</span>
                        <input name="company_name" value="{{ old('company_name') }}" autocomplete="organization">
                    </label>

                    <label class="contact-field contact-field--wide contact-field--select">
                        <span>Subject*</span>
                        <select name="subject" required>
                            <option value="">Select an inquiry type</option>
                            @foreach ($inquiryOptions as $subjectOption)
                                <option value="{{ $subjectOption }}" @selected(old('subject') === $subjectOption)>{{ $subjectOption }}</option>
                            @endforeach
                        </select>
                    </label>

                    <label class="contact-field contact-field--full">
                        <span>Message</span>
                        <textarea name="message" rows="6" required>{{ old('message') }}</textarea>
                    </label>

                    <input type="hidden" name="whatsapp_number" value="{{ old('whatsapp_number') }}">

                    <label class="contact-consent contact-field--full">
                        <input type="checkbox" name="consent_confirmed" value="1" required @checked(old('consent_confirmed'))>
                        <span>{{ $contactInformation?->consent_text ?? 'I consent to being contacted about this inquiry.' }}</span>
                    </label>
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
        </div>
    </section>

    <section class="contact-location-section" aria-labelledby="contact-location-title">
        <div class="contact-location-section__inner">
            <div class="contact-map">
                <iframe
                    src="{{ $mapEmbedUrl }}"
                    title="{{ $addressLabel }} map"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                ></iframe>
            </div>

            <div class="contact-location">
                <p class="contact-kicker">{{ $locationKicker }}</p>
                <h2 id="contact-location-title">{{ $locationTitle }}</h2>
                <p class="contact-location__intro">{{ $locationBody }}</p>

                <div class="contact-info-list">
                    <article class="contact-info-item">
                        <span class="contact-info-item__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M12 21s7-5.2 7-12A7 7 0 0 0 5 9c0 6.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>
                        </span>
                        <div>
                            <h3>{{ $addressLabel }}</h3>
                            <address>
                                @foreach ($addressLines as $addressLine)
                                    {{ $addressLine }}@unless ($loop->last)<br>@endunless
                                @endforeach
                            </address>
                            <a href="{{ $mapLinkUrl }}" target="_blank" rel="noopener noreferrer">Open in maps</a>
                        </div>
                    </article>

                    <article class="contact-info-item">
                        <span class="contact-info-item__icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"/><path d="m4 7 8 6 8-6"/></svg>
                        </span>
                        <div>
                            <h3>Call Us / Email</h3>
                            <a href="tel:{{ preg_replace('/\s+/', '', $phone) }}">{{ $phone }}</a>
                            @if ($secondaryPhone)
                                <a href="tel:{{ preg_replace('/\s+/', '', $secondaryPhone) }}">{{ $secondaryPhone }}</a>
                            @endif
                            <a href="mailto:{{ $email }}">{{ $email }}</a>
                            @if ($secondaryEmail)
                                <a href="mailto:{{ $secondaryEmail }}">{{ $secondaryEmail }}</a>
                            @endif
                        </div>
                    </article>
                </div>

                <div class="contact-socials" aria-label="Social links">
                    @foreach ($contactSocialLinks as $link)
                        <a href="{{ $link['url'] }}" target="_blank" rel="noopener noreferrer">{{ $link['label'] }}</a>
                    @endforeach
                </div>
            </div>
        </div>
    </section>

    <x-public.home.clients :clients="$clients" title="Our Clients" />
@endsection
