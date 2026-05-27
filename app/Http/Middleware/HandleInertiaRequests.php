<?php

namespace App\Http\Middleware;

use App\Models\LayananSetting;
use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Ambil data kontak desa dari settings (tidak berubah)
        $villageSettings = Setting::whereIn('key', [
            'nama_desa',
            'email',
            'telepon',
            'provinsi',
            'kabupaten',
            'kecamatan',
        ])->pluck('value', 'key');

        // Ambil layanan dari tabel layanan_settings (bukan lagi tabel settings)
        // Format output dipertahankan sama agar MainLayout.tsx tidak perlu diubah
        $layananSettings = LayananSetting::orderBy('name')
            ->get()
            ->mapWithKeys(fn ($l) => [
                self::toKey($l->name) => [
                    'name'      => $l->name,
                    'is_active' => $l->is_active,
                    'category'  => $l->category,
                ],
            ])
            ->filter(fn ($l) => $l['is_active'] === true);

        return [
            ...parent::share($request),
            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth'  => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            'villageSettings' => [
                'nama_desa' => $villageSettings->get('nama_desa'),
                'email'     => $villageSettings->get('email'),
                'telepon'   => $villageSettings->get('telepon'),
                'provinsi'  => $villageSettings->get('provinsi'),
                'kabupaten' => $villageSettings->get('kabupaten'),
                'kecamatan' => $villageSettings->get('kecamatan'),
            ],

            // Share layanan settings ke semua halaman
            'layananSettings' => $layananSettings->toArray(),
        ];
    }

    /**
     * Konversi nama layanan ke key yang digunakan di frontend (MainLayout.tsx).
     * Mapping eksplisit lebih aman daripada otomatis via Str::slug.
     */
    private static function toKey(string $name): string
    {
        $map = [
            'Surat Pengantar KTP'                 => 'layanan_ktp',
            'Surat Pengantar KK'                  => 'layanan_kk',
            'Surat Keterangan Domisili'            => 'layanan_domisili',
            'Surat Keterangan Usaha'              => 'layanan_usaha',
            'Surat Keterangan Tidak Mampu (SKTM)' => 'layanan_sktm',
            'Surat Keterangan Kelahiran'           => 'layanan_kelahiran',
            'Surat Keterangan Kematian'            => 'layanan_kematian',
            'Surat Pengantar Nikah'               => 'layanan_nikah',
            'Surat Keterangan Pindah'             => 'layanan_pindah',
            'Surat Izin Kegiatan'                 => 'layanan_izin_kegiatan',
            'Surat Rekomendasi Desa'              => 'layanan_rekomendasi',
            'Pengaduan & Aspirasi Masyarakat'     => 'layanan_pengaduan_aspirasi',
        ];

        return $map[$name] ?? 'layanan_' . Str::slug($name, '_');
    }
}