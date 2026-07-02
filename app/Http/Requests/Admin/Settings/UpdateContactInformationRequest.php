<?php

namespace App\Http\Requests\Admin\Settings;

use App\Models\ContactInformation;
use Illuminate\Foundation\Http\FormRequest;

class UpdateContactInformationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $contactInformation = ContactInformation::query()->firstOrNew(['id' => 1]);

        return $this->user()?->can('update', $contactInformation) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'business_name' => ['nullable', 'string', 'max:150'],
            'phone_primary' => ['nullable', 'string', 'max:50'],
            'phone_secondary' => ['nullable', 'string', 'max:50'],
            'email_primary' => ['nullable', 'email', 'max:190'],
            'email_secondary' => ['nullable', 'email', 'max:190'],
            'whatsapp_number' => ['nullable', 'string', 'max:50'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'show_address' => ['required', 'boolean'],
            'show_phone' => ['required', 'boolean'],
            'show_email' => ['required', 'boolean'],
            'show_whatsapp' => ['required', 'boolean'],
            'contact_intro' => ['nullable', 'string'],
            'form_helper_text' => ['nullable', 'string'],
            'success_message' => ['nullable', 'string'],
            'consent_text' => ['nullable', 'string'],
        ];
    }
}
