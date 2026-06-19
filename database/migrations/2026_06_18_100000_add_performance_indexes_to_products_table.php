<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Add performance indexes to the products table.
 *
 * These indexes dramatically speed up the common queries:
 *  - WHERE status = true   (all storefront queries)
 *  - WHERE slug = ?        (product detail page)
 *  - WHERE is_featured = ? (featured product filter)
 *  - Composite (status + created_at) for "latest active products" query
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index('status',      'products_status_index');
            $table->index('slug',        'products_slug_index');
            $table->index('is_featured', 'products_is_featured_index');
            $table->index(['status', 'created_at'], 'products_status_created_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_status_index');
            $table->dropIndex('products_slug_index');
            $table->dropIndex('products_is_featured_index');
            $table->dropIndex('products_status_created_at_index');
        });
    }
};
