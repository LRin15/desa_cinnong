<?php

// database/seeders/InfografisSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Infografis;

class InfografisSeeder extends Seeder
{
    public function run(): void
    {
        Infografis::create([
            'judul' => 'Data Kependudukan Desa Cinnong',
            'deskripsi' => 'Terdapat sebanyak 4 dusun di Desa Cinnong, yaitu Dusun Kaddumpia, Dusun Makkawaru, Dusun Jampalenna, dan Dusun Tammarenre.',
            'gambar' => '/images/infografis/infografis-penduduk.png', // Path ke gambar Anda
            'tanggal_terbit' => '2025-08-10',
        ]);

        Infografis::create([
            'judul' => 'Anggaran Pendapatan dan Belanja Desa (APBDes) 2025',
            'deskripsi' => 'Ringkasan alokasi dana desa untuk pembangunan infrastruktur, pemberdayaan masyarakat, dan kegiatan operasional desa.',
            'gambar' => '/images/infografis/infografis-apbdes.png', // Path ke gambar lain
            'tanggal_terbit' => '2025-07-22',
        ]);
    }
}
