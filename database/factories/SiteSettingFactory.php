<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSetting>
 */
class SiteSettingFactory extends Factory
{
    protected $model = SiteSetting::class;

    public function definition(): array
    {
        return [
            'site_name' => 'Zarokha Wooden Arts',
            'default_robots_index' => true,
            'default_robots_follow' => true,
        ];
    }
}
