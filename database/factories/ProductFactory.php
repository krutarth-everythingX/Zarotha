<?php

namespace Database\Factories;

use App\Enums\PublishStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);

        return [
            'category_id' => Category::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'short_description' => fake()->sentence(),
            'full_description' => fake()->paragraph(),
            'dimensions' => '24 x 18 in',
            'material' => 'Wood',
            'finish' => 'Natural',
            'status' => PublishStatus::Draft,
            'sort_order' => fake()->numberBetween(0, 20),
            'is_featured' => false,
            'is_best_selling' => false,
            'is_latest' => false,
            'robots_index' => true,
            'robots_follow' => true,
            'created_by_user_id' => $user->id,
            'updated_by_user_id' => $user->id,
        ];
    }
}
