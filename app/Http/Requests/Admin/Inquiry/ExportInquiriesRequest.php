<?php

namespace App\Http\Requests\Admin\Inquiry;

use App\Models\Inquiry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExportInquiriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('export', Inquiry::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['unread', 'read', 'replied', 'archived'])],
            'assigned_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'source_page_key' => ['nullable', 'string', 'max:50'],
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date', 'after_or_equal:from_date'],
            'search' => ['nullable', 'string', 'max:190'],
        ];
    }
}
