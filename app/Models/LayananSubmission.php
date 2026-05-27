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
        'layanan_id',
        'form_data',
        'uploaded_files',
        'status',
        'catatan_admin',
        'result_files',
        'rating',
        'feedback',
        'rated_at',
    ];

    protected $casts = [
        'form_data'      => 'array',
        'uploaded_files' => 'array',
        'result_files'   => 'array',
        'rated_at'       => 'datetime',
    ];

    // ── Relasi ────────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(LayananSetting::class, 'layanan_id');
    }

    // ── Accessor ──────────────────────────────────────────────────────────────

    /**
     * Nama layanan diambil dari relasi — dipakai di banyak tempat
     * sebagai pengganti $submission->jenis_layanan yang lama.
     */
    public function getJenisLayananAttribute(): string
    {
        return $this->layanan?->name ?? '-';
    }

    public function getNamaPemohonAttribute(): string
    {
        return $this->user?->name ?? '-';
    }

    public function getEmailPemohonAttribute(): string
    {
        return $this->user?->email ?? '-';
    }

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

    // ── Helper ────────────────────────────────────────────────────────────────

    public function hasResult(): bool
    {
        return !empty($this->result_files);
    }

    public function hasRating(): bool
    {
        return $this->rating !== null;
    }
}