<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Role constants
     */
    const ROLE_ADMIN_BPS         = 'admin_bps';
    const ROLE_ADMIN_DESA        = 'admin_desa';
    const ROLE_PENGGUNA_TERDAFTAR = 'pengguna_terdaftar';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user is Admin BPS.
     */
    public function isAdminBps(): bool
    {
        return $this->role === self::ROLE_ADMIN_BPS;
    }

    /**
     * Check if the user is Admin Desa.
     */
    public function isAdminDesa(): bool
    {
        return $this->role === self::ROLE_ADMIN_DESA;
    }

    /**
     * Check if the user is a regular registered user.
     */
    public function isPenggunaTerdaftar(): bool
    {
        return $this->role === self::ROLE_PENGGUNA_TERDAFTAR;
    }

    /**
     * Check if the user has admin access (BPS or Desa).
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN_BPS, self::ROLE_ADMIN_DESA]);
    }

    /**
     * Get human-readable role label.
     */
    public function getRoleLabelAttribute(): string
    {
        return match($this->role) {
            self::ROLE_ADMIN_BPS         => 'Admin BPS',
            self::ROLE_ADMIN_DESA        => 'Admin Desa',
            self::ROLE_PENGGUNA_TERDAFTAR => 'Pengguna Terdaftar',
            default                       => 'Tidak Diketahui',
        };
    }
}