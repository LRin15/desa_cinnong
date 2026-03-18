<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'jenis_kelamin',
        'tanggal_lahir',
        'usia',
        'alamat',
        'rt',
        'rw',
        'no_telepon',
        'pekerjaan',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Hitung usia otomatis dari tanggal_lahir saat disimpan.
     */
    public function setTanggalLahirAttribute($value): void
    {
        $this->attributes['tanggal_lahir'] = $value;
        if ($value) {
            $this->attributes['usia'] = \Carbon\Carbon::parse($value)->age;
        }
    }
}