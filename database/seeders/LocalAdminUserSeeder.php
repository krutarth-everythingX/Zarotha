<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class LocalAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            throw new RuntimeException('LocalAdminUserSeeder may only run in the local environment.');
        }

        User::query()->updateOrCreate(
            ['email' => config('cms.local_admin.email')],
            [
                'name' => config('cms.local_admin.name'),
                'password' => Hash::make(config('cms.local_admin.password')),
                'role_id' => Role::idFor(UserRole::SuperAdministrator),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
