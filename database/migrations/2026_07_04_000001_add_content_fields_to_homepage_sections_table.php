<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homepage_sections', function (Blueprint $table): void {
            if (! Schema::hasColumn('homepage_sections', 'eyebrow')) {
                $table->string('eyebrow', 120)->nullable()->after('section_key');
            }

            if (! Schema::hasColumn('homepage_sections', 'section_body')) {
                $table->text('section_body')->nullable()->after('section_intro');
            }

            if (! Schema::hasColumn('homepage_sections', 'secondary_cta_label')) {
                $table->string('secondary_cta_label', 80)->nullable()->after('cta_url');
            }

            if (! Schema::hasColumn('homepage_sections', 'secondary_cta_url')) {
                $table->string('secondary_cta_url', 2048)->nullable()->after('secondary_cta_label');
            }
        });
    }

    public function down(): void
    {
        Schema::table('homepage_sections', function (Blueprint $table): void {
            foreach (['secondary_cta_url', 'secondary_cta_label', 'section_body', 'eyebrow'] as $column) {
                if (Schema::hasColumn('homepage_sections', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
