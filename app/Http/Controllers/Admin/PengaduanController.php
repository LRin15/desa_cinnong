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
        ]);
    }

    /**
     * Update status pengaduan
     */
    public function updateStatus(Request $request, Pengaduan $pengaduan)
    {
        $validated = $request->validate([
            'status' => 'required|in:belum_diproses,sedang_diproses,selesai',
        ]);

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

        return redirect()->route('admin.pengaduan.index', $queryParams)
            ->with('success', 'Status pengaduan berhasil diperbarui!');
    }

    /**
     * Remove the specified pengaduan from storage
     */
    public function destroy(Pengaduan $pengaduan)
    {
        $pengaduan->delete();

        return redirect()->route('admin.pengaduan.index')
            ->with('success', 'Pengaduan berhasil dihapus!');
    }
}