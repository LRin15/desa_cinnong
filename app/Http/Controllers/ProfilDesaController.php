<?php

namespace App\Http\Controllers;

use App\Models\Official;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilDesaController extends Controller
{
    /** Halaman publik Profil Desa */
    public function show()
    {
        $settings  = Setting::pluck('value', 'key')->toArray();
        $officials = Official::orderBy('urutan')->get();

        return Inertia::render('ProfilDesa', [
            'auth'      => ['user' => auth()->user()], // ← kirim auth agar navbar tahu status login
            'settings'  => $settings,
            'officials' => $officials,
        ]);
    }
}