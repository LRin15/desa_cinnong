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
use App\Http\Controllers\PublikasiController;

// Rute Utama
Route::get('/', [PageController::class, 'beranda'])->name('beranda');
Route::get('/profil-desa', [PageController::class, 'profilDesa'])->name('profil.desa');
Route::get('/data-desa', [DataDesaController::class, 'index'])->name('data.desa');
Route::get('/infografis', [InfografisController::class, 'index'])->name('infografis.desa');
Route::get('/infografis/{infografis}', [InfografisController::class, 'show'])->name('infografis.detail');
Route::get('/berita', [BeritaController::class, 'index'])->name('berita');
Route::get('/berita/{slug}', [BeritaController::class, 'show'])->name('berita.detail');

// Route publikasi - pastikan ini ada dan benar
Route::get('/publikasi', [PublikasiController::class, 'index'])->name('publikasi.index');
Route::get('/publikasi/{publikasi}/download', [PublikasiController::class, 'download'])->name('publikasi.download');

// Rute otentikasi (jika diperlukan nanti)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Debug: tampilkan semua route
Route::get('/debug-routes', function() {
    return collect(Route::getRoutes())->map(function($route) {
        return [
            'uri' => $route->uri(),
            'name' => $route->getName(),
            'methods' => $route->methods()
        ];
    });
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/dashboard.php';