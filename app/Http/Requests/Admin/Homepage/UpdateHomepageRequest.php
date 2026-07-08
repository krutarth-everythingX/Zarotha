<?php

namespace App\Http\Requests\Admin\Homepage;

use App\Models\Product;
use App\Support\YoutubeVideo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateHomepageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Product::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('quick_inquiry') && ! $this->has('quickInquiry')) {
            $quickInquiry = $this->input('quick_inquiry', []);

            $this->merge([
                'quickInquiry' => [
                    'title' => $quickInquiry['title'] ?? $quickInquiry['heading'] ?? null,
                    'subtitle' => $quickInquiry['subtitle'] ?? $quickInquiry['subtext'] ?? null,
                    'button_label' => $quickInquiry['button_label'] ?? null,
                    'button_url' => $quickInquiry['button_url'] ?? null,
                    'background_media_id' => $quickInquiry['background_media_id'] ?? null,
                    'background_color' => $quickInquiry['background_color'] ?? null,
                    'is_visible' => $quickInquiry['is_visible'] ?? true,
                    'items' => $quickInquiry['items'] ?? [],
                ],
            ]);
        }

        $normalized = [];

        if (is_array($this->input('hero'))) {
            $hero = $this->input('hero');
            $hero['items'] = $this->filledBannerItems($hero['items'] ?? []);
            $normalized['hero'] = $hero;
        }

        if (is_array($this->input('quickInquiry'))) {
            $quickInquiry = $this->input('quickInquiry');
            $quickInquiry['items'] = $this->filledBannerItems($quickInquiry['items'] ?? []);
            $normalized['quickInquiry'] = $quickInquiry;
        }

        if (is_array($this->input('turnkey'))) {
            $turnkey = $this->input('turnkey');
            $turnkey['items'] = $this->filledContentItems($turnkey['items'] ?? []);
            $normalized['turnkey'] = $turnkey;
        }

        if (is_array($this->input('aboutPreview'))) {
            $aboutPreview = $this->input('aboutPreview');
            $aboutPreview['points'] = $this->filledContentItems($aboutPreview['points'] ?? []);
            $normalized['aboutPreview'] = $aboutPreview;
        }

        if (is_array($this->input('industryStats'))) {
            $industryStats = $this->input('industryStats');
            $industryStats['items'] = $this->filledContentItems($industryStats['items'] ?? []);
            $normalized['industryStats'] = $industryStats;
        }

        if (is_array($this->input('settings'))) {
            $settings = $this->input('settings');
            $settings['show_whatsapp'] = $settings['show_whatsapp'] ?? true;
            $normalized['settings'] = $settings;
        }

        if ($normalized !== []) {
            $this->merge($normalized);
        }
    }

    /**
     * @param  mixed  $items
     * @return array<int, array<string, mixed>>
     */
    private function filledBannerItems(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        return array_values(array_filter(array_map(function (mixed $item): ?array {
            if (! is_array($item)) {
                return null;
            }

            $imageMediaId = $item['imageMediaId'] ?? $item['image_media_id'] ?? null;

            if ($this->blankValue($imageMediaId)) {
                return null;
            }

            $item['imageMediaId'] = $imageMediaId;
            $item['sortOrder'] = $item['sortOrder'] ?? $item['sort_order'] ?? 0;
            $item['isVisible'] = $item['isVisible'] ?? $item['is_visible'] ?? true;

            return $item;
        }, $items)));
    }

    /**
     * @param  mixed  $items
     * @return array<int, array<string, mixed>>
     */
    private function filledContentItems(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        return array_values(array_filter($items, fn (mixed $item): bool => is_array($item)
            && (! $this->blankValue($item['heading'] ?? null) || ! $this->blankValue($item['body_text'] ?? null))));
    }

    private function blankValue(mixed $value): bool
    {
        return $value === null || (is_string($value) && trim($value) === '');
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

            'turnkey' => ['sometimes', 'array'],
            'turnkey.eyebrow' => ['nullable', 'string', 'max:120'],
            'turnkey.title' => ['nullable', 'string', 'max:255'],
            'turnkey.subtitle' => ['nullable', 'string', 'max:1200'],
            'turnkey.button_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'turnkey.is_visible' => ['required_with:turnkey', 'boolean'],
            'turnkey.items' => ['nullable', 'array', 'max:8'],
            'turnkey.items.*.id' => ['nullable', 'integer', 'exists:why_choose_us_items,id'],
            'turnkey.items.*.heading' => ['required', 'string', 'max:150'],
            'turnkey.items.*.body_text' => ['nullable', 'string', 'max:1200'],
            'turnkey.items.*.sort_order' => ['required', 'integer', 'min:0', 'max:100000'],
            'turnkey.items.*.is_active' => ['required', 'boolean'],

            'aboutPreview' => ['sometimes', 'array'],
            'aboutPreview.eyebrow' => ['nullable', 'string', 'max:120'],
            'aboutPreview.title' => ['nullable', 'string', 'max:255'],
            'aboutPreview.subtitle' => ['nullable', 'string', 'max:1200'],
            'aboutPreview.body' => ['nullable', 'string', 'max:2000'],
            'aboutPreview.primary_button_label' => ['nullable', 'string', 'max:80'],
            'aboutPreview.primary_button_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'aboutPreview.secondary_button_label' => ['nullable', 'string', 'max:80'],
            'aboutPreview.secondary_button_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'aboutPreview.background_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'aboutPreview.is_visible' => ['required_with:aboutPreview', 'boolean'],
            'aboutPreview.points' => ['nullable', 'array', 'max:8'],
            'aboutPreview.points.*.id' => ['nullable', 'integer', 'exists:why_choose_us_items,id'],
            'aboutPreview.points.*.heading' => ['required', 'string', 'max:150'],
            'aboutPreview.points.*.body_text' => ['nullable', 'string', 'max:1200'],
            'aboutPreview.points.*.sort_order' => ['required', 'integer', 'min:0', 'max:100000'],
            'aboutPreview.points.*.is_active' => ['required', 'boolean'],

            'industryStats' => ['sometimes', 'array'],
            'industryStats.title' => ['nullable', 'string', 'max:255'],
            'industryStats.highlight' => ['nullable', 'string', 'max:120'],
            'industryStats.subtitle' => ['nullable', 'string', 'max:1200'],
            'industryStats.body' => ['nullable', 'string', 'max:1200'],
            'industryStats.contact_label' => ['nullable', 'string', 'max:80'],
            'industryStats.contact_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'industryStats.more_label' => ['nullable', 'string', 'max:80'],
            'industryStats.more_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^\s*javascript:/i'],
            'industryStats.is_visible' => ['required_with:industryStats', 'boolean'],
            'industryStats.items' => ['nullable', 'array', 'max:8'],
            'industryStats.items.*.id' => ['nullable', 'integer', 'exists:why_choose_us_items,id'],
            'industryStats.items.*.heading' => ['required', 'string', 'max:150'],
            'industryStats.items.*.body_text' => ['required', 'string', 'max:1200'],
            'industryStats.items.*.sort_order' => ['required', 'integer', 'min:0', 'max:100000'],
            'industryStats.items.*.is_active' => ['required', 'boolean'],

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
            'quickInquiry.items' => ['nullable', 'array', 'max:3'],
            'quickInquiry.items.*.id' => ['nullable', 'integer', 'exists:homepage_section_banners,id'],
            'quickInquiry.items.*.imageMediaId' => ['nullable', 'integer', 'exists:media_assets,id'],
            'quickInquiry.items.*.sortOrder' => ['required', 'integer', 'min:0', 'max:100000'],
            'quickInquiry.items.*.isVisible' => ['required', 'boolean'],

            'settings.show_whatsapp' => ['required', 'boolean'],
            'settings.whatsapp_text' => ['nullable', 'string', 'max:255'],
            'settings.whatsapp_number' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $turnkeyVideo = $this->input('turnkey.button_url');

            if (is_string($turnkeyVideo) && trim($turnkeyVideo) !== '' && ! YoutubeVideo::isYoutubeUrl($turnkeyVideo)) {
                $validator->errors()->add('turnkey.button_url', 'The Turnkey video must be a YouTube URL.');
            }
        });
    }
}
