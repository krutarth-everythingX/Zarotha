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
            'message' => fake()->paragraph(),
            'consent_confirmed' => true,
            'user_agent' => 'PHPUnit',
        ];
    }
}
