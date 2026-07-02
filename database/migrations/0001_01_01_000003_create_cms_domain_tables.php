<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('slug', 160)->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'sort_order', 'id'], 'categories_active_sort_idx');
        });

        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->string('disk', 50);
            $table->string('directory')->nullable();
            $table->string('filename');
            $table->string('original_filename');
            $table->string('mime_type', 100);
            $table->string('extension', 20);
            $table->unsignedBigInteger('bytes');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->string('credit')->nullable();
            $table->char('sha256', 64)->nullable()->unique();
            $table->string('status', 20)->default('uploaded');
            $table->string('visibility', 20)->default('public');
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['status', 'created_at', 'id'], 'media_assets_status_created_idx');
        });

        Schema::create('media_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_asset_id')->constrained()->cascadeOnDelete();
            $table->string('variant_key', 50);
            $table->string('format', 20);
            $table->string('path');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedBigInteger('bytes')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            $table->unique(['media_asset_id', 'variant_key'], 'media_variants_asset_variant_unique');
            $table->index(['media_asset_id', 'is_primary'], 'media_variants_asset_primary_idx');
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('page_key', 50)->unique();
            $table->string('slug', 190)->unique();
            $table->string('navigation_label', 100)->nullable();
            $table->string('title');
            $table->string('intro_title')->nullable();
            $table->text('intro_body')->nullable();
            $table->longText('body_html')->nullable();
            $table->foreignId('hero_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->string('cta_label', 80)->nullable();
            $table->string('cta_url', 2048)->nullable();
            $table->date('effective_date')->nullable();
            $table->string('status', 20)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->string('og_title')->nullable();
            $table->string('og_description', 320)->nullable();
            $table->foreignId('og_image_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->string('canonical_url', 2048)->nullable();
            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);
            $table->foreignId('created_by_user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['status', 'published_at', 'id'], 'pages_status_published_idx');
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name', 150);
            $table->string('default_meta_title')->nullable();
            $table->string('default_meta_description', 320)->nullable();
            $table->foreignId('default_og_image_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->boolean('default_robots_index')->default(true);
            $table->boolean('default_robots_follow')->default(true);
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('contact_information', function (Blueprint $table) {
            $table->id();
            $table->string('business_name', 150)->nullable();
            $table->string('phone_primary', 50)->nullable();
            $table->string('phone_secondary', 50)->nullable();
            $table->string('email_primary', 190)->nullable();
            $table->string('email_secondary', 190)->nullable();
            $table->string('whatsapp_number', 50)->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->nullable();
            $table->boolean('show_address')->default(false);
            $table->boolean('show_phone')->default(true);
            $table->boolean('show_email')->default(true);
            $table->boolean('show_whatsapp')->default(true);
            $table->text('contact_intro')->nullable();
            $table->text('form_helper_text')->nullable();
            $table->text('success_message')->nullable();
            $table->text('consent_text')->nullable();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform_key', 50)->unique();
            $table->string('label', 100)->nullable();
            $table->string('url', 2048);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'sort_order', 'id'], 'social_links_active_sort_idx');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('name', 190);
            $table->string('slug', 190)->unique();
            $table->string('short_description', 500)->nullable();
            $table->longText('full_description')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('material', 150)->nullable();
            $table->string('finish', 150)->nullable();
            $table->foreignId('featured_media_id')->nullable()->constrained('media_assets')->restrictOnDelete();
            $table->string('status', 20)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_best_selling')->default(false);
            $table->boolean('is_latest')->default(false);
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->string('og_title')->nullable();
            $table->string('og_description', 320)->nullable();
            $table->foreignId('og_image_media_id')->nullable()->constrained('media_assets')->restrictOnDelete();
            $table->string('canonical_url', 2048)->nullable();
            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);
            $table->foreignId('created_by_user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['status', 'published_at', 'sort_order', 'id'], 'products_status_publish_sort_idx');
            $table->index(['category_id', 'status', 'published_at', 'id'], 'products_category_status_idx');
            $table->index(['is_featured', 'status', 'published_at', 'id'], 'products_featured_status_idx');
            $table->index(['is_best_selling', 'status', 'published_at', 'id'], 'products_best_selling_idx');
            $table->index(['is_latest', 'published_at', 'id'], 'products_latest_published_idx');

            if (Schema::getConnection()->getDriverName() !== 'sqlite') {
                $table->fullText(['name', 'short_description', 'full_description'], 'products_search_fulltext');
            }
        });

        Schema::create('product_media', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('media_asset_id');
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('alt_text_override')->nullable();
            $table->boolean('is_gallery_visible')->default(true);
            $table->timestamps();
            $table->unique(['product_id', 'media_asset_id'], 'product_media_product_asset_unique');
            $table->index(['product_id', 'sort_order', 'id'], 'product_media_sort_idx');
        });

        Schema::table('product_media', function (Blueprint $table) {
            $table->foreign('product_id', 'product_media_product_fk')
                ->references('id')
                ->on('products')
                ->cascadeOnDelete();
            $table->foreign('media_asset_id', 'product_media_media_asset_fk')
                ->references('id')
                ->on('media_assets')
                ->restrictOnDelete();
        });

    }

    public function down(): void
    {
        foreach ([
            'product_media',
            'products',
            'social_links',
            'contact_information',
            'site_settings',
            'pages',
            'media_variants',
            'media_assets',
            'categories',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
