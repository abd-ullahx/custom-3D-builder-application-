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
        Schema::table('dealers', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->unique()->after('id');
            $table->string('password')->nullable()->after('email');
            $table->rememberToken()->after('password');
            $table->timestamp('approved_at')->nullable()->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dealers', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'password',
                'remember_token',
                'approved_at'
            ]);
        });
    }
};
