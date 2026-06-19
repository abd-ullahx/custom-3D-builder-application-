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
        Schema::create('home_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('count');
            $table->string('gradient')->default('from-[#0EA5E9]/70 via-[#0284C7]/60 to-[#1D4ED8]/80');
            $table->string('image_path')->nullable();
            $table->text('image_url')->nullable();
            $table->boolean('status')->default(true);
            $table->integer('order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_categories');
    }
};
