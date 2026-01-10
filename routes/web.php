<?php
// routes/web.php - Tambahkan route layanan

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\DataDesaController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\InfografisController;
use App\Http\Controllers\PublikasiController;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\Admin\ProfilDesaController;
use App\Http\Controllers\LayananController;

// Rute Utama
Route::get('/', [PageController::class, 'beranda'])->name('beranda');
Route::get('/profil-desa', [ProfilDesaController::class, 'show'])->name('profil.show');
Route::get('/data-desa', [DataDesaController::class, 'index'])->name('data.desa');
Route::get('/data-desa/{table}/download', [DataDesaController::class, 'download'])->name('data-desa.download');
Route::get('/infografis', [InfografisController::class, 'index'])->name('infografis.desa');
Route::get('/infografis/{infografis}', [InfografisController::class, 'show'])->name('infografis.detail');
Route::get('/berita', [BeritaController::class, 'index'])->name('berita');
Route::get('/berita/{slug}', [BeritaController::class, 'show'])->name('berita.detail');

// Route publikasi
Route::get('/publikasi', [PublikasiController::class, 'index'])->name('publikasi.index');
Route::get('/publikasi/{publikasi}/download', [PublikasiController::class, 'download'])->name('publikasi.download');

// Rute untuk menerima data form pengaduan
Route::post('/pengaduan', [PengaduanController::class, 'store'])->name('pengaduan.store');

// ===== ROUTES LAYANAN ADMINISTRASI KEPENDUDUKAN =====
Route::prefix('layanan')->name('layanan.')->group(function () {
    Route::get('/surat-pengantar-ktp', [LayananController::class, 'ktp'])->name('ktp');
    Route::get('/surat-pengantar-kk', [LayananController::class, 'kk'])->name('kk');
    Route::get('/surat-keterangan-domisili', [LayananController::class, 'domisili'])->name('domisili');
    Route::get('/surat-keterangan-usaha', [LayananController::class, 'usaha'])->name('usaha');
    Route::get('/surat-keterangan-tidak-mampu', [LayananController::class, 'sktm'])->name('sktm');
    Route::get('/surat-keterangan-kelahiran', [LayananController::class, 'kelahiran'])->name('kelahiran');
    Route::get('/surat-keterangan-kematian', [LayananController::class, 'kematian'])->name('kematian');
    
    // Layanan Administrasi Umum
    Route::get('/surat-pengantar-nikah', [LayananController::class, 'nikah'])->name('nikah');
    Route::get('/surat-keterangan-pindah', [LayananController::class, 'pindah'])->name('pindah');
    Route::get('/surat-izin-kegiatan', [LayananController::class, 'izinKegiatan'])->name('izin-kegiatan');
    Route::get('/surat-rekomendasi-desa', [LayananController::class, 'rekomendasi'])->name('rekomendasi');
    
    // Route untuk submit form layanan
    Route::post('/submit', [LayananController::class, 'submit'])->name('submit');
});

// Rute otentikasi
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/dashboard.php';