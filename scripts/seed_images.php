
if (!is_dir(storage_path('app/public/media'))) {
    mkdir(storage_path('app/public/media'), 0755, true);
}

// Ensure the storage symlink exists
if (!is_dir(public_path('storage'))) {
    app('files')->link(storage_path('app/public'), public_path('storage'));
}

// Download a placeholder image if it doesn't exist
$fakeFile = storage_path('app/public/media/fake.webp');
if (!file_exists($fakeFile)) {
    // Generate a simple 1x1 WebP or download one
    $img = file_get_contents('https://picsum.photos/800/1000.webp') ?: file_get_contents('https://picsum.photos/800/1000');
    file_put_contents($fakeFile, $img);
}

// Create Media Asset and Variant
$mediaAsset = \App\Models\MediaAsset::firstOrCreate(
    ['filename' => 'fake.webp'],
    [
        'disk' => 'public',
        'directory' => 'media',
        'original_filename' => 'fake.webp',
        'mime_type' => 'image/webp',
        'extension' => 'webp',
        'bytes' => filesize($fakeFile),
        'width' => 800,
        'height' => 1000,
        'status' => 'ready',
        'visibility' => 'public'
    ]
);

\App\Models\MediaVariant::firstOrCreate(
    ['media_asset_id' => $mediaAsset->id, 'width' => 800],
    [
        'variant_key' => 'webp-800',
        'path' => 'media/fake.webp',
        'format' => 'webp',
        'bytes' => filesize($fakeFile),
        'height' => 1000,
        'is_primary' => true
    ]
);

// Update Hero Banner
$heroBanner = \App\Models\HeroBanner::first();
if ($heroBanner) {
    $heroBanner->update(['desktop_media_id' => $mediaAsset->id, 'mobile_media_id' => $mediaAsset->id]);
}

// Update Products
$products = \App\Models\Product::all();
foreach($products as $product) {
    $product->update(['featured_media_id' => $mediaAsset->id]);
}

echo "Images generated and attached successfully.\n";
