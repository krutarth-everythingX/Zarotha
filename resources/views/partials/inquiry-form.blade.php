@php
    $compact = $compact ?? false;
@endphp

<form class="inquiry-form" method="post" action="{{ $action }}" enctype="multipart/form-data" data-inquiry-submit-form>
    @csrf
    <input type="text" name="website" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true">
    @unless ($compact)
        <div class="section-heading">
            <p class="eyebrow">Inquiry</p>
            <h2>{{ isset($product) && $product ? 'Ask about ' . $product->name : 'Send an inquiry' }}</h2>
            <p>{{ $contactInformation?->form_helper_text ?? 'Visit us to view our collection, discuss ideas, and plan custom wooden work.' }}</p>
        </div>
    @endunless
    <div class="form-grid">
        <label>Full Name *<input name="name" value="{{ old('name') }}" required autocomplete="name"></label>
        <label>Email Address *<input name="email" value="{{ old('email') }}" type="email" required autocomplete="email"></label>
        <label>Phone Number *<input name="phone" value="{{ old('phone') }}" required autocomplete="tel"></label>
        <label>
            Inquiry Type *
            <input name="subject" value="{{ old('subject', isset($product) && $product ? 'Inquiry about ' . $product->name : '') }}" required>
        </label>
        <label>Project Location *<input name="project_location" value="{{ old('project_location') }}" required autocomplete="address-level2"></label>
        <label>State *<input name="project_state" value="{{ old('project_state') }}" required autocomplete="address-level1" pattern="[A-Za-z][A-Za-z .-]*" title="Use letters only for state name"></label>
        <label>Country *<input name="project_country" value="{{ old('project_country', 'India') }}" required autocomplete="country-name" pattern="[A-Za-z][A-Za-z .-]*" title="Use letters only for country name"></label>
        <div>
            Budget Range (Optional)
            <div class="budget-range-inputs">
                <label class="budget-range-input">
                    <span>Rs.</span>
                    <input
                        name="budget_range_start"
                        value="{{ old('budget_range_start') }}"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="1,00,000"
                    >
                </label>
                <span class="budget-range-separator">-</span>
                <label class="budget-range-input">
                    <span>Rs.</span>
                    <input
                        name="budget_range_end"
                        value="{{ old('budget_range_end') }}"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="3,00,000"
                    >
                </label>
            </div>
            <input type="hidden" name="budget_range" value="{{ old('budget_range') }}">
        </div>
        <label>Expected Project Start (Optional)<input name="expected_project_start" value="{{ old('expected_project_start') }}" type="date"></label>
        <label class="full">Message / Project Details *<textarea name="message" rows="5" required>{{ old('message') }}</textarea></label>
        <div class="full inquiry-upload" data-inquiry-upload>
            <span>Upload Images / Videos (Optional)</span>
            <label class="inquiry-upload__dropzone">
                <input name="uploaded_images[]" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" multiple data-inquiry-upload-input>
                <span class="inquiry-upload__button">Choose files</span>
            </label>
            <div class="inquiry-upload__preview" data-inquiry-upload-preview aria-live="polite"></div>
        </div>
        <input type="hidden" name="whatsapp_number" value="{{ old('whatsapp_number') }}">
        <label class="checkbox full"><input type="checkbox" name="consent_confirmed" value="1" required> <span>{{ $contactInformation?->consent_text ?? 'I consent to being contacted regarding my inquiry.' }}</span></label>
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
