-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Apr 2026 pada 08.00
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
(1, 'Penyerahan Piagam Pencanangan Desa Cinta Statistik ( Desa Cantik )', 'penyerahan-piagam-pencanangan-desa-cinta-statistik-desa-cantik', 'Informasi', 'Penyerahan Piagam Pencanangan Desa Cinta Statistik ( Desa Cantik )', 'Penyerahan piagam pencanangan Kepada Desa Cinnong sebagai Desa Cinta Statistik ( Desa Cantik ). yang diserahkan langsung oleh bapak Kepala Badan Pusat Statistik ( BPS ) , Bapak H.Abdi Amin, SE.,M.M.', '1774930970_5f5LZdDGgP.jpg', '2025-10-07 16:00:00', '2026-03-30 19:52:42', '2026-03-30 20:22:50'),
(2, 'Juara 1 Lomba Yel-Yel Antar Desa Se Kecamatan Sibulue Dalam Rangka Perayaan Ulang Tahun RI Yang Ke-80', 'juara-1-lomba-yel-yel-antar-desa-se-kecamatan-sibulue-dalam-rangka-perayaan-ulang-tahun-ri-yang-ke-80', 'Kegiatan Warga', 'Juara 1 Lomba Yel-Yel Antar Desa Se Kecamatan Sibulue Dalam Rangka Perayaan Ulang Tahun RI Yang Ke-80', 'Juara 1 Lomba Yel-Yel Antar Desa Se Kecamatan Sibulue Dalam Rangka Perayaan Ulang Tahun RI Yang Ke-80', '1774931083_M52FyH8PKW.jpeg', '2025-09-11 16:00:00', '2026-03-30 19:52:42', '2026-03-30 20:24:43'),
(3, 'WORLD CLEANUP DAY 2025', 'world-cleanup-day-2025', 'Kegiatan Warga', 'Mari bersama wujudkan Bone Bersih, Indonesia Bersih !', 'Pada hari Sabtu 20 September 2025, Perangkat Desa bersama Warga Desa Cinnong dan para siswa/siswi SMAN 12 Bone ikut berpartisipasi dalam acara WORLD CLEANUP DAY 2025. Kegiatan yang dilakukan diantaranyaKerja bakti & Aksi bersih lingkungan , Pemilahan sampah (organik,anorganik,residu), Dan Edukasi & kampanye bijak kelola sampah.', '1774931030_PlERoX0GcK.jpg', '2025-09-19 16:00:00', '2026-03-30 19:52:42', '2026-03-30 20:23:50'),
(4, '🏆 Tim 79 Cell Desa Cinnong Juara Turnamen AR. TB Toddopuli Mini Soccer Cup I', 'tim-79-cell-desa-cinnong-juara-turnamen-ar-tb-toddopuli-mini-soccer-cup-i', 'Kegiatan Warga', 'Tim 79 Cell Desa Cinnong menjuarai AR. TB Toddopuli Cup I usai mengalahkan Underdog 2-1 pada final di Bone (16/8/2025), turnamen 64 tim ini turut memeriahkan HUT RI ke-80.', 'Turnamen Mini Soccer AR. TB Toddopuli Cup I yang digelar di Lapangan Golf Korem 141 Toddopuli, Kelurahan Bulu Tempe, Kecamatan Tanete Riattang Barat, Kabupaten Bone, berlangsung meriah. Partai grand final yang dilaksanakan pada hari Sabtu, 16 Agustus 2025, mempertemukan Tim 79 Cell Desa Cinnong Kecamatan Sibulue melawan tim Underdog. Pertandingan berjalan sengit dan berakhir dengan kemenangan 79 Cell dengan skor 2-1. Turnamen ini diikuti oleh 64 tim dari berbagai daerah dan berlangsung selama 23 hari, mulai 25 Juli hingga 16 Agustus 2025. Acara ini mendapat dukungan dari Komandan Korem 141/Toddopuli, Brigjen TNI Andre Clif Rumbayan. Pemerintah Kabupaten Bone juga menyampaikan apresiasi atas inisiatif masyarakat dalam menyelenggarakan turnamen ini. Bupati Bone, Dr. H. Andi Asman Sulaiman, bersama Wakil Bupati Bone, Dr. H. Andi Akmal Pasluddin, turut memberikan dukungan penuh terhadap kegiatan positif ini. Kemenangan Tim 79 Cell menjadi kebanggaan tersendiri bagi masyarakat Desa Cinnong, sekaligus menambah semarak peringatan HUT RI ke-80 tahun 2025.', '1774931135_OUADmwXd3K.jpg', '2025-08-15 16:00:00', '2026-03-30 20:25:22', '2026-03-30 20:25:35');

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
  `table_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`columns`)),
  `has_column_total` tinyint(1) NOT NULL DEFAULT 0,
  `has_row_total` tinyint(1) NOT NULL DEFAULT 0,
  `source` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `charts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`charts`)),
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
(2, 'Infografis Penduduk Desa Cinnong Tahun 2025', 'Infografis data kependudukan Desa Cinnong tahun 2025. Jumlah penduduk sebanyak 1.868 jiwa, terdiri dari 898 laki-laki dan 970 perempuan. Tersebar di 4 dusun: Kaddumpia, Jampalenna, Makkawaru, dan Tammarenne.', '1774931231_1LxHBulvwK.png', '2025-08-28', '2026-03-30 19:52:41', '2026-03-30 20:27:11');

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
-- Struktur dari tabel `layanan_submissions`
--

