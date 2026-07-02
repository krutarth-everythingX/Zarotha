<?php

namespace App\Policies;

use App\Models\ContactInformation;
use App\Models\User;

class ContactInformationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, ContactInformation $contactInformation): bool
    {
        return $user->canManageContent();
    }
}
