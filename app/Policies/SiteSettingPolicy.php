<?php

namespace App\Policies;

use App\Models\SiteSetting;
use App\Models\User;

class SiteSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->roleEnum()->value === 'super_administrator';
    }

    public function update(User $user, SiteSetting $siteSetting): bool
    {
        return $user->roleEnum()->value === 'super_administrator';
    }

    public function manageSeo(User $user): bool
    {
        return $user->canManageSeo();
    }
}
