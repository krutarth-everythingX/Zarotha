<?php

namespace Database\Factories;

use App\Models\CraftsmanshipStep;
use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CraftsmanshipStep>
 */
class CraftsmanshipStepFactory extends Factory
{
    protected $model = CraftsmanshipStep::class;

    public function definition(): array
    {
        return [
            'page_id' => Page::factory(),
            'title' => fake()->sentence(3),
            'body_text' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
