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
        Schema::table('dealer_applications', function (Blueprint $table) {
            $table->dropColumn('custom_area');
            $table->string('custom_zip_code')->nullable()->after('area_id');
            $table->decimal('custom_latitude', 10, 7)->nullable()->after('custom_zip_code');
            $table->decimal('custom_longitude', 10, 7)->nullable()->after('custom_latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dealer_applications', function (Blueprint $table) {
            $table->dropColumn(['custom_zip_code', 'custom_latitude', 'custom_longitude']);
            $table->string('custom_area')->nullable()->after('area_id');
        });
    }
};
