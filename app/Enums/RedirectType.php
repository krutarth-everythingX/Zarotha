<?php

namespace App\Enums;

enum RedirectType: string
{
    case SlugHistory = 'slug_history';
    case Manual = 'manual';
}