CREATE TABLE `layanan_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_layanan` varchar(255) NOT NULL,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`form_data`)),
  `uploaded_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`uploaded_files`)),
  `status` enum('pending','diproses','selesai','ditolak') NOT NULL DEFAULT 'pending',
  `catatan_admin` text DEFAULT NULL,
  `result_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`result_files`)),
  `result_link` varchar(1000) DEFAULT NULL,
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
(11, '2026_01_08_093826_create_layanan_submissions_table', 1),
(12, '2026_01_10_055401_add_charts_to_dynamic_tables_table', 1),
(13, '2026_01_12_075318_add_layanan_settings_to_settings_table', 1),
(14, '2026_02_12_011905_add_role_to_users_table', 1),
(15, '2026_03_07_050817_create_user_profiles_table', 1),
(16, '2026_03_18_014202_create_notifications_table', 1),
(17, '2026_03_27_233333_add_source_notes_to_dynamic_tables_table', 1),
(18, '2026_03_28_000823_add_result_and_rating_to_layanan_submissions_table', 1);

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
(4, 'Desa Cinnong Dalam Angka 2025', 'Publikasi Desa Cinnong Dalam Angka 2025 menyajikan data geografis, pemerintahan, kependudukan, pendidikan, perumahan, dan sosial sebagai rujukan perencanaan pembangunan desa.', '2025-09-15', '1774943932_ivosB7MwSr.pdf', 'Desa Cinnong Dalam Angka 2025 (2).pdf', 'pdf', 561864, '2026-03-30 19:52:42', '2026-03-30 23:58:52'),
(6, 'Potensi Desa 2024', 'Publikasi Potensi Desa 2024 menyajikan informasi menyeluruh mengenai potensi sumber daya alam, manusia, ekonomi, serta infrastruktur desa. Data ini diharapkan menjadi acuan dalam perencanaan pembangunan, pemberdayaan masyarakat, dan pemanfaatan potensi lokal secara berkelanjutan', '2025-09-15', '1774931710_WHU4YqJwqh.pdf', 'Potensi Desa.pdf', 'pdf', 393298, '2026-03-30 20:35:10', '2026-03-31 00:09:13');

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

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3TwhyPexhwoFSTLCWnrMwE5FHKLo1znFSKnfI31M', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiSEhGamtXSWk4cUR6aUo0bFVrRG45YnVjZlVmQlZZOGFHbjdnclhYSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hZG1pbi9wcm9maWwtZGVzYS9lZGl0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MTp7aTowO3M6NToiZXJyb3IiO31zOjM6Im5ldyI7YTowOnt9fXM6NToiZXJyb3IiO3M6MzA6IlNpbGFrYW4gbWFzdWsgdGVybGViaWggZGFodWx1LiI7fQ==', 1775109205),
('J7IhwNJFG9wVVxA0j0R6lXkD3kFQgFzcTJiRWmA2', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVUpMdUNYcDl3cnc0RWR1aGQ1ck93TnNNOUk1ZG5hNWJORGgxT2FZRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9ub3RpZmljYXRpb25zIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mjt9', 1775109469);

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

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'layanan_ktp', '{\"name\":\"Surat Pengantar KTP\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(2, 'layanan_kk', '{\"name\":\"Surat Pengantar KK\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(3, 'layanan_domisili', '{\"name\":\"Surat Keterangan Domisili\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(4, 'layanan_usaha', '{\"name\":\"Surat Keterangan Usaha\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(5, 'layanan_sktm', '{\"name\":\"Surat Keterangan Tidak Mampu (SKTM)\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(6, 'layanan_kelahiran', '{\"name\":\"Surat Keterangan Kelahiran\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(7, 'layanan_kematian', '{\"name\":\"Surat Keterangan Kematian\",\"is_active\":true,\"category\":\"kependudukan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(8, 'layanan_nikah', '{\"name\":\"Surat Pengantar Nikah\",\"is_active\":true,\"category\":\"umum\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(9, 'layanan_pindah', '{\"name\":\"Surat Keterangan Pindah\",\"is_active\":true,\"category\":\"umum\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(10, 'layanan_izin_kegiatan', '{\"name\":\"Surat Izin Kegiatan\",\"is_active\":true,\"category\":\"umum\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(11, 'layanan_rekomendasi', '{\"name\":\"Surat Rekomendasi Desa\",\"is_active\":true,\"category\":\"umum\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(12, 'layanan_pengaduan_aspirasi', '{\"name\":\"Pengaduan & Aspirasi Masyarakat\",\"is_active\":true,\"category\":\"pengaduan\"}', '2026-03-30 19:52:38', '2026-03-30 19:52:38'),
(13, 'stat1_label', 'Total Penduduk', '2026-03-30 20:20:17', '2026-03-30 20:20:17'),
(14, 'stat2_label', 'Jumlah Dusun', '2026-03-30 20:20:17', '2026-03-30 20:20:17'),
(15, 'stat3_label', 'Sekolah', '2026-03-30 20:20:17', '2026-03-30 20:20:17'),
(16, 'data_terakhir', '2025', '2026-03-30 20:20:17', '2026-03-30 20:43:36'),
(17, 'nama_desa', 'Desa Cinnong', '2026-03-30 20:20:17', '2026-03-30 20:20:17'),
(18, 'jumlah_rt', '8', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(19, 'luas', '16.29', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(20, 'email', 'Cinnongsib@gmail.com', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(21, 'sejarah', 'Sejarah kepemimpinan Desa Cinnong dapat dimulai dari tahun 70-an sampai tahun 1994 dibawah Pemerintahan Asapah. Pada tahun yang sama pucuk kepemimpinan diambil alih oleh H. Muh. Anshar sebagai Kepala Desa Cinnong sampai tahun 2010.\r\n\r\nPada tahun 2010 diadakan Pemilihan Kepala Desa tongkat estafet kepemimpinan berpindah kepada Irfan, S.Kom selaku Kepala Desa Cinnong sampai pada tahun 2016 dan kembali memimpin desa Cinnong setelah terpilih kedua kalinya pada Pemilihan serentak Kepala Desa tahap II untuk memimpin Desa Cinnong sampai pada tahun 2022, yang kemudian kembali memimpin setelah terpilih yang ketiga kalinya pada Pemilihan kepala desa serentak gel. II untuk memimpin desa Cinnong Periode 2023-2030.', '2026-03-30 20:43:36', '2026-03-30 20:44:41'),
(22, 'visi', 'MENINGKATKAN MUTU KESEJAHTERAAN MASYARAKAT DESA CINNONG UNTUK MENCAPAI TARAF KEHIDUPAN YANG LEBIH BAIK DAN LAYAK SEHINGGA MENJADI DESA YANG MAJU DAN MANDIRI', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(23, 'misi', '1. Meningkatkan Profesionalisme Pelayanan Publik\r\n2. Meningkatkan Pengelolaan Jalan desa, Jalan Dusun, Sarana Hunian Pemukiman yang Layak Huni, Peningkatan Sarana Air Bersih, Saluran Air Pertanian, Sarana Keagamaan, Pendidikan dan Kesehatan serta Infrastruktur lainnya\r\n3. Meningkatkan Sarana Kesehatan, Kebersihan desa serta mengusahakan Jaminan Kesehatan Masyarakat melalui program pemerintah\r\n4. Meningkatkan kesejahteraan masyarakat desa dengan mewujudkan Badan Usaha Milik Desa (BUMDes) dan program lain untuk membuka lapangan kerja bagi masyarakat desa, serta meningkatkan produksi rumah tangga kecil\r\n5. Memberdayakan lembaga yang ada dan mengoptimalkan kegiatan pemuda dan olah raga guna menekan tingkat kenakalan remaja', '2026-03-30 20:43:36', '2026-04-01 21:57:42'),
(24, 'stat1_value', '1.868', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(25, 'stat2_value', '4', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(26, 'stat3_value', '6', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(27, 'kecamatan', 'Sibulue', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(28, 'kabupaten', 'Bone', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(29, 'provinsi', 'Sulawesi Selatan', '2026-03-30 20:43:36', '2026-03-30 20:43:36'),
(30, 'gambar_peta', '/storage/profil/Aha5gj2zXPH5hyamG2nZ5T8U2Z8trEjEMfLIBRMk.png', '2026-03-30 21:01:47', '2026-03-31 00:11:24'),
(31, 'gambar_tim', '/storage/profil/kmX6NO2NwJSLZT1GsJoFPO1YYF4sWxLLs50g0NYC.png', '2026-03-30 21:03:36', '2026-03-30 21:03:36');

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
(1, 'Admin BPS', 'adminbps@email.com', 'admin_bps', '2026-03-30 19:52:57', '$2y$12$/1EIT5OZ9F1giL2J538xN.ebwXGTMdM8nYv7FFKABxrPCWIALSyse', 'Zcn8o97Yo0', '2026-03-30 19:52:59', '2026-03-30 19:52:59'),
(2, 'Desa Cinnong', 'Cinnongsib@gmail.com', 'admin_desa', NULL, '$2y$12$g87ij/MC4kK2Y70rafng1esv9i0pWNJjwk1l5ezabdLxDQmkCBRly', NULL, '2026-03-30 20:09:54', '2026-03-30 20:09:54');

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
  `usia` tinyint(3) UNSIGNED DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `rt` varchar(3) DEFAULT NULL,
  `rw` varchar(3) DEFAULT NULL,
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
  `urutan` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `village_officials`
--

INSERT INTO `village_officials` (`id`, `nama`, `jabatan`, `foto`, `urutan`, `created_at`, `updated_at`) VALUES
(1, 'IRFAN, S.Kom', 'Kepala Desa', '/storage/officials/a51YCNE3GoN3xWWvdRVl5YnO0Iem0c0AZa40cvxn.png', 1, '2026-03-30 21:03:36', '2026-04-01 21:57:42');

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dynamic_tables_table_name_unique` (`table_name`);

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
-- Indeks untuk tabel `layanan_submissions`
--
ALTER TABLE `layanan_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layanan_submissions_user_id_index` (`user_id`),
  ADD KEY `layanan_submissions_jenis_layanan_index` (`jenis_layanan`),
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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `village_officials`
--
ALTER TABLE `village_officials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
