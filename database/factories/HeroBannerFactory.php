<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\HeroBanner;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroBanner>
 */
class HeroBannerFactory extends Factory
{
    protected $model = HeroBanner::class;

    public function definition(): array
    {
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);

        return [
            'eyebrow' => fake()->words(2, true),
            'headline' => fake()->sentence(4),
            'body_text' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'created_by_user_id' => $user->id,
            'updated_by_user_id' => $user->id,
        ];
    }
}
