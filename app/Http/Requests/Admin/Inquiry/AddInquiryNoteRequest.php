<?php

namespace App\Http\Requests\Admin\Inquiry;

use App\Models\Inquiry;
use Illuminate\Foundation\Http\FormRequest;

class AddInquiryNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Inquiry $inquiry */
        $inquiry = $this->route('inquiry');

        return $this->user()?->can('addNote', $inquiry) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'note_body' => ['required', 'string', 'max:5000'],
        ];
    }
}
