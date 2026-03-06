<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layanan_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('jenis_layanan');
            $table->json('form_data');          // Data form (tanpa nama/email — diambil dari relasi user)
            $table->json('uploaded_files')->nullable();
            $table->enum('status', ['pending', 'diproses', 'selesai', 'ditolak'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('jenis_layanan');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layanan_submissions');
    }
};