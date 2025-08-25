<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Infografis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InfografisController extends Controller
{
    /**
     * Menampilkan daftar semua infografis.
     */
    public function index(Request $request)
    {
        $query = Infografis::query();

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where('judul', 'like', "%{$searchTerm}%");
        }

        // Apply ordering and pagination
        $infografis = $query->latest()->paginate(10)->through(fn ($item) => [
            'id' => $item->id,
            'judul' => $item->judul,
            'tanggal_terbit' => $item->tanggal_terbit->format('d F Y'),
            // Updated to use public/images/infografis path
            'gambar' => $item->gambar ? asset('images/infografis/' . $item->gambar) : null,
        ]);

        // Append query parameters to pagination links
        $infografis->appends($request->query());

        return Inertia::render('Admin/Infografis/Index', [
            'infografis' => $infografis,
            'filters' => [
                'search' => $request->search,
            ],
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
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'tanggal_terbit' => 'required|date',
                // Validasi gambar: harus berupa file gambar, required untuk create, maks 2MB
                'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ], [
                'judul.required' => 'Judul wajib diisi.',
                'deskripsi.required' => 'Deskripsi wajib diisi.',
                'tanggal_terbit.required' => 'Tanggal terbit wajib diisi.',
                'tanggal_terbit.date' => 'Format tanggal tidak valid.',
                'gambar.required' => 'Gambar wajib diunggah.',
                'gambar.image' => 'File harus berupa gambar.',
                'gambar.mimes' => 'Gambar harus berformat: jpeg, png, jpg, gif, atau webp.',
                'gambar.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $filename = null;
            if ($request->hasFile('gambar')) {
                // Create directory if it doesn't exist
                $uploadPath = public_path('images/infografis');
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }

                // Generate unique filename
                $file = $request->file('gambar');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                
                // Move file to public/images/infografis
                $file->move($uploadPath, $filename);
            }
            
            $infografis = Infografis::create([
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'tanggal_terbit' => $request->tanggal_terbit,
                'gambar' => $filename, // Store only filename, not full path
            ]);

            return redirect()->route('admin.infografis.index')
                ->with('success', "Infografis '{$infografis->judul}' berhasil dibuat.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error creating infografis: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['gambar'])
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menyimpan infografis. Silakan coba lagi.');
        }
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
                // Updated to use public/images/infografis path
                'gambar_url' => $infografi->gambar ? asset('images/infografis/' . $infografi->gambar) : null,
            ]
        ]);
    }

    /**
     * Memperbarui data infografis.
     */
    public function update(Request $request, Infografis $infografi)
    {
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'tanggal_terbit' => 'required|date',
                'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ], [
                'judul.required' => 'Judul wajib diisi.',
                'deskripsi.required' => 'Deskripsi wajib diisi.',
                'tanggal_terbit.required' => 'Tanggal terbit wajib diisi.',
                'tanggal_terbit.date' => 'Format tanggal tidak valid.',
                'gambar.image' => 'File harus berupa gambar.',
                'gambar.mimes' => 'Gambar harus berformat: jpeg, png, jpg, gif, atau webp.',
                'gambar.max' => 'Ukuran gambar maksimal 2MB.',
            ]);
            
            $filename = $infografi->gambar;

            // Cek jika ada file gambar baru yang diunggah
            if ($request->hasFile('gambar')) {
                // Create directory if it doesn't exist
                $uploadPath = public_path('images/infografis');
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }

                // Delete old image if exists
                if ($filename && File::exists($uploadPath . '/' . $filename)) {
                    File::delete($uploadPath . '/' . $filename);
                }

                // Generate unique filename and move new file
                $file = $request->file('gambar');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->move($uploadPath, $filename);
            }

            $infografi->update([
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'tanggal_terbit' => $request->tanggal_terbit,
                'gambar' => $filename, // Store only filename, not full path
            ]);

            return redirect()->route('admin.infografis.index')
                ->with('success', "Infografis '{$infografi->judul}' berhasil diperbarui.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error updating infografis: ' . $e->getMessage(), [
                'infografis_id' => $infografi->id,
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['gambar'])
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat memperbarui infografis. Silakan coba lagi.');
        }
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
            
            // Hapus file gambar dari public/images/infografis sebelum menghapus record dari database
            if ($infografi->gambar) {
                $imagePath = public_path('images/infografis/' . $infografi->gambar);
                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                    \Log::info('Deleted associated image file: ' . $infografi->gambar);
                }
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