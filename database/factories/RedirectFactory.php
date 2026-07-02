<?php

namespace Database\Factories;

use App\Enums\RedirectType;
use App\Models\Redirect;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Redirect>
 */
class RedirectFactory extends Factory
{
    protected $model = Redirect::class;

    public function definition(): array
    {
        return [
            'source_path' => '/'.fake()->unique()->slug(),
            'target_path' => '/'.fake()->slug(),
            'redirect_type' => RedirectType::Manual,
            'http_status' => 301,
            'is_active' => true,
        ];
    }
}
