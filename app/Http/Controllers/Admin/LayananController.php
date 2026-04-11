<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LayananSubmission;
use App\Notifications\StatusLayananNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LayananController extends Controller
{
    /** Folder relatif terhadap public_path() untuk file hasil pengajuan */
    protected string $resultPath = 'dokumen/hasil_pengajuan';

    /** Folder relatif terhadap public_path() untuk file pengajuan */
    protected string $uploadPath = 'dokumen/pengajuan_layanan';

    public function index(Request $request)
    {
        $query = LayananSubmission::with('user')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('jenis_layanan', 'like', "%{$search}%")
                  ->orWhereRaw("JSON_EXTRACT(form_data, '$.nik') LIKE ?", ["%{$search}%"])
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('jenis_layanan')) {
            $query->where('jenis_layanan', $request->jenis_layanan);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $layanan = $query->paginate(10)->withQueryString();

        $layanan->through(function ($item) {
            return [
                'id'             => $item->id,
                'nama_pemohon'   => $item->user?->name ?? '-',
                'email_pemohon'  => $item->user?->email ?? '-',
                'jenis_layanan'  => $item->jenis_layanan,
                'form_data'      => $item->form_data,
                'uploaded_files' => $item->uploaded_files,
                'status'         => $item->status,
                'status_label'   => $item->status_label,
                'catatan_admin'  => $item->catatan_admin,
                'result_files'   => $item->result_files,
                'rating'         => $item->rating,
                'feedback'       => $item->feedback,
                'rated_at'       => $item->rated_at?->format('d M Y, H:i'),
                'created_at'     => $item->created_at,
                'updated_at'     => $item->updated_at,
            ];
        });

        $jenisLayananList = LayananSubmission::select('jenis_layanan')
            ->distinct()
            ->orderBy('jenis_layanan')
            ->pluck('jenis_layanan');

        return Inertia::render('Admin/Layanan/Index', [
            'layanan'          => $layanan,
            'jenisLayananList' => $jenisLayananList,
            'filters'          => [
                'search'        => $request->search,
                'jenis_layanan' => $request->jenis_layanan,
                'status'        => $request->status,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function updateStatus(Request $request, LayananSubmission $layanan)
    {
        try {
            $validated = $request->validate([
                'status'         => 'required|in:pending,diproses,selesai,ditolak',
                'catatan_admin'  => 'nullable|string|max:1000',
                // Hasil layanan — hanya file, maksimal 1 MB per file
                'result_files'   => 'nullable|array',
                'result_files.*' => 'file|mimes:jpg,jpeg,png,gif,pdf,doc,docx|max:1024',
            ], [
                'result_files.*.max'   => 'Setiap file tidak boleh melebihi 1 MB.',
                'result_files.*.mimes' => 'Format file tidak didukung. Gunakan JPG, PNG, PDF, DOC, atau DOCX.',
                'result_files.*.file'  => 'File tidak valid.',
            ]);

            if ($validated['status'] === 'ditolak' && empty($validated['catatan_admin'])) {
                return back()->with('error', 'Alasan penolakan harus diisi.');
            }

            $statusLabels = [
                'pending'  => 'Menunggu',
                'diproses' => 'Sedang Diproses',
                'selesai'  => 'Selesai',
                'ditolak'  => 'Ditolak',
            ];

            $updateData = [
                'status'        => $validated['status'],
                'catatan_admin' => $validated['catatan_admin'] ?? $layanan->catatan_admin,
            ];

            // ── Upload file hasil layanan ke dokumen/hasil_pengajuan ────────
            if ($validated['status'] === 'selesai' && $request->hasFile('result_files')) {
                $resultDir = public_path($this->resultPath);
                if (!File::exists($resultDir)) {
                    File::makeDirectory($resultDir, 0755, true);
                }

                $uploadedResultFiles = [];
                foreach ($request->file('result_files') as $file) {
                    $namaFile = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $file->move($resultDir, $namaFile);
                    $uploadedResultFiles[] = $this->resultPath . '/' . $namaFile;
                }

                // Gabungkan dengan file hasil lama jika sudah ada
                $existing = $layanan->result_files ?? [];
                $updateData['result_files'] = array_merge($existing, $uploadedResultFiles);
            }

            $layanan->update($updateData);

            // Kirim notifikasi
            if ($validated['status'] !== 'pending' && $layanan->user) {
                try {
                    $layanan->user->notify(new StatusLayananNotification($layanan));
                } catch (\Exception $e) {
                    \Log::error("Gagal kirim notifikasi layanan #{$layanan->id}: " . $e->getMessage());
                }
            }

            $queryParams = [];
            if ($request->filled('search'))               $queryParams['search']        = $request->search;
            if ($request->filled('jenis_layanan_filter')) $queryParams['jenis_layanan'] = $request->jenis_layanan_filter;
            if ($request->filled('status_filter'))        $queryParams['status']        = $request->status_filter;

            $statusLabel = $statusLabels[$validated['status']];
            $namaPemohon = $layanan->user?->name ?? 'Pemohon';

            return redirect()->route('admin.layanan.index', $queryParams)
                ->with('success', "Status permohonan '{$layanan->jenis_layanan}' dari '{$namaPemohon}' berhasil diubah menjadi '{$statusLabel}'.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Gagal menyimpan: ' . collect($e->errors())->flatten()->first());

        } catch (\Exception $e) {
            \Log::error('Error updating layanan status: ' . $e->getMessage(), [
                'layanan_id' => $layanan->id,
                'trace'      => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Terjadi kesalahan saat mengubah status permohonan. Silakan coba lagi.');
        }
    }

    /**
     * Hapus satu file hasil layanan dari dokumen/hasil_pengajuan
     */
    public function deleteResultFile(Request $request, LayananSubmission $layanan)
    {
        try {
            $validated = $request->validate([
                'file_path' => 'required|string',
            ]);

            $files = $layanan->result_files ?? [];
            $files = array_values(array_filter($files, fn($f) => $f !== $validated['file_path']));

            $absolutePath = public_path($validated['file_path']);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }

            $layanan->update(['result_files' => $files]);

            return back()->with('success', 'File berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus file.');
        }
    }

    public function destroy(LayananSubmission $layanan)
    {
        try {
            $jenisLayanan = $layanan->jenis_layanan;
            $namaPemohon  = $layanan->user?->name ?? 'Pemohon';

            // ── Hapus file pengajuan dari dokumen/pengajuan_layanan ─────────
            if (!empty($layanan->uploaded_files)) {
                foreach ($layanan->uploaded_files as $filePath) {
                    if (is_array($filePath)) {
                        foreach ($filePath as $path) {
                            $abs = public_path($path);
                            if (File::exists($abs)) File::delete($abs);
                        }
                    } else {
                        $abs = public_path($filePath);
                        if (File::exists($abs)) File::delete($abs);
                    }
                }
            }

            // ── Hapus file hasil dari dokumen/hasil_pengajuan ───────────────
            if (!empty($layanan->result_files)) {
                foreach ($layanan->result_files as $filePath) {
                    $abs = public_path($filePath);
                    if (File::exists($abs)) File::delete($abs);
                }
            }

            $layanan->delete();

            return redirect()->route('admin.layanan.index')
                ->with('success', "Permohonan '{$jenisLayanan}' dari '{$namaPemohon}' berhasil dihapus.");

        } catch (\Exception $e) {
            \Log::error('Error deleting layanan: ' . $e->getMessage());

            return redirect()->route('admin.layanan.index')
                ->with('error', 'Terjadi kesalahan saat menghapus permohonan: ' . $e->getMessage());
        }
    }
}