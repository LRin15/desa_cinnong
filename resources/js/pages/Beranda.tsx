// resources/js/Pages/Beranda.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, Calendar, MapPin, Newspaper, TrendingUp, Users } from 'lucide-react';

// Tipe data untuk satu item berita
interface BeritaItem {
    slug: string;
    judul: string;
    kategori: string;
    tanggal_terbit: string;
    kutipan: string;
    gambar: string | null;
}

// Tipe data untuk settings
interface Settings {
    nama_desa?: string;
    stat1_label?: string;
    stat1_value?: string;
    stat2_label?: string;
    stat2_value?: string;
    stat3_label?: string;
    stat3_value?: string;
    data_terakhir?: string;
    [key: string]: string | undefined;
}

// Tipe data untuk props halaman Beranda
interface BerandaProps {
    beritaTerbaru: BeritaItem[];
    settings: Settings;
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

// Fungsi untuk menentukan icon berdasarkan label statistik
const getStatIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('penduduk') || lowerLabel.includes('jiwa') || lowerLabel.includes('warga')) {
        return Users;
    } else if (lowerLabel.includes('dusun') || lowerLabel.includes('rw') || lowerLabel.includes('rt') || lowerLabel.includes('wilayah')) {
        return Building2;
    } else if (
        lowerLabel.includes('sekolah') ||
        lowerLabel.includes('pendidikan') ||
        lowerLabel.includes('kesehatan') ||
        lowerLabel.includes('rumah sakit') ||
        lowerLabel.includes('puskesmas') ||
        lowerLabel.includes('posyandu')
    ) {
        return TrendingUp;
    }

    return BarChart3; // default icon
};

export default function Beranda({ auth, beritaTerbaru, settings }: BerandaProps) {
    // Ambil nama desa dari settings atau gunakan default
    const namaDesa = settings.nama_desa || 'Desa Cinnong';

    // Siapkan data statistik
    const stats = [
        {
            label: settings.stat1_label || 'Total Penduduk',
            value: settings.stat1_value || '0',
            icon: getStatIcon(settings.stat1_label || 'Total Penduduk'),
        },
        {
            label: settings.stat2_label || 'Jumlah Dusun',
            value: settings.stat2_value || '0',
            icon: getStatIcon(settings.stat2_label || 'Jumlah Dusun'),
        },
        {
            label: settings.stat3_label || 'Sekolah',
            value: settings.stat3_value || '0',
            icon: getStatIcon(settings.stat3_label || 'Sekolah'),
        },
        {
            label: 'Data Terakhir',
            value: settings.data_terakhir || new Date().getFullYear().toString(),
            icon: Calendar,
        },
    ];

    return (
        <MainLayout auth={auth}>
            <Head title="Beranda" />
            <div className="min-h-screen">
                {/* Hero Section - Mobile optimized */}
                <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-12 sm:py-16 lg:py-20">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                                Selamat Datang di
                                <span className="block text-orange-600">{namaDesa}</span>
                            </h1>
                            <p className="mx-auto mb-6 max-w-2xl text-base text-gray-700 sm:mb-8 sm:text-lg lg:text-xl">
                                Sistem informasi desa yang menyediakan data terkini tentang profil desa, statistik penduduk, dan informasi ekonomi
                                untuk transparansi dan kemudahan akses.
                            </p>

                            {/* CTA Buttons - Mobile stacked */}
                            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                                <Link href={route('profil.show')}>
                                    <button className="flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-700 sm:w-auto sm:px-6 sm:text-base lg:text-lg">
                                        <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="sm:hidden">Profil Desa</span>
                                        <span className="hidden sm:inline">Jelajahi Profil Desa</span>
                                    </button>
                                </Link>
                                <Link href={route('data.desa')}>
                                    <button className="flex w-full items-center justify-center rounded-lg border border-orange-600 px-4 py-3 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50 sm:w-auto sm:px-6 sm:text-base lg:text-lg">
                                        <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="sm:hidden">Data Statistik</span>
                                        <span className="hidden sm:inline">Lihat Data Statistik</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section - Mobile grid optimization */}
                <section className="bg-white py-12 sm:py-16">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                        <div className="mb-8 text-center sm:mb-12">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl">Data Terkini {namaDesa}</h2>
                            <p className="text-sm text-gray-600 sm:text-base">Informasi statistik dan demografis terbaru</p>
                        </div>

                        {/* Mobile 2x2 grid, tablet 2x2, desktop 1x4 */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm sm:p-6">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 sm:mb-3 sm:h-12 sm:w-12">
                                            <IconComponent className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />
                                        </div>
                                        <div className="mb-1 text-xl font-bold text-orange-600 sm:text-2xl">{stat.value}</div>
                                        <div className="text-xs text-gray-600 sm:text-sm">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* News/Updates Section - Mobile card optimization */}
                <section className="bg-gray-50 py-12 sm:py-16">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                        <div className="mb-8 text-center sm:mb-12">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl">Berita & Pengumuman Terbaru</h2>
                            <p className="text-sm text-gray-600 sm:text-base">Informasi terkini dari {namaDesa}</p>
                        </div>

                        {/* Mobile single column, tablet 2 col, desktop 3 col */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                            {beritaTerbaru.map((berita) => (
                                <Link
                                    key={berita.slug}
                                    href={route('berita.detail', berita.slug)}
                                    className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                                >
                                    {/* Image container with aspect ratio */}
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        {berita.gambar ? (
                                            <img
                                                src={berita.gambar}
                                                alt={berita.judul}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                                <Newspaper className="h-8 w-8 text-gray-400 sm:h-12 sm:w-12" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content with proper mobile spacing */}
                                    <div className="flex flex-1 flex-col p-4 sm:p-6">
                                        <div className="mb-2 sm:mb-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium sm:px-2.5 sm:text-xs ${getCategoryClass(berita.kategori)}`}
                                            >
                                                {berita.kategori}
                                            </span>
                                        </div>
                                        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 sm:text-lg">{berita.judul}</h3>
                                        <p className="mb-2 text-xs text-gray-600 sm:mb-3 sm:text-sm">{berita.tanggal_terbit}</p>
                                        <p className="line-clamp-3 flex-1 text-sm text-gray-600">{berita.kutipan}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile optimized CTA button */}
                        <div className="mt-8 text-center sm:mt-12">
                            <Link
                                href={route('berita')}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-700 sm:w-auto sm:px-6 sm:text-base lg:text-lg"
                            >
                                <Newspaper className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="sm:hidden">Semua Berita</span>
                                <span className="hidden sm:inline">Lihat Semua Berita</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
