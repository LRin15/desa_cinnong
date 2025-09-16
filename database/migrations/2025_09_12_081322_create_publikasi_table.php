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
        Schema::create('publikasi', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_publikasi');
            $table->string('nama_file'); // Nama file unik yang disimpan di server
            $table->string('nama_asli_file'); // Nama file asli saat di-upload
            $table->string('tipe_file'); // e.g., pdf, docx, xlsx
            $table->unsignedInteger('ukuran_file'); // Ukuran file dalam bytes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publikasi');
    }
};