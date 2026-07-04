<?php

namespace Database\Seeders;

use App\Enums\PublishStatus;
use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->first();

        if (! $user) {
            return;
        }

        Page::query()->updateOrCreate(
            ['page_key' => 'about_us'],
            [
                'slug' => 'about-us',
                'navigation_label' => 'About Us',
                'title' => 'About Us',
                'intro_title' => 'Crafted wooden furniture for considered spaces',
                'intro_body' => 'Zarokha Wooden Arts brings together custom furniture planning, careful material selection, and workshop-led execution for homes, offices, and hospitality interiors.',
                'body_html' => null,
                'about_details' => [
                    'hero_note' => 'Handcrafted furniture and wooden art shaped for daily use, long life, and warm interiors.',
                    'video_url' => '',
                    'video_title' => 'Zarokha Wooden Arts introduction',
                    'who_we_are_kicker' => 'Who we are',
                    'who_we_are_title' => 'An experienced wooden furniture and decor studio',
                    'who_we_are_body' => 'We create furniture, wall pieces, storage, display units, and custom wooden details with a focus on proportion, finish, and practical installation. Each project is guided through design conversation, production planning, and quality review before handover.',
                    'why_title' => 'Why choose us?',
                    'why_items' => [
                        'Direct workshop-led manufacturing with careful quality checks.',
                        'Custom furniture support for residential, office, retail, and hospitality spaces.',
                        'Material selection, finishing, and sizing planned around real site needs.',
                        'Clear inquiry flow from concept discussion to final installation guidance.',
                        'Experienced craftspeople working with durable wood, hardware, and finishes.',
                        'Responsive after-sales communication for care, updates, and repeat work.',
                    ],
                    'catalog_title' => 'Explore our custom wooden furniture concepts',
                    'catalog_body' => 'Browse published products or share a requirement for a made-to-order piece.',
                    'gallery_media_ids' => [],
                    'vision_title' => 'Vision & Mission',
                    'vision_body' => 'Our vision is to make thoughtfully designed wooden furniture accessible to customers who value comfort, durability, and a calm material presence in their spaces.',
                    'mission_title' => 'Our mission',
                    'mission_body' => 'Our mission is to combine craft discipline, dependable timelines, and honest communication so every client receives furniture that feels personal, useful, and lasting.',
                    'aim_title' => 'Our aim is to promote',
                    'aim_body' => 'Customized wooden designs with comfort, strength, durability, and visual satisfaction.',
                    'stats' => [
                        ['value' => '10+', 'label' => 'Furniture and decor categories'],
                        ['value' => '15+', 'label' => 'Years of working experience'],
                        ['value' => '250+', 'label' => 'Custom project conversations'],
                    ],
                    'strength_kicker' => 'Our strength',
                    'strength_title' => 'Workshop discipline with a design-first approach',
                    'strength_body' => 'Our process combines measurement, material planning, finishing control, and installation awareness. The result is furniture that looks refined, performs reliably, and feels at home in the spaces where it is used every day.',
                    'skills' => [
                        ['label' => 'Skilled craft and finishing', 'percent' => 96],
                        ['label' => 'Project planning and coordination', 'percent' => 94],
                    ],
                    'client_title' => 'Our Clients',
                ],
                'cta_label' => 'Explore Products',
                'cta_url' => '/products',
                'status' => PublishStatus::Published->value,
                'published_at' => now(),
                'meta_title' => 'About Zarokha Wooden Arts',
                'meta_description' => 'Learn about Zarokha Wooden Arts, our custom wooden furniture approach, vision, mission, workshop strengths, and clients.',
                'robots_index' => true,
                'robots_follow' => true,
                'created_by_user_id' => $user->id,
                'updated_by_user_id' => $user->id,
            ],
        );
    }
}
