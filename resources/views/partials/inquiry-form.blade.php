@php
    $compact = $compact ?? false;
@endphp

<form class="inquiry-form" method="post" action="{{ $action }}">
    @csrf
    <input type="text" name="website" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true">
    @unless ($compact)
        <div class="section-heading">
            <p class="eyebrow">Inquiry</p>
            <h2>{{ isset($product) && $product ? 'Ask about ' . $product->name : 'Send an inquiry' }}</h2>
            <p>{{ $contactInformation?->form_helper_text ?? 'Share your question and the team can respond through the configured inquiry workflow.' }}</p>
        </div>
    @endunless
    <div class="form-grid">
        <label>Name<input name="name" value="{{ old('name') }}" required></label>
        <label>Email<input name="email" value="{{ old('email') }}" type="email" required></label>
        <label>Phone<input name="phone" value="{{ old('phone') }}" required></label>
        <label>WhatsApp<input name="whatsapp_number" value="{{ old('whatsapp_number') }}"></label>
        <label class="full">Subject<input name="subject" value="{{ old('subject', isset($product) && $product ? 'Inquiry about ' . $product->name : '') }}"></label>
        <label class="full">Message<textarea name="message" rows="5" required>{{ old('message') }}</textarea></label>
        <label class="checkbox full"><input type="checkbox" name="consent_confirmed" value="1" required> <span>{{ $contactInformation?->consent_text ?? 'I consent to being contacted about this inquiry.' }}</span></label>
    </div>
    @if ($errors->any())
        <div class="form-errors" role="alert">
            <p>Please review the highlighted fields and try again.</p>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <button class="button button-primary" type="submit">Submit inquiry</button>
</form>
