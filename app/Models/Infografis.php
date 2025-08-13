<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Infografis extends Model
{
    use HasFactory;

    protected $table = 'infografis'; // Eksplisit mendefinisikan nama tabel

    protected $fillable = [
        'judul',
        'deskripsi',
        'gambar',
        'tanggal_terbit',
    ];

    protected $casts = [
    'tanggal_terbit' => 'datetime',
];
}