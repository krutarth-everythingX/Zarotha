<?php

namespace App\Http\Requests\Admin\Inquiry;

use App\Models\Inquiry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInquiryStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Inquiry $inquiry */
        $inquiry = $this->route('inquiry');

        return $this->user()?->can('update', $inquiry) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['unread', 'read', 'replied', 'archived'])],
        ];
    }
}
