// resources/js/Pages/Beranda.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, Calendar, MapPin, Newspaper, TrendingUp, Users } from 'lucide-react';

// Tipe data untuk satu item berita, sekarang dengan 'gambar'
interface BeritaItem {
    slug: string;
    judul: string;
    kategori: string;
    tanggal_terbit: string;
    kutipan: string;
    gambar: string | null; // URL gambar bisa jadi null
}

// Tipe data untuk props halaman Beranda
interface BerandaProps {
    beritaTerbaru: BeritaItem[];
    auth?: any;
}

// Fungsi untuk menentukan warna badge berdasarkan kategori
const getCategoryClass = (category: string) => {
    switch (category) {
        case 'Pengumuman':
            return 'bg-orange-100 text-orange-800';
        case 'Program Desa':
            return 'bg-green-100 text-green-800';
        case 'Informasi':
            return 'bg-blue-100 text-blue-800';
        case 'Kegiatan Warga':
            return 'bg-purple-100 text-purple-800';
        case 'Kesehatan':
            return 'bg-pink-100 text-pink-800';
        case 'Pendidikan':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function Beranda({ auth, beritaTerbaru }: BerandaProps) {
    return (
        <MainLayout auth={auth}>
            <Head title="Beranda" />
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
                                Selamat Datang di
                                <span className="block text-orange-600">Desa Cinnong</span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-700">
                                Sistem informasi desa yang menyediakan data terkini tentang profil desa, statistik penduduk, dan informasi ekonomi
                                untuk transparansi dan kemudahan akses.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href={route('profil.desa')}>
                                    <button className="flex w-full items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-orange-700 sm:w-auto">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Jelajahi Profil Desa
                                    </button>
                                </Link>
                                <Link href={route('data.desa')}>
                                    <button className="flex w-full items-center justify-center rounded-lg border border-orange-600 px-6 py-3 text-lg font-medium text-orange-600 transition-colors hover:bg-orange-50 sm:w-auto">
                                        <BarChart3 className="mr-2 h-5 w-5" />
                                        Lihat Data Statistik
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">Data Terkini Desa Cinnong</h2>
                            <p className="text-gray-600">Informasi statistik dan demografis terbaru</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="mb-1 text-2xl font-bold text-orange-600">1.868</div>
                                <div className="text-sm text-gray-600">Total Penduduk</div>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Building2 className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="mb-1 text-2xl font-bold text-orange-600">4</div>
                                <div className="text-sm text-gray-600">Jumlah Dusun</div>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <TrendingUp className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="mb-1 text-2xl font-bold text-orange-600">156</div>
                                <div className="text-sm text-gray-600">UMKM Aktif</div>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Calendar className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="mb-1 text-2xl font-bold text-orange-600">2025</div>
                                <div className="text-sm text-gray-600">Data Terakhir</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* News/Updates Section - KONTEN DINAMIS DENGAN GAMBAR */}
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">Berita & Pengumuman Terbaru</h2>
                            <p className="text-gray-600">Informasi terkini dari Desa Cinnong</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {beritaTerbaru.map((berita) => (
                                <Link
                                    key={berita.slug}
                                    href={route('berita.detail', berita.slug)}
                                    className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
                                >
                                    {/* 👇 BAGIAN GAMBAR BARU 👇 */}
                                    <div className="aspect-w-16 aspect-h-9">
                                        {berita.gambar ? (
                                            <img src={berita.gambar} alt={berita.judul} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                                <Newspaper className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bagian Teks */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryClass(berita.kategori)}`}
                                            >
                                                {berita.kategori}
                                            </span>
                                        </div>
                                        <h3 className="mb-1 text-lg font-semibold text-gray-900">{berita.judul}</h3>
                                        <p className="mb-3 text-sm text-gray-600">{berita.tanggal_terbit}</p>
                                        <p className="line-clamp-3 flex-1 text-sm text-gray-600">{berita.kutipan}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link
                                href={route('berita')}
                                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-orange-700"
                            >
                                <Newspaper className="mr-2 h-5 w-5" />
                                Lihat Semua Berita
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
