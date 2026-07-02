<?php

namespace Database\Factories;

use App\Enums\PublishStatus;
use App\Enums\UserRole;
use App\Models\Page;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Page>
 */
class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition(): array
    {
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);

        return [
            'page_key' => fake()->unique()->randomElement([
                'about_us',
                'our_craftsmanship',
                'contact',
                'privacy_policy',
                'terms_and_conditions',
            ]),
            'slug' => fake()->unique()->slug(),
            'title' => fake()->sentence(3),
            'intro_title' => fake()->sentence(2),
            'intro_body' => fake()->paragraph(),
            'body_html' => '<p>'.fake()->paragraph().'</p>',
            'status' => PublishStatus::Draft,
            'robots_index' => true,
            'robots_follow' => true,
            'created_by_user_id' => $user->id,
            'updated_by_user_id' => $user->id,
        ];
    }
}
