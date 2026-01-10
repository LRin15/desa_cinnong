<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\InfografisController;
use App\Http\Controllers\Admin\PengaduanController;
use App\Http\Controllers\Admin\DynamicTableController;
use App\Http\Controllers\Admin\LayananController as AdminLayananController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PublikasiController as AdminPublikasiController;
use App\Http\Controllers\Admin\ProfilDesaController;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('infografis', InfografisController::class);
    Route::resource('berita', BeritaController::class);
    Route::resource('publikasi', AdminPublikasiController::class);
    Route::get('/profil-desa/edit', [ProfilDesaController::class, 'edit'])->name('profil.edit');
    Route::post('/profil-desa', [ProfilDesaController::class, 'update'])->name('profil.update');
    
    // Route untuk kelola pengaduan
    Route::get('/pengaduan', [PengaduanController::class, 'index'])->name('pengaduan.index');
    Route::put('/pengaduan/{pengaduan}/update-status', [PengaduanController::class, 'updateStatus'])->name('pengaduan.update-status');
    Route::delete('/pengaduan/{pengaduan}', [PengaduanController::class, 'destroy'])->name('pengaduan.destroy');
    
    // Route untuk kelola layanan
    Route::get('/layanan', [AdminLayananController::class, 'index'])->name('layanan.index');
    Route::put('/layanan/{layanan}/update-status', [AdminLayananController::class, 'updateStatus'])->name('layanan.update-status');
    Route::delete('/layanan/{layanan}', [AdminLayananController::class, 'destroy'])->name('layanan.destroy');
    
    // Routes untuk Dynamic Tables
    Route::resource('dynamic-tables', DynamicTableController::class)->parameters([
        'dynamic-tables' => 'dynamicTable'
    ]);

    // Route tambahan untuk Dynamic Tables yang tidak dicover oleh resource
    Route::prefix('dynamic-tables/{dynamicTable}')->name('dynamic-tables.')->group(function () {
        Route::get('/insert', [DynamicTableController::class, 'showInsertForm'])->name('insert');
        Route::post('/insert', [DynamicTableController::class, 'insertData'])->name('insert-data');
        Route::put('/data/{data}', [DynamicTableController::class, 'updateData'])->name('update-data');
        Route::delete('/data/{data}', [DynamicTableController::class, 'deleteData'])->name('delete-data');
    });
});

// Add a redirect from /dashboard to /admin/dashboard for convenience
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});