-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Apr 2026 pada 04.33
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `desa_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `berita`
--

CREATE TABLE `berita` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `kutipan` text NOT NULL,
  `isi` longtext NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `tanggal_terbit` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `berita`
--

INSERT INTO `berita` (`id`, `judul`, `slug`, `kategori`, `kutipan`, `isi`, `gambar`, `tanggal_terbit`, `created_at`, `updated_at`) VALUES
(1, 'Update Data Kependudukan Kuartal III 2025', 'update-data-kependudukan-kuartal-iii-2025', 'Pengumuman', 'Data kependudukan Desa Cinnong telah diperbarui dengan total 1.868 jiwa tersebar di 4 dusun.', 'Konten lengkap tentang update data kependudukan...', 'images/berita/default.jpg', '2026-04-13 19:32:36', '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(2, 'Program Bantuan UMKM Resmi Dibuka', 'program-bantuan-umkm-resmi-dibuka', 'Program Desa', 'Pemerintah desa meluncurkan program bantuan modal usaha untuk UMKM terdaftar di Desa Cinnong.', 'Konten lengkap tentang program bantuan UMKM...', 'images/berita/default.jpg', '2026-04-08 19:32:36', '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(3, 'Gotong Royong Membersihkan Saluran Irigasi', 'gotong-royong-membersihkan-saluran-irigasi', 'Kegiatan Warga', 'Warga Dusun I dan II melaksanakan kegiatan gotong royong untuk membersihkan saluran irigasi utama.', 'Konten lengkap tentang kegiatan gotong royong...', 'images/berita/default.jpg', '2026-04-01 19:32:36', '2026-04-16 19:32:36', '2026-04-16 19:32:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `dynamic_tables`
--

CREATE TABLE `dynamic_tables` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`columns`)),
  `has_column_total` tinyint(1) NOT NULL DEFAULT 0,
  `has_row_total` tinyint(1) NOT NULL DEFAULT 0,
  `source` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `charts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`charts`)),
  `has_row_number` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `dynamic_table_data`
--

CREATE TABLE `dynamic_table_data` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dynamic_table_id` bigint(20) UNSIGNED NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `infografis`
--

CREATE TABLE `infografis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `tanggal_terbit` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `infografis`
--

INSERT INTO `infografis` (`id`, `judul`, `deskripsi`, `gambar`, `tanggal_terbit`, `created_at`, `updated_at`) VALUES
(1, 'Data Kependudukan Desa Cinnong', 'Terdapat sebanyak 4 dusun di Desa Cinnong, yaitu Dusun Kaddumpia, Dusun Makkawaru, Dusun Jampalenna, dan Dusun Tammarenre.', '/images/infografis/infografis-penduduk.png', '2025-08-10', '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(2, 'Anggaran Pendapatan dan Belanja Desa (APBDes) 2025', 'Ringkasan alokasi dana desa untuk pembangunan infrastruktur, pemberdayaan masyarakat, dan kegiatan operasional desa.', '/images/infografis/infografis-apbdes.png', '2025-07-22', '2026-04-16 19:32:36', '2026-04-16 19:32:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `layanan_settings`
--

CREATE TABLE `layanan_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('kependudukan','umum','pengaduan') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `layanan_settings`
--

INSERT INTO `layanan_settings` (`id`, `name`, `category`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Surat Pengantar KTP', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(2, 'Surat Pengantar KK', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(3, 'Surat Keterangan Domisili', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(4, 'Surat Keterangan Usaha', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(5, 'Surat Keterangan Tidak Mampu (SKTM)', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(6, 'Surat Keterangan Kelahiran', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(7, 'Surat Keterangan Kematian', 'kependudukan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(8, 'Surat Pengantar Nikah', 'umum', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(9, 'Surat Keterangan Pindah', 'umum', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(10, 'Surat Izin Kegiatan', 'umum', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(11, 'Surat Rekomendasi Desa', 'umum', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(12, 'Pengaduan & Aspirasi Masyarakat', 'pengaduan', 1, '2026-04-16 19:32:36', '2026-04-16 19:32:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `layanan_submissions`
--

CREATE TABLE `layanan_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `layanan_id` bigint(20) UNSIGNED NOT NULL,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`form_data`)),
  `uploaded_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`uploaded_files`)),
  `status` enum('pending','diproses','selesai','ditolak') NOT NULL DEFAULT 'pending',
  `catatan_admin` text DEFAULT NULL,
  `result_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`result_files`)),
  `rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `rated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_12_053231_create_infografis_table', 1),
