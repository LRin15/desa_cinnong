<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PageController; // Impor PageController
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rute Utama
Route::get('/', [PageController::class, 'beranda'])->name('beranda');
Route::get('/profil-desa', [PageController::class, 'profilDesa'])->name('profil.desa');
Route::get('/data-desa', [PageController::class, 'dataDesa'])->name('data.desa');
Route::get('/infografis-desa', [PageController::class, 'infografisDesa'])->name('infografis.desa');


// Rute otentikasi (jika diperlukan nanti)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
