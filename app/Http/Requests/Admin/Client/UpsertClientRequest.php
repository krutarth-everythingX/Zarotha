<?php

namespace App\Http\Requests\Admin\Client;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class UpsertClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Product::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'website_url' => ['nullable', 'required_without:logo_media_id', 'url:http,https', 'max:2048'],
            'logo_media_id' => ['nullable', 'required_without:website_url', 'integer', 'exists:media_assets,id'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
