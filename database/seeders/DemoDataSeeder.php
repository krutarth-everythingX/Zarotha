<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ContactInformation;
use App\Models\HeroBanner;
use App\Models\HomepageSection;
use App\Models\HomepageSectionBanner;
use App\Models\HomepageTestimonial;
use App\Models\MediaAsset;
use App\Models\MediaVariant;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding Demo Data...');

        $admin = User::first() ?? User::factory()->create();

        Storage::disk('public')->makeDirectory('demo');

        // Contact info
        ContactInformation::updateOrCreate(['id' => 1], [
            'email_primary' => 'hello@zarokha.com',
            'phone_primary' => '+91 98765 43210',
            'whatsapp_number' => '+919876543210',
            'whatsapp_text' => 'Hi Zarokha, I want to discuss a custom project.',
            'address_line_1' => '123 Woodcrafters Lane',
            'city' => 'Jaipur',
            'state' => 'Rajasthan',
            'business_name' => 'Zarokha Wooden Arts',
            'show_address' => true,
            'show_phone' => true,
            'show_email' => true,
            'show_whatsapp' => true,
        ]);

        // Social links
        SocialLink::truncate();
        SocialLink::create(['platform_key' => 'instagram', 'url' => 'https://instagram.com/zarokha', 'sort_order' => 1]);
        SocialLink::create(['platform_key' => 'facebook', 'url' => 'https://facebook.com/zarokha', 'sort_order' => 2]);
        SocialLink::create(['platform_key' => 'pinterest', 'url' => 'https://pinterest.com/zarokha', 'sort_order' => 3]);

        SiteSetting::updateOrCreate(['id' => 1], [
            'site_name' => 'Zarokha Wooden Arts',
            'show_social_links_on_hero' => true,
        ]);

        // Categories
        $category = Category::firstOrCreate(['slug' => 'wooden-art'], ['name' => 'Wooden Art', 'is_active' => true]);

        // Products with different aspect ratios
        $productImages = [
            ['url' => 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=600&h=900&auto=format&fit=crop', 'w' => 600, 'h' => 900, 'name' => 'Tall Wooden Vase'],
            ['url' => 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=900&h=600&auto=format&fit=crop', 'w' => 900, 'h' => 600, 'name' => 'Wide Wooden Console'],
            ['url' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&h=800&auto=format&fit=crop', 'w' => 800, 'h' => 800, 'name' => 'Square Wooden Frame'],
            ['url' => 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=600&h=1000&auto=format&fit=crop', 'w' => 600, 'h' => 1000, 'name' => 'Carved Wooden Panel'],
            ['url' => 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800&h=600&auto=format&fit=crop', 'w' => 800, 'h' => 600, 'name' => 'Rustic Wooden Stool'],
            ['url' => 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=600&h=1200&auto=format&fit=crop', 'w' => 600, 'h' => 1200, 'name' => 'Vertical Wall Decor'],
        ];

        foreach ($productImages as $idx => $img) {
            $media = $this->createMedia($img['url'], $img['w'], $img['h'], 'product-'.$idx.'.jpg');
            $product = Product::create([
                'category_id' => $category->id,
                'name' => $img['name'],
                'slug' => Str::slug($img['name']) . '-' . rand(100, 999),
                'short_description' => 'A handcrafted masterpiece showing true wooden art.',
                'featured_media_id' => $media->id,
                'status' => 'published',
                'is_featured' => true,
                'is_latest' => true,
                'created_by_user_id' => $admin->id,
            ]);
            $product->media()->attach($media->id, ['sort_order' => 1]);
        }

        // Hero Banners
        HeroBanner::truncate();
        $heroImage1 = $this->createMedia('https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=1600&h=900&auto=format&fit=crop', 1600, 900, 'hero1.jpg');
        $heroImage2 = $this->createMedia('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&h=900&auto=format&fit=crop', 1600, 900, 'hero2.jpg');

        HeroBanner::create([
            'desktop_media_id' => $heroImage1->id,
            'headline' => 'Crafting Elegance from Wood',
            'is_active' => true,
            'sort_order' => 1,
        ]);
        HeroBanner::create([
            'desktop_media_id' => $heroImage2->id,
            'headline' => 'Timeless Wooden Masterpieces',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Homepage Sections
        $latest = HomepageSection::firstOrCreate(['section_key' => 'latest_products']);
        $latest->update(['section_title' => 'Latest Wooden Art', 'is_visible' => true]);

        $inquiry = HomepageSection::firstOrCreate(['section_key' => 'quick_inquiry']);
        $inquiryImage = $this->createMedia('https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1200&h=800&auto=format&fit=crop', 1200, 800, 'inquiry.jpg');
        $inquiry->update([
            'section_title' => 'Start your project',
            'is_visible' => true,
            'background_media_id' => $inquiryImage->id,
            'source_mode' => 'custom',
        ]);

        // Homepage Section Banners
        HomepageSectionBanner::truncate();
        HomepageSectionBanner::create([
            'homepage_section_id' => $inquiry->id,
            'media_asset_id' => $inquiryImage->id,
            'is_visible' => true,
            'sort_order' => 1,
        ]);

        $testimonialSection = HomepageSection::firstOrCreate(['section_key' => 'testimonials']);
        $testimonialSection->update(['section_title' => 'What our clients say', 'is_visible' => true]);

        HomepageTestimonial::truncate();
        $testImg1 = $this->createMedia('https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop', 200, 200, 't1.jpg');
        HomepageTestimonial::create([
            'homepage_section_id' => $testimonialSection->id,
            'customer_name' => 'Rahul Sharma',
            'location_or_role' => 'Interior Designer',
            'body_text' => 'The wooden art pieces from Zarokha completely transformed my client\'s living space.',
            'image_media_id' => $testImg1->id,
            'status' => 'published',
            'is_visible' => true,
        ]);

        $this->command->info('Demo Data Seeded Successfully!');
    }

    private function createMedia($url, $w, $h, $filename)
    {
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(10)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ])->get($url);

            if (!$response->successful()) {
                // Fallback to picsum
                $response = \Illuminate\Support\Facades\Http::timeout(10)->get("https://picsum.photos/{$w}/{$h}");
            }
            $content = $response->body();
        } catch (\Exception $e) {
            // Absolute fallback
            $content = file_get_contents("https://placehold.co/{$w}x{$h}/png");
        }

        if (!$content) return null;

        Storage::disk('public')->put('demo/' . $filename, $content);

        $asset = MediaAsset::create([
            'disk' => 'public',
            'directory' => 'demo',
            'filename' => $filename,
            'original_filename' => $filename,
            'mime_type' => 'image/jpeg',
            'extension' => 'jpg',
            'bytes' => strlen($content),
            'width' => $w,
            'height' => $h,
            'status' => 'ready',
            'visibility' => 'public',
        ]);

        MediaVariant::create([
            'media_asset_id' => $asset->id,
            'variant_key' => 'default',
            'format' => 'webp',
            'path' => 'demo/' . $filename,
            'width' => $w,
            'height' => $h,
            'bytes' => strlen($content),
            'is_primary' => true,
        ]);

        return $asset;
    }
}
