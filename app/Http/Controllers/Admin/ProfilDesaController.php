<?php

// app/Http/Controllers/Admin/ProfilDesaController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\VillageOfficial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfilDesaController extends Controller
{
    // Menampilkan halaman profil desa untuk publik
    public function show()
    {
        $settings = Setting::pluck('value', 'key');
        $officials = VillageOfficial::orderBy('urutan')->get();

        return Inertia::render('ProfilDesa', [
            'settings' => $settings,
            'officials' => $officials
        ]);
    }

    // Menampilkan form edit di dashboard admin
    public function edit()
    {
        $settings = Setting::pluck('value', 'key');
        $officials = VillageOfficial::orderBy('urutan')->get()->map(function($official) {
            return [
                'id' => $official->id,
                'nama' => $official->nama,
                'jabatan' => $official->jabatan,
                'foto' => $official->foto,
                'foto_url' => $official->foto,
                'urutan' => $official->urutan,
            ];
        });

        return Inertia::render('Admin/Profil/Edit', [
            'settings' => $settings,
            'officials' => $officials
        ]);
    }

    // Menyimpan perubahan dari form edit
    public function update(Request $request)
    {
        try {
            Log::info('=== START UPDATE PROFIL DESA ===');
            Log::info('Request Method: ' . $request->method());
            Log::info('Request Data:', $request->except(['gambar_peta', 'gambar_tim']));
            Log::info('Files:', array_keys($request->allFiles()));

            // Validasi - tambahkan field baru
            $validated = $request->validate([
                'nama_desa' => 'nullable|string|max:255',
                'kecamatan' => 'nullable|string|max:255',
                'kabupaten' => 'nullable|string|max:255',
                'provinsi' => 'nullable|string|max:255',
                'jumlah_rt' => 'nullable|integer|min:0',
                'luas' => 'nullable|numeric|min:0',
                'email' => 'nullable|email|max:255',
                'telepon' => 'nullable|string|max:20',
                'sejarah' => 'nullable|string',
                'visi' => 'nullable|string',
                'misi' => 'nullable|string',
                'gambar_peta' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'gambar_tim' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'officials' => 'nullable|array',
                'officials.*.id' => 'nullable|integer|exists:village_officials,id',
                'officials.*.nama' => 'nullable|string|max:255',
                'officials.*.jabatan' => 'nullable|string|max:255',
                'officials.*.foto' => 'nullable|image|mimes:jpeg,png,jpg|max:1024',
                'officials.*.urutan' => 'nullable|integer',
                // Validasi untuk statistik dinamis
                'stat1_label' => 'nullable|string|max:100',
                'stat1_value' => 'nullable|string|max:100',
                'stat2_label' => 'nullable|string|max:100',
                'stat2_value' => 'nullable|string|max:100',
                'stat3_label' => 'nullable|string|max:100',
                'stat3_value' => 'nullable|string|max:100',
                'data_terakhir' => 'nullable|string|max:100',
            ]);

            DB::beginTransaction();

            // Update settings (termasuk field baru dan statistik)
            $settingsData = $request->only([
                'nama_desa', 
                'kecamatan', 
                'kabupaten', 
                'provinsi', 
                'jumlah_rt', 
                'luas',
                'email', 
                'telepon', 
                'sejarah', 
                'visi', 
                'misi',
                // Statistik dinamis
                'stat1_label',
                'stat1_value',
                'stat2_label',
                'stat2_value',
                'stat3_label',
                'stat3_value',
                'data_terakhir'
            ]);
            
            foreach ($settingsData as $key => $value) {
                if ($value !== null) {
                    Setting::updateOrCreate(['key' => $key], ['value' => $value]);
                    Log::info("Updated setting: {$key}");
                }
            }

            // Handle upload gambar peta
            if ($request->hasFile('gambar_peta')) {
                Log::info('Uploading gambar_peta');
                
                // Hapus gambar lama jika ada
                $oldSetting = Setting::where('key', 'gambar_peta')->first();
                if ($oldSetting && $oldSetting->value) {
                    $oldPath = str_replace('/storage/', '', $oldSetting->value);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                        Log::info('Deleted old gambar_peta');
                    }
                }
                
                $path = $request->file('gambar_peta')->store('profil', 'public');
                $url = Storage::url($path);
                Setting::updateOrCreate(['key' => 'gambar_peta'], ['value' => $url]);
                Log::info('Saved new gambar_peta: ' . $url);
            }

            // Handle upload gambar tim
            if ($request->hasFile('gambar_tim')) {
                Log::info('Uploading gambar_tim');
                
                // Hapus gambar lama jika ada
                $oldSetting = Setting::where('key', 'gambar_tim')->first();
                if ($oldSetting && $oldSetting->value) {
                    $oldPath = str_replace('/storage/', '', $oldSetting->value);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                        Log::info('Deleted old gambar_tim');
                    }
                }
                
                $path = $request->file('gambar_tim')->store('profil', 'public');
                $url = Storage::url($path);
                Setting::updateOrCreate(['key' => 'gambar_tim'], ['value' => $url]);
                Log::info('Saved new gambar_tim: ' . $url);
            }
            
            // Update atau buat data aparat desa
            if ($request->has('officials') && is_array($request->officials)) {
                Log::info('Processing officials: ' . count($request->officials) . ' items');
                
                // Ambil ID yang ada di request
                $submittedIds = collect($request->officials)
                    ->filter(function($official) {
                        // Filter hanya officials yang memiliki nama dan jabatan
                        return !empty($official['nama']) && !empty($official['jabatan']);
                    })
                    ->pluck('id')
                    ->filter()
                    ->toArray();
                
                Log::info('Submitted IDs: ' . json_encode($submittedIds));
                
                // Hapus pegawai yang tidak ada di request
                if (count($submittedIds) > 0) {
                    $deleted = VillageOfficial::whereNotIn('id', $submittedIds)->delete();
                    Log::info('Deleted ' . $deleted . ' officials not in submission');
                }
                
                // Update atau create setiap pegawai
                foreach ($request->officials as $index => $officialData) {
                    // Skip jika nama atau jabatan kosong
                    if (empty($officialData['nama']) || empty($officialData['jabatan'])) {
                        Log::info("Skipping official at index {$index} - empty nama or jabatan");
                        continue;
                    }
                    
                    $fotoPath = $officialData['foto_url'] ?? null;
                    
                    // Handle upload foto baru
                    if ($request->hasFile("officials.{$index}.foto")) {
                        Log::info("Uploading foto for official index {$index}");
                        
                        // Hapus foto lama jika ada
                        if (isset($officialData['id']) && $officialData['id']) {
                            $oldOfficial = VillageOfficial::find($officialData['id']);
                            if ($oldOfficial && $oldOfficial->foto) {
                                $oldPath = str_replace('/storage/', '', $oldOfficial->foto);
                                if (Storage::disk('public')->exists($oldPath)) {
                                    Storage::disk('public')->delete($oldPath);
                                    Log::info('Deleted old photo for official ID: ' . $officialData['id']);
                                }
                            }
                        }
                        
                        $path = $request->file("officials.{$index}.foto")->store('officials', 'public');
                        $fotoPath = Storage::url($path);
                        Log::info("Saved new photo: {$fotoPath}");
                    }
                    
                    // Update atau create
                    $official = VillageOfficial::updateOrCreate(
                        ['id' => $officialData['id'] ?? null],
                        [
                            'nama' => $officialData['nama'],
                            'jabatan' => $officialData['jabatan'],
                            'foto' => $fotoPath,
                            'urutan' => $officialData['urutan'] ?? ($index + 1),
                        ]
                    );
                    
                    Log::info("Saved official ID {$official->id}: {$official->nama} - {$official->jabatan}");
                }
            }

            DB::commit();
            Log::info('=== UPDATE PROFIL DESA SUCCESS ===');
            
            return redirect()->back()->with('success', 'Profil desa berhasil diperbarui!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('=== VALIDATION ERROR ===');
            Log::error('Errors: ' . json_encode($e->errors()));
            
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Validasi gagal. Periksa kembali input Anda.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('=== UPDATE PROFIL DESA ERROR ===');
            Log::error('Message: ' . $e->getMessage());
            Log::error('File: ' . $e->getFile() . ':' . $e->getLine());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }
}