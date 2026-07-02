<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        return [
            'subject_type' => 'product',
            'subject_id' => fake()->numberBetween(1, 100),
            'action' => 'created',
            'summary' => fake()->sentence(),
            'created_at' => now(),
        ];
    }
}
