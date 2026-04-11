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

            if ($request->filled('search')) {
                $searchTerm = $request->search;
                $query->where('judul', 'like', "%{$searchTerm}%")
                      ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            }

            $publikasi = $query->latest('tanggal_publikasi')->paginate(10)->through(fn ($item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'deskripsi' => $item->deskripsi,
                'tanggal_publikasi' => $item->tanggal_publikasi->format('d F Y'),
                'tipe_file' => strtoupper($item->tipe_file),
                'ukuran_file' => number_format($item->ukuran_file / 1024, 2) . ' KB',
                'nama_asli_file' => $item->nama_asli_file,
                'download_url' => asset('dokumen/publikasi/' . $item->nama_file),
            ]);

            $publikasi->appends($request->query());

            return Inertia::render('Admin/Publikasi/Index', [
                'publikasi' => $publikasi,
                'filters' => ['search' => $request->search],
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in PublikasiController@index: ' . $e->getMessage());

            return Inertia::render('Admin/Publikasi/Index', [
                'publikasi' => [
                    'data' => [], 'links' => [], 'total' => 0,
                    'current_page' => 1, 'last_page' => 1,
                    'per_page' => 10, 'from' => 0, 'to' => 0,
                ],
                'filters' => ['search' => $request->search],
                'flash' => ['error' => 'Terjadi kesalahan saat memuat data publikasi.'],
            ]);
        }
    }

    public function create()
    {
        return Inertia::render('Admin/Publikasi/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_publikasi' => 'required|date',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
        ]);

        DB::beginTransaction();

        try {
            $file = $request->file('file');

            $namaFileUnik   = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $namaAsliFile   = $file->getClientOriginalName();
            $tipeFile       = $file->getClientOriginalExtension();
            // ✅ Ambil ukuran SEBELUM move()
            $ukuranFile     = $file->getSize();

            $publikasi = Publikasi::create([
                'judul'              => $request->judul,
                'deskripsi'          => $request->deskripsi,
                'tanggal_publikasi'  => $request->tanggal_publikasi,
                'nama_file'          => $namaFileUnik,
                'nama_asli_file'     => $namaAsliFile,
                'tipe_file'          => $tipeFile,
                'ukuran_file'        => $ukuranFile,
            ]);

            $uploadDir = public_path($this->uploadPath);
            if (!File::exists($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true);
            }
            $file->move($uploadDir, $namaFileUnik);

            DB::commit();

            return redirect()->route('admin.publikasi.index')
                ->with('success', "Publikasi '{$publikasi->judul}' berhasil ditambahkan.");

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating publikasi: ' . $e->getMessage());

            return back()->withInput()->with('error', 'Terjadi kesalahan saat menyimpan publikasi.');
        }
    }

    public function edit(Publikasi $publikasi)
    {
        return Inertia::render('Admin/Publikasi/Edit', [
            'publikasi' => [
                'id'                 => $publikasi->id,
                'judul'              => $publikasi->judul,
                'deskripsi'          => $publikasi->deskripsi,
                'tanggal_publikasi'  => $publikasi->tanggal_publikasi?->format('Y-m-d'),
                'file_info'          => $publikasi->nama_asli_file . ' (' . number_format($publikasi->ukuran_file / 1024, 2) . ' KB)',
            ],
        ]);
    }

    public function update(Request $request, Publikasi $publikasi)
    {
        try {
            $request->validate([
                'judul'              => 'required|string|max:255',
                'deskripsi'          => 'nullable|string',
                'tanggal_publikasi'  => 'required|date',
                'file'               => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
            ], [
                'judul.required'            => 'Judul wajib diisi.',
                'tanggal_publikasi.required' => 'Tanggal publikasi wajib diisi.',
                'tanggal_publikasi.date'    => 'Format tanggal tidak valid.',
                'file.mimes'                => 'File harus berformat: PDF, DOC, DOCX, XLS, atau XLSX.',
                'file.max'                  => 'Ukuran file maksimal 5MB.',
            ]);

            $publikasi->update($request->only('judul', 'deskripsi', 'tanggal_publikasi'));

            if ($request->hasFile('file')) {
                $file = $request->file('file');

                // ✅ FIX UTAMA: ambil semua info file SEBELUM move()
                //    Setelah move(), objek UploadedFile tidak lagi valid
                //    dan getSize() / getClientOriginalName() bisa melempar exception.
                $namaFileUnik   = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $namaAsliFile   = $file->getClientOriginalName();
                $tipeFile       = $file->getClientOriginalExtension();
                $ukuranFile     = $file->getSize(); // ← sebelum move()

                // Hapus file lama
                $oldFilePath = public_path($this->uploadPath . '/' . $publikasi->nama_file);
                if (File::exists($oldFilePath)) {
                    File::delete($oldFilePath);
                }

                // Pastikan direktori ada
                $uploadDir = public_path($this->uploadPath);
                if (!File::exists($uploadDir)) {
                    File::makeDirectory($uploadDir, 0755, true);
                }

                // Pindahkan file baru
                $file->move($uploadDir, $namaFileUnik);

                // Update record dengan data yang sudah dikumpulkan sebelum move()
                $publikasi->update([
                    'nama_file'      => $namaFileUnik,
                    'nama_asli_file' => $namaAsliFile,
                    'tipe_file'      => $tipeFile,
                    'ukuran_file'    => $ukuranFile,
                ]);
            }

            return redirect()->route('admin.publikasi.index')
                ->with('success', "Publikasi '{$publikasi->judul}' berhasil diperbarui.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error updating publikasi: ' . $e->getMessage(), [
                'publikasi_id' => $publikasi->id,
            ]);

            return back()->withInput()
                ->with('error', 'Terjadi kesalahan saat memperbarui publikasi. Silakan coba lagi.');
        }
    }

    public function destroy(Publikasi $publikasi)
    {
        try {
            $publikasiJudul = $publikasi->judul;

            if ($publikasi->nama_file) {
                $filePath = public_path($this->uploadPath . '/' . $publikasi->nama_file);
                if (File::exists($filePath)) {
                    File::delete($filePath);
                }
            }

            $publikasi->delete();

            return redirect()->route('admin.publikasi.index')
                ->with('success', "Publikasi '{$publikasiJudul}' berhasil dihapus.");

        } catch (\Exception $e) {
            \Log::error('Error deleting publikasi: ' . $e->getMessage());

            return redirect()->route('admin.publikasi.index')
                ->with('error', 'Terjadi kesalahan saat menghapus publikasi: ' . $e->getMessage());
        }
    }
}