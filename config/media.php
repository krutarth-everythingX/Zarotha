<?php

return [
    'disk' => env('MEDIA_DISK', 'public'),
    'original_directory' => env('MEDIA_ORIGINAL_DIRECTORY', 'media/originals'),
    'variant_directory' => env('MEDIA_VARIANT_DIRECTORY', 'media/variants'),
    'max_upload_kb' => (int) env('MEDIA_MAX_UPLOAD_KB', 8192),
    'min_width' => (int) env('MEDIA_MIN_WIDTH', 320),
    'min_height' => (int) env('MEDIA_MIN_HEIGHT', 320),
    'max_width' => (int) env('MEDIA_MAX_WIDTH', 8000),
    'max_height' => (int) env('MEDIA_MAX_HEIGHT', 8000),
    'allowed_mime_types' => [
        'image/jpeg',
        'image/png',
        'image/webp',
    ],
    'extensions' => [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ],
    'processor_command' => env('MEDIA_PROCESSOR_COMMAND', 'node scripts/process-media.mjs'),
    'webp_quality' => (int) env('MEDIA_WEBP_QUALITY', 82),
    'variants' => [
        'hero' => ['width' => 1920],
        'editorial_card' => ['width' => 900],
        'product_card' => ['width' => 700],
        'product_detail' => ['width' => 1400],
        'thumbnail' => ['width' => 320],
        'social_preview' => ['width' => 1200, 'height' => 630],
    ],
    'malware_scanning' => [
        'enabled' => false,
        'integration_point' => 'Scan stored originals before derivative generation when production malware tooling is approved.',
    ],
];
