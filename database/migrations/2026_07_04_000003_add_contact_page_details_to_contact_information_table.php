<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_information', function (Blueprint $table): void {
            $table->string('page_title')->nullable()->after('whatsapp_text');
            $table->text('page_intro')->nullable()->after('page_title');
            $table->string('form_title')->nullable()->after('page_intro');
            $table->string('submit_label', 80)->nullable()->after('form_title');
            $table->json('inquiry_type_options')->nullable()->after('submit_label');
            $table->string('location_kicker', 100)->nullable()->after('inquiry_type_options');
            $table->string('location_title')->nullable()->after('location_kicker');
            $table->text('location_body')->nullable()->after('location_title');
            $table->string('address_label', 120)->nullable()->after('location_body');
            $table->string('map_embed_url', 2048)->nullable()->after('address_label');
            $table->string('map_link_url', 2048)->nullable()->after('map_embed_url');
            $table->json('contact_social_links')->nullable()->after('map_link_url');
        });
    }

    public function down(): void
    {
        Schema::table('contact_information', function (Blueprint $table): void {
            $table->dropColumn([
                'page_title',
                'page_intro',
                'form_title',
                'submit_label',
                'inquiry_type_options',
                'location_kicker',
                'location_title',
                'location_body',
                'address_label',
                'map_embed_url',
                'map_link_url',
                'contact_social_links',
            ]);
        });
    }
};
