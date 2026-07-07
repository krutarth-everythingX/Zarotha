<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table): void {
            $table->string('project_location', 190)->nullable()->after('subject');
            $table->string('budget_range', 120)->nullable()->after('project_location');
            $table->date('expected_project_start')->nullable()->after('budget_range');
            $table->json('uploaded_images')->nullable()->after('message');
        });
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table): void {
            $table->dropColumn([
                'project_location',
                'budget_range',
                'expected_project_start',
                'uploaded_images',
            ]);
        });
    }
};
