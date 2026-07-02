<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\MediaAsset;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MediaAsset>
 */
class MediaAssetFactory extends Factory
{
    protected $model = MediaAsset::class;

    public function definition(): array
    {
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);
        $filename = Str::uuid().'.jpg';

        return [
            'disk' => 'public',
            'directory' => 'media',
            'filename' => $filename,
            'original_filename' => 'uploaded-image.jpg',
            'mime_type' => 'image/jpeg',
            'extension' => 'jpg',
            'bytes' => 120000,
            'width' => 1200,
            'height' => 900,
            'alt_text' => fake()->sentence(3),
            'status' => 'uploaded',
            'visibility' => 'public',
            'created_by_user_id' => $user->id,
            'updated_by_user_id' => $user->id,
        ];
    }
}
