<?php

namespace App\Http\Requests\Admin\Inquiry;

use App\Models\Inquiry;
use Illuminate\Foundation\Http\FormRequest;

class AssignInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Inquiry $inquiry */
        $inquiry = $this->route('inquiry');

        return $this->user()?->can('assign', $inquiry) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'assigned_user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
