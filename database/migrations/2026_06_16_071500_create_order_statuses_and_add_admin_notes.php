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
        // 1. Create order_statuses table
        Schema::create('order_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('badge_color')->default('primary'); // e.g. success, warning, primary, danger, info, secondary
            $table->timestamps();
        });

        // 2. Change status column in dealer_orders from enum to string
        Schema::table('dealer_orders', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
            $table->text('admin_note')->nullable()->after('notes');
        });

        // 3. Add admin_note to orders table
        Schema::table('orders', function (Blueprint $table) {
            $table->text('admin_note')->nullable()->after('notes');
        });

        // 4. Seed default statuses directly
        DB::table('order_statuses')->insert([
            ['name' => 'Pending', 'badge_color' => 'warning', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Confirmed', 'badge_color' => 'info', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Processing', 'badge_color' => 'primary', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Shipped', 'badge_color' => 'info', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Delivered', 'badge_color' => 'success', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cancelled', 'badge_color' => 'danger', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('admin_note');
        });

        Schema::table('dealer_orders', function (Blueprint $table) {
            $table->dropColumn('admin_note');
            // Reverting column type changes in Laravel usually requires doctrine/dbal,
            // we keep it as string or change it back if needed.
        });

        Schema::dropIfExists('order_statuses');
    }
};
