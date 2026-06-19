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
        Schema::table('orders', function (Blueprint $table) {
            $table->text('shipping_address')->nullable()->after('billing_email');
            $table->string('phone')->nullable()->after('shipping_address');
            $table->string('payment_method')->default('Cash on Delivery')->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shipping_address', 'phone', 'payment_method']);
        });
    }
};
