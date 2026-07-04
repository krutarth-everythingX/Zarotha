<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(RoleSeeder::class);

        if (app()->environment('local')) {
            $this->call(LocalAdminUserSeeder::class);
        }

        $this->call(AboutPageSeeder::class);
    }
}
