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
        // 1. Add dealer fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('password');
            $table->text('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->decimal('latitude', 10, 7)->nullable()->after('city');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('status')->default('active')->after('longitude');
            $table->foreignId('area_id')->nullable()->after('status')->constrained('areas')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('area_id');
        });

        // 2. Drop foreign key constraints pointing to dealers table
        Schema::table('dealer_orders', function (Blueprint $table) {
            $table->dropForeign(['dealer_id']);
        });

        Schema::table('coupons', function (Blueprint $table) {
            $table->dropForeign(['dealer_id']);
        });

        // 3. Drop dealers table
        Schema::dropIfExists('dealers');

        // 4. Re-create foreign keys pointing to users table
        Schema::table('dealer_orders', function (Blueprint $table) {
            $table->foreign('dealer_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('coupons', function (Blueprint $table) {
            $table->foreign('dealer_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Simple rollback: recreate dealers and alter tables back is not strictly required for this dev refactor,
        // but we can drop constraints and restore if needed. Since this is a direct refactor, dropping constraints
        // and deleting table is sufficient.
    }
};
