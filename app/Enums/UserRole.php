<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdministrator = 'super_administrator';
    case ContentEditor = 'content_editor';
    case InquiryManager = 'inquiry_manager';
}
