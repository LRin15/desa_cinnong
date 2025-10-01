<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengaduanController extends Controller
{
    /**
     * Store pengaduan dari masyarakat
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telepon' => 'required|string|max:20',
            'judul' => 'required|string|max:255',
            'isi_pengaduan' => 'required|string',
        ]);

        Pengaduan::create([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'telepon' => $validated['telepon'],
            'judul' => $validated['judul'],
            'isi_pengaduan' => $validated['isi_pengaduan'],
            'status' => 'belum_diproses',
        ]);

        // Ganti redirect()->back() dengan ini
        return redirect()->back()->with('success', 'Pengaduan Anda telah berhasil dikirim. Terima kasih!');
    }
}
