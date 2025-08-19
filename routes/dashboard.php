<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

// Grup untuk semua rute di dalam area admin
// Semua rute di sini akan memiliki prefix '/admin' dan memerlukan login
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    
    // Rute utama dasbor
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // (Placeholder) Rute untuk mengelola berita, infografis, dan pengguna
    // Route::resource('berita', BeritaAdminController::class);
    // Route::resource('infografis', InfografisAdminController::class);
    // Route::resource('users', UserAdminController::class);

});