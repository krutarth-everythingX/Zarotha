<?php

namespace App\Http\Requests\Admin\Media;

use App\Models\MediaAsset;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var MediaAsset $mediaAsset */
        $mediaAsset = $this->route('media');

        return $this->user()?->can('update', $mediaAsset) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
            'credit' => ['nullable', 'string', 'max:255'],
        ];
    }
}
