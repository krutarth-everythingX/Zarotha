<?php

namespace App\Enums;

enum InquiryActivityType: string
{
    case Created = 'created';
    case NoteAdded = 'note_added';
    case StatusChanged = 'status_changed';
    case Assigned = 'assigned';
    case Replied = 'replied';
    case Exported = 'exported';
    case Archived = 'archived';
    case Restored = 'restored';
}
