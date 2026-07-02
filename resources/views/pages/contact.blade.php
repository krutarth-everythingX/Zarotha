@extends('layouts.public')

@section('title', 'Contact | ' . config('app.name'))
@section('body_class', 'contact-page')

@section('content')
    @php
        $phone = $contactInformation?->show_phone && $contactInformation?->phone_primary
            ? $contactInformation->phone_primary
            : '+91 98765 43210';
        $email = $contactInformation?->show_email && $contactInformation?->email_primary
            ? $contactInformation->email_primary
            : 'craft@zarokha.art';
        $whatsapp = $contactInformation?->show_whatsapp && $contactInformation?->whatsapp_number
            ? $contactInformation->whatsapp_number
            : $phone;
        $whatsappUrl = 'https://wa.me/' . preg_replace('/\D+/', '', $whatsapp);
        $addressParts = collect([
            $contactInformation?->show_address ? $contactInformation?->address_line_1 : '34 Heritage Lane, Alkapuri',
            $contactInformation?->show_address ? $contactInformation?->address_line_2 : null,
            $contactInformation?->show_address
                ? trim(collect([$contactInformation?->city, $contactInformation?->state, $contactInformation?->postal_code])->filter()->join(', '))
                : 'Vadodara, Gujarat 390007',
            $contactInformation?->show_address ? $contactInformation?->country : 'India',
        ])->filter();
    @endphp

    <section class="contact-editorial" aria-labelledby="contact-page-title">
        <div class="contact-editorial__frame" aria-hidden="true"></div>

        <aside class="contact-editorial__details">
            <h1 id="contact-page-title">Connect</h1>

            <div class="contact-editorial__block">
                <p class="contact-editorial__kicker">Atelier & Workshop</p>
                <address>
                    @foreach ($addressParts as $addressLine)
                        {{ $addressLine }}@unless ($loop->last)<br>@endunless
                    @endforeach
                </address>
            </div>

            <div class="contact-editorial__block">
                <a class="contact-editorial__email" href="mailto:{{ $email }}">{{ $email }}</a>
                <div class="contact-editorial__phone-row">
                    <a href="tel:{{ preg_replace('/\s+/', '', $phone) }}">{{ $phone }}</a>
                    <a class="contact-editorial__whatsapp" href="{{ $whatsappUrl }}" aria-label="Start a WhatsApp inquiry">
                        <span aria-hidden="true"></span>
                        WhatsApp
                    </a>
                </div>
            </div>
        </aside>

        <form id="contact-inquiry-form" class="contact-commission-form" method="post" action="{{ route('public.contact.submit') }}">
            @csrf
            <input type="text" name="website" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true">

            <h2>Start a Commission</h2>

            <div class="contact-commission-form__grid">
                <label class="contact-field contact-field--full">
                    <span>Full Name</span>
                    <input name="name" value="{{ old('name') }}" required autocomplete="name">
                </label>

                <label class="contact-field">
                    <span>Email Address</span>
                    <input name="email" value="{{ old('email') }}" type="email" required autocomplete="email">
                </label>

                <label class="contact-field">
                    <span>Phone</span>
                    <input name="phone" value="{{ old('phone') }}" required autocomplete="tel">
                </label>

                <label class="contact-field contact-field--full contact-field--select">
                    <span>Nature of Inquiry</span>
                    <select name="subject">
                        <option value="">Select an inquiry type</option>
                        @foreach (['Custom Design', 'Product Inquiry', 'Studio Visit', 'Trade / Hospitality', 'General Inquiry'] as $subjectOption)
                            <option value="{{ $subjectOption }}" @selected(old('subject') === $subjectOption)>{{ $subjectOption }}</option>
                        @endforeach
                    </select>
                </label>

                <label class="contact-field contact-field--full">
                    <span>Project Details</span>
                    <textarea name="message" rows="5" required>{{ old('message') }}</textarea>
                </label>

                <input type="hidden" name="whatsapp_number" value="{{ old('whatsapp_number') }}">

                <label class="contact-consent contact-field--full">
                    <input type="checkbox" name="consent_confirmed" value="1" required @checked(old('consent_confirmed'))>
                    <span>{{ $contactInformation?->consent_text ?? 'I consent to being contacted about this inquiry.' }}</span>
                </label>
            </div>

            @if ($errors->any())
                <div class="form-errors contact-commission-form__errors" role="alert">
                    <p>Please review the highlighted fields and try again.</p>
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <button class="contact-submit" type="submit">
                Submit Inquiry
                <span aria-hidden="true"></span>
            </button>
        </form>
    </section>
@endsection
