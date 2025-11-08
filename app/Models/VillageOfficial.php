<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VillageOfficial extends Model
{
    use HasFactory;
    protected $fillable = ['nama', 'jabatan', 'foto', 'urutan'];
}