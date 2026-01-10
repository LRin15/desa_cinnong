<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LayananSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_layanan',
        'form_data',
        'uploaded_files',
        'status',
        'catatan_admin'
    ];

    protected $casts = [
        'form_data' => 'array',
        'uploaded_files' => 'array',
    ];

    // Accessor untuk mendapatkan status dalam bahasa Indonesia
    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'pending' => 'Menunggu',
            'diproses' => 'Sedang Diproses',
            'selesai' => 'Selesai',
            'ditolak' => 'Ditolak',
            default => 'Tidak Diketahui'
        };
    }

    // Accessor untuk mendapatkan warna badge status
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'diproses' => 'blue',
            'selesai' => 'green',
            'ditolak' => 'red',
            default => 'gray'
        };
    }
}