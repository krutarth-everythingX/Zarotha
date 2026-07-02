<?php

namespace Database\Factories;

use App\Models\ContactInformation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactInformation>
 */
class ContactInformationFactory extends Factory
{
    protected $model = ContactInformation::class;

    public function definition(): array
    {
        return [
            'business_name' => 'Zarokha Wooden Arts',
            'show_address' => false,
            'show_phone' => true,
            'show_email' => true,
            'show_whatsapp' => true,
        ];
    }
}
