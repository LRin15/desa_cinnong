<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\DataDesaController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\InfografisController;
use App\Models\Berita;
use Illuminate\Support\Str;

// Rute Utama
Route::get('/', [PageController::class, 'beranda'])->name('beranda');
Route::get('/profil-desa', [PageController::class, 'profilDesa'])->name('profil.desa');
Route::get('/data-desa', [DataDesaController::class, 'index'])->name('data.desa');
Route::get('/infografis', [InfografisController::class, 'index'])->name('infografis.desa');
Route::get('/infografis/{infografis}', [InfografisController::class, 'show'])->name('infografis.detail');
Route::get('/berita', [BeritaController::class, 'index'])->name('berita');
Route::get('/berita/{slug}', [BeritaController::class, 'show'])->name('berita.detail');

// Rute otentikasi (jika diperlukan nanti)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/', function () {
    $beritaTerbaru = Berita::latest('tanggal_terbit')
        ->take(3)
        ->get()
        ->map(fn ($berita) => [
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'kategori' => $berita->kategori,
            'tanggal_terbit' => $berita->tanggal_terbit->format('d F Y'),
            'kutipan' => Str::limit($berita->kutipan, 100),
            // 👇 TAMBAHKAN BARIS INI 👇
            'gambar' => $berita->gambar ? Storage::url($berita->gambar) : null,
        ]);

    return Inertia::render('Beranda', [
        'beritaTerbaru' => $beritaTerbaru,
    ]);

})->name('beranda');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/dashboard.php';