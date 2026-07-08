<?php

namespace App\Http\Requests\Admin\Page;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Product::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->route('pageSlug') !== 'about-us') {
            return;
        }

        $aboutDetails = $this->input('about_details', []);

        if (is_array($aboutDetails)) {
            unset(
                $aboutDetails['catalog_media_id'],
                $aboutDetails['gallery_media_ids'],
                $aboutDetails['certificate_media_id'],
                $aboutDetails['strength_media_id'],
            );
        }

        $this->merge([
            'about_details' => is_array($aboutDetails) ? $aboutDetails : [],
            'og_image_media_id' => null,
        ]);
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
            'about_details' => ['nullable', 'array'],
            'about_details.hero_kicker' => ['nullable', 'string', 'max:80'],
            'about_details.hero_note' => ['nullable', 'string', 'max:255'],
            'about_details.video_url' => ['nullable', 'url:http,https', 'max:2048'],
            'about_details.video_title' => ['nullable', 'string', 'max:160'],
            'about_details.who_we_are_kicker' => ['nullable', 'string', 'max:80'],
            'about_details.who_we_are_title' => ['nullable', 'string', 'max:255'],
            'about_details.who_we_are_body' => ['nullable', 'string', 'max:2000'],
            'about_details.why_title' => ['nullable', 'string', 'max:160'],
            'about_details.why_items' => ['nullable', 'array', 'max:12'],
            'about_details.why_items.*' => ['nullable', 'string', 'max:180'],
            'about_details.catalog_title' => ['nullable', 'string', 'max:160'],
            'about_details.catalog_body' => ['nullable', 'string', 'max:255'],
            'about_details.vision_title' => ['nullable', 'string', 'max:160'],
            'about_details.vision_body' => ['nullable', 'string', 'max:1200'],
            'about_details.mission_title' => ['nullable', 'string', 'max:160'],
            'about_details.mission_body' => ['nullable', 'string', 'max:1200'],
            'about_details.aim_title' => ['nullable', 'string', 'max:160'],
            'about_details.aim_body' => ['nullable', 'string', 'max:600'],
            'about_details.stats' => ['nullable', 'array', 'max:4'],
            'about_details.stats.*.value' => ['nullable', 'string', 'max:40'],
            'about_details.stats.*.label' => ['nullable', 'string', 'max:120'],
            'about_details.strength_kicker' => ['nullable', 'string', 'max:80'],
            'about_details.strength_title' => ['nullable', 'string', 'max:160'],
            'about_details.strength_body' => ['nullable', 'string', 'max:1600'],
            'about_details.skills' => ['nullable', 'array', 'max:4'],
            'about_details.skills.*.label' => ['nullable', 'string', 'max:120'],
            'about_details.skills.*.percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'about_details.client_title' => ['nullable', 'string', 'max:160'],
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $videoUrl = $this->input('about_details.video_url');

            if (is_string($videoUrl) && trim($videoUrl) !== '' && ! $this->isYoutubeUrl($videoUrl)) {
                $validator->errors()->add('about_details.video_url', 'The About video must be a YouTube URL.');
            }
        });
    }

    private function isYoutubeUrl(string $url): bool
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));

        return str_ends_with($host, 'youtube.com')
            || str_ends_with($host, 'youtube-nocookie.com')
            || str_ends_with($host, 'youtu.be');
    }
}
