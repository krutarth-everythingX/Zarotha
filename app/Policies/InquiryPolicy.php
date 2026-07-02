<?php

namespace App\Policies;

use App\Models\Inquiry;
use App\Models\User;

class InquiryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageInquiries() || $user->canManageContent();
    }

    public function view(User $user, Inquiry $inquiry): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Inquiry $inquiry): bool
    {
        return $user->canManageInquiries();
    }

    public function assign(User $user, Inquiry $inquiry): bool
    {
        return $user->canManageInquiries();
    }

    public function addNote(User $user, Inquiry $inquiry): bool
    {
        return $user->canManageInquiries();
    }

    public function export(User $user): bool
    {
        return $user->canManageInquiries();
    }
}
