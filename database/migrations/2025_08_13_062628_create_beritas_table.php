<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_xxxxxx_create_berita_table.php
public function up(): void
{
    Schema::create('berita', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->string('slug')->unique(); // Untuk URL yang rapi (SEO-friendly)
        $table->string('kategori');
        $table->text('kutipan'); // Ringkasan singkat berita
        $table->longText('isi'); // Konten lengkap berita
        $table->string('gambar')->nullable(); // Path ke file gambar
        $table->timestamp('tanggal_terbit')->useCurrent();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
};
