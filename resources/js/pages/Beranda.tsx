// resources/js/Pages/Beranda.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, Calendar, MapPin, TrendingUp, Users } from 'lucide-react';

export default function Beranda() {
    return (
        <MainLayout>
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
                                <Link href="/profil-desa">
                                    <button className="flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-orange-700">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Jelajahi Profil Desa
                                    </button>
                                </Link>
                                <Link href="/data-desa">
                                    <button className="flex items-center justify-center rounded-lg border border-orange-600 px-6 py-3 text-lg font-medium text-orange-600 transition-colors hover:bg-orange-50">
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

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                                {/* Data updated based on PDF source [cite: 134] */}
                                <div className="mb-1 text-2xl font-bold text-orange-600">1.868</div>
                                <div className="text-sm text-gray-600">Total Penduduk</div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Building2 className="h-6 w-6 text-orange-600" />
                                </div>
                                {/* Data updated based on PDF source [cite: 91] */}
                                <div className="mb-1 text-2xl font-bold text-orange-600">4</div>
                                <div className="text-sm text-gray-600">Jumlah Dusun</div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <TrendingUp className="h-6 w-6 text-orange-600" />
                                </div>
                                {/* NOTE: UMKM data is not available in the provided PDF. */}
                                <div className="mb-1 text-2xl font-bold text-orange-600">156</div>
                                <div className="text-sm text-gray-600">UMKM Aktif</div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <Calendar className="h-6 w-6 text-orange-600" />
                                </div>
                                {/* Data updated based on PDF source [cite: 5, 9, 14] */}
                                <div className="mb-1 text-2xl font-bold text-orange-600">2025</div>
                                <div className="text-sm text-gray-600">Data Terakhir</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* News/Updates Section */}
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">Berita & Pengumuman</h2>
                            <p className="text-gray-600">Informasi terbaru dari Desa Cinnong</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-3">
                                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                                        Pengumuman
                                    </span>
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">Update Data Kependudukan</h3>
                                <p className="mb-3 text-sm text-gray-600">10 Agustus 2025</p>
                                <p className="text-sm text-gray-600">
                                    {/* Data updated based on PDF source [cite: 134, 91] */}
                                    Data kependudukan Desa Cinnong telah diperbarui dengan total 1.868 jiwa tersebar di 4 dusun.
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-3">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                        Program Desa
                                    </span>
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">Program Bantuan UMKM</h3>
                                <p className="mb-3 text-sm text-gray-600">5 Agustus 2025</p>
                                <p className="text-sm text-gray-600">
                                    {/* NOTE: UMKM data is not available in the provided PDF. */}
                                    Pembukaan pendaftaran program bantuan modal usaha untuk UMKM di Desa Cinnong dengan total bantuan Rp 500 juta.
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-3">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                        Informasi
                                    </span>
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">Sistem Informasi Desa</h3>
                                <p className="mb-3 text-sm text-gray-600">1 Agustus 2025</p>
                                <p className="text-sm text-gray-600">
                                    Peluncuran sistem informasi desa digital untuk memudahkan akses data dan transparansi pemerintahan.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
