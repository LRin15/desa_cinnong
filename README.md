# 🚀 Laravel + React (Inertia) + Tailwind Starter

Project ini menggunakan **Laravel** sebagai backend, **React (Inertia.js)** untuk frontend, dan **TailwindCSS** untuk styling.

## 📦 Persyaratan

Pastikan sudah terinstall di sistem kamu:

- Git Bash https://git-scm.com/downloads
- Virtual Studio Code https://code.visualstudio.com/download
- PHP >= 8.1 https://www.apachefriends.org/index.html
- Composer https://getcomposer.org/
- Node.js & npm (atau Yarn/Pnpm) https://nodejs.org/en/
- MySQL / MariaDB (jika menggunakan database) https://www.apachefriends.org/index.html

Setelah install, pastikan php dikenali di terminal:

Tambahkan path php ke Environment Variables → Path.

Misalnya C:\xampp\php atau C:\laragon\bin\php\php-8.2.12

Kemudian buka xampp/php/php.ini lalu ubah ;extension=zip menjadi extension=zip

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/LRin15/desa_cinnong.git
cd nama-proyek
```

### 2. Install Dependency Laravel

```
composer install

```

### 3. Konfigurasi Environment

```
cp .env.example .env

```

ganti bagian .env dibawah

APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

# APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite

# DB_HOST=127.0.0.1

# DB_PORT=3306

# DB_DATABASE=laravel

# DB_USERNAME=root

# DB_PASSWORD=

Menjadi seperti yang dibawah

APP_NAME=Cinnong
APP_ENV=local
APP_KEY=base64:LLIYferPnLTKRDrfS+9x8yTTu3PFNfwKoiJ5kr9H1uU=
APP_DEBUG=true
APP_URL=http://localhost:8000

GOOGLE_SERVICE_ENABLED=true
GOOGLE_SERVICE_ACCOUNT_JSON_LOCATION=C:/Desa_Cinnong/desa_cinnong/storage/app/google-credentials.json
SPREADSHEET_ID=1Ff5IO1ABom9kLrmjB6CiuzLX9Tw11jcpZYVtdGehCXA
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

# APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=desa_db
DB_USERNAME=root
DB_PASSWORD=

### 3. Konfigurasi Environment

```
php artisan key:generate

```

### 4. Migrasi Database

```
php artisan migrate

```

### 5. Setup Frontend (React + Tailwind)

```
npm install

npm run dev

```

### 6. Menjalankan Aplikasi

```
php artisan serve

```

🛠️ Catatan

Gunakan npm run dev saat development agar perubahan React/Tailwind langsung terlihat.

Jika deploy ke hosting (shared hosting/cPanel), jalankan npm run build lalu upload hasil build ke server.

👨‍💻 Tech Stack

- Laravel
- Inertia.js
- React
- Tailwind CSS
