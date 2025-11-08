<?php

namespace App\Http\Controllers;

use App\Models\Publikasi;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PublikasiController extends Controller
{
    /**
     * Menampilkan halaman daftar publikasi dengan pagination dan pencarian.
     */
    public function index(Request $request)
    {
        // Ambil nama desa dari settings
        $settings = Setting::pluck('value', 'key');
        
        $publikasiList = Publikasi::query()
            ->when($request->search, fn($query, $search) => $query->where('judul', 'like', '%' . $search . '%'))
            ->latest('tanggal_publikasi')
            ->paginate(10)
            ->withQueryString()
            ->through(fn($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'deskripsi' => $item->deskripsi,
                'tanggal_publikasi' => $item->tanggal_publikasi->format('d F Y'),
                'tipe_file' => $item->tipe_file,
                'ukuran_file' => number_format($item->ukuran_file / 1024, 2) . ' KB',
            ]);

        return Inertia::render('Publikasi', [
            'publikasiList' => $publikasiList,
            'filters' => $request->only('search'),
            'settings' => $settings,
        ]);
    }

    /**
     * Menangani permintaan download file.
     */
    public function download(Publikasi $publikasi): BinaryFileResponse
    {
        // Path lengkap menuju file di dalam folder public
        $path = public_path('dokumen/publikasi/' . $publikasi->nama_file);
        
        // Periksa apakah file benar-benar ada untuk menghindari error
        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }
        
        // Kembalikan response download
        return response()->download($path, $publikasi->nama_asli_file);
    }
}