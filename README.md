# 🚀 Sistem Informasi Desa Cinta Statistik (Desa Cantik) Berbasis Web

## 📌 Identitas Proyek

| Informasi          | Keterangan                                                    |
| ------------------ | ------------------------------------------------------------- |
| Nama Aplikasi      | Sistem Informasi Desa Cinta Statistik (Desa Cantik)           |
| Instansi Terkait   | Badan Pusat Statistik Kabupaten Bone                          |
| Jenis Aplikasi     | Sistem Informasi Berbasis Web                                 |
| Backend            | Laravel                                                       |
| Frontend           | React.js dengan Inertia.js                                    |
| Bahasa Pemrograman | PHP, TypeScript                                               |
| Styling            | Tailwind CSS                                                  |
| Database           | MySQL                                                         |
| Repository         | [LRin15/desa_cinnong](https://github.com/LRin15/desa_cinnong) |

## 📝 Deskripsi Proyek

Sistem Informasi Desa Cinta Statistik (Desa Cantik) merupakan aplikasi berbasis web yang dikembangkan untuk mendukung penyediaan informasi profil desa, publikasi, berita, infografis, dan data statistik desa. Sistem ini juga mendukung pengelolaan informasi oleh administrator serta penyediaan layanan bagi masyarakat.

Aplikasi dibangun menggunakan Laravel sebagai backend, React.js sebagai frontend, Inertia.js sebagai penghubung antara Laravel dan React, serta Tailwind CSS untuk membangun antarmuka pengguna.

## 📁 Struktur File dan Folder

Struktur berikut merupakan gambaran umum direktori proyek Laravel dengan React dan Inertia.js. Beberapa folder atau file dapat berbeda sesuai implementasi di repository.

```text
desa_cinnong/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # Logika penanganan request
│   │   ├── Middleware/        # Middleware aplikasi
│   │   └── Requests/          # Validasi request
│   ├── Models/                # Model dan interaksi database
│   └── Providers/             # Service provider Laravel
│
├── bootstrap/                 # Proses bootstrap aplikasi
├── config/                    # Konfigurasi aplikasi Laravel
├── database/
│   ├── migrations/            # Struktur tabel database
│   ├── seeders/               # Data awal database
│   └── factories/             # Factory untuk data pengujian
│
├── public/                    # Direktori publik dan aset hasil build
├── resources/
│   ├── css/                   # File CSS dan Tailwind
│   ├── js/
│   │   ├── Components/        # Komponen React yang dapat digunakan ulang
│   │   ├── Layouts/            # Layout halaman
│   │   ├── Pages/              # Halaman aplikasi React
│   │   ├── types/              # Definisi tipe TypeScript
│   │   └── app.tsx             # Entry point frontend (jika digunakan)
│   └── views/                 # Template Blade, termasuk root Inertia
│
├── routes/
│   ├── web.php                # Routing web
│   ├── api.php                # Routing API (jika digunakan)
│   └── console.php            # Routing perintah Artisan
│
├── storage/                   # Log, cache, dan file yang disimpan
├── tests/                     # Pengujian aplikasi
├── .env.example               # Contoh konfigurasi environment
├── artisan                    # CLI Laravel
├── composer.json              # Dependency PHP
├── package.json               # Dependency dan script frontend
├── tsconfig.json              # Konfigurasi TypeScript (jika digunakan)
├── vite.config.ts             # Konfigurasi Vite (jika digunakan)
└── README.md                  # Dokumentasi proyek
```

## 📦 Persyaratan

Pastikan perangkat lunak berikut telah terpasang:

- [Git](https://git-scm.com/downloads) — untuk mengelola repository.
- [Visual Studio Code](https://code.visualstudio.com/download) — editor kode.
- [PHP](https://www.php.net/downloads) — gunakan versi yang kompatibel dengan `composer.json` proyek.
- [Composer](https://getcomposer.org/) — pengelola dependency PHP.
- [Node.js dan npm](https://nodejs.org/en/) — pengelola dependency frontend.
- [XAMPP](https://www.apachefriends.org/) atau [Laragon](https://laragon.org/) — untuk lingkungan pengembangan lokal.
- MySQL atau MariaDB — sebagai database.

### Konfigurasi PHP

Pastikan PHP dapat dijalankan melalui terminal. Tambahkan direktori PHP ke Environment Variables → `Path`, misalnya:

```text
C:\xampp\php
```

Aktifkan ekstensi ZIP pada file `php.ini` dengan menghapus tanda titik koma pada baris berikut:

```ini
extension=zip
```

Pastikan juga ekstensi PHP lain yang dibutuhkan oleh Laravel dan dependency Composer telah aktif.

## ⚙️ Instalasi dan Setup

### 1. Clone Repository

Jalankan perintah berikut pada Git Bash atau terminal:

```bash
git clone https://github.com/LRin15/desa_cinnong.git
cd desa_cinnong
```

### 2. Install Dependency Laravel

```bash
composer install
```

### 3. Konfigurasi Environment

Salin file konfigurasi contoh menjadi `.env`.

Pada Git Bash:

```bash
cp .env.example .env
```

Jika menggunakan Command Prompt Windows:

```cmd
copy .env.example .env
```

Sesuaikan konfigurasi `.env` untuk lingkungan pengembangan lokal. Contoh konfigurasi aplikasi dan database:

```dotenv
APP_NAME=Cinnong
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=desa_db
DB_USERNAME=root
DB_PASSWORD=
```

Konfigurasi lainnya, seperti locale, logging, session, cache, queue, dan email, dapat disesuaikan dengan kebutuhan aplikasi.

**Catatan penting:**

- Buat database bernama `desa_db` melalui phpMyAdmin atau MySQL sebelum menjalankan migrasi.
- Biarkan `APP_KEY` kosong terlebih dahulu. Kunci aplikasi akan dibuat pada langkah berikutnya.
- Jangan menggunakan `APP_KEY` milik lingkungan lain. Setiap lingkungan harus menggunakan konfigurasi kunci yang sesuai.
- Jangan mengunggah file `.env` yang berisi kredensial atau informasi rahasia ke repository publik.

### 4. Generate Application Key

```bash
php artisan key:generate
```

Perintah tersebut akan menghasilkan `APP_KEY` dan menyimpannya ke dalam file `.env`.

### 5. Migrasi Database

```bash
php artisan migrate
```

Jika aplikasi memerlukan data awal, jalankan seeder yang tersedia sesuai dokumentasi proyek:

```bash
php artisan db:seed
```

**Perhatian:** Jalankan seeder hanya jika sudah memahami data yang akan dimasukkan. Jangan menjalankan `migrate:fresh` pada database yang berisi data penting karena perintah tersebut menghapus tabel sebelum membuatnya kembali.

### 6. Install Dependency Frontend

```bash
npm install
```

### 7. Jalankan Aplikasi

Buka dua terminal pada direktori proyek.

**Terminal pertama — Laravel:**

```bash
php artisan serve
```

Aplikasi backend secara default dapat diakses melalui:

```text
http://localhost:8000
```

**Terminal kedua — Vite dan frontend:**

```bash
npm run dev
```

Pastikan server Vite tetap berjalan selama pengembangan agar perubahan pada kode frontend dapat diproses.

## 🏗️ Build untuk Deployment

Sebelum aplikasi dipasang pada hosting atau server produksi, jalankan:

```bash
npm run build
```

Perintah tersebut membangun aset frontend untuk produksi. Hasil build umumnya disimpan di direktori `public/build`, sesuai konfigurasi Vite.

## 🛠️ Tech Stack

| Teknologi    | Fungsi                                             |
| ------------ | -------------------------------------------------- |
| Laravel      | Backend, routing, autentikasi, dan logika aplikasi |
| React.js     | Pengembangan antarmuka pengguna                    |
| Inertia.js   | Penghubung backend Laravel dan frontend React      |
| TypeScript   | Penulisan kode frontend dengan sistem tipe         |
| Tailwind CSS | Styling dan desain antarmuka                       |
| MySQL        | Penyimpanan data aplikasi                          |
| Vite         | Build tool dan server pengembangan frontend        |
| Composer     | Pengelolaan dependency PHP                         |
| npm          | Pengelolaan dependency JavaScript                  |

## 👨‍💻 Pengembangan

Untuk menjalankan aplikasi selama proses pengembangan, gunakan:

```bash
php artisan serve
npm run dev
```

Kedua perintah dijalankan pada terminal terpisah.

Untuk menghentikan server, tekan `Ctrl + C` pada terminal terkait.
