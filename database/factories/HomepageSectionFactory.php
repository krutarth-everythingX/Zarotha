<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\HomepageSection;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HomepageSection>
 */
class HomepageSectionFactory extends Factory
{
    protected $model = HomepageSection::class;

    public function definition(): array
    {
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);

        return [
            'section_key' => fake()->unique()->slug(2),
            'section_title' => fake()->sentence(3),
            'section_intro' => fake()->sentence(),
            'source_mode' => 'manual',
            'max_items' => 6,
            'sort_order' => fake()->numberBetween(0, 10),
            'is_visible' => true,
            'created_by_user_id' => $user->id,
            'updated_by_user_id' => $user->id,
        ];
    }
}
