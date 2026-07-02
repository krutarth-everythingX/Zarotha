<?php

namespace App\Http\Requests\Admin\ProductGallery;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class ReorderProductMediaRequest extends FormRequest
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
            'media' => ['required', 'array', 'min:1'],
            'media.*.id' => ['required', 'integer', 'distinct', 'exists:media_assets,id'],
            'media.*.sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
