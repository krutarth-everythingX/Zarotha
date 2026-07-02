<?php

namespace Database\Factories;

use App\Models\HomepageSection;
use App\Models\WhyChooseUsItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WhyChooseUsItem>
 */
class WhyChooseUsItemFactory extends Factory
{
    protected $model = WhyChooseUsItem::class;

    public function definition(): array
    {
        return [
            'homepage_section_id' => HomepageSection::factory(),
            'heading' => fake()->sentence(3),
            'body_text' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
