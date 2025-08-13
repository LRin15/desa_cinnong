<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RekapPenduduk;

class RekapPendudukSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            // Data Januari 2025
            ['tahun' => 2025, 'bulan' => 1, 'nama_dusun' => 'KADDUMPIA', 'jumlah_l' => 308, 'jumlah_p' => 319],
            ['tahun' => 2025, 'bulan' => 1, 'nama_dusun' => 'MAKKAWARU', 'jumlah_l' => 202, 'jumlah_p' => 224],
            ['tahun' => 2025, 'bulan' => 1, 'nama_dusun' => 'JAMPALENNA', 'jumlah_l' => 196, 'jumlah_p' => 231],
            ['tahun' => 2025, 'bulan' => 1, 'nama_dusun' => 'TAMMARENRE', 'jumlah_l' => 181, 'jumlah_p' => 197],
            // Data Februari 2025
            ['tahun' => 2025, 'bulan' => 2, 'nama_dusun' => 'KADDUMPIA', 'jumlah_l' => 307, 'jumlah_p' => 318],
            ['tahun' => 2025, 'bulan' => 2, 'nama_dusun' => 'MAKKAWARU', 'jumlah_l' => 201, 'jumlah_p' => 225],
            // ... dan seterusnya untuk bulan-bulan lain
        ];

        foreach ($data as $item) {
            RekapPenduduk::create($item);
        }
    }
}