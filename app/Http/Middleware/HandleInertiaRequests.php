<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
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

        // Ambil data kontak desa dari settings
        $villageSettings = Setting::whereIn('key', [
            'nama_desa', 
            'email', 
            'telepon',
            'provinsi',
            'kabupaten',
            'kecamatan'
        ])->pluck('value', 'key');

        // Ambil data layanan yang aktif
        $layananSettings = Setting::where('key', 'LIKE', 'layanan_%')
            ->get()
            ->mapWithKeys(function ($setting) {
                $data = json_decode($setting->value, true);
                return [$setting->key => $data];
            })
            ->filter(function ($layanan) {
                // PENTING: Filter hanya yang is_active === true
                return isset($layanan['is_active']) && $layanan['is_active'] === true;
            });

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            
            'villageSettings' => [
                'nama_desa' => $villageSettings->get('nama_desa'),
                'email' => $villageSettings->get('email'),
                'telepon' => $villageSettings->get('telepon'),
                'provinsi' => $villageSettings->get('provinsi'),
                'kabupaten' => $villageSettings->get('kabupaten'),
                'kecamatan' => $villageSettings->get('kecamatan'),
            ],
            
            // Share layanan settings ke semua halaman
            'layananSettings' => $layananSettings->toArray(),
        ];
    }
}