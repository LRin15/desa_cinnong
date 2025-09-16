<?php

namespace App\Http\Controllers;

use App\Models\Publikasi;
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
        
        // Kembalikan response download. Ini akan menghasilkan BinaryFileResponse
        // yang sesuai dengan "janji" di atas.
        return response()->download($path, $publikasi->nama_asli_file);
    }
}