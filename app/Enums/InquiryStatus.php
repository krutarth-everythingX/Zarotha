<?php

namespace App\Enums;

enum InquiryStatus: string
{
    case Unread = 'unread';
    case Read = 'read';
    case Replied = 'replied';
    case Archived = 'archived';
}
