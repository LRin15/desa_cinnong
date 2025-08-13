<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('infografis', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('gambar'); // Akan menyimpan path ke file gambar
            $table->date('tanggal_terbit');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('infografis');
    }
};