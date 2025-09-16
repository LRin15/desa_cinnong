<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
class PublikasiController extends Controller
{
    protected $uploadPath = 'dokumen/publikasi';

    public function index(Request $request)
    {
        try {
            $query = Publikasi::query();

            // Search functionality - consistent with infografis
            if ($request->filled('search')) {
                $searchTerm = $request->search;
                $query->where('judul', 'like', "%{$searchTerm}%")
                      ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            }

            // Apply ordering and pagination
            $publikasi = $query->latest('tanggal_publikasi')->paginate(10)->through(fn ($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'deskripsi' => $item->deskripsi,
                'tanggal_publikasi' => $item->tanggal_publikasi->format('d F Y'),
                'tipe_file' => strtoupper($item->tipe_file),
                'ukuran_file' => number_format($item->ukuran_file / 1024, 2) . ' KB',
                'nama_asli_file' => $item->nama_asli_file,
                // Add download URL for future use
                'download_url' => asset('dokumen/publikasi/' . $item->nama_file),
            ]);

            // Append query parameters to pagination links
            $publikasi->appends($request->query());

            return Inertia::render('Admin/Publikasi/Index', [
                'publikasi' => $publikasi,
                'filters' => [
                    'search' => $request->search,
                ],
                // Explicitly pass flash messages
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in PublikasiController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return Inertia::render('Admin/Publikasi/Index', [
                'publikasi' => [
                    'data' => [],
                    'links' => [],
                    'total' => 0,
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'from' => 0,
                    'to' => 0,
                ],
                'filters' => [
                    'search' => $request->search,
                ],
                'flash' => [
                    'error' => 'Terjadi kesalahan saat memuat data publikasi.'
                ],
            ]);
        }
    }

    public function create()
    {
        return Inertia::render('Admin/Publikasi/Create');
    }

    // Kode Lengkap yang Direkomendasikan (Gabungan Solusi)
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_publikasi' => 'required|date',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
        ]);

        DB::beginTransaction(); // Mulai transaksi

        try {
            $file = $request->file('file');

            // 1. Ambil semua info file sebelum dipindahkan
            $namaFileUnik = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $ukuranFile = $file->getSize();
            
            // 2. Buat record database
            $publikasi = Publikasi::create([
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'tanggal_publikasi' => $request->tanggal_publikasi,
                'nama_file' => $namaFileUnik,
                'nama_asli_file' => $file->getClientOriginalName(),
                'tipe_file' => $file->getClientOriginalExtension(),
                'ukuran_file' => $ukuranFile,
            ]);

            // 3. Jika database berhasil, pindahkan file
            $uploadDir = public_path($this->uploadPath);
            if (!File::exists($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true);
            }
            $file->move($uploadDir, $namaFileUnik);

            DB::commit(); // Selesaikan transaksi

            return redirect()->route('admin.publikasi.index')
                ->with('success', "Publikasi '{$publikasi->judul}' berhasil ditambahkan.");
                
        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua jika ada error

            \Log::error('Error creating publikasi: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['file'])
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menyimpan publikasi. Silakan periksa log.');
        }
    }

    public function edit(Publikasi $publikasi)
    {
        // Kode ini sekarang akan berfungsi karena model casting sudah benar
        return Inertia::render('Admin/Publikasi/Edit', [
            'publikasi' => [
                'id' => $publikasi->id,
                'judul' => $publikasi->judul,
                'deskripsi' => $publikasi->deskripsi,
                // Gunakan null-safe operator (?) untuk keamanan jika tanggal bisa null
                'tanggal_publikasi' => $publikasi->tanggal_publikasi?->format('Y-m-d'),
                'file_info' => $publikasi->nama_asli_file . ' (' . number_format($publikasi->ukuran_file / 1024, 2) . ' KB)',
            ],
        ]);
    }

    public function update(Request $request, Publikasi $publikasi)
    {
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'deskripsi' => 'nullable|string',
                'tanggal_publikasi' => 'required|date',
                'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:5120', // file not required for update
            ], [
                'judul.required' => 'Judul wajib diisi.',
                'tanggal_publikasi.required' => 'Tanggal publikasi wajib diisi.',
                'tanggal_publikasi.date' => 'Format tanggal tidak valid.',
                'file.mimes' => 'File harus berformat: PDF, DOC, DOCX, XLS, atau XLSX.',
                'file.max' => 'Ukuran file maksimal 5MB.',
            ]);
            
            $publikasi->update($request->only('judul', 'deskripsi', 'tanggal_publikasi'));

            if ($request->hasFile('file')) {
                // Delete old file
                $oldFilePath = public_path($this->uploadPath . '/' . $publikasi->nama_file);
                if (File::exists($oldFilePath)) {
                    File::delete($oldFilePath);
                }
                
                // Upload new file
                $file = $request->file('file');
                $namaFileUnik = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                
                // Ensure directory exists
                $uploadDir = public_path($this->uploadPath);
                if (!File::exists($uploadDir)) {
                    File::makeDirectory($uploadDir, 0755, true);
                }
                
                $file->move(public_path($this->uploadPath), $namaFileUnik);
                
                $publikasi->update([
                    'nama_file' => $namaFileUnik,
                    'nama_asli_file' => $file->getClientOriginalName(),
                    'tipe_file' => $file->getClientOriginalExtension(),
                    'ukuran_file' => $file->getSize(),
                ]);
            }

            return redirect()->route('admin.publikasi.index')
                ->with('success', "Publikasi '{$publikasi->judul}' berhasil diperbarui.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error updating publikasi: ' . $e->getMessage(), [
                'publikasi_id' => $publikasi->id,
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['file'])
            ]);

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat memperbarui publikasi. Silakan coba lagi.');
        }
    }

    public function destroy(Publikasi $publikasi)
    {
        // Log untuk debugging
        \Log::info('=== DESTROY PUBLIKASI METHOD CALLED ===');
        \Log::info('Request method: ' . request()->method());
        \Log::info('Request URL: ' . request()->url());
        \Log::info('Publikasi to delete: ' . $publikasi->id . ' - ' . $publikasi->judul);
        \Log::info('Current auth user: ' . auth()->id());

        try {
            $publikasiJudul = $publikasi->judul; // Save title before deletion
            
            \Log::info('About to delete publikasi: ' . $publikasi->id);
            
            // Check if publikasi exists before delete
            if (!$publikasi->exists) {
                \Log::error('Publikasi does not exist in database: ' . $publikasi->id);
                return redirect()->route('admin.publikasi.index')
                    ->with('error', 'Publikasi tidak ditemukan.');
            }
            
            // Delete file from storage before deleting database record
            if ($publikasi->nama_file) {
                $filePath = public_path($this->uploadPath . '/' . $publikasi->nama_file);
                if (File::exists($filePath)) {
                    File::delete($filePath);
                    \Log::info('Deleted associated file: ' . $publikasi->nama_file);
                }
            }
            
            $deleted = $publikasi->delete();
            
            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));
            \Log::info('Publikasi deleted successfully: ' . $publikasi->id . ' (' . $publikasiJudul . ')');

            return redirect()->route('admin.publikasi.index')
                ->with('success', "Publikasi '{$publikasiJudul}' berhasil dihapus.");

        } catch (\Exception $e) {
            // Log error with details
            \Log::error('=== ERROR DELETING PUBLIKASI ===');
            \Log::error('Publikasi ID: ' . $publikasi->id);
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.publikasi.index')
                ->with('error', 'Terjadi kesalahan saat menghapus publikasi: ' . $e->getMessage());
        }
    }
}