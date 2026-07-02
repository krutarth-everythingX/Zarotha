<?php

namespace App\Http\Requests\Admin\Settings;

use App\Models\SiteSetting;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $siteSetting = SiteSetting::query()->firstOrNew(['id' => 1]);

        return $this->user()?->can('update', $siteSetting) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:255'],
            'light_logo_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
            'dark_logo_media_id' => ['nullable', 'integer', 'exists:media_assets,id'],
        ];
    }
}
