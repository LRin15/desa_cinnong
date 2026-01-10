<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananController extends Controller
{
    // Base fields yang digunakan di semua form
    private function getBaseFields()
    {
        return [
            [
                'name' => 'nama_lengkap',
                'label' => 'Nama Lengkap',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Masukkan nama lengkap sesuai KTP'
            ],
            [
                'name' => 'nik',
                'label' => 'NIK',
                'type' => 'text',
                'required' => true,
                'placeholder' => '16 digit NIK',
                'maxLength' => 16
            ],
            [
                'name' => 'tempat_lahir',
                'label' => 'Tempat Lahir',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'tanggal_lahir',
                'label' => 'Tanggal Lahir',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'jenis_kelamin',
                'label' => 'Jenis Kelamin',
                'type' => 'select',
                'required' => true,
                'options' => ['Laki-laki', 'Perempuan']
            ],
            [
                'name' => 'pekerjaan',
                'label' => 'Pekerjaan',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'alamat',
                'label' => 'Alamat Lengkap',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jalan, Nomor Rumah, Dusun',
                'rows' => 3
            ],
            [
                'name' => 'rt',
                'label' => 'RT',
                'type' => 'text',
                'required' => true,
                'placeholder' => '000',
                'maxLength' => 3
            ],
            [
                'name' => 'rw',
                'label' => 'RW',
                'type' => 'text',
                'required' => true,
                'placeholder' => '000',
                'maxLength' => 3
            ],
            [
                'name' => 'no_telepon',
                'label' => 'No. Telepon',
                'type' => 'tel',
                'required' => true,
                'placeholder' => '08xxxxxxxxxx'
            ],
        ];
    }

    // Layanan Administrasi Kependudukan
    public function ktp()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'status_permohonan',
                'label' => 'Status Permohonan',
                'type' => 'select',
                'required' => true,
                'options' => ['Pembuatan Baru', 'Perpanjangan', 'Perubahan Data']
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_ktp_lama',
                'label' => 'Upload KTP Lama (Jika Perpanjangan)',
                'type' => 'file',
                'required' => false,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'pas_foto',
                'label' => 'Upload Pas Foto 3x4 (2 lembar)',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*',
                'multiple' => true
            ],
            [
                'name' => 'keperluan',
                'label' => 'Keterangan Tambahan',
                'type' => 'textarea',
                'required' => false,
                'placeholder' => 'Informasi tambahan jika diperlukan',
                'rows' => 3
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Pengantar KTP',
            'deskripsi' => 'Permohonan surat pengantar untuk pembuatan atau perpanjangan KTP',
            'persyaratan' => [
                'Fotocopy KK',
                'Fotocopy KTP lama (jika perpanjangan)',
                'Pas foto terbaru 3x4 (2 lembar)',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function kk()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'jenis_permohonan',
                'label' => 'Jenis Permohonan',
                'type' => 'select',
                'required' => true,
                'options' => ['KK Baru', 'Perubahan KK', 'Penambahan Anggota', 'Pengurangan Anggota']
            ],
            [
                'name' => 'foto_ktp_semua',
                'label' => 'Upload Fotocopy KTP Seluruh Anggota Keluarga',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf',
                'multiple' => true
            ],
            [
                'name' => 'foto_kk_lama',
                'label' => 'Upload Fotocopy KK Lama',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'dokumen_pendukung',
                'label' => 'Upload Surat Nikah/Akta Kelahiran',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf',
                'multiple' => true
            ],
            [
                'name' => 'keperluan',
                'label' => 'Alasan Permohonan',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jelaskan alasan permohonan KK',
                'rows' => 4
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Pengantar Kartu Keluarga',
            'deskripsi' => 'Permohonan surat pengantar untuk pembuatan atau perubahan KK',
            'persyaratan' => [
                'Fotocopy KTP seluruh anggota keluarga',
                'Fotocopy KK lama',
                'Surat nikah/akta kelahiran',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function domisili()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'foto_ktp',
                'label' => 'Upload Fotocopy KTP',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'pas_foto',
                'label' => 'Upload Pas Foto 3x4',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*'
            ],
            [
                'name' => 'keperluan',
                'label' => 'Keperluan',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jelaskan keperluan surat domisili',
                'rows' => 4
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Keterangan Domisili',
            'deskripsi' => 'Surat keterangan tempat tinggal yang sah',
            'persyaratan' => [
                'Fotocopy KTP',
                'Fotocopy KK',
                'Surat pengantar RT/RW',
                'Pas foto 3x4 (1 lembar)'
            ],
            'formFields' => $fields
        ]);
    }

    public function usaha()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'nama_usaha',
                'label' => 'Nama Usaha',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Nama usaha/bisnis Anda'
            ],
            [
                'name' => 'jenis_usaha',
                'label' => 'Jenis Usaha',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: Warung Makan, Toko Kelontong, dll'
            ],
            [
                'name' => 'alamat_usaha',
                'label' => 'Alamat Usaha',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Alamat lengkap lokasi usaha',
                'rows' => 2
            ],
            [
                'name' => 'foto_ktp',
                'label' => 'Upload Fotocopy KTP',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'pas_foto',
                'label' => 'Upload Pas Foto 3x4 (2 lembar)',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*',
                'multiple' => true
            ],
            [
                'name' => 'foto_lokasi_usaha',
                'label' => 'Upload Foto Lokasi Usaha',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*',
                'multiple' => true
            ],
            [
                'name' => 'keperluan',
                'label' => 'Keperluan',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jelaskan keperluan surat keterangan usaha',
                'rows' => 3
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Keterangan Usaha',
            'deskripsi' => 'Surat keterangan untuk keperluan usaha/bisnis',
            'persyaratan' => [
                'Fotocopy KTP',
                'Fotocopy KK',
                'Pas foto 3x4 (2 lembar)',
                'Foto lokasi usaha',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function sktm()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'penghasilan_perbulan',
                'label' => 'Penghasilan Per Bulan',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: Rp 1.000.000'
            ],
            [
                'name' => 'jumlah_tanggungan',
                'label' => 'Jumlah Tanggungan',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Jumlah anggota keluarga yang ditanggung'
            ],
            [
                'name' => 'foto_ktp',
                'label' => 'Upload Fotocopy KTP',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'pas_foto',
                'label' => 'Upload Pas Foto 3x4 (2 lembar)',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*',
                'multiple' => true
            ],
            [
                'name' => 'surat_keterangan_penghasilan',
                'label' => 'Upload Surat Keterangan Penghasilan',
                'type' => 'file',
                'required' => false,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'keperluan',
                'label' => 'Keperluan SKTM',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jelaskan untuk keperluan apa SKTM ini (contoh: berobat, sekolah, dll)',
                'rows' => 4
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Keterangan Tidak Mampu (SKTM)',
            'deskripsi' => 'Surat keterangan untuk keperluan bantuan/keringanan biaya',
            'persyaratan' => [
                'Fotocopy KTP',
                'Fotocopy KK',
                'Pas foto 3x4 (2 lembar)',
                'Surat keterangan penghasilan',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function kelahiran()
    {
        $fields = [
            // Data Bayi
            [
                'name' => 'nama_bayi',
                'label' => 'Nama Bayi',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'jenis_kelamin_bayi',
                'label' => 'Jenis Kelamin Bayi',
                'type' => 'select',
                'required' => true,
                'options' => ['Laki-laki', 'Perempuan']
            ],
            [
                'name' => 'tempat_lahir_bayi',
                'label' => 'Tempat Lahir Bayi',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'tanggal_lahir_bayi',
                'label' => 'Tanggal Lahir Bayi',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'jam_lahir',
                'label' => 'Jam Lahir',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'HH:MM (contoh: 14:30)'
            ],
            [
                'name' => 'berat_bayi',
                'label' => 'Berat Bayi (gram)',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: 3200'
            ],
            [
                'name' => 'panjang_bayi',
                'label' => 'Panjang Bayi (cm)',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: 50'
            ],
            // Data Ayah
            [
                'name' => 'nama_ayah',
                'label' => 'Nama Ayah',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik_ayah',
                'label' => 'NIK Ayah',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'pekerjaan_ayah',
                'label' => 'Pekerjaan Ayah',
                'type' => 'text',
                'required' => true
            ],
            // Data Ibu
            [
                'name' => 'nama_ibu',
                'label' => 'Nama Ibu',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik_ibu',
                'label' => 'NIK Ibu',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'pekerjaan_ibu',
                'label' => 'Pekerjaan Ibu',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'alamat',
                'label' => 'Alamat Lengkap',
                'type' => 'textarea',
                'required' => true,
                'rows' => 3
            ],
            [
                'name' => 'rt',
                'label' => 'RT',
                'type' => 'text',
                'required' => true,
                'maxLength' => 3
            ],
            [
                'name' => 'rw',
                'label' => 'RW',
                'type' => 'text',
                'required' => true,
                'maxLength' => 3
            ],
            [
                'name' => 'no_telepon',
                'label' => 'No. Telepon',
                'type' => 'tel',
                'required' => true,
                'placeholder' => '08xxxxxxxxxx'
            ],
            // Upload Dokumen
            [
                'name' => 'foto_ktp_ayah',
                'label' => 'Upload Fotocopy KTP Ayah',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_ktp_ibu',
                'label' => 'Upload Fotocopy KTP Ibu',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_buku_nikah',
                'label' => 'Upload Fotocopy Buku Nikah',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'surat_keterangan_lahir',
                'label' => 'Upload Surat Keterangan Kelahiran dari Bidan/RS',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ]
        ];

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Keterangan Kelahiran',
            'deskripsi' => 'Surat keterangan untuk pengurusan akta kelahiran',
            'persyaratan' => [
                'Fotocopy KTP kedua orang tua',
                'Fotocopy KK',
                'Fotocopy buku nikah',
                'Surat keterangan kelahiran dari bidan/rumah sakit',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function kematian()
    {
        $fields = [
            // Data Almarhum
            [
                'name' => 'nama_almarhum',
                'label' => 'Nama Almarhum/Almarhumah',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik_almarhum',
                'label' => 'NIK Almarhum/Almarhumah',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'jenis_kelamin_almarhum',
                'label' => 'Jenis Kelamin',
                'type' => 'select',
                'required' => true,
                'options' => ['Laki-laki', 'Perempuan']
            ],
            [
                'name' => 'tempat_lahir_almarhum',
                'label' => 'Tempat Lahir',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'tanggal_lahir_almarhum',
                'label' => 'Tanggal Lahir',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'tanggal_kematian',
                'label' => 'Tanggal Kematian',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'jam_kematian',
                'label' => 'Jam Kematian',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'HH:MM (contoh: 14:30)'
            ],
            [
                'name' => 'tempat_kematian',
                'label' => 'Tempat Kematian',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: RS, Rumah, dll'
            ],
            [
                'name' => 'sebab_kematian',
                'label' => 'Sebab Kematian',
                'type' => 'textarea',
                'required' => true,
                'rows' => 3
            ],
            // Data Pelapor
            [
                'name' => 'nama_pelapor',
                'label' => 'Nama Pelapor',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik_pelapor',
                'label' => 'NIK Pelapor',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'hubungan_pelapor',
                'label' => 'Hubungan dengan Almarhum/Almarhumah',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: Anak, Istri, Suami, dll'
            ],
            [
                'name' => 'alamat_pelapor',
                'label' => 'Alamat Pelapor',
                'type' => 'textarea',
                'required' => true,
                'rows' => 2
            ],
            [
                'name' => 'no_telepon',
                'label' => 'No. Telepon Pelapor',
                'type' => 'tel',
                'required' => true,
                'placeholder' => '08xxxxxxxxxx'
            ],
            // Upload Dokumen
            [
                'name' => 'foto_ktp_almarhum',
                'label' => 'Upload Fotocopy KTP Almarhum/Almarhumah',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_ktp_pelapor',
                'label' => 'Upload Fotocopy KTP Pelapor',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'surat_kematian_rs',
                'label' => 'Upload Surat Keterangan Kematian dari RS/Dokter',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ]
        ];

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Keterangan Kematian',
            'deskripsi' => 'Surat keterangan untuk pengurusan akta kematian',
            'persyaratan' => [
                'Fotocopy KTP almarhum/almarhumah',
                'Fotocopy KK',
                'Surat keterangan kematian dari rumah sakit/dokter',
                'Fotocopy KTP pelapor',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function nikah()
    {
        $fields = [
            // Data Calon Suami
            [
                'name' => 'nama_suami',
                'label' => 'Nama Lengkap Calon Suami',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik_suami',
                'label' => 'NIK Calon Suami',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'tempat_lahir_suami',
                'label' => 'Tempat Lahir',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'tanggal_lahir_suami',
                'label' => 'Tanggal Lahir',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'pekerjaan_suami',
                'label' => 'Pekerjaan',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'alamat_suami',
                'label' => 'Alamat Lengkap',
                'type' => 'textarea',
                'required' => true,
                'rows' => 2
            ],
            // Data Calon Istri
            [
                'name' => 'nama_istri',
                'label' => 'Nama Lengkap Calon Istri',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik_istri',
                'label' => 'NIK Calon Istri',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'tempat_lahir_istri',
                'label' => 'Tempat Lahir',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'tanggal_lahir_istri',
                'label' => 'Tanggal Lahir',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'pekerjaan_istri',
                'label' => 'Pekerjaan',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'alamat_istri',
                'label' => 'Alamat Lengkap',
                'type' => 'textarea',
                'required' => true,
                'rows' => 2
            ],
            [
                'name' => 'tanggal_rencana_nikah',
                'label' => 'Tanggal Rencana Pernikahan',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'no_telepon',
                'label' => 'No. Telepon',
                'type' => 'tel',
                'required' => true,
                'placeholder' => '08xxxxxxxxxx'
            ],
            // Upload Dokumen
            [
                'name' => 'foto_ktp_suami',
                'label' => 'Upload Fotocopy KTP Calon Suami',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_ktp_istri',
                'label' => 'Upload Fotocopy KTP Calon Istri',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk_suami',
                'label' => 'Upload Fotocopy KK Calon Suami',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk_istri',
                'label' => 'Upload Fotocopy KK Calon Istri',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'pas_foto',
                'label' => 'Upload Pas Foto 3x4 (4 lembar per orang)',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*',
                'multiple' => true
            ],
            [
                'name' => 'foto_ijazah',
                'label' => 'Upload Fotocopy Ijazah Terakhir (Keduanya)',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf',
                'multiple' => true
            ],
            [
                'name' => 'surat_belum_menikah',
                'label' => 'Upload Surat Keterangan Belum Menikah',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf',
                'multiple' => true
            ]
        ];

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Pengantar Nikah',
            'deskripsi' => 'Surat pengantar untuk keperluan pernikahan',
            'persyaratan' => [
                'Fotocopy KTP calon mempelai',
                'Fotocopy KK',
                'Pas foto 3x4 (4 lembar)',
                'Fotocopy ijazah terakhir',
                'Surat keterangan belum menikah',
                'Surat pengantar RT/RW'
            ],
            'formFields' => $fields
        ]);
    }

    public function pindah()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'alasan_pindah',
                'label' => 'Alasan Pindah',
                'type' => 'select',
                'required' => true,
                'options' => ['Pekerjaan', 'Pendidikan', 'Keamanan', 'Kesehatan', 'Perumahan', 'Keluarga', 'Lainnya']
            ],
            [
                'name' => 'alamat_tujuan',
                'label' => 'Alamat Tujuan',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Alamat lengkap tujuan pindah',
                'rows' => 3
            ],
            [
                'name' => 'jumlah_keluarga_pindah',
                'label' => 'Jumlah Anggota Keluarga yang Pindah',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: 4 orang'
            ],
            [
                'name' => 'foto_ktp_semua',
                'label' => 'Upload Fotocopy KTP Seluruh Anggota yang Pindah',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf',
                'multiple' => true
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'keterangan_tambahan',
                'label' => 'Keterangan Tambahan',
                'type' => 'textarea',
                'required' => false,
                'placeholder' => 'Informasi tambahan jika diperlukan',
                'rows' => 3
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Keterangan Pindah',
            'deskripsi' => 'Surat keterangan untuk keperluan pindah domisili',
            'persyaratan' => [
                'Fotocopy KTP seluruh anggota keluarga yang pindah',
                'Fotocopy KK',
                'Surat pengantar RT/RW',
                'Surat keterangan pindah dari kelurahan asal (jika dari luar desa)'
            ],
            'formFields' => $fields
        ]);
    }

    public function izinKegiatan()
    {
        $fields = [
            [
                'name' => 'nama_lengkap',
                'label' => 'Nama Lengkap Penanggung Jawab',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'nik',
                'label' => 'NIK',
                'type' => 'text',
                'required' => true,
                'maxLength' => 16
            ],
            [
                'name' => 'alamat',
                'label' => 'Alamat Lengkap',
                'type' => 'textarea',
                'required' => true,
                'rows' => 2
            ],
            [
                'name' => 'no_telepon',
                'label' => 'No. Telepon',
                'type' => 'tel',
                'required' => true,
                'placeholder' => '08xxxxxxxxxx'
            ],
            [
                'name' => 'nama_kegiatan',
                'label' => 'Nama Kegiatan',
                'type' => 'text',
                'required' => true
            ],
            [
                'name' => 'jenis_kegiatan',
                'label' => 'Jenis Kegiatan',
                'type' => 'select',
                'required' => true,
                'options' => ['Sosial', 'Keagamaan', 'Olahraga', 'Budaya', 'Hiburan', 'Lainnya']
            ],
            [
                'name' => 'tanggal_mulai',
                'label' => 'Tanggal Mulai',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'tanggal_selesai',
                'label' => 'Tanggal Selesai',
                'type' => 'date',
                'required' => true
            ],
            [
                'name' => 'waktu_kegiatan',
                'label' => 'Waktu Kegiatan',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: 08.00 - 17.00 WIB'
            ],
            [
                'name' => 'lokasi_kegiatan',
                'label' => 'Lokasi Kegiatan',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Alamat lengkap lokasi kegiatan',
                'rows' => 2
            ],
            [
                'name' => 'jumlah_peserta',
                'label' => 'Perkiraan Jumlah Peserta',
                'type' => 'text',
                'required' => true,
                'placeholder' => 'Contoh: 100 orang'
            ],
            [
                'name' => 'deskripsi_kegiatan',
                'label' => 'Deskripsi Kegiatan',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jelaskan secara singkat kegiatan yang akan dilaksanakan',
                'rows' => 4
            ],
            [
                'name' => 'foto_ktp',
                'label' => 'Upload Fotocopy KTP Penanggung Jawab',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'proposal_kegiatan',
                'label' => 'Upload Proposal Kegiatan',
                'type' => 'file',
                'required' => true,
                'accept' => '.pdf,.doc,.docx'
            ],
            [
                'name' => 'surat_pernyataan',
                'label' => 'Upload Surat Pernyataan Bertanggung Jawab',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ]
        ];

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Izin Kegiatan',
            'deskripsi' => 'Surat izin untuk penyelenggaraan kegiatan di wilayah desa',
            'persyaratan' => [
                'Fotocopy KTP penanggung jawab',
                'Proposal kegiatan',
                'Surat pengantar RT/RW',
                'Surat pernyataan bertanggung jawab'
            ],
            'formFields' => $fields
        ]);
    }

    public function rekomendasi()
    {
        $fields = array_merge($this->getBaseFields(), [
            [
                'name' => 'jenis_rekomendasi',
                'label' => 'Jenis Rekomendasi',
                'type' => 'select',
                'required' => true,
                'options' => [
                    'Rekomendasi Kerja',
                    'Rekomendasi Pendidikan',
                    'Rekomendasi Bantuan',
                    'Rekomendasi Kredit/Pinjaman',
                    'Lainnya'
                ]
            ],
            [
                'name' => 'foto_ktp',
                'label' => 'Upload Fotocopy KTP',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'foto_kk',
                'label' => 'Upload Fotocopy KK',
                'type' => 'file',
                'required' => true,
                'accept' => 'image/*,.pdf'
            ],
            [
                'name' => 'dokumen_pendukung',
                'label' => 'Upload Dokumen Pendukung (jika ada)',
                'type' => 'file',
                'required' => false,
                'accept' => 'image/*,.pdf',
                'multiple' => true
            ],
            [
                'name' => 'keperluan',
                'label' => 'Tujuan dan Keperluan Rekomendasi',
                'type' => 'textarea',
                'required' => true,
                'placeholder' => 'Jelaskan secara detail untuk keperluan apa rekomendasi ini',
                'rows' => 5
            ]
        ]);

        return Inertia::render('Layanan/FormLayanan', [
            'jenisLayanan' => 'Surat Rekomendasi Desa',
            'deskripsi' => 'Surat rekomendasi untuk berbagai keperluan',
            'persyaratan' => [
                'Fotocopy KTP',
                'Fotocopy KK',
                'Surat pengantar RT/RW',
                'Dokumen pendukung sesuai keperluan'
            ],
            'formFields' => $fields
        ]);
    }

    // Method untuk submit form
    public function submit(Request $request)
    {
        $rules = [
            'jenis_layanan' => 'required|string',
        ];

        // Dynamic validation based on form fields
        foreach ($request->all() as $key => $value) {
            if ($key !== 'jenis_layanan' && $key !== '_token') {
                if ($request->hasFile($key)) {
                    if (is_array($request->file($key))) {
                        // Jika multiple files
                        $rules[$key] = 'required|array';
                        $rules[$key . '.*'] = 'file|max:5120';
                    } else {
                        // Jika single file
                        $rules[$key] = 'nullable|file|max:5120';
                    }
                } else {
                    $rules[$key] = 'nullable|string';
                }
            }
        }

        $validated = $request->validate($rules);

        try {
            // Handle file uploads
            $uploadedFiles = [];
            foreach ($request->allFiles() as $key => $files) {
                if (is_array($files)) {
                    $uploadedFiles[$key] = [];
                    foreach ($files as $file) {
                        $path = $file->store('layanan_documents', 'public');
                        $uploadedFiles[$key][] = $path;
                    }
                } else {
                    $uploadedFiles[$key] = $files->store('layanan_documents', 'public');
                }
            }

            // Prepare form data (excluding files and meta fields)
            $formData = [];
            foreach ($validated as $key => $value) {
                if ($key !== 'jenis_layanan' && !$request->hasFile($key)) {
                    $formData[$key] = $value;
                }
            }

            // Create layanan submission
            \App\Models\LayananSubmission::create([
                'jenis_layanan' => $validated['jenis_layanan'],
                'form_data' => $formData,
                'uploaded_files' => $uploadedFiles,
                'status' => 'pending',
            ]);

            return redirect()->back()->with('success', 'Permohonan layanan berhasil dikirim. Silakan tunggu proses verifikasi.');

        } catch (\Exception $e) {
            \Log::error('Error submitting layanan: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi.')
                ->withInput();
        }
    }
}