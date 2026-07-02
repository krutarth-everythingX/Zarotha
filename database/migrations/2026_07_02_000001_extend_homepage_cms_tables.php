<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_banners', function (Blueprint $table): void {
            $table->string('secondary_cta_label', 80)->nullable()->after('primary_cta_url');
            $table->string('secondary_cta_url', 2048)->nullable()->after('secondary_cta_label');
            $table->unsignedTinyInteger('overlay_opacity')->default(35)->after('mobile_media_id');
            $table->string('text_theme', 20)->default('light')->after('overlay_opacity');
        });

        Schema::table('homepage_sections', function (Blueprint $table): void {
            $table->string('background_color', 7)->nullable()->after('background_media_id');
        });

        Schema::create('homepage_floating_product_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('homepage_section_id')->constrained('homepage_sections')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->restrictOnDelete();
            $table->foreignId('image_media_id')->nullable()->constrained('media_assets')->restrictOnDelete();
            $table->string('alt_text')->nullable();
            $table->string('position', 40);
            $table->string('tilt_preset', 30)->default('full');
            $table->string('tap_label', 40)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['homepage_section_id', 'sort_order'], 'hfpi_floating_section_sort_unique');
            $table->index(['homepage_section_id', 'is_visible', 'sort_order'], 'hfpi_floating_visible_sort_idx');
        });

        Schema::create('homepage_testimonials', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('homepage_section_id')->constrained('homepage_sections')->cascadeOnDelete();
            $table->string('customer_name', 150);
            $table->string('location_or_role', 150)->nullable();
            $table->text('body_text');
            $table->foreignId('image_media_id')->nullable()->constrained('media_assets')->restrictOnDelete();
            $table->string('status', 20)->default('draft');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['homepage_section_id', 'status', 'is_visible', 'sort_order'], 'homepage_testimonials_public_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_testimonials');
        Schema::dropIfExists('homepage_floating_product_items');

        Schema::table('homepage_sections', function (Blueprint $table): void {
            $table->dropColumn('background_color');
        });

        Schema::table('hero_banners', function (Blueprint $table): void {
            $table->dropColumn([
                'secondary_cta_label',
                'secondary_cta_url',
                'overlay_opacity',
                'text_theme',
            ]);
        });
    }
};
