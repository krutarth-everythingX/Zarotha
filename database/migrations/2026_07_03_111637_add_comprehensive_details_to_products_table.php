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
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->nullable()->after('slug');
            $table->string('product_type', 50)->nullable()->after('sku');

            // Core searchable fields
            $table->string('wood_type', 100)->nullable()->after('material');
            $table->string('style', 100)->nullable()->after('finish');

            // Pricing & Inventory
            $table->decimal('regular_price', 12, 2)->nullable()->after('is_latest');
            $table->decimal('sale_price', 12, 2)->nullable()->after('regular_price');
            $table->boolean('is_track_inventory')->default(false)->after('sale_price');
            $table->integer('stock_quantity')->nullable()->after('is_track_inventory');
            $table->string('availability', 50)->nullable()->after('stock_quantity');

            // Extensive dynamic data storage
            $table->json('details')->nullable()->after('availability');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'sku',
                'product_type',
                'wood_type',
                'style',
                'regular_price',
                'sale_price',
                'is_track_inventory',
                'stock_quantity',
                'availability',
                'details',
            ]);
        });
    }
};
