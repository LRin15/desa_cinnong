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
        // Tabel untuk menyimpan definisi tabel
        Schema::create('dynamic_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama tabel untuk display
            $table->string('table_name')->unique(); // Nama tabel di database
            $table->text('description')->nullable();
            $table->json('columns'); // Struktur kolom dalam JSON
            $table->timestamps();
        });

        // Tabel untuk menyimpan data tabel dinamis
        Schema::create('dynamic_table_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dynamic_table_id')->constrained()->onDelete('cascade');
            $table->json('data'); // Data row dalam JSON
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dynamic_table_data');
        Schema::dropIfExists('dynamic_tables');
    }
};
