<?php

namespace App\Http\Requests\Admin\Media;

use App\Models\MediaAsset;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MediaAsset::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max((int) config('media.max_upload_kb')),
                'dimensions:min_width='.(int) config('media.min_width')
                    .',min_height='.(int) config('media.min_height')
                    .',max_width='.(int) config('media.max_width')
                    .',max_height='.(int) config('media.max_height'),
            ],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
        ];
    }
}
