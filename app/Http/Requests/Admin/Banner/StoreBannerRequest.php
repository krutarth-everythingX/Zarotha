<?php

namespace App\Http\Requests\Admin\Banner;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Product::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:100'],
            'headline' => ['required', 'string', 'max:255'],
            'body_text' => ['nullable', 'string', 'max:2000'],
            'primary_cta_label' => ['nullable', 'string', 'max:80'],
            'primary_cta_url' => ['nullable', 'string', 'max:2048'],
            'desktop_media_id' => ['required', 'integer', 'exists:media_assets,id'],
            'mobile_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:100000'],
            'is_active' => ['required', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ];
    }
}
