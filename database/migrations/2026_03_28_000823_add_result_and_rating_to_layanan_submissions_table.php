<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('layanan_submissions', function (Blueprint $table) {
            // Hasil layanan dari admin
            $table->json('result_files')->nullable()->after('catatan_admin');

            // Penilaian dari pengguna
            $table->unsignedTinyInteger('rating')->nullable()->after('result_link');
            $table->text('feedback')->nullable()->after('rating');
            $table->timestamp('rated_at')->nullable()->after('feedback');
        });
    }

    public function down(): void
    {
        Schema::table('layanan_submissions', function (Blueprint $table) {
            $table->dropColumn(['result_files', 'rating', 'feedback', 'rated_at']);
        });
    }
};