<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->roleEnum()->value === 'super_administrator';
    }

    public function manageUsers(User $user): bool
    {
        return $user->roleEnum()->value === 'super_administrator';
    }

    public function create(User $user): bool
    {
        return $this->manageUsers($user);
    }

    public function update(User $user, User $managedUser): bool
    {
        return $this->manageUsers($user);
    }
}
