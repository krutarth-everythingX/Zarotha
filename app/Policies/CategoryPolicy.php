<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageContent();
    }

    public function create(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, Category $category): bool
    {
        return $user->canManageContent();
    }

    public function delete(User $user, Category $category): bool
    {
        return $user->roleEnum()->value === 'super_administrator';
    }

    public function reorder(User $user): bool
    {
        return $user->canManageContent();
    }
}
