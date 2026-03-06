<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
        InfografisSeeder::class,
    ]);
    $this->call([
        BeritaSeeder::class,
    ]);
     $this->call([
        PublikasiSeeder::class,
    ]);
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin BPS',
            'email' => 'adminbps@email.com',
            'role' => 'admin_bps',
            'password' => Hash::make('bps123'),
        ]);
    }
}
