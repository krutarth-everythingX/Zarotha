<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->randomElement(array_map(
                static fn (UserRole $role): string => $role->value,
                UserRole::cases(),
            )),
            'name' => fake()->jobTitle(),
            'description' => fake()->sentence(),
            'is_system' => true,
        ];
    }
}
