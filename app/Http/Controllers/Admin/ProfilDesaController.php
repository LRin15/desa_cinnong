<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\VillageOfficial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProfilDesaController extends Controller
{
    /**
     * Direktori penyimpanan gambar profil desa — di bawah public/ langsung,
     * konsisten dengan cara BeritaController menyimpan public/images/berita.
     */
    protected string $uploadPath = 'images/profil';

    // ── Helper: path absolut ──────────────────────────────────────────────────

    private function absPath(string $filename): string
    {
        return public_path($this->uploadPath . '/' . $filename);
    }

    private function assetUrl(string $filename): string
    {
        return asset($this->uploadPath . '/' . $filename);
    }

    /** Pastikan direktori upload ada. */
    private function ensureDir(): void
    {
        $dir = public_path($this->uploadPath);
        if (!File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }
    }

    /**
     * Simpan satu file gambar ke public/images/profil.
     * Kembalikan nama file unik yang disimpan.
     */
    private function storeImage(\Illuminate\Http\UploadedFile $file): string
    {
        $this->ensureDir();
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $file->move(public_path($this->uploadPath), $filename);
        return $filename;
    }

    /**
     * Hapus file lama jika ada.
     * Nilai yang disimpan di DB bisa berupa:
     *   - URL penuh   : "http://…/images/profil/xxx.jpg"
     *   - Path storage: "/storage/profil/xxx.jpg"  (format lama)
     *   - Nama file   : "xxx.jpg"
     */
    private function deleteOldFile(?string $stored): void
    {
        if (!$stored) return;

        // Coba ekstrak nama file dari URL asset (format baru)
        $base = basename(parse_url($stored, PHP_URL_PATH));
        $newPath = public_path($this->uploadPath . '/' . $base);
        if (File::exists($newPath)) {
            File::delete($newPath);
            return;
        }

        // Format lama: /storage/... → storage/app/public/...
        if (str_starts_with($stored, '/storage/')) {
            $legacyPath = storage_path('app/public/' . ltrim(str_replace('/storage/', '', $stored), '/'));
            if (File::exists($legacyPath)) {
                File::delete($legacyPath);
            }
        }
    }

    // ── Controller actions ────────────────────────────────────────────────────

    public function show()
    {
        $settings  = Setting::pluck('value', 'key');
        $officials = VillageOfficial::orderBy('urutan')->get();

        return Inertia::render('ProfilDesa', [
            'settings'  => $settings,
            'officials' => $officials,
        ]);
    }

    public function edit()
    {
        $settings  = Setting::pluck('value', 'key');
        $officials = VillageOfficial::orderBy('urutan')->get()->map(fn ($o) => [
            'id'      => $o->id,
            'nama'    => $o->nama,
            'jabatan' => $o->jabatan,
            'foto'    => $o->foto,
            'urutan'  => $o->urutan,
        ]);

        return Inertia::render('Admin/Profil/Edit', [
            'settings'   => $settings,
            'officials'  => $officials,
            'isAdminBps' => Auth::user()->isAdminBps(),
            'flash'      => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        try {
            Log::info('=== START UPDATE PROFIL DESA ===');

            $isAdminBps = Auth::user()->isAdminBps();

            $rules = [
                'jumlah_rt'    => 'nullable|integer|min:0',
                'luas'         => 'nullable|numeric|min:0',
                'email'        => 'nullable|email|max:255',
                'telepon'      => 'nullable|string|max:20',
                'sejarah'      => 'nullable|string',
                'visi'         => 'nullable|string',
                'misi'         => 'nullable|string',
                // Gambar profil disimpan di public/images/profil
                'gambar_peta'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'gambar_tim'   => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'officials'    => 'nullable|array',
                'officials.*.id'            => 'nullable|integer|exists:village_officials,id',
                'officials.*.nama'          => 'nullable|string|max:255',
                'officials.*.jabatan'       => 'nullable|string|max:255',
                'officials.*.foto'          => 'nullable|image|mimes:jpeg,png,jpg|max:1024',
                'officials.*.existing_foto' => 'nullable|string',
                'officials.*.urutan'        => 'nullable|integer',
                'stat1_label'   => 'nullable|string|max:100',
                'stat1_value'   => 'nullable|string|max:100',
                'stat2_label'   => 'nullable|string|max:100',
                'stat2_value'   => 'nullable|string|max:100',
                'stat3_label'   => 'nullable|string|max:100',
                'stat3_value'   => 'nullable|string|max:100',
                'data_terakhir' => 'nullable|string|max:100',
            ];

            $messages = [
                'officials.*.foto.max'   => 'Ukuran foto aparatur maksimal 1MB.',
                'officials.*.foto.mimes' => 'Foto aparatur harus berformat JPEG, PNG, atau JPG.',
                'gambar_peta.max'        => 'Ukuran gambar peta maksimal 2MB.',
                'gambar_tim.max'         => 'Ukuran gambar tim maksimal 2MB.',
            ];

            if ($isAdminBps) {
                $rules['nama_desa'] = 'nullable|string|max:255';
                $rules['kecamatan'] = 'nullable|string|max:255';
                $rules['kabupaten'] = 'nullable|string|max:255';
                $rules['provinsi']  = 'nullable|string|max:255';
            }

            $request->validate($rules, $messages);

            DB::beginTransaction();

            // ── Settings teks ─────────────────────────────────────────────────
            $commonSettings  = [
                'jumlah_rt', 'luas', 'email', 'telepon',
                'sejarah', 'visi', 'misi',
                'stat1_label', 'stat1_value',
                'stat2_label', 'stat2_value',
                'stat3_label', 'stat3_value',
                'data_terakhir',
            ];
            $bpsOnlySettings = ['nama_desa', 'kecamatan', 'kabupaten', 'provinsi'];
            $settingsKeys    = $isAdminBps
                ? array_merge($commonSettings, $bpsOnlySettings)
                : $commonSettings;

            foreach ($request->only($settingsKeys) as $key => $value) {
                if ($value !== null) {
                    Setting::updateOrCreate(['key' => $key], ['value' => $value]);
                }
            }

            // ── Gambar peta ───────────────────────────────────────────────────
            if ($request->hasFile('gambar_peta')) {
                // Hapus file lama
                $old = Setting::where('key', 'gambar_peta')->value('value');
                $this->deleteOldFile($old);

                // Simpan file baru ke public/images/profil
                $filename = $this->storeImage($request->file('gambar_peta'));
                Setting::updateOrCreate(
                    ['key' => 'gambar_peta'],
                    ['value' => $this->assetUrl($filename)]
                );
            }

            // ── Gambar tim ────────────────────────────────────────────────────
            if ($request->hasFile('gambar_tim')) {
                $old = Setting::where('key', 'gambar_tim')->value('value');
                $this->deleteOldFile($old);

                $filename = $this->storeImage($request->file('gambar_tim'));
                Setting::updateOrCreate(
                    ['key' => 'gambar_tim'],
                    ['value' => $this->assetUrl($filename)]
                );
            }

            // ── Officials ─────────────────────────────────────────────────────
            if ($request->has('officials') && is_array($request->officials)) {
                $officialsData = collect($request->officials)
                    ->filter(fn ($o) => !empty($o['nama']) && !empty($o['jabatan']));

                $submittedIds = $officialsData->pluck('id')->filter()->values()->toArray();

                // Hapus official yang tidak ada lagi di form (beserta file fotonya)
                $toDelete = count($submittedIds) > 0
                    ? VillageOfficial::whereNotIn('id', $submittedIds)->get()
                    : VillageOfficial::all();

                foreach ($toDelete as $del) {
                    $this->deleteOldFile($del->foto);
                    $del->delete();
                }

                foreach ($officialsData as $index => $officialData) {
                    $officialId = $officialData['id'] ?? null;
                    // Pertahankan foto lama jika tidak ada upload baru
                    $fotoUrl = $officialData['existing_foto'] ?? null;

                    if ($request->hasFile("officials.{$index}.foto")) {
                        // Hapus foto lama jika ada
                        if ($officialId) {
                            $oldOfficial = VillageOfficial::find($officialId);
                            $this->deleteOldFile($oldOfficial?->foto);
                        }

                        // Simpan foto baru ke public/images/profil
                        $filename = $this->storeImage($request->file("officials.{$index}.foto"));
                        $fotoUrl  = $this->assetUrl($filename);
                    }

                    $payload = [
                        'nama'    => $officialData['nama'],
                        'jabatan' => $officialData['jabatan'],
                        'foto'    => $fotoUrl,
                        'urutan'  => $officialData['urutan'] ?? ($index + 1),
                    ];

                    if ($officialId) {
                        VillageOfficial::where('id', $officialId)->update($payload);
                    } else {
                        VillageOfficial::create($payload);
                    }
                }
            }

            DB::commit();
            Log::info('=== UPDATE PROFIL DESA SUCCESS ===');

            return redirect()->route('admin.profil.edit')
                ->with('success', 'Profil desa berhasil diperbarui!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Validasi gagal. Periksa kembali input Anda.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('UPDATE PROFIL DESA ERROR: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}