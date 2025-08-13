<?php

// app/Models/Berita.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    use HasFactory;

    protected $table = 'berita';

    protected $fillable = [
        'judul',
        'slug',
        'kategori',
        'kutipan',
        'isi',
        'gambar',
        'tanggal_terbit',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    // 💡 TAMBAHKAN BLOK KODE INI
    protected $casts = [
        'tanggal_terbit' => 'datetime',
    ];
}