(5, '2025_08_13_062628_create_beritas_table', 1),
(6, '2025_09_12_081322_create_publikasi_table', 1),
(7, '2025_10_17_123749_create_settings_table', 1),
(8, '2025_10_17_123754_create_village_officials_table', 1),
(9, '2025_12_08_113630_create_dynamic_tables', 1),
(10, '2025_12_30_013154_add_total_fields_to_dynamic_tables_table', 1),
(11, '2026_01_10_055401_add_charts_to_dynamic_tables_table', 1),
(12, '2026_02_12_011905_add_role_to_users_table', 1),
(13, '2026_03_07_050817_create_user_profiles_table', 1),
(14, '2026_03_18_014202_create_notifications_table', 1),
(15, '2026_03_27_233333_add_source_notes_to_dynamic_tables_table', 1),
(16, '2026_04_11_114557_create_layanan_settings_table', 1),
(17, '2026_04_11_114558_create_layanan_submissions_table', 1),
(18, '2026_04_11_114608_seed_layanan_settings_table', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `publikasi`
--

CREATE TABLE `publikasi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `tanggal_publikasi` date NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `nama_asli_file` varchar(255) NOT NULL,
  `tipe_file` varchar(255) NOT NULL,
  `ukuran_file` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `publikasi`
--

INSERT INTO `publikasi` (`id`, `judul`, `deskripsi`, `tanggal_publikasi`, `nama_file`, `nama_asli_file`, `tipe_file`, `ukuran_file`, `created_at`, `updated_at`) VALUES
(1, 'Laporan Keuangan Desa Tahun 2024', 'Laporan lengkap keuangan dan anggaran Desa Cinnong untuk tahun anggaran 2024, termasuk realisasi APBDes dan pertanggungjawaban keuangan.', '2025-01-15', 'laporan_keuangan_2024.pdf', 'Laporan Keuangan Desa Cinnong 2024.pdf', 'pdf', 2560000, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(2, 'Data Kependudukan dan Statistik Desa 2024', 'Data lengkap kependudukan Desa Cinnong tahun 2024, termasuk demografi, tingkat pendidikan, dan mata pencaharian penduduk.', '2025-01-10', 'data_penduduk_2024.xlsx', 'Data Kependudukan Desa Cinnong 2024.xlsx', 'xlsx', 1843200, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(3, 'Peraturan Desa Nomor 1 Tahun 2024', 'Peraturan Desa tentang Tata Tertib Keamanan dan Ketertiban Lingkungan di Wilayah Desa Cinnong.', '2025-01-05', 'perdes_01_2024.docx', 'Peraturan Desa No 1 Tahun 2024.docx', 'docx', 870400, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(4, 'Rencana Pembangunan Jangka Menengah Desa 2024-2030', 'Dokumen perencanaan pembangunan jangka menengah Desa Cinnong periode 2024-2030 yang memuat visi, misi, dan program prioritas.', '2024-12-28', 'rpjm_desa_2024_2030.pdf', 'RPJM Desa Cinnong 2024-2030.pdf', 'pdf', 4194304, '2026-04-16 19:32:36', '2026-04-16 19:32:36'),
(5, 'Profil Potensi Ekonomi Desa 2024', 'Dokumen yang berisi informasi lengkap tentang potensi ekonomi, UMKM, dan peluang investasi di Desa Cinnong.', '2024-12-20', 'profil_ekonomi_desa_2024.pdf', 'Profil Potensi Ekonomi Desa Cinnong 2024.pdf', 'pdf', 3145728, '2026-04-16 19:32:36', '2026-04-16 19:32:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin_bps','admin_desa','pengguna_terdaftar') NOT NULL DEFAULT 'pengguna_terdaftar',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin BPS', 'adminbps@email.com', 'admin_bps', '2026-04-16 19:32:38', '$2y$12$BpqPiSNP5i9jk0x5rV18TupJQiX38MdTLMlMiq3KNllp3414WVnX6', 'pKKPAMK6Pa', '2026-04-16 19:32:38', '2026-04-16 19:32:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `nama_lengkap` varchar(255) DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `pekerjaan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `village_officials`
--

CREATE TABLE `village_officials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `berita_slug_unique` (`slug`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indeks untuk tabel `dynamic_tables`
--
ALTER TABLE `dynamic_tables`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `dynamic_table_data`
--
ALTER TABLE `dynamic_table_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dynamic_table_data_dynamic_table_id_foreign` (`dynamic_table_id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `infografis`
--
ALTER TABLE `infografis`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `layanan_settings`
--
ALTER TABLE `layanan_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `layanan_submissions`
--
ALTER TABLE `layanan_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layanan_submissions_user_id_index` (`user_id`),
  ADD KEY `layanan_submissions_layanan_id_index` (`layanan_id`),
  ADD KEY `layanan_submissions_status_index` (`status`),
  ADD KEY `layanan_submissions_created_at_index` (`created_at`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `publikasi`
--
ALTER TABLE `publikasi`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indeks untuk tabel `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_profiles_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `village_officials`
--
ALTER TABLE `village_officials`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `berita`
--
ALTER TABLE `berita`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `dynamic_tables`
--
ALTER TABLE `dynamic_tables`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `dynamic_table_data`
--
ALTER TABLE `dynamic_table_data`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `infografis`
--
ALTER TABLE `infografis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `layanan_settings`
--
ALTER TABLE `layanan_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `layanan_submissions`
--
ALTER TABLE `layanan_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `publikasi`
--
ALTER TABLE `publikasi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `village_officials`
--
ALTER TABLE `village_officials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `dynamic_table_data`
--
ALTER TABLE `dynamic_table_data`
  ADD CONSTRAINT `dynamic_table_data_dynamic_table_id_foreign` FOREIGN KEY (`dynamic_table_id`) REFERENCES `dynamic_tables` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `layanan_submissions`
--
ALTER TABLE `layanan_submissions`
  ADD CONSTRAINT `layanan_submissions_layanan_id_foreign` FOREIGN KEY (`layanan_id`) REFERENCES `layanan_settings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layanan_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
