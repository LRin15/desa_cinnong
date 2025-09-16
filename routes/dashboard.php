<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\InfografisController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PublikasiController as AdminPublikasiController;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('infografis', InfografisController::class);
    Route::resource('berita', BeritaController::class);
    Route::resource('publikasi', AdminPublikasiController::class);
});

// Add a redirect from /dashboard to /admin/dashboard for convenience
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});