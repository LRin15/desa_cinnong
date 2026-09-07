<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PenggunaTerdaftar
{
    /**
     * Handle an incoming request.
     * Hanya izinkan pengguna dengan role 'pengguna_terdaftar' mengakses.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Silakan login terlebih dahulu.'], 401);
            }
            return redirect()->route('login')
                ->with('info', 'Silakan login terlebih dahulu untuk mengakses layanan ini.');
        }

        if (!auth()->user()->isPenggunaTerdaftar()) {
            return redirect()->route('dashboard')
                ->with('info', 'Halaman ini hanya untuk pengguna terdaftar.');
        }

        if (!auth()->user()->hasVerifiedEmail()) {
            return redirect()->route('verification.notice')
                ->with('info', 'Silakan verifikasi email Anda terlebih dahulu untuk mengakses layanan ini.');
        }

        return $next($request);
    }
}