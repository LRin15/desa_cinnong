<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananSettingsController extends Controller
{
    public function index()
    {
        $layananSettings = Setting::where('key', 'LIKE', 'layanan_%')
            ->get()
            ->map(function ($setting) {
                $data = json_decode($setting->value, true);
                return [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'name' => $data['name'] ?? '',
                    'is_active' => $data['is_active'] ?? false,
                    'category' => $data['category'] ?? 'kependudukan',
                ];
            })
            ->groupBy('category');

        return Inertia::render('Admin/LayananSettings/Index', [
            'layananSettings' => $layananSettings,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function toggleStatus(Request $request)
    {
        try {
            $validated = $request->validate([
                'key' => 'required|string',
                'is_active' => 'required|boolean',
            ]);

            $setting = Setting::where('key', $validated['key'])->firstOrFail();
            $data = json_decode($setting->value, true);
            $data['is_active'] = $validated['is_active'];
            
            $setting->update([
                'value' => json_encode($data)
            ]);

            $status = $validated['is_active'] ? 'diaktifkan' : 'dinonaktifkan';
            
            return back()->with('success', "Layanan '{$data['name']}' berhasil {$status}.");

        } catch (\Exception $e) {
            \Log::error('Error toggling layanan status: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mengubah status layanan.');
        }
    }

    public function toggleBulk(Request $request)
    {
        try {
            $validated = $request->validate([
                'keys' => 'required|array',
                'keys.*' => 'required|string',
                'is_active' => 'required|boolean',
            ]);

            $count = 0;
            foreach ($validated['keys'] as $key) {
                $setting = Setting::where('key', $key)->first();
                if ($setting) {
                    $data = json_decode($setting->value, true);
                    $data['is_active'] = $validated['is_active'];
                    $setting->update(['value' => json_encode($data)]);
                    $count++;
                }
            }

            $status = $validated['is_active'] ? 'diaktifkan' : 'dinonaktifkan';
            
            return back()->with('success', "{$count} layanan berhasil {$status}.");

        } catch (\Exception $e) {
            \Log::error('Error bulk toggling layanan status: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mengubah status layanan.');
        }
    }
}