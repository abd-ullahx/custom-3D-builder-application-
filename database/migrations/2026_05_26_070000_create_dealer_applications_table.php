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
        Schema::create('dealer_applications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('business_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('address');
            $table->string('city');
            $table->string('country');
            $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dealer_applications');
    }
};
