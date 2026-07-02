<?php

namespace App\Http\Requests\Admin\Homepage;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHomepageRequest extends FormRequest
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
            'hero.heading' => ['required', 'string', 'max:255'],
            'hero.subtext' => ['nullable', 'string', 'max:1200'],
            'hero.desktop_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'hero.mobile_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'hero.primary_button_label' => ['nullable', 'string', 'max:80'],
            'hero.primary_button_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'hero.secondary_button_label' => ['nullable', 'string', 'max:80'],
            'hero.secondary_button_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'hero.overlay_opacity' => ['required', 'integer', 'min:0', 'max:80'],
            'hero.text_theme' => ['required', Rule::in(['light', 'dark'])],
            'hero.is_visible' => ['required', 'boolean'],
            'hero.items' => ['nullable', 'array', 'max:10'],
            'hero.items.*.id' => ['nullable', 'integer', 'exists:homepage_section_banners,id'],
            'hero.items.*.imageMediaId' => ['nullable', 'integer', 'exists:media_assets,id'],
            'hero.items.*.sortOrder' => ['required', 'integer', 'min:0', 'max:100000'],
            'hero.items.*.isVisible' => ['required', 'boolean'],

            'floating_products' => ['required', 'array', 'size:4'],
            'floating_products.*.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'floating_products.*.image_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'floating_products.*.alt_text' => ['nullable', 'string', 'max:255'],
            'floating_products.*.position' => ['required', Rule::in(['top-left', 'top-right', 'bottom-left', 'bottom-right'])],
            'floating_products.*.tilt_preset' => ['required', Rule::in(['soft', 'medium', 'full'])],
            'floating_products.*.tap_label' => ['nullable', 'string', 'max:40'],
            'floating_products.*.is_visible' => ['required', 'boolean'],

            'featured.title' => ['nullable', 'string', 'max:255'],
            'featured.subtitle' => ['nullable', 'string', 'max:1200'],
            'featured.view_all_label' => ['nullable', 'string', 'max:80'],
            'featured.view_all_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'featured.is_visible' => ['required', 'boolean'],
            'featured.products' => ['nullable', 'array', 'max:10'],
            'featured.products.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],

            'latest.title' => ['nullable', 'string', 'max:255'],
            'latest.subtitle' => ['nullable', 'string', 'max:1200'],
            'latest.max_items' => ['required', 'integer', 'min:1', 'max:10'],
            'latest.view_all_label' => ['nullable', 'string', 'max:80'],
            'latest.view_all_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'latest.is_visible' => ['required', 'boolean'],

            'quickInquiry.title' => ['nullable', 'string', 'max:255'],
            'quickInquiry.subtitle' => ['nullable', 'string', 'max:1200'],
            'quickInquiry.button_label' => ['nullable', 'string', 'max:80'],
            'quickInquiry.button_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'quickInquiry.background_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'quickInquiry.background_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'quickInquiry.is_visible' => ['required', 'boolean'],
            'quickInquiry.items' => ['nullable', 'array', 'max:10'],
            'quickInquiry.items.*.id' => ['nullable', 'integer', 'exists:homepage_section_banners,id'],
            'quickInquiry.items.*.imageMediaId' => ['nullable', 'integer', 'exists:media_assets,id'],
            'quickInquiry.items.*.sortOrder' => ['required', 'integer', 'min:0', 'max:100000'],
            'quickInquiry.items.*.isVisible' => ['required', 'boolean'],

            'settings.whatsapp_text' => ['nullable', 'string', 'max:255'],
            'settings.whatsapp_number' => ['nullable', 'string', 'max:50'],
            'settings.show_social_links_on_hero' => ['required', 'boolean'],
        ];
    }
}
