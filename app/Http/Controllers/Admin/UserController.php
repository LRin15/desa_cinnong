<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Apply ordering and pagination
        $users = $query->latest()->paginate(10)->through(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);

        // Append query parameters to pagination links
        $users->appends($request->query());

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
            ],
            // Explicitly pass flash messages
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Menampilkan form untuk membuat pengguna baru.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Menyimpan pengguna baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dibuat.');
    }

    /**
     * Menampilkan form untuk mengedit pengguna.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Memperbarui data pengguna di database.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    /**
     * Menghapus pengguna dari database.
     */
    public function destroy(User $user)
    {
        // Log untuk memastikan method ini dipanggil
        \Log::info('=== DESTROY METHOD CALLED ===');
        \Log::info('Request method: ' . request()->method());
        \Log::info('Request URL: ' . request()->url());
        \Log::info('User to delete: ' . $user->id . ' - ' . $user->name);
        \Log::info('Current auth user: ' . auth()->id());
        
        try {
            // Tambahkan validasi agar pengguna tidak bisa menghapus dirinya sendiri
            if (auth()->id() === $user->id) {
                \Log::warning('User attempted to delete themselves: ' . auth()->id());
                return redirect()->route('admin.users.index')
                    ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
            }
            
            $userName = $user->name; // Simpan nama sebelum menghapus
            
            // Log sebelum delete
            \Log::info('About to delete user: ' . $user->id);
            
            // Cek apakah user exists sebelum delete
            if (!$user->exists) {
                \Log::error('User does not exist in database: ' . $user->id);
                return redirect()->route('admin.users.index')
                    ->with('error', 'Pengguna tidak ditemukan.');
            }
            
            $deleted = $user->delete();
            
            \Log::info('Delete result: ' . ($deleted ? 'SUCCESS' : 'FAILED'));
            \Log::info('User deleted successfully: ' . $user->id . ' (' . $userName . ')');

            // Pastikan flash message di-set dengan benar
            return redirect()->route('admin.users.index')
                ->with('success', "Pengguna '{$userName}' berhasil dihapus.");

        } catch (\Exception $e) {
            // Log error dengan detail
            \Log::error('=== ERROR DELETING USER ===');
            \Log::error('User ID: ' . $user->id);
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.users.index')
                ->with('error', 'Terjadi kesalahan saat menghapus pengguna: ' . $e->getMessage());
        }
    }
}