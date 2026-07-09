@php
    $compact = $compact ?? false;
    $inquiryOptions = collect($contactInformation?->inquiry_type_options ?? [])
        ->map(fn ($option) => trim((string) $option))
        ->filter()
        ->values();

    if ($inquiryOptions->isEmpty()) {
        $inquiryOptions = collect(['Home furniture', 'Office furniture', 'Custom wooden art', 'Commercial project', 'General inquiry']);
    }

    $defaultSubject = isset($product) && $product ? 'Inquiry about ' . $product->name : '';
@endphp

<form class="inquiry-form" method="post" action="{{ $action }}" data-inquiry-submit-form>
    @csrf
    <input type="text" name="website" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true">
    @unless ($compact)
        <div class="section-heading">
            <p class="eyebrow">Inquiry</p>
            <h2>{{ isset($product) && $product ? 'Ask about ' . $product->name : 'Send an inquiry' }}</h2>
            <p>{{ $contactInformation?->form_helper_text ?? 'Share your inquiry and we will get back to you shortly.' }}</p>
        </div>
    @endunless
    <div class="form-grid">
        <label>Full Name *<input name="name" value="{{ old('name') }}" required autocomplete="name"></label>
        <label>Email Address<input name="email" value="{{ old('email') }}" type="email" autocomplete="email"></label>
        <label>Phone Number *<input name="phone" value="{{ old('phone') }}" required autocomplete="tel"></label>
        <label>
            Inquiry Type *
            @if ($defaultSubject)
                <input name="subject" value="{{ old('subject', $defaultSubject) }}" required>
            @else
                <select name="subject" required>
                    <option value="">Select an inquiry type</option>
                    @foreach ($inquiryOptions as $subjectOption)
                        <option value="{{ $subjectOption }}" @selected(old('subject') === $subjectOption)>{{ $subjectOption }}</option>
                    @endforeach
                </select>
            @endif
        </label>
        <label class="full">Message *<textarea name="message" rows="5" required>{{ old('message') }}</textarea></label>
        <input type="hidden" name="whatsapp_number" value="{{ old('whatsapp_number') }}">
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
    <button class="button button-primary" type="submit">Send Inquiry</button>
</form>
