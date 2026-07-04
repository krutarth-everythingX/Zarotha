<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$userId = App\Models\User::first()?->id ?? 1;

$mediaLight = App\Models\MediaAsset::firstOrCreate(
    ['filename' => 'navbar-logo.png'],
    [
        'disk' => 'public', 
        'directory' => 'images', 
        'original_filename' => 'navbar-logo.png', 
        'mime_type' => 'image/png', 
        'extension' => 'png', 
        'bytes' => 1799998, 
        'width' => null, 
        'height' => null, 
        'status' => 'active', 
        'visibility' => 'public', 
        'created_by_user_id' => $userId, 
        'updated_by_user_id' => $userId
    ]
);

$mediaDark = App\Models\MediaAsset::firstOrCreate(
    ['filename' => 'sidebar-logo.png'],
    [
        'disk' => 'public', 
        'directory' => 'images', 
        'original_filename' => 'sidebar-logo.png', 
        'mime_type' => 'image/png', 
        'extension' => 'png', 
        'bytes' => 15457, 
        'width' => null, 
        'height' => null, 
        'status' => 'active', 
        'visibility' => 'public', 
        'created_by_user_id' => $userId, 
        'updated_by_user_id' => $userId
    ]
);

App\Models\SiteSetting::firstOrCreate(['id' => 1])->update([
    'light_logo_media_id' => $mediaLight->id, 
    'dark_logo_media_id' => $mediaDark->id
]);

echo "Logos attached successfully.\n";
