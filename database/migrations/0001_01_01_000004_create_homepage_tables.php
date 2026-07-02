<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key', 60)->unique();
            $table->string('section_title')->nullable();
            $table->text('section_intro')->nullable();
            $table->string('cta_label', 80)->nullable();
            $table->string('cta_url', 2048)->nullable();
            $table->string('source_mode', 30)->default('manual');
            $table->foreignId('background_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('mobile_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedTinyInteger('max_items')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['is_visible', 'sort_order'], 'homepage_sections_visible_sort_idx');
        });

        Schema::create('homepage_featured_product_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('homepage_section_id')->constrained('homepage_sections')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->unique(['homepage_section_id', 'product_id'], 'hfpi_section_product_unique');
            $table->index(['homepage_section_id', 'sort_order', 'product_id'], 'hfpi_section_sort_product_idx');
        });

        Schema::create('why_choose_us_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('homepage_section_id')->constrained('homepage_sections')->cascadeOnDelete();
            $table->string('heading', 150);
            $table->text('body_text');
            $table->foreignId('icon_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['homepage_section_id', 'is_active', 'sort_order', 'id'], 'wcu_section_active_sort_idx');
        });
    }

    public function down(): void
    {
        foreach ([
            'why_choose_us_items',
            'homepage_featured_product_items',
            'homepage_sections',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
