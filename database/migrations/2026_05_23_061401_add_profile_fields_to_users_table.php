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
        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name')->nullable()->after('name');
            $table->string('phone')->nullable()->after('last_name');
            $table->boolean('email_notifications')->default(true)->after('phone');
            $table->boolean('sms_alerts')->default(false)->after('email_notifications');
            $table->boolean('newsletter')->default(true)->after('sms_alerts');
            $table->boolean('two_factor_auth')->default(false)->after('newsletter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'last_name',
                'phone',
                'email_notifications',
                'sms_alerts',
                'newsletter',
                'two_factor_auth'
            ]);
        });
    }
};
