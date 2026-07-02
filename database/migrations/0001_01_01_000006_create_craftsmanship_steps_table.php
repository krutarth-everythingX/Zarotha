<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('craftsmanship_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->restrictOnDelete();
            $table->string('title', 150);
            $table->text('body_text');
            $table->foreignId('media_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['page_id', 'is_active', 'sort_order', 'id'], 'craft_steps_page_active_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('craftsmanship_steps');
    }
};
