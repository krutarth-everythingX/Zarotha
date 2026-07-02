<?php

namespace App\Http\Requests\Admin\Homepage;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHomepageSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', Product::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'section_title' => ['nullable', 'string', 'max:255'],
            'section_intro' => ['nullable', 'string', 'max:2000'],
            'cta_label' => ['nullable', 'string', 'max:80'],
            'cta_url' => ['nullable', 'string', 'max:2048'],
            'source_mode' => ['required', Rule::in(['manual', 'editorial_flag', 'publish_date', 'disabled'])],
            'background_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'mobile_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'max_items' => ['nullable', 'integer', 'min:1', 'max:24'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:100000'],
            'is_visible' => ['required', 'boolean'],
        ];
    }
}
