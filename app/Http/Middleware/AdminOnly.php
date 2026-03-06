<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        // Belum login → redirect ke halaman login
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('error', 'Silakan masuk terlebih dahulu.');
        }

        $user = Auth::user();

        // Hanya admin_bps dan admin_desa yang boleh masuk
        if (!$user->isAdmin()) {
            // Pengguna terdaftar → redirect ke profil mereka
            if ($user->isPenggunaTerdaftar()) {
                return redirect()->route('pengguna.profil')
                    ->with('error', 'Anda tidak memiliki akses ke halaman admin.');
            }

            // Role tidak dikenal → logout dan redirect login
            Auth::logout();
            return redirect()->route('login')
                ->with('error', 'Akses ditolak.');
        }

        return $next($request);
    }
}