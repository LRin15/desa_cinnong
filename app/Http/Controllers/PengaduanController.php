<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PengaduanController extends Controller
{
    /**
     * Store pengaduan dari pengguna terdaftar.
     * Nama dan email diambil otomatis dari akun yang sedang login.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'telepon'      => 'required|string|max:20',
            'judul'        => 'required|string|max:255',
            'isi_pengaduan' => 'required|string',
        ]);

        Pengaduan::create([
            'user_id'      => Auth::id(),
            'telepon'      => $validated['telepon'],
            'judul'        => $validated['judul'],
            'isi_pengaduan' => $validated['isi_pengaduan'],
            'status'       => 'menunggu',
        ]);

        return redirect()->back()->with('success', 'Pengaduan Anda telah berhasil dikirim. Terima kasih!');
    }
}