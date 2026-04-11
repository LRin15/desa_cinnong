<?php

namespace App\Http\Controllers;

use App\Models\LayananSubmission;
use App\Models\UserProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PenggunaTerdaftarController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user()->load('profile');

        $riwayatLayanan = LayananSubmission::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn ($item) => [
                'id'            => $item->id,
                'jenis_layanan' => $item->jenis_layanan,
                'status'        => $item->status,
                'status_label'  => $item->status_label,
                'catatan_admin' => $item->catatan_admin,
                // Hasil layanan dari admin
                'result_files'  => $item->result_files ?? [],
                'result_link'   => $item->result_link,
                // Penilaian dari pengguna
                'rating'        => $item->rating,
                'feedback'      => $item->feedback,
                'rated_at'      => $item->rated_at?->format('d M Y, H:i'),
                'created_at'    => $item->created_at->format('d M Y, H:i'),
                'updated_at'    => $item->updated_at->format('d M Y, H:i'),
            ]);

        return Inertia::render('Pengguna/Profil', [
            'auth'           => ['user' => $user],
            'riwayatLayanan' => $riwayatLayanan,
            'status'         => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => ['nullable', 'string'],
            'password'         => ['nullable', 'confirmed', Password::min(8)],
            'nama_lengkap'     => ['nullable', 'string', 'max:255'],
            'jenis_kelamin'    => ['nullable', 'in:Laki-laki,Perempuan'],
            'tanggal_lahir'    => ['nullable', 'date', 'before:today'],
            'alamat'           => ['nullable', 'string', 'max:500'],
            'rt'               => ['nullable', 'string', 'max:3'],
            'rw'               => ['nullable', 'string', 'max:3'],
            'no_telepon'       => ['nullable', 'string', 'max:20'],
            'pekerjaan'        => ['nullable', 'string', 'max:100'],
        ]);

        if (!empty($validated['password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Kata sandi saat ini tidak sesuai.']);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->name = $validated['name'];
        if ($user->email !== $validated['email']) {
            $user->email             = $validated['email'];
            $user->email_verified_at = null;
        }
        $user->save();

        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nama_lengkap'  => $validated['nama_lengkap']  ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'alamat'        => $validated['alamat']        ?? null,
                'rt'            => $validated['rt']            ?? null,
                'rw'            => $validated['rw']            ?? null,
                'no_telepon'    => $validated['no_telepon']    ?? null,
                'pekerjaan'     => $validated['pekerjaan']     ?? null,
            ]
        );

        return back()->with('status', 'Profil berhasil diperbarui.');
    }

    /**
     * Pengguna memberikan rating dan feedback setelah layanan selesai
     */
    public function submitRating(Request $request, LayananSubmission $layanan): RedirectResponse
    {
        // Pastikan layanan milik user yang login
        if ($layanan->user_id !== Auth::id()) {
            abort(403);
        }

        // Hanya layanan selesai yang bisa dinilai
        if ($layanan->status !== 'selesai') {
            return back()->with('error', 'Penilaian hanya dapat diberikan untuk layanan yang telah selesai.');
        }

        // Tidak boleh menilai ulang
        if ($layanan->rating !== null) {
            return back()->with('error', 'Anda sudah memberikan penilaian untuk layanan ini.');
        }

        $validated = $request->validate([
            'rating'   => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ], [
            'rating.required' => 'Penilaian wajib dipilih.',
            'rating.min'      => 'Penilaian minimal 1 bintang.',
            'rating.max'      => 'Penilaian maksimal 5 bintang.',
        ]);

        $layanan->update([
            'rating'   => $validated['rating'],
            'feedback' => $validated['feedback'] ?? null,
            'rated_at' => now(),
        ]);

        return back()->with('status', 'Terima kasih atas penilaian Anda!');
    }
}