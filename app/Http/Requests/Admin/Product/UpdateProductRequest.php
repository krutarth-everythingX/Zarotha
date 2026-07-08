<?php

namespace App\Http\Requests\Admin\Product;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => $this->input('slug') ?: str($this->input('name'))->slug()->toString(),
            'status' => $this->input('status', 'draft'),
            'is_featured' => $this->boolean('is_featured'),
            'is_best_selling' => $this->boolean('is_best_selling'),
            'is_latest' => $this->boolean('is_latest'),
            'robots_index' => $this->has('robots_index') ? $this->boolean('robots_index') : true,
            'robots_follow' => $this->has('robots_follow') ? $this->boolean('robots_follow') : true,
            'is_track_inventory' => $this->boolean('is_track_inventory'),
            'is_available_for_inquiry' => true,
            'show_price' => $this->has('show_price') ? $this->boolean('show_price') : false,
        ]);
    }

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
        /** @var Product $product */
        $product = $this->route('product');

        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:190'],
            'slug' => ['required', 'string', 'max:190', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('products', 'slug')->ignore($this->route('product'))],
            'short_description' => ['required', 'string', 'max:500'],
            'full_description' => ['required', 'string'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'material' => ['nullable', 'string', 'max:150'],
            'finish' => ['nullable', 'string', 'max:150'],
            'featured_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'is_featured' => ['required', 'boolean'],
            'is_best_selling' => ['required', 'boolean'],
            'is_latest' => ['required', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:320'],
            'og_image_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'canonical_url' => ['nullable', 'url', 'max:2048'],
            'robots_index' => ['required', 'boolean'],
            'robots_follow' => ['required', 'boolean'],

            // New strict rules
            'sku' => ['nullable', 'string', 'max:100'],
            'product_type' => ['nullable', 'string', 'max:100'],
            'wood_type' => ['nullable', 'string', 'max:100'],
            'style' => ['nullable', 'string', 'max:100'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'is_track_inventory' => ['required', 'boolean'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'availability' => ['nullable', 'string', 'max:100'],
            'is_available_for_inquiry' => ['required', 'boolean'],
            'show_price' => ['required', 'boolean'],
            'details' => ['nullable', 'array'],
            'details.*.title' => ['nullable', 'string', 'max:120'],
            'details.*.value' => ['nullable', 'string', 'max:500'],
            'gallery_images' => ['nullable', 'array', 'max:10'],
            'gallery_images.*' => ['integer', 'exists:media_assets,id'],
        ];
    }
}
