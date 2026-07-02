<?php

namespace App\Http\Requests\Admin\Page;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'navigation_label' => ['nullable', 'string', 'max:100'],
            'intro_title' => ['nullable', 'string', 'max:255'],
            'intro_body' => ['nullable', 'string', 'max:2000'],
            'body_html' => ['nullable', 'string'],
            'hero_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'cta_label' => ['nullable', 'string', 'max:80'],
            'cta_url' => ['nullable', 'string', 'max:2048'],
            'effective_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:320'],
            'og_image_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'canonical_url' => ['nullable', 'url', 'max:2048'],
            'robots_index' => ['required', 'boolean'],
            'robots_follow' => ['required', 'boolean'],
        ];
    }
}
