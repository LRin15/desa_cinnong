<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LayananSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'jenis_layanan',
        'form_data',
        'uploaded_files',
        'status',
        'catatan_admin',
    ];

    protected $casts = [
        'form_data'      => 'array',
        'uploaded_files' => 'array',
    ];

    /**
     * Relasi ke User (pengguna terdaftar yang mengajukan permohonan)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor: nama pemohon dari relasi user
     */
    public function getNamaPemohonAttribute(): string
    {
        return $this->user?->name ?? '-';
    }

    /**
     * Accessor: email pemohon dari relasi user
     */
    public function getEmailPemohonAttribute(): string
    {
        return $this->user?->email ?? '-';
    }

    /**
     * Accessor: status dalam Bahasa Indonesia
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending'  => 'Menunggu',
            'diproses' => 'Sedang Diproses',
            'selesai'  => 'Selesai',
            'ditolak'  => 'Ditolak',
            default    => 'Tidak Diketahui',
        };
    }

    /**
     * Accessor: warna badge status
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending'  => 'yellow',
            'diproses' => 'blue',
            'selesai'  => 'green',
            'ditolak'  => 'red',
            default    => 'gray',
        };
    }
}