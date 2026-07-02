<?php

namespace App\Http\Requests\Admin\ProductGallery;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class AttachProductMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Product $product */
        $product = $this->route('product');

        return $this->user()?->can('update', $product) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'media_asset_id' => ['required', 'integer', 'exists:media_assets,id'],
            'alt_text_override' => ['nullable', 'string', 'max:255'],
        ];
    }
}
