<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->foreignId('light_logo_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('dark_logo_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->boolean('show_social_links_on_hero')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropForeign(['light_logo_media_id']);
            $table->dropForeign(['dark_logo_media_id']);
            $table->dropColumn(['light_logo_media_id', 'dark_logo_media_id', 'show_social_links_on_hero']);
        });
    }
};
