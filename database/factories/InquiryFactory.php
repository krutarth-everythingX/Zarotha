<?php

namespace Database\Factories;

use App\Enums\InquiryStatus;
use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'status' => InquiryStatus::Unread,
            'source_page_key' => 'contact',
            'source_url' => '/contact',
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'company_name' => fake()->optional()->company(),
            'subject' => fake()->sentence(3),
            'project_location' => fake()->city(),
            'project_state' => fake()->state(),
            'project_country' => fake()->country(),
            'budget_range' => fake()->optional()->randomElement(['Under Rs. 1 lakh', 'Rs. 1 lakh - Rs. 3 lakh', 'Rs. 3 lakh+']),
            'expected_project_start' => fake()->optional()->dateTimeBetween('now', '+6 months')?->format('Y-m-d'),
            'message' => fake()->paragraph(),
            'consent_confirmed' => true,
            'user_agent' => 'PHPUnit',
        ];
    }
}
