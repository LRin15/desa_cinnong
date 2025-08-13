<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekap_penduduks', function (Blueprint $table) {
            $table->id();
            $table->integer('tahun');
            $table->integer('bulan'); // 1 = Januari, 2 = Februari, dst.
            $table->string('nama_dusun');
            $table->integer('jumlah_l'); // Jumlah Laki-laki
            $table->integer('jumlah_p'); // Jumlah Perempuan
            $table->timestamps();

            // Membuat unique constraint agar tidak ada data duplikat untuk dusun, tahun, dan bulan yang sama
            $table->unique(['tahun', 'bulan', 'nama_dusun']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekap_penduduks');
    }
};
