

$inquirySection = \App\Models\HomepageSection::where('section_key', 'quick_inquiry')->first();

if (!$inquirySection) {
    echo "Quick inquiry section not found.\n";
    return;
}

$imageUrls = [
    'https://picsum.photos/id/10/1920/1080',
    'https://picsum.photos/id/11/1920/1080',
    'https://picsum.photos/id/12/1920/1080',
];

$mediaDir = storage_path('app/public/media');
if (!is_dir($mediaDir)) {
    mkdir($mediaDir, 0755, true);
}

foreach ($imageUrls as $index => $url) {
    $filename = "inquiry-banner-{$index}.jpg";
    $filepath = $mediaDir . '/' . $filename;
    
    // Download image
    file_put_contents($filepath, file_get_contents($url));
    
    // Create Media Asset
    $mediaAsset = \App\Models\MediaAsset::create([
        'filename' => $filename,
        'original_filename' => $filename,
        'extension' => 'jpg',
        'mime_type' => 'image/jpeg',
        'bytes' => filesize($filepath),
        'disk' => 'public',
        'directory' => 'media',
        'status' => 'processed',
        'created_by_user_id' => 1,
    ]);
    
    // Create Media Variant
    \App\Models\MediaVariant::create([
        'media_asset_id' => $mediaAsset->id,
        'variant_key' => 'webp-1920',
        'width' => 1920,
        'height' => 1080,
        'path' => 'media/' . $filename, // Simplification for dummy seed
        'format' => 'jpeg',
        'bytes' => filesize($filepath),
    ]);
    
    // Attach to section
    \App\Models\HomepageSectionBanner::create([
        'homepage_section_id' => $inquirySection->id,
        'media_asset_id' => $mediaAsset->id,
        'sort_order' => $index,
        'is_visible' => true,
        'created_by_user_id' => 1,
    ]);
    
    echo "Added banner {$index}\n";
}

echo "Done seeding banners.\n";
