<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_banners', function (Blueprint $table) {
            $table->id();
            $table->string('eyebrow', 100)->nullable();
            $table->string('headline');
            $table->text('body_text')->nullable();
            $table->string('primary_cta_label', 80)->nullable();
            $table->string('primary_cta_url', 2048)->nullable();
            $table->unsignedBigInteger('desktop_media_id')->nullable();
            $table->unsignedBigInteger('mobile_media_id')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedBigInteger('created_by_user_id')->nullable();
            $table->unsignedBigInteger('updated_by_user_id')->nullable();
            $table->timestamps();
            $table->index(['is_active', 'sort_order', 'id'], 'hero_banners_active_sort_idx');
        });

        Schema::table('hero_banners', function (Blueprint $table) {
            $table->foreign('desktop_media_id', 'hero_banners_desktop_media_fk')
                ->references('id')
                ->on('media_assets')
                ->restrictOnDelete();
            $table->foreign('mobile_media_id', 'hero_banners_mobile_media_fk')
                ->references('id')
                ->on('media_assets')
                ->restrictOnDelete();
            $table->foreign('created_by_user_id', 'hero_banners_created_by_fk')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
            $table->foreign('updated_by_user_id', 'hero_banners_updated_by_fk')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_banners');
    }
};
