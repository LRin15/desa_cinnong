<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaduanController extends Controller
{
    /**
     * Display a listing of pengaduan
     */
    public function index(Request $request)
    {
        $query = Pengaduan::with('user')->latest();

        // Filter by search (cari berdasarkan nama/email user atau judul)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $pengaduan = $query->paginate(10)->withQueryString();

        // Transform agar nama & email tersedia langsung di frontend
        $pengaduan->through(function ($item) {
            return [
                'id'           => $item->id,
                'nama'         => $item->user?->name ?? '-',
                'email'        => $item->user?->email ?? '-',
                'telepon'      => $item->telepon,
                'judul'        => $item->judul,
                'isi_pengaduan' => $item->isi_pengaduan,
                'status'       => $item->status,
                'created_at'   => $item->created_at,
                'updated_at'   => $item->updated_at,
            ];
        });

        return Inertia::render('Admin/Pengaduan/Index', [
            'pengaduan' => $pengaduan,
            'filters'   => [
                'search' => $request->search,
                'status' => $request->status,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * Update status pengaduan
     */
    public function updateStatus(Request $request, Pengaduan $pengaduan)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:menunggu,diproses,selesai',
            ]);

            $statusLabels = [
                'menunggu' => 'Menunggu',
                'diproses' => 'Diproses',
                'selesai'  => 'Selesai',
            ];

            $pengaduan->update(['status' => $validated['status']]);

            $queryParams = [];
            if ($request->filled('search')) {
                $queryParams['search'] = $request->search;
            }
            if ($request->filled('status_filter')) {
                $queryParams['status'] = $request->status_filter;
            }

            $statusLabel = $statusLabels[$validated['status']] ?? $validated['status'];
            $namaPelapor = $pengaduan->user?->name ?? 'Pengguna';

            return redirect()->route('admin.pengaduan.index', $queryParams)
                ->with('success', "Status pengaduan dari '{$namaPelapor}' berhasil diubah menjadi '{$statusLabel}'.");

        } catch (\Exception $e) {
            \Log::error('Error updating pengaduan status: ' . $e->getMessage(), [
                'pengaduan_id' => $pengaduan->id,
                'trace'        => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Terjadi kesalahan saat mengubah status pengaduan. Silakan coba lagi.');
        }
    }

    /**
     * Remove the specified pengaduan from storage
     */
    public function destroy(Pengaduan $pengaduan)
    {
        \Log::info('=== DESTROY PENGADUAN METHOD CALLED ===');
        \Log::info('Pengaduan to delete: ' . $pengaduan->id . ' - ' . $pengaduan->judul);

        try {
            $namaPelapor  = $pengaduan->user?->name ?? 'Pengguna';
            $judulPengaduan = $pengaduan->judul;

            if (!$pengaduan->exists) {
                \Log::error('Pengaduan does not exist in database: ' . $pengaduan->id);
                return redirect()->route('admin.pengaduan.index')
                    ->with('error', 'Pengaduan tidak ditemukan.');
            }

            $deleted = $pengaduan->delete();

            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));

            return redirect()->route('admin.pengaduan.index')
                ->with('success', "Pengaduan dari '{$namaPelapor}' dengan judul '{$judulPengaduan}' berhasil dihapus.");

        } catch (\Exception $e) {
            \Log::error('=== ERROR DELETING PENGADUAN ===');
            \Log::error('Pengaduan ID: ' . $pengaduan->id);
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.pengaduan.index')
                ->with('error', 'Terjadi kesalahan saat menghapus pengaduan: ' . $e->getMessage());
        }
    }
}