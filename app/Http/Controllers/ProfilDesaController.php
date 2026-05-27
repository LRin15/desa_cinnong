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
        $officials = Official::all();

        return Inertia::render('ProfilDesa', [
            'auth'      => ['user' => auth()->user()],
            'settings'  => $settings,
            'officials' => $officials,
        ]);
    }
}