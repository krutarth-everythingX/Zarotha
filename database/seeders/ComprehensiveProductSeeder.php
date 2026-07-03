<?php

namespace Database\Seeders;

use App\Enums\PublishStatus;
use App\Models\Category;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ComprehensiveProductSeeder extends Seeder
{
    /**
     * Source directory for seeder images (from the conversation artifacts).
     */
    private string $imageSourceDir = 'C:\\Users\\every\\.gemini\\antigravity-ide\\brain\\4c281a20-5e07-4045-895e-f6fc547bc162';

    public function run(): void
    {
        // Disable FK checks, clean up related tables, then delete existing products
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \Illuminate\Support\Facades\DB::table('homepage_floating_product_items')->truncate();
        \Illuminate\Support\Facades\DB::table('product_media')->truncate();
        Product::query()->forceDelete();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $user = User::first();
        $userId = $user?->id ?? 1;

        $wallDecorCategoryId = Category::where('name', 'Wall Decor')->first()?->id ?? 2;
        $woodenArtCategoryId = Category::where('name', 'Wooden Art')->first()?->id ?? 3;

        // Create the 6 products with comprehensive details
        $products = $this->getProductDefinitions($wallDecorCategoryId, $woodenArtCategoryId);

        foreach ($products as $productData) {
            $imageFiles = $productData['_images'] ?? [];
            unset($productData['_images']);

            // Create the product
            /** @var Product $product */
            $product = Product::create([
                ...$productData,
                'created_by_user_id' => $userId,
                'updated_by_user_id' => $userId,
            ]);

            // Handle images
            $galleryData = [];
            $primaryMediaId = null;

            foreach ($imageFiles as $index => $imageFilename) {
                $sourcePath = $this->imageSourceDir . '\\' . $imageFilename;

                if (!file_exists($sourcePath)) {
                    $this->command->warn("Image not found: {$sourcePath}");
                    continue;
                }

                $storedFilename = Str::uuid() . '.png';
                $storedPath = 'media/' . $storedFilename;

                // Copy the image file into public storage
                Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));

                // Get image dimensions
                $imageInfo = @getimagesize($sourcePath);
                $width = $imageInfo[0] ?? null;
                $height = $imageInfo[1] ?? null;

                // Create the MediaAsset record
                $media = MediaAsset::create([
                    'disk' => 'public',
                    'directory' => 'media',
                    'filename' => $storedFilename,
                    'original_filename' => $imageFilename,
                    'mime_type' => 'image/png',
                    'extension' => 'png',
                    'bytes' => filesize($sourcePath),
                    'width' => $width,
                    'height' => $height,
                    'alt_text' => $productData['name'] . ' - Image ' . ($index + 1),
                    'status' => 'active',
                    'visibility' => 'public',
                    'created_by_user_id' => $userId,
                    'updated_by_user_id' => $userId,
                ]);

                $galleryData[$media->id] = ['sort_order' => $index];

                if ($index === 0) {
                    $primaryMediaId = $media->id;
                }
            }

            // Attach gallery images
            if (!empty($galleryData)) {
                $product->media()->sync($galleryData);
            }

            // Set featured image
            if ($primaryMediaId !== null) {
                $product->update(['featured_media_id' => $primaryMediaId]);
            }

            $this->command->info("Created product: {$product->name}");
        }

        $this->command->info('✅ All 6 products seeded successfully!');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getProductDefinitions(int $wallDecorId, int $woodenArtId): array
    {
        return [
            // 1. Jali Clock (Wall Decor) — WITH 4 GALLERY IMAGES
            [
                'category_id' => $wallDecorId,
                'name' => 'Handcrafted Jali Lattice Wall Clock',
                'slug' => 'handcrafted-jali-lattice-wall-clock',
                'sku' => 'ZRK-CLK-001',
                'product_type' => 'Wall Clock',
                'short_description' => 'A stunning handcrafted wall clock featuring intricate jali lattice carving in sheesham wood with a natural walnut finish. Each piece is uniquely crafted by master artisans.',
                'full_description' => '<p>This exquisite <strong>Jali Lattice Wall Clock</strong> showcases the timeless art of Indian woodworking. Carved from premium Sheesham wood, each geometric pattern in the jali lattice is hand-cut with precision by our master craftsmen.</p><p>The clock features a <em>silent quartz movement</em> ensuring it keeps perfect time without any ticking noise. The walnut finish brings out the natural beauty of the Sheesham wood grain.</p><ul><li>Hand-carved jali lattice with geometric Indian patterns</li><li>Silent quartz movement (battery included)</li><li>Wall-mount hook included</li><li>Natural walnut finish, hand-rubbed</li></ul>',
                'dimensions' => '14 x 14 x 2 inches',
                'material' => 'Solid Sheesham Wood',
                'finish' => 'Natural Walnut',
                'wood_type' => 'Sheesham',
                'style' => 'Traditional Indian',
                'regular_price' => 3499.00,
                'sale_price' => 2999.00,
                'is_track_inventory' => true,
                'stock_quantity' => 15,
                'availability' => 'in_stock',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'sort_order' => 1,
                'is_featured' => true,
                'is_best_selling' => true,
                'is_latest' => true,
                'meta_title' => 'Handcrafted Jali Lattice Wall Clock | Zarokha Wooden Arts',
                'meta_description' => 'Buy a hand-carved jali lattice wall clock made from sheesham wood with natural walnut finish. Silent quartz movement. Free shipping across India.',
                'robots_index' => true,
                'robots_follow' => true,
                'details' => [
                    'material_grade' => 'Premium Grade A',
                    'wood_source' => 'Rajasthan, India',
                    'is_reclaimed_wood' => false,
                    'is_sustainably_sourced' => true,
                    'dimensions_unit' => 'inches',
                    'height' => '14',
                    'width' => '14',
                    'depth' => '2',
                    'weight' => '1.2',
                    'dynamic_specs' => [
                        ['id' => 'spec-1', 'key' => 'Clock Movement', 'value' => 'Silent Quartz'],
                        ['id' => 'spec-2', 'key' => 'Battery Type', 'value' => 'AA (Included)'],
                        ['id' => 'spec-3', 'key' => 'Carving Style', 'value' => 'Jali Lattice'],
                        ['id' => 'spec-4', 'key' => 'Packaging', 'value' => 'Gift-ready box'],
                    ],
                ],
                '_images' => [
                    'product_jali_clock_1783078273481.png',
                    'product_jali_clock_angle_1783078390694.png',
                    'product_jali_clock_detail_1783078410880.png',
                    'product_jali_clock_lifestyle_1783078430429.png',
                ],
            ],

            // 2. Carved Wall Panel (Wall Decor)
            [
                'category_id' => $wallDecorId,
                'name' => 'Floral Mandala Carved Wall Panel',
                'slug' => 'floral-mandala-carved-wall-panel',
                'sku' => 'ZRK-PNL-002',
                'product_type' => 'Wall Panel',
                'short_description' => 'A breathtaking hand-carved teak wood wall panel featuring a deep-relief floral mandala design with lotus flowers and entwined vines.',
                'full_description' => '<p>This magnificent <strong>Floral Mandala Wall Panel</strong> is a statement piece that transforms any wall into a gallery. Carved from a single piece of premium teak wood, the panel features a stunning mandala pattern with lotus flowers radiating from the centre.</p><p>The deep relief carving creates dramatic shadow play as light changes throughout the day, making this a living artwork in your home.</p><ul><li>Deep relief carving (up to 1.5 inches depth)</li><li>Single-piece premium teak wood</li><li>Hand-rubbed antique brown finish</li><li>Heavy-duty wall mount hardware included</li></ul>',
                'dimensions' => '36 x 36 x 2 inches',
                'material' => 'Solid Teak Wood',
                'finish' => 'Antique Brown',
                'wood_type' => 'Teak',
                'style' => 'Mandala Art',
                'regular_price' => 12999.00,
                'sale_price' => null,
                'is_track_inventory' => true,
                'stock_quantity' => 5,
                'availability' => 'in_stock',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'sort_order' => 2,
                'is_featured' => true,
                'is_best_selling' => false,
                'is_latest' => true,
                'meta_title' => 'Floral Mandala Carved Wall Panel | Zarokha Wooden Arts',
                'meta_description' => 'Handcrafted teak wood wall panel with deep-relief floral mandala carving. A statement piece for modern and traditional interiors.',
                'robots_index' => true,
                'robots_follow' => true,
                'details' => [
                    'material_grade' => 'Premium Grade A',
                    'wood_source' => 'Kerala, India',
                    'is_reclaimed_wood' => false,
                    'is_sustainably_sourced' => true,
                    'dimensions_unit' => 'inches',
                    'height' => '36',
                    'width' => '36',
                    'depth' => '2',
                    'weight' => '8.5',
                    'dynamic_specs' => [
                        ['id' => 'spec-1', 'key' => 'Carving Depth', 'value' => 'Up to 1.5 inches'],
                        ['id' => 'spec-2', 'key' => 'Installation', 'value' => 'Wall mount (hardware included)'],
                    ],
                ],
                '_images' => [
                    'product_carved_panel_1783078293048.png',
                ],
            ],

            // 3. Mirror Frame (Wall Decor)
            [
                'category_id' => $wallDecorId,
                'name' => 'Rajasthani Peacock Mirror Frame',
                'slug' => 'rajasthani-peacock-mirror-frame',
                'sku' => 'ZRK-MRR-003',
                'product_type' => 'Mirror Frame',
                'short_description' => 'An ornate oval mirror frame hand-carved in mango wood with intricate peacock and leaf motifs in the Rajasthani tradition.',
                'full_description' => '<p>Bring the royal elegance of Rajasthan into your home with this <strong>Peacock Mirror Frame</strong>. Each frame is lovingly carved from seasoned mango wood, featuring detailed peacock motifs that symbolise grace and beauty.</p><p>The honey gold finish highlights the depth of the carving, making every feather and leaf visible. A mirror of this calibre becomes the centrepiece of any entryway, bedroom, or living room.</p>',
                'dimensions' => '24 x 18 x 1.5 inches',
                'material' => 'Mango Wood',
                'finish' => 'Honey Gold',
                'wood_type' => 'Mango Wood',
                'style' => 'Rajasthani Heritage',
                'regular_price' => 5999.00,
                'sale_price' => 4999.00,
                'is_track_inventory' => true,
                'stock_quantity' => 8,
                'availability' => 'in_stock',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'sort_order' => 3,
                'is_featured' => false,
                'is_best_selling' => true,
                'is_latest' => true,
                'meta_title' => 'Rajasthani Peacock Mirror Frame | Zarokha Wooden Arts',
                'meta_description' => 'Hand-carved mango wood mirror frame with peacock motifs. Rajasthani heritage craftsmanship with honey gold finish.',
                'robots_index' => true,
                'robots_follow' => true,
                'details' => [
                    'material_grade' => 'Premium',
                    'wood_source' => 'Jodhpur, Rajasthan',
                    'is_reclaimed_wood' => false,
                    'is_sustainably_sourced' => true,
                    'dimensions_unit' => 'inches',
                    'height' => '24',
                    'width' => '18',
                    'depth' => '1.5',
                    'weight' => '3.5',
                    'dynamic_specs' => [
                        ['id' => 'spec-1', 'key' => 'Mirror Type', 'value' => 'Bevelled Glass'],
                        ['id' => 'spec-2', 'key' => 'Mirror Shape', 'value' => 'Oval'],
                        ['id' => 'spec-3', 'key' => 'Mount Type', 'value' => 'D-ring hanger (included)'],
                    ],
                ],
                '_images' => [
                    'product_mirror_frame_1783078310202.png',
                ],
            ],

            // 4. Temple Shelf (Wooden Art)
            [
                'category_id' => $woodenArtId,
                'name' => 'Carved Temple Mandir Shelf',
                'slug' => 'carved-temple-mandir-shelf',
                'sku' => 'ZRK-TMP-004',
                'product_type' => 'Temple Shelf',
                'short_description' => 'A handcrafted wooden temple mandir with dome top, carved columns, and small doors. Perfect for a dedicated puja space at home.',
                'full_description' => '<p>This <strong>Carved Temple Mandir Shelf</strong> brings sacred architecture into your home. Inspired by traditional Indian temple design, it features a beautiful dome-shaped top, ornate carved columns, and functional small doors.</p><p>Made from seasoned Sheesham wood and finished in dark walnut, this mandir is both a devotional space and a work of art.</p><ul><li>Dome-shaped top with carved finial</li><li>Functional small doors with brass handles</li><li>Two shelves for deity placement</li><li>Floor-standing or table-top use</li></ul>',
                'dimensions' => '18 x 12 x 24 inches',
                'material' => 'Solid Sheesham Wood',
                'finish' => 'Dark Walnut',
                'wood_type' => 'Sheesham',
                'style' => 'Temple Architecture',
                'regular_price' => 8499.00,
                'sale_price' => 7499.00,
                'is_track_inventory' => true,
                'stock_quantity' => 10,
                'availability' => 'in_stock',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'sort_order' => 4,
                'is_featured' => true,
                'is_best_selling' => true,
                'is_latest' => true,
                'meta_title' => 'Carved Temple Mandir Shelf | Zarokha Wooden Arts',
                'meta_description' => 'Buy a handcrafted Sheesham wood temple mandir with dome top and carved columns. Perfect for home puja rooms.',
                'robots_index' => true,
                'robots_follow' => true,
                'details' => [
                    'material_grade' => 'Premium Grade A',
                    'wood_source' => 'Rajasthan, India',
                    'is_reclaimed_wood' => false,
                    'is_sustainably_sourced' => true,
                    'dimensions_unit' => 'inches',
                    'height' => '24',
                    'width' => '18',
                    'depth' => '12',
                    'weight' => '12',
                    'dynamic_specs' => [
                        ['id' => 'spec-1', 'key' => 'Door Hardware', 'value' => 'Brass handles'],
                        ['id' => 'spec-2', 'key' => 'Number of Shelves', 'value' => '2'],
                        ['id' => 'spec-3', 'key' => 'Placement', 'value' => 'Floor or Table-top'],
                    ],
                ],
                '_images' => [
                    'product_temple_shelf_1783078329318.png',
                ],
            ],

            // 5. Elephant Sculpture (Wooden Art)
            [
                'category_id' => $woodenArtId,
                'name' => 'Royal Elephant Trunk-Up Sculpture',
                'slug' => 'royal-elephant-trunk-up-sculpture',
                'sku' => 'ZRK-SCL-005',
                'product_type' => 'Sculpture',
                'short_description' => 'A meticulously hand-carved solid teak elephant sculpture with trunk raised upward for good fortune. Features an intricately carved decorative saddle blanket.',
                'full_description' => '<p>In Indian tradition, an elephant with its trunk raised is a symbol of <strong>good luck and prosperity</strong>. This exquisite sculpture captures that auspicious pose in solid teak wood.</p><p>The master carver has spent weeks detailing the decorative saddle blanket, each pattern telling a story of royal Rajasthani heritage. The natural polish allows the beautiful teak grain to shine through.</p>',
                'dimensions' => '10 x 5 x 12 inches',
                'material' => 'Solid Teak Wood',
                'finish' => 'Natural Polish',
                'wood_type' => 'Teak',
                'style' => 'Figurative Art',
                'regular_price' => 4299.00,
                'sale_price' => null,
                'is_track_inventory' => false,
                'stock_quantity' => null,
                'availability' => 'made_to_order',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'sort_order' => 5,
                'is_featured' => false,
                'is_best_selling' => false,
                'is_latest' => true,
                'meta_title' => 'Royal Elephant Trunk-Up Sculpture | Zarokha Wooden Arts',
                'meta_description' => 'Hand-carved teak wood elephant sculpture with trunk raised for good fortune. Made to order by master artisans.',
                'robots_index' => true,
                'robots_follow' => true,
                'details' => [
                    'material_grade' => 'Premium',
                    'wood_source' => 'Kerala, India',
                    'is_reclaimed_wood' => false,
                    'is_sustainably_sourced' => true,
                    'dimensions_unit' => 'inches',
                    'height' => '12',
                    'width' => '10',
                    'depth' => '5',
                    'weight' => '2.8',
                    'dynamic_specs' => [
                        ['id' => 'spec-1', 'key' => 'Carving Time', 'value' => 'Approx. 2 weeks'],
                        ['id' => 'spec-2', 'key' => 'Lead Time (Made to Order)', 'value' => '3-4 weeks'],
                    ],
                ],
                '_images' => [
                    'product_elephant_sculpture_1783078350485.png',
                ],
            ],

            // 6. Console Table (Wooden Art)
            [
                'category_id' => $woodenArtId,
                'name' => 'Jali Console Table with Bone Inlay',
                'slug' => 'jali-console-table-bone-inlay',
                'sku' => 'ZRK-TBL-006',
                'product_type' => 'Console Table',
                'short_description' => 'A handcrafted console table featuring jali lattice panel drawers, carved cabriole legs, and a stunning bone inlay geometric pattern on the top surface.',
                'full_description' => '<p>This <strong>Jali Console Table</strong> is a masterpiece of Indian furniture craftsmanship. The table combines several traditional techniques:</p><ul><li><strong>Jali lattice panels</strong> on the two drawers for ventilation and beauty</li><li><strong>Cabriole legs</strong> with elegant curves inspired by Mughal furniture</li><li><strong>Bone inlay</strong> geometric pattern on the table top using ethically sourced camel bone</li></ul><p>Made from seasoned Acacia wood with a hand-rubbed rustic brown finish that will develop a beautiful patina over time.</p>',
                'dimensions' => '48 x 16 x 30 inches',
                'material' => 'Acacia Wood with Bone Inlay',
                'finish' => 'Rustic Brown',
                'wood_type' => 'Acacia',
                'style' => 'Indo-Colonial',
                'regular_price' => 18999.00,
                'sale_price' => 15999.00,
                'is_track_inventory' => true,
                'stock_quantity' => 3,
                'availability' => 'in_stock',
                'status' => PublishStatus::Published,
                'published_at' => now(),
                'sort_order' => 6,
                'is_featured' => true,
                'is_best_selling' => false,
                'is_latest' => true,
                'meta_title' => 'Jali Console Table with Bone Inlay | Zarokha Wooden Arts',
                'meta_description' => 'Handcrafted acacia wood console table with jali lattice drawers, cabriole legs, and bone inlay top. Premium Indian furniture.',
                'robots_index' => true,
                'robots_follow' => true,
                'details' => [
                    'material_grade' => 'Premium Grade A',
                    'wood_source' => 'Jodhpur, Rajasthan',
                    'is_reclaimed_wood' => false,
                    'is_sustainably_sourced' => true,
                    'dimensions_unit' => 'inches',
                    'height' => '30',
                    'width' => '48',
                    'depth' => '16',
                    'weight' => '25',
                    'dynamic_specs' => [
                        ['id' => 'spec-1', 'key' => 'Number of Drawers', 'value' => '2'],
                        ['id' => 'spec-2', 'key' => 'Drawer Hardware', 'value' => 'Antique brass pulls'],
                        ['id' => 'spec-3', 'key' => 'Inlay Material', 'value' => 'Ethically sourced camel bone'],
                        ['id' => 'spec-4', 'key' => 'Assembly', 'value' => 'Legs attach with bolts (tools included)'],
                    ],
                ],
                '_images' => [
                    'product_console_table_1783078367021.png',
                ],
            ],
        ];
    }
}
