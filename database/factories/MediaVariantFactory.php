<?php

namespace Database\Factories;

use App\Models\MediaAsset;
use App\Models\MediaVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MediaVariant>
 */
class MediaVariantFactory extends Factory
{
    protected $model = MediaVariant::class;

    public function definition(): array
    {
        return [
            'media_asset_id' => MediaAsset::factory(),
            'variant_key' => fake()->unique()->randomElement(['thumb', 'card', 'hero']),
            'format' => 'webp',
            'path' => 'media/'.fake()->uuid().'.webp',
            'width' => 800,
            'height' => 600,
            'bytes' => 65000,
            'is_primary' => false,
        ];
    }
}
