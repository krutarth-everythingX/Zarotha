<?php

namespace App\Http\Requests\Admin\Settings;

use App\Models\SiteSetting;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageSeo', SiteSetting::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'default_meta_title' => ['nullable', 'string', 'max:255'],
            'default_meta_description' => ['nullable', 'string', 'max:320'],
            'default_og_image_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'default_robots_index' => ['required', 'boolean'],
            'default_robots_follow' => ['required', 'boolean'],
        ];
    }
}
