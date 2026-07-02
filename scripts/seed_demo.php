
$heroBanner = \App\Models\HeroBanner::firstOrCreate(
    ['is_active' => true],
    [
        'headline' => 'Zarokha Wooden Arts',
        'body_text' => 'Handcrafted wooden pieces for interiors and gifting.',
        'sort_order' => 1,
        'text_theme' => 'light'
    ]
);

$heroSection = \App\Models\HomepageSection::firstOrCreate(
    ['section_key' => 'hero'],
    ['is_visible' => true, 'section_title' => 'Hero']
);

$positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
foreach($positions as $pos) {
    if(\App\Models\HomepageFloatingProductItem::where('homepage_section_id', $heroSection->id)->where('position', $pos)->exists()) {
        continue;
    }
    
    $product = \App\Models\Product::factory()->create([
        'status' => \App\Enums\PublishStatus::Published,
        'published_at' => now()
    ]);
    
    \App\Models\HomepageFloatingProductItem::create([
        'homepage_section_id' => $heroSection->id,
        'product_id' => $product->id,
        'position' => $pos,
        'is_visible' => true,
        'tilt_preset' => 'none'
    ]);
}

echo "Fake banner and floating products created successfully.\n";
