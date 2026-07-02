<?php

namespace Database\Factories;

use App\Models\HomepageFeaturedProductItem;
use App\Models\HomepageSection;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HomepageFeaturedProductItem>
 */
class HomepageFeaturedProductItemFactory extends Factory
{
    protected $model = HomepageFeaturedProductItem::class;

    public function definition(): array
    {
        return [
            'homepage_section_id' => HomepageSection::factory(),
            'product_id' => Product::factory(),
            'sort_order' => fake()->numberBetween(0, 10),
            'created_at' => now(),
        ];
    }
}
