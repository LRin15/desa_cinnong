<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Menampilkan daftar berita.
     */
    public function index(Request $request)
    {
        $query = Berita::query();

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where('judul', 'like', "%{$searchTerm}%");
        }

        // Filter by category
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Apply ordering and pagination
        $berita = $query->latest('tanggal_terbit')->paginate(10)->through(fn ($item) => [
            'id' => $item->id,
            'judul' => $item->judul,
            'kategori' => $item->kategori,
            'tanggal_terbit' => $item->tanggal_terbit->format('d F Y'),
            'gambar' => $item->gambar ? Storage::url($item->gambar) : null,
        ]);

        // Append query parameters to pagination links
        $berita->appends($request->query());

        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita,
            'filters' => [
                'search' => $request->search,
                'kategori' => $request->kategori,
            ],
            // Explicitly pass flash messages
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Menampilkan form pembuatan berita.
     */
    public function create()
    {
        return Inertia::render('Admin/Berita/Create');
    }

    /**
     * Menyimpan berita baru.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'judul' => 'required|string|max:255|unique:berita,judul',
                'kategori' => 'required|string|max:100',
                'kutipan' => 'required|string|max:500',
                'isi' => 'required|string',
                'tanggal_terbit' => 'required|date',
                'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ], [
                'judul.required' => 'Judul wajib diisi.',
                'judul.unique' => 'Judul sudah digunakan, pilih judul lain.',
                'kategori.required' => 'Kategori wajib dipilih.',
                'kutipan.required' => 'Kutipan wajib diisi.',
                'kutipan.max' => 'Kutipan maksimal 500 karakter.',
                'isi.required' => 'Isi berita wajib diisi.',
                'tanggal_terbit.required' => 'Tanggal terbit wajib diisi.',
                'tanggal_terbit.date' => 'Format tanggal tidak valid.',
                'gambar.image' => 'File harus berupa gambar.',
                'gambar.mimes' => 'Gambar harus berformat: jpeg, png, jpg, gif, atau webp.',
                'gambar.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $path = null;
            if ($request->hasFile('gambar')) {
                $path = $request->file('gambar')->store('berita', 'public');
            }

            $berita = Berita::create([
                'judul' => $validatedData['judul'],
                'slug' => Str::slug($validatedData['judul']),
                'kategori' => $validatedData['kategori'],
                'kutipan' => $validatedData['kutipan'],
                'isi' => $validatedData['isi'],
                'tanggal_terbit' => $validatedData['tanggal_terbit'],
                'gambar' => $path,
            ]);

            return redirect()->route('admin.berita.index')
                ->with('success', "Berita '{$berita->judul}' berhasil dibuat.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error creating berita: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['gambar', 'password'])
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menyimpan berita. Silakan coba lagi.');
        }
    }

    /**
     * Menampilkan form edit berita.
     */
    public function edit(Berita $beritum)
    {
        return Inertia::render('Admin/Berita/Edit', [
            'berita' => [
                'id' => $beritum->id,
                'judul' => $beritum->judul,
                'kategori' => $beritum->kategori,
                'kutipan' => $beritum->kutipan,
                'isi' => $beritum->isi,
                'tanggal_terbit' => $beritum->tanggal_terbit->format('Y-m-d'),
                'gambar_url' => $beritum->gambar ? Storage::url($beritum->gambar) : null,
            ]
        ]);
    }

    /**
     * Memperbarui berita.
     */
    public function update(Request $request, Berita $beritum)
    {
        try {
            $validatedData = $request->validate([
                'judul' => 'required|string|max:255|unique:berita,judul,'.$beritum->id,
                'kategori' => 'required|string|max:100',
                'kutipan' => 'required|string|max:500',
                'isi' => 'required|string',
                'tanggal_terbit' => 'required|date',
                'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ], [
                'judul.required' => 'Judul wajib diisi.',
                'judul.unique' => 'Judul sudah digunakan, pilih judul lain.',
                'kategori.required' => 'Kategori wajib dipilih.',
                'kutipan.required' => 'Kutipan wajib diisi.',
                'kutipan.max' => 'Kutipan maksimal 500 karakter.',
                'isi.required' => 'Isi berita wajib diisi.',
                'tanggal_terbit.required' => 'Tanggal terbit wajib diisi.',
                'tanggal_terbit.date' => 'Format tanggal tidak valid.',
                'gambar.image' => 'File harus berupa gambar.',
                'gambar.mimes' => 'Gambar harus berformat: jpeg, png, jpg, gif, atau webp.',
                'gambar.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $path = $beritum->gambar;
            if ($request->hasFile('gambar')) {
                // Delete old image if exists
                if ($path && Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
                $path = $request->file('gambar')->store('berita', 'public');
            }

            $beritum->update([
                'judul' => $validatedData['judul'],
                'slug' => Str::slug($validatedData['judul']),
                'kategori' => $validatedData['kategori'],
                'kutipan' => $validatedData['kutipan'],
                'isi' => $validatedData['isi'],
                'tanggal_terbit' => $validatedData['tanggal_terbit'],
                'gambar' => $path,
            ]);

            return redirect()->route('admin.berita.index')
                ->with('success', "Berita '{$beritum->judul}' berhasil diperbarui.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error updating berita: ' . $e->getMessage(), [
                'berita_id' => $beritum->id,
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['gambar'])
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat memperbarui berita. Silakan coba lagi.');
        }
    }

    /**
     * Menghapus berita.
     */
    public function destroy(Berita $beritum)
    {
        // Log untuk memastikan method ini dipanggil
        \Log::info('=== DESTROY BERITA METHOD CALLED ===');
        \Log::info('Request method: ' . request()->method());
        \Log::info('Request URL: ' . request()->url());
        \Log::info('Berita to delete: ' . $beritum->id . ' - ' . $beritum->judul);
        \Log::info('Current auth user: ' . auth()->id());
        
        try {
            $beritaJudul = $beritum->judul; // Simpan judul sebelum menghapus
            
            // Log sebelum delete
            \Log::info('About to delete berita: ' . $beritum->id);
            
            // Cek apakah berita exists sebelum delete
            if (!$beritum->exists) {
                \Log::error('Berita does not exist in database: ' . $beritum->id);
                return redirect()->route('admin.berita.index')
                    ->with('error', 'Berita tidak ditemukan.');
            }
            
            // Hapus file gambar dari storage sebelum menghapus record dari database
            if ($beritum->gambar) {
                Storage::disk('public')->delete($beritum->gambar);
                \Log::info('Deleted associated image file: ' . $beritum->gambar);
            }
            
            $deleted = $beritum->delete();
            
            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));
            \Log::info('Berita deleted successfully: ' . $beritum->id . ' (' . $beritaJudul . ')');

            // Pastikan flash message di-set dengan benar
            return redirect()->route('admin.berita.index')
                ->with('success', "Berita '{$beritaJudul}' berhasil dihapus.");

        } catch (\Exception $e) {
            // Log error dengan detail
            \Log::error('=== ERROR DELETING BERITA ===');
            \Log::error('Berita ID: ' . $beritum->id);
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.berita.index')
                ->with('error', 'Terjadi kesalahan saat menghapus berita: ' . $e->getMessage());
        }
    }
}