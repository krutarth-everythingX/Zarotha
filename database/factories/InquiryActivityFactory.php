<?php

namespace Database\Factories;

use App\Enums\InquiryActivityType;
use App\Models\Inquiry;
use App\Models\InquiryActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InquiryActivity>
 */
class InquiryActivityFactory extends Factory
{
    protected $model = InquiryActivity::class;

    public function definition(): array
    {
        return [
            'inquiry_id' => Inquiry::factory(),
            'activity_type' => InquiryActivityType::Created,
            'created_at' => now(),
        ];
    }
}
