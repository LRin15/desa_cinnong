<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\InfografisController;
use App\Http\Controllers\Admin\PengaduanController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PublikasiController as AdminPublikasiController;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('infografis', InfografisController::class);
    Route::resource('berita', BeritaController::class);
    Route::resource('publikasi', AdminPublikasiController::class);
    
    // Route untuk kelola pengaduan
    Route::get('/pengaduan', [PengaduanController::class, 'index'])->name('pengaduan.index');
    Route::put('/pengaduan/{pengaduan}/update-status', [PengaduanController::class, 'updateStatus'])->name('pengaduan.update-status');
    Route::delete('/pengaduan/{pengaduan}', [PengaduanController::class, 'destroy'])->name('pengaduan.destroy');
});

// Add a redirect from /dashboard to /admin/dashboard for convenience
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});