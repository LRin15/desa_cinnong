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
        Schema::table('dynamic_tables', function (Blueprint $table) {
            $table->string('source', 500)->nullable()->after('has_row_total');
            $table->text('notes')->nullable()->after('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dynamic_tables', function (Blueprint $table) {
            $table->dropColumn(['source', 'notes']);
        });
    }
};