<?php

namespace App\Policies;

use App\Models\Redirect;
use App\Models\User;

class RedirectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageRedirects();
    }

    public function create(User $user): bool
    {
        return $user->canManageRedirects();
    }

    public function update(User $user, Redirect $redirect): bool
    {
        return $user->canManageRedirects();
    }

    public function delete(User $user, Redirect $redirect): bool
    {
        return $user->canManageRedirects();
    }
}
