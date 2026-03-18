<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Role constants
     */
    const ROLE_ADMIN_BPS          = 'admin_bps';
    const ROLE_ADMIN_DESA         = 'admin_desa';
    const ROLE_PENGGUNA_TERDAFTAR = 'pengguna_terdaftar';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ─── Relasi ───────────────────────────────────────────────────

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    // ─── Role helpers ─────────────────────────────────────────────

    public function isAdminBps(): bool
    {
        return $this->role === self::ROLE_ADMIN_BPS;
    }

    public function isAdminDesa(): bool
    {
        return $this->role === self::ROLE_ADMIN_DESA;
    }

    public function isPenggunaTerdaftar(): bool
    {
        return $this->role === self::ROLE_PENGGUNA_TERDAFTAR;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN_BPS, self::ROLE_ADMIN_DESA]);
    }

    public function getRoleLabelAttribute(): string
    {
        return match ($this->role) {
            self::ROLE_ADMIN_BPS          => 'Admin BPS',
            self::ROLE_ADMIN_DESA         => 'Admin Desa',
            self::ROLE_PENGGUNA_TERDAFTAR => 'Pengguna Terdaftar',
            default                       => 'Tidak Diketahui',
        };
    }
}