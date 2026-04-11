<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\InfografisController;
use App\Http\Controllers\Admin\DynamicTableController;
use App\Http\Controllers\Admin\LayananController as AdminLayananController;
use App\Http\Controllers\Admin\LayananSettingsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PublikasiController as AdminPublikasiController;
use App\Http\Controllers\Admin\ProfilDesaController;

// Semua route admin dijaga middleware 'admin.only'
Route::middleware(['admin.only'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Konten
    Route::resource('users',      UserController::class);
    Route::resource('infografis', InfografisController::class);
    Route::resource('berita',     BeritaController::class);
    Route::resource('publikasi',  AdminPublikasiController::class);

    // Profil Desa
    Route::get('/profil-desa/edit', [ProfilDesaController::class, 'edit'])->name('profil.edit');
    Route::post('/profil-desa',     [ProfilDesaController::class, 'update'])->name('profil.update');

    // Kelola Layanan Submissions (termasuk Pengaduan & Aspirasi)
    Route::get('/layanan',                         [AdminLayananController::class, 'index'])->name('layanan.index');
    Route::match(['PUT', 'POST'], '/layanan/{layanan}/update-status', [AdminLayananController::class, 'updateStatus'])->name('layanan.update-status');
    Route::delete('/layanan/{layanan}',            [AdminLayananController::class, 'destroy'])->name('layanan.destroy');
    Route::delete('/admin/layanan/{layanan}/result-file', [App\Http\Controllers\Admin\LayananController::class, 'deleteResultFile'])->name('admin.layanan.delete-result-file');

    // Pengaturan Layanan (aktif / nonaktif)
    Route::get('/layanan-settings',              [LayananSettingsController::class, 'index'])->name('layanan-settings.index');
    Route::post('/layanan-settings/toggle',      [LayananSettingsController::class, 'toggleStatus'])->name('layanan-settings.toggle');
    Route::post('/layanan-settings/toggle-bulk', [LayananSettingsController::class, 'toggleBulk'])->name('layanan-settings.toggle-bulk');

    // Dynamic Tables
    Route::resource('dynamic-tables', DynamicTableController::class)
        ->parameters(['dynamic-tables' => 'dynamicTable']);

    Route::prefix('dynamic-tables/{dynamicTable}')->name('dynamic-tables.')->group(function () {
        Route::get('/insert',         [DynamicTableController::class, 'showInsertForm'])->name('insert');
        Route::post('/insert',        [DynamicTableController::class, 'insertData'])->name('insert-data');
        Route::put('/data/{data}',    [DynamicTableController::class, 'updateData'])->name('update-data');
        Route::delete('/data/{data}', [DynamicTableController::class, 'deleteData'])->name('delete-data');
        Route::get('/charts',         [DynamicTableController::class, 'charts'])->name('charts');
        Route::post('/charts',        [DynamicTableController::class, 'saveCharts'])->name('save-charts');
    });
});

// Redirect /dashboard → /admin/dashboard
Route::middleware(['admin.only'])->group(function () {
    Route::get('/dashboard', fn() => redirect()->route('admin.dashboard'))->name('dashboard');
});