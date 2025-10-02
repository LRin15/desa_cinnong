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
        $query = Pengaduan::query()->latest();

        // Filter by search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('judul', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $pengaduan = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Pengaduan/Index', [
            'pengaduan' => $pengaduan,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
            // Explicitly pass flash messages
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
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
                'status' => 'required|in:belum_diproses,sedang_diproses,selesai',
            ]);

            $statusLabels = [
                'belum_diproses' => 'Belum Diproses',
                'sedang_diproses' => 'Sedang Diproses',
                'selesai' => 'Selesai',
            ];

            $pengaduan->update([
                'status' => $validated['status'],
            ]);

            // Preserve filters saat redirect
            $queryParams = [];
            if ($request->has('search') && $request->search) {
                $queryParams['search'] = $request->search;
            }
            if ($request->has('status_filter') && $request->status_filter) {
                $queryParams['status'] = $request->status_filter;
            }

            $statusLabel = $statusLabels[$validated['status']] ?? $validated['status'];

            return redirect()->route('admin.pengaduan.index', $queryParams)
                ->with('success', "Status pengaduan dari '{$pengaduan->nama}' berhasil diubah menjadi '{$statusLabel}'.");

        } catch (\Exception $e) {
            \Log::error('Error updating pengaduan status: ' . $e->getMessage(), [
                'pengaduan_id' => $pengaduan->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->with('error', 'Terjadi kesalahan saat mengubah status pengaduan. Silakan coba lagi.');
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
            $pengaduanNama = $pengaduan->nama;
            $pengaduanJudul = $pengaduan->judul;
            
            if (!$pengaduan->exists) {
                \Log::error('Pengaduan does not exist in database: ' . $pengaduan->id);
                return redirect()->route('admin.pengaduan.index')
                    ->with('error', 'Pengaduan tidak ditemukan.');
            }
            
            $deleted = $pengaduan->delete();
            
            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));
            \Log::info('Pengaduan deleted successfully: ' . $pengaduan->id);

            return redirect()->route('admin.pengaduan.index')
                ->with('success', "Pengaduan dari '{$pengaduanNama}' dengan judul '{$pengaduanJudul}' berhasil dihapus.");

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