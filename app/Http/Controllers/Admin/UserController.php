<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Tentukan role target berdasarkan role yang sedang login.
     * - admin_bps  → mengelola admin_desa
     * - admin_desa → hanya melihat pengguna_terdaftar (read-only)
     */
    private function targetRole(): string
    {
        return Auth::user()->isAdminBps()
            ? User::ROLE_ADMIN_DESA
            : User::ROLE_PENGGUNA_TERDAFTAR;
    }

    /**
     * Apakah user yang login hanya boleh view (tidak bisa CRUD).
     */
    private function isReadOnly(): bool
    {
        return Auth::user()->isAdminDesa();
    }

    /**
     * Menampilkan daftar user sesuai role yang bisa dikelola.
     */
    public function index(Request $request)
    {
        $currentUser = Auth::user();
        $targetRole  = $this->targetRole();

        $query = User::where('role', $targetRole);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(10)->through(fn ($user) => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'            => $user->role,
            'email_verified_at' => $user->email_verified_at?->toISOString(),
        ]);

        $users->appends($request->query());

        return Inertia::render('Admin/Users/Index', [
            'users'      => $users,
            'targetRole' => $targetRole,
            'isReadOnly' => $this->isReadOnly(),
            'filters'    => ['search' => $request->search],
            'flash'      => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * Form tambah user baru — hanya admin_bps.
     */
    public function create()
    {
        if ($this->isReadOnly()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak memiliki izin untuk menambah pengguna.');
        }

        return Inertia::render('Admin/Users/Create', [
            'targetRole' => $this->targetRole(),
        ]);
    }

    /**
     * Simpan user baru — hanya admin_bps, role dikunci ke admin_desa.
     */
    public function store(Request $request)
    {
        if ($this->isReadOnly()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak memiliki izin untuk menambah pengguna.');
        }

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $this->targetRole(), // selalu admin_desa saat dibuat oleh admin_bps
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dibuat.');
    }

    /**
     * Form edit user — hanya admin_bps.
     */
    public function edit(User $user)
    {
        if ($this->isReadOnly()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak memiliki izin untuk mengedit pengguna.');
        }

        // Pastikan admin_bps hanya bisa edit admin_desa
        if ($user->role !== $this->targetRole()) {
            abort(403, 'Akses ditolak.');
        }

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'            => $user->role,
            'email_verified_at' => $user->email_verified_at?->toISOString(),
            ],
            'targetRole' => $this->targetRole(),
        ]);
    }

    /**
     * Update user — hanya admin_bps.
     */
    public function update(Request $request, User $user)
    {
        if ($this->isReadOnly()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak memiliki izin untuk mengedit pengguna.');
        }

        if ($user->role !== $this->targetRole()) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    /**
     * Hapus user — hanya admin_bps.
     */
    public function destroy(User $user)
    {
        if ($this->isReadOnly()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak memiliki izin untuk menghapus pengguna.');
        }

        if ($user->role !== $this->targetRole()) {
            abort(403, 'Akses ditolak.');
        }

        if (Auth::id() === $user->id) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        try {
            $userName = $user->name;
            $user->delete();

            return redirect()->route('admin.users.index')
                ->with('success', "Pengguna '{$userName}' berhasil dihapus.");
        } catch (\Exception $e) {
            \Log::error('Error deleting user: ' . $e->getMessage());
            return redirect()->route('admin.users.index')
                ->with('error', 'Terjadi kesalahan saat menghapus pengguna.');
        }
    }
}