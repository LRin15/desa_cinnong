<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LayananSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananSettingsController extends Controller
{
    public function index()
    {
        $layananSettings = LayananSetting::orderBy('name')
            ->get()
            ->map(fn ($item) => [
                'id'        => $item->id,
                'name'      => $item->name,
                'is_active' => $item->is_active,
                'category'  => $item->category,
            ])
            ->groupBy('category');

        return Inertia::render('Admin/LayananSettings/Index', [
            'layananSettings' => $layananSettings,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function toggleStatus(Request $request)
    {
        try {
            $validated = $request->validate([
                'id'        => 'required|integer|exists:layanan_settings,id',
                'is_active' => 'required|boolean',
            ]);

            $layanan = LayananSetting::findOrFail($validated['id']);
            $layanan->update(['is_active' => $validated['is_active']]);

            $status = $validated['is_active'] ? 'diaktifkan' : 'dinonaktifkan';

            return back()->with('success', "Layanan '{$layanan->name}' berhasil {$status}.");

        } catch (\Exception $e) {
            \Log::error('Error toggling layanan status: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mengubah status layanan.');
        }
    }

    public function toggleBulk(Request $request)
    {
        try {
            $validated = $request->validate([
                'ids'       => 'required|array',
                'ids.*'     => 'required|integer|exists:layanan_settings,id',
                'is_active' => 'required|boolean',
            ]);

            $count = LayananSetting::whereIn('id', $validated['ids'])
                ->update(['is_active' => $validated['is_active']]);

            $status = $validated['is_active'] ? 'diaktifkan' : 'dinonaktifkan';

            return back()->with('success', "{$count} layanan berhasil {$status}.");

        } catch (\Exception $e) {
            \Log::error('Error bulk toggling layanan status: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mengubah status layanan.');
        }
    }
}