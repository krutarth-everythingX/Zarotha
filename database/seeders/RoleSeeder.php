<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            UserRole::SuperAdministrator->value => 'Super Administrator',
            UserRole::ContentEditor->value => 'Content Editor',
            UserRole::InquiryManager->value => 'Inquiry Manager',
        ];

        foreach ($roles as $slug => $name) {
            Role::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'is_system' => true],
            );
        }
    }
}
