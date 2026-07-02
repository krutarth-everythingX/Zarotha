<?php

namespace App\Http\Requests\Admin\Redirect;

use App\Models\Redirect;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRedirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Redirect $redirect */
        $redirect = $this->route('redirect');

        return $this->user()?->can('update', $redirect) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Redirect $redirect */
        $redirect = $this->route('redirect');

        return [
            'source_path' => ['required', 'string', 'max:2048', 'starts_with:/', Rule::unique('redirects', 'source_path')->ignore($redirect->id), 'different:target_path'],
            'target_path' => ['required', 'string', 'max:2048', 'starts_with:/', 'different:source_path'],
            'redirect_type' => ['required', Rule::in(['slug_history', 'manual'])],
            'source_entity_type' => ['nullable', Rule::in(['product', 'page', 'category', 'custom'])],
            'source_entity_id' => ['nullable', 'integer', 'min:1'],
            'http_status' => ['required', Rule::in([301, 302])],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
