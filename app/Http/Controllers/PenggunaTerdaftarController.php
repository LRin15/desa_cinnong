<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PenggunaTerdaftarController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Riwayat pengajuan layanan milik user yang login
        $riwayatLayanan = \App\Models\LayananSubmission::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn ($item) => [
                'id'            => $item->id,
                'jenis_layanan' => $item->jenis_layanan,
                'status'        => $item->status,
                'status_label'  => $item->status_label,
                'catatan_admin' => $item->catatan_admin,
                'created_at'    => $item->created_at->format('d M Y, H:i'),
                'updated_at'    => $item->updated_at->format('d M Y, H:i'),
            ]);

        // Riwayat pengaduan milik user yang login
        $riwayatPengaduan = \App\Models\Pengaduan::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn ($item) => [
                'id'           => $item->id,
                'judul'        => $item->judul,
                'isi_pengaduan'=> $item->isi_pengaduan,
                'telepon'      => $item->telepon,
                'status'       => $item->status,
                'created_at'   => $item->created_at->format('d M Y, H:i'),
                'updated_at'   => $item->updated_at->format('d M Y, H:i'),
            ]);

        return Inertia::render('Pengguna/Profil', [
            'auth'             => ['user' => $user],
            'riwayatLayanan'   => $riwayatLayanan,
            'riwayatPengaduan' => $riwayatPengaduan,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => ['nullable', 'string'],
            'password'         => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        if (!empty($validated['password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Kata sandi saat ini tidak sesuai.']);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->name  = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        return back()->with('status', 'Profil berhasil diperbarui.');
    }
}