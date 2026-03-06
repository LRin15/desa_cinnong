<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LayananSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananController extends Controller
{
    /**
     * Display a listing of layanan submissions
     */
    public function index(Request $request)
    {
        $query = LayananSubmission::with('user')->latest();

        // Filter by search — cari berdasarkan nama/email user atau jenis layanan atau NIK di form_data
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

        // Filter by jenis layanan
        if ($request->filled('jenis_layanan')) {
            $query->where('jenis_layanan', $request->jenis_layanan);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $layanan = $query->paginate(10)->withQueryString();

        // Transform: sertakan nama & email dari relasi user agar frontend tidak perlu eager-load sendiri
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
                'created_at'     => $item->created_at,
                'updated_at'     => $item->updated_at,
            ];
        });

        // Get distinct jenis layanan for filter dropdown
        $jenisLayananList = LayananSubmission::select('jenis_layanan')
            ->distinct()
            ->orderBy('jenis_layanan')
            ->pluck('jenis_layanan');

        return Inertia::render('Admin/Layanan/Index', [
            'layanan'         => $layanan,
            'jenisLayananList'=> $jenisLayananList,
            'filters'         => [
                'search'       => $request->search,
                'jenis_layanan'=> $request->jenis_layanan,
                'status'       => $request->status,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * Update status layanan
     */
    public function updateStatus(Request $request, LayananSubmission $layanan)
    {
        try {
            $validated = $request->validate([
                'status'        => 'required|in:pending,diproses,selesai,ditolak',
                'catatan_admin' => 'nullable|string|max:1000',
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

            $layanan->update([
                'status'        => $validated['status'],
                'catatan_admin' => $validated['catatan_admin'] ?? $layanan->catatan_admin,
            ]);

            $queryParams = [];
            if ($request->filled('search'))              $queryParams['search']        = $request->search;
            if ($request->filled('jenis_layanan_filter'))$queryParams['jenis_layanan'] = $request->jenis_layanan_filter;
            if ($request->filled('status_filter'))       $queryParams['status']        = $request->status_filter;

            $statusLabel  = $statusLabels[$validated['status']] ?? $validated['status'];
            $namaPemohon  = $layanan->user?->name ?? 'Pemohon';

            return redirect()->route('admin.layanan.index', $queryParams)
                ->with('success', "Status permohonan '{$layanan->jenis_layanan}' dari '{$namaPemohon}' berhasil diubah menjadi '{$statusLabel}'.");

        } catch (\Exception $e) {
            \Log::error('Error updating layanan status: ' . $e->getMessage(), [
                'layanan_id' => $layanan->id,
                'trace'      => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Terjadi kesalahan saat mengubah status permohonan. Silakan coba lagi.');
        }
    }

    /**
     * Remove the specified layanan from storage
     */
    public function destroy(LayananSubmission $layanan)
    {
        \Log::info('=== DESTROY LAYANAN METHOD CALLED ===');
        \Log::info('Layanan to delete: ' . $layanan->id . ' - ' . $layanan->jenis_layanan);

        try {
            $jenisLayanan = $layanan->jenis_layanan;
            $namaPemohon  = $layanan->user?->name ?? 'Pemohon';

            if (!$layanan->exists) {
                \Log::error('Layanan does not exist in database: ' . $layanan->id);
                return redirect()->route('admin.layanan.index')
                    ->with('error', 'Permohonan layanan tidak ditemukan.');
            }

            // Hapus file yang terupload
            if (!empty($layanan->uploaded_files)) {
                foreach ($layanan->uploaded_files as $filePath) {
                    if (is_array($filePath)) {
                        foreach ($filePath as $path) {
                            \Storage::disk('public')->delete($path);
                        }
                    } else {
                        \Storage::disk('public')->delete($filePath);
                    }
                }
            }

            $deleted = $layanan->delete();

            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));

            return redirect()->route('admin.layanan.index')
                ->with('success', "Permohonan '{$jenisLayanan}' dari '{$namaPemohon}' berhasil dihapus.");

        } catch (\Exception $e) {
            \Log::error('=== ERROR DELETING LAYANAN ===');
            \Log::error('Layanan ID: ' . $layanan->id);
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.layanan.index')
                ->with('error', 'Terjadi kesalahan saat menghapus permohonan: ' . $e->getMessage());
        }
    }
}