<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Infografis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InfografisController extends Controller
{
    /**
     * Menampilkan daftar semua infografis.
     */
    public function index()
    {
        return Inertia::render('Admin/Infografis/Index', [
            'infografis' => Infografis::latest()->paginate(10)->through(fn ($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'tanggal_terbit' => $item->tanggal_terbit->format('d F Y'),
                // Kirim URL lengkap dari gambar
                'gambar' => $item->gambar ? Storage::url($item->gambar) : null,
            ]),
            // Explicitly pass flash messages
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Menampilkan form untuk membuat infografis baru.
     */
    public function create()
    {
        return Inertia::render('Admin/Infografis/Create');
    }

    /**
     * Menyimpan infografis baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_terbit' => 'required|date',
            // Validasi gambar: harus berupa file gambar, required untuk create, maks 2MB
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('gambar')) {
            // Simpan gambar di 'public/infografis' dan dapatkan path-nya
            $path = $request->file('gambar')->store('infografis', 'public');
        }
        
        Infografis::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_terbit' => $request->tanggal_terbit,
            'gambar' => $path,
        ]);

        return redirect()->route('admin.infografis.index')
            ->with('success', 'Infografis berhasil dibuat.');
    }

    /**
     * Menampilkan form untuk mengedit infografis.
     */
    public function edit(Infografis $infografi)
    {
        return Inertia::render('Admin/Infografis/Edit', [
            'infografis' => [
                'id' => $infografi->id,
                'judul' => $infografi->judul,
                'deskripsi' => $infografi->deskripsi,
                'tanggal_terbit' => $infografi->tanggal_terbit->format('Y-m-d'),
                'gambar_url' => $infografi->gambar ? Storage::url($infografi->gambar) : null,
            ]
        ]);
    }

    /**
     * Memperbarui data infografis.
     */
    public function update(Request $request, Infografis $infografi)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_terbit' => 'required|date',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        
        $path = $infografi->gambar;

        // Cek jika ada file gambar baru yang diunggah
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($path) {
                Storage::disk('public')->delete($path);
            }
            // Simpan gambar baru
            $path = $request->file('gambar')->store('infografis', 'public');
        }

        $infografi->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_terbit' => $request->tanggal_terbit,
            'gambar' => $path,
        ]);

        return redirect()->route('admin.infografis.index')
            ->with('success', 'Infografis berhasil diperbarui.');
    }

    /**
     * Menghapus infografis.
     */
    public function destroy(Infografis $infografi)
    {
        // Log untuk memastikan method ini dipanggil
        \Log::info('=== DESTROY INFOGRAFIS METHOD CALLED ===');
        \Log::info('Request method: ' . request()->method());
        \Log::info('Request URL: ' . request()->url());
        \Log::info('Infografis to delete: ' . $infografi->id . ' - ' . $infografi->judul);
        \Log::info('Current auth user: ' . auth()->id());
        
        try {
            $infografisJudul = $infografi->judul; // Simpan judul sebelum menghapus
            
            // Log sebelum delete
            \Log::info('About to delete infografis: ' . $infografi->id);
            
            // Cek apakah infografis exists sebelum delete
            if (!$infografi->exists) {
                \Log::error('Infografis does not exist in database: ' . $infografi->id);
                return redirect()->route('admin.infografis.index')
                    ->with('error', 'Infografis tidak ditemukan.');
            }
            
            // Hapus file gambar dari storage sebelum menghapus record dari database
            if ($infografi->gambar) {
                Storage::disk('public')->delete($infografi->gambar);
                \Log::info('Deleted associated image file: ' . $infografi->gambar);
            }
            
            $deleted = $infografi->delete();
            
            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));
            \Log::info('Infografis deleted successfully: ' . $infografi->id . ' (' . $infografisJudul . ')');

            // Pastikan flash message di-set dengan benar
            return redirect()->route('admin.infografis.index')
                ->with('success', "Infografis '{$infografisJudul}' berhasil dihapus.");

        } catch (\Exception $e) {
            // Log error dengan detail
            \Log::error('=== ERROR DELETING INFOGRAFIS ===');
            \Log::error('Infografis ID: ' . $infografi->id);
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.infografis.index')
                ->with('error', 'Terjadi kesalahan saat menghapus infografis: ' . $e->getMessage());
        }
    }
}