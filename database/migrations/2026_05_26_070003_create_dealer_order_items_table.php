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
        Schema::create('dealer_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dealer_order_id')->constrained('dealer_orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('product_name');
            $table->integer('qty');
            $table->string('size');
            $table->string('color')->nullable();
            $table->string('custom_name')->nullable();
            $table->string('custom_number')->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dealer_order_items');
    }
};
