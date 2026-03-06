<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengaduan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'telepon',
        'judul',
        'isi_pengaduan',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke User (pengguna terdaftar yang membuat pengaduan)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor: ambil nama dari relasi user
     */
    public function getNamaAttribute(): string
    {
        return $this->user?->name ?? '-';
    }

    /**
     * Accessor: ambil email dari relasi user
     */
    public function getEmailAttribute(): string
    {
        return $this->user?->email ?? '-';
    }

    /**
     * Scope untuk filter berdasarkan status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope untuk pengaduan belum diproses
     */
    public function scopeBelumDiproses($query)
    {
        return $query->where('status', 'menunggu');
    }

    /**
     * Scope untuk pengaduan sedang diproses
     */
    public function scopeSedangDiproses($query)
    {
        return $query->where('status', 'diproses');
    }

    /**
     * Scope untuk pengaduan selesai
     */
    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }
}