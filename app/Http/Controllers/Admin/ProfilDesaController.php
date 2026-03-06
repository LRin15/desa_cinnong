<?php

// app/Http/Controllers/Admin/ProfilDesaController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\VillageOfficial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfilDesaController extends Controller
{
    // Menampilkan halaman profil desa untuk publik
    public function show()
    {
        $settings  = Setting::pluck('value', 'key');
        $officials = VillageOfficial::orderBy('urutan')->get();

        return Inertia::render('ProfilDesa', [
            'settings'  => $settings,
            'officials' => $officials,
        ]);
    }

    // Menampilkan form edit di dashboard admin
    public function edit()
    {
        $settings  = Setting::pluck('value', 'key');
        $officials = VillageOfficial::orderBy('urutan')->get()->map(function ($official) {
            return [
                'id'       => $official->id,
                'nama'     => $official->nama,
                'jabatan'  => $official->jabatan,
                'foto'     => $official->foto,
                'foto_url' => $official->foto,
                'urutan'   => $official->urutan,
            ];
        });

        return Inertia::render('Admin/Profil/Edit', [
            'settings'   => $settings,
            'officials'  => $officials,
            'isAdminBps' => Auth::user()->isAdminBps(), // ← kirim ke frontend
        ]);
    }

    // Menyimpan perubahan dari form edit
    public function update(Request $request)
    {
        try {
            Log::info('=== START UPDATE PROFIL DESA ===');

            $isAdminBps = Auth::user()->isAdminBps();

            // Validasi field yang hanya boleh diedit admin_bps
            $rules = [
                'jumlah_rt'    => 'nullable|integer|min:0',
                'luas'         => 'nullable|numeric|min:0',
                'email'        => 'nullable|email|max:255',
                'telepon'      => 'nullable|string|max:20',
                'sejarah'      => 'nullable|string',
                'visi'         => 'nullable|string',
                'misi'         => 'nullable|string',
                'gambar_peta'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'gambar_tim'   => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'officials'    => 'nullable|array',
                'officials.*.id'      => 'nullable|integer|exists:village_officials,id',
                'officials.*.nama'    => 'nullable|string|max:255',
                'officials.*.jabatan' => 'nullable|string|max:255',
                'officials.*.foto'    => 'nullable|image|mimes:jpeg,png,jpg|max:1024',
                'officials.*.urutan'  => 'nullable|integer',
                'stat1_label'   => 'nullable|string|max:100',
                'stat1_value'   => 'nullable|string|max:100',
                'stat2_label'   => 'nullable|string|max:100',
                'stat2_value'   => 'nullable|string|max:100',
                'stat3_label'   => 'nullable|string|max:100',
                'stat3_value'   => 'nullable|string|max:100',
                'data_terakhir' => 'nullable|string|max:100',
            ];

            // Field eksklusif admin_bps
            if ($isAdminBps) {
                $rules['nama_desa']  = 'nullable|string|max:255';
                $rules['kecamatan']  = 'nullable|string|max:255';
                $rules['kabupaten']  = 'nullable|string|max:255';
                $rules['provinsi']   = 'nullable|string|max:255';
            }

            $request->validate($rules);

            DB::beginTransaction();

            // Settings yang bisa diedit semua admin
            $commonSettings = [
                'jumlah_rt', 'luas', 'email', 'telepon',
                'sejarah', 'visi', 'misi',
                'stat1_label', 'stat1_value',
                'stat2_label', 'stat2_value',
                'stat3_label', 'stat3_value',
                'data_terakhir',
            ];

            // Settings eksklusif admin_bps
            $bpsOnlySettings = ['nama_desa', 'kecamatan', 'kabupaten', 'provinsi'];

            $settingsKeys = $isAdminBps
                ? array_merge($commonSettings, $bpsOnlySettings)
                : $commonSettings;

            foreach ($request->only($settingsKeys) as $key => $value) {
                if ($value !== null) {
                    Setting::updateOrCreate(['key' => $key], ['value' => $value]);
                }
            }

            // Handle upload gambar peta
            if ($request->hasFile('gambar_peta')) {
                $oldSetting = Setting::where('key', 'gambar_peta')->first();
                if ($oldSetting?->value) {
                    $oldPath = str_replace('/storage/', '', $oldSetting->value);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $path = $request->file('gambar_peta')->store('profil', 'public');
                Setting::updateOrCreate(['key' => 'gambar_peta'], ['value' => Storage::url($path)]);
            }

            // Handle upload gambar tim
            if ($request->hasFile('gambar_tim')) {
                $oldSetting = Setting::where('key', 'gambar_tim')->first();
                if ($oldSetting?->value) {
                    $oldPath = str_replace('/storage/', '', $oldSetting->value);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $path = $request->file('gambar_tim')->store('profil', 'public');
                Setting::updateOrCreate(['key' => 'gambar_tim'], ['value' => Storage::url($path)]);
            }

            // Update data aparat desa
            if ($request->has('officials') && is_array($request->officials)) {
                $submittedIds = collect($request->officials)
                    ->filter(fn ($o) => !empty($o['nama']) && !empty($o['jabatan']))
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                if (count($submittedIds) > 0) {
                    VillageOfficial::whereNotIn('id', $submittedIds)->delete();
                }

                foreach ($request->officials as $index => $officialData) {
                    if (empty($officialData['nama']) || empty($officialData['jabatan'])) continue;

                    $fotoPath = $officialData['foto_url'] ?? null;

                    if ($request->hasFile("officials.{$index}.foto")) {
                        if (!empty($officialData['id'])) {
                            $old = VillageOfficial::find($officialData['id']);
                            if ($old?->foto) {
                                $oldPath = str_replace('/storage/', '', $old->foto);
                                if (Storage::disk('public')->exists($oldPath)) {
                                    Storage::disk('public')->delete($oldPath);
                                }
                            }
                        }
                        $path     = $request->file("officials.{$index}.foto")->store('officials', 'public');
                        $fotoPath = Storage::url($path);
                    }

                    VillageOfficial::updateOrCreate(
                        ['id' => $officialData['id'] ?? null],
                        [
                            'nama'    => $officialData['nama'],
                            'jabatan' => $officialData['jabatan'],
                            'foto'    => $fotoPath,
                            'urutan'  => $officialData['urutan'] ?? ($index + 1),
                        ]
                    );
                }
            }

            DB::commit();
            Log::info('=== UPDATE PROFIL DESA SUCCESS ===');

            return redirect()->back()->with('success', 'Profil desa berhasil diperbarui!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Validasi gagal. Periksa kembali input Anda.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('UPDATE PROFIL DESA ERROR: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }
}