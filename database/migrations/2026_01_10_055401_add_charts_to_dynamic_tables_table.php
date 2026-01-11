<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dynamic_tables', function (Blueprint $table) {
            $table->json('charts')->nullable()->after('has_row_total');
        });
    }

    public function down(): void
    {
        Schema::table('dynamic_tables', function (Blueprint $table) {
            $table->dropColumn('charts');
        });
    }
};