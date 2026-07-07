<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class SubmitInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $start = $this->normalizeBudgetValue($this->input('budget_range_start'));
        $end = $this->normalizeBudgetValue($this->input('budget_range_end'));

        $budgetRange = null;

        if ($start !== null && $end !== null) {
            $budgetRange = sprintf('Rs. %s - Rs. %s', $start, $end);
        }

        $this->merge([
            'budget_range_start' => $start,
            'budget_range_end' => $end,
            'budget_range' => $budgetRange,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'phone' => ['required', 'string', 'max:50'],
            'company_name' => ['nullable', 'string', 'max:150'],
            'whatsapp_number' => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'max:255'],
            'project_location' => ['required', 'string', 'max:190'],
            'project_state' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z][A-Za-z .-]*$/'],
            'project_country' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z][A-Za-z .-]*$/'],
            'budget_range_start' => ['nullable', 'regex:/^\d{1,3}(,\d{2,3})*$/', 'required_with:budget_range_end'],
            'budget_range_end' => ['nullable', 'regex:/^\d{1,3}(,\d{2,3})*$/', 'required_with:budget_range_start'],
            'budget_range' => ['nullable', 'string', 'max:120'],
            'expected_project_start' => ['nullable', 'date', 'after_or_equal:today'],
            'message' => ['required', 'string', 'max:5000'],
            'uploaded_images' => ['nullable', 'array', 'max:10'],
            'uploaded_images.*' => ['file', 'mimes:jpg,jpeg,png,webp,mp4,mov,webm', 'max:20480'],
            'consent_confirmed' => ['accepted'],
            'website' => ['nullable', 'prohibited'],
            'utm_source' => ['nullable', 'string', 'max:100'],
            'utm_medium' => ['nullable', 'string', 'max:100'],
            'utm_campaign' => ['nullable', 'string', 'max:150'],
            'utm_term' => ['nullable', 'string', 'max:150'],
            'utm_content' => ['nullable', 'string', 'max:150'],
        ];
    }

    private function normalizeBudgetValue(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $value);

        if ($digits === null || $digits === '') {
            return null;
        }

        return $this->formatIndianNumber($digits);
    }

    private function formatIndianNumber(string $digits): string
    {
        $digits = ltrim($digits, '0');

        if ($digits === '') {
            return '0';
        }

        if (strlen($digits) <= 3) {
            return $digits;
        }

        $lastThree = substr($digits, -3);
        $remaining = substr($digits, 0, -3);
        $parts = [];

        while (strlen($remaining) > 2) {
            array_unshift($parts, substr($remaining, -2));
            $remaining = substr($remaining, 0, -2);
        }

        if ($remaining !== '') {
            array_unshift($parts, $remaining);
        }

        return implode(',', $parts).','.$lastThree;
    }
}
