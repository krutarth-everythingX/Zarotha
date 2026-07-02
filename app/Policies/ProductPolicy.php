<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageContent();
    }

    public function create(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, Product $product): bool
    {
        return $user->canManageContent();
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->canManageContent();
    }

    public function publish(User $user, Product $product): bool
    {
        return $user->canManageContent();
    }

    public function archive(User $user, Product $product): bool
    {
        return $user->canManageContent();
    }
}
