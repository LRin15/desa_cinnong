<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaduan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'email',
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
        return $query->where('status', 'belum_diproses');
    }

    /**
     * Scope untuk pengaduan sedang diproses
     */
    public function scopeSedangDiproses($query)
    {
        return $query->where('status', 'sedang_diproses');
    }

    /**
     * Scope untuk pengaduan selesai
     */
    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }
}