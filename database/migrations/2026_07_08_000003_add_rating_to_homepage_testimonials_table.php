<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homepage_testimonials', function (Blueprint $table): void {
            $table->unsignedTinyInteger('rating')->default(5)->after('body_text');
        });
    }

    public function down(): void
    {
        Schema::table('homepage_testimonials', function (Blueprint $table): void {
            $table->dropColumn('rating');
        });
    }
};
