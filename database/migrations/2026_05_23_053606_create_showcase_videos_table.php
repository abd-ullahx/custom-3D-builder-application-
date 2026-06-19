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
        Schema::create('showcase_videos', function (Blueprint $table) {
            $table->id();
            $table->string('phase_name'); // e.g., "Action Phase" or "Craft Phase"
            $table->string('video_path')->nullable(); // For uploaded video files
            $table->text('video_url')->nullable(); // For direct video URLs
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
        Schema::dropIfExists('showcase_videos');
    }
};
