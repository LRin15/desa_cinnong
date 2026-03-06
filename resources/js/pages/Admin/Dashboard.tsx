// resources/js/Pages/Admin/Dashboard.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Image as ImageIcon,
    MessageSquare,
    Newspaper,
    Plus,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    stats: {
        total_berita: number;
        total_infografis: number;
        total_publikasi: number;
        total_pengguna: number;
        total_pengaduan: number;
        pengaduan_belum_diproses: number;
        pengaduan_sedang_diproses: number;
        pengaduan_selesai: number;
        total_layanan: number;
        layanan_pending: number;
        layanan_diproses: number;
        layanan_selesai: number;
        layanan_ditolak: number;
    };
    settings?: {
        nama_desa?: string;
        [key: string]: string | undefined;
    };
    [key: string]: unknown;
}

const StatCardWithHover = ({
    title,
    value,
    icon,
    colorClass,
    bgGradient,
    link,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
    bgGradient: string;
    link: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`group relative overflow-hidden rounded-lg ${bgGradient} p-6 shadow-md transition-all duration-300 hover:shadow-xl`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="mb-3 flex items-center justify-between">
                <span className={`text-sm font-semibold tracking-wide uppercase ${colorClass}`}>{title}</span>
                <div className={`rounded-full p-2 ${colorClass.replace('text-', 'bg-').replace('-600', '-100')}`}>{icon}</div>
            </div>
            <div className={`mb-2 text-4xl font-bold ${colorClass}`}>{value}</div>

            {/* Tambah Button at Bottom */}
            <div
                className={`absolute right-0 bottom-0 left-0 transition-all duration-300 ${
                    isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
            >
                <Link
                    href={link}
                    className={`flex items-center justify-start gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 hover:gap-3 ${colorClass} ${bgGradient} backdrop-blur-sm`}
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
};

export default function Dashboard({ auth, stats, settings }: DashboardProps) {
    // Ambil nama desa dari settings atau gunakan default
    const namaDesa = settings?.nama_desa || 'Desa Cinnong';

    return (
        <AuthenticatedLayout auth={auth} title="Dashboard">
            <div className="space-y-6 px-4 sm:space-y-8 sm:px-0">
                {/* Welcome Header Section */}
                <div className="rounded-lg border-l-4 border-orange-500 bg-gradient-to-r from-white to-orange-50 p-4 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-xl leading-tight font-bold text-gray-800 sm:text-2xl">Selamat Datang, Admin {namaDesa}!</h1>
                            <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">Pusat kendali Sistem Informasi {namaDesa}</p>
                        </div>
                        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-orange-100 sm:flex">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs sm:text-sm">
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Sabtu, 31 Januari 2026</span>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards Grid - Top Row with Light Theme */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCardWithHover
                        title="Berita"
                        value={stats.total_berita}
                        icon={<Newspaper className="h-5 w-5 text-blue-600" />}
                        colorClass="text-blue-600"
                        bgGradient="bg-gradient-to-br from-blue-50 to-blue-100"
                        link={route('admin.berita.create')}
                    />

                    <StatCardWithHover
                        title="Infografis"
                        value={stats.total_infografis}
                        icon={<ImageIcon className="h-5 w-5 text-green-600" />}
                        colorClass="text-green-600"
                        bgGradient="bg-gradient-to-br from-green-50 to-green-100"
                        link={route('admin.infografis.create')}
                    />

                    <StatCardWithHover
                        title="Publikasi"
                        value={stats.total_publikasi}
                        icon={<FileText className="h-5 w-5 text-orange-600" />}
                        colorClass="text-orange-600"
                        bgGradient="bg-gradient-to-br from-orange-50 to-orange-100"
                        link={route('admin.publikasi.create')}
                    />
                </div>

                {/* Status Sections Row */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Layanan Status Cards */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Status Permohonan Layanan</h2>
                                <p className="text-sm text-gray-600">Pantau status layanan masyarakat</p>
                            </div>
                            <Link
                                href={route('admin.layanan.index')}
                                className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600">Menunggu</p>
                                        <p className="mt-1 text-2xl font-bold text-yellow-700">{stats.layanan_pending}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Diproses</p>
                                        <p className="mt-1 text-2xl font-bold text-blue-700">{stats.layanan_diproses}</p>
                                    </div>
                                    <AlertCircle className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Selesai</p>
                                        <p className="mt-1 text-2xl font-bold text-green-700">{stats.layanan_selesai}</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">Ditolak</p>
                                        <p className="mt-1 text-2xl font-bold text-red-700">{stats.layanan_ditolak}</p>
                                    </div>
                                    <XCircle className="h-8 w-8 text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pengaduan Status Cards */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Status Pengaduan Masyarakat</h2>
                                <p className="text-sm text-gray-600">Monitor pengaduan yang masuk</p>
                            </div>
                            <Link
                                href={route('admin.pengaduan.index')}
                                className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600">Menunggu</p>
                                        <p className="mt-1 text-2xl font-bold text-yellow-700">{stats.pengaduan_belum_diproses}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Diproses</p>
                                        <p className="mt-1 text-2xl font-bold text-blue-700">{stats.pengaduan_sedang_diproses}</p>
                                    </div>
                                    <AlertCircle className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Selesai</p>
                                        <p className="mt-1 text-2xl font-bold text-green-700">{stats.pengaduan_selesai}</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Distribution Chart */}
                <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-800 sm:text-xl">Statistik Sistem</h2>
                    <p className="mb-4 text-sm text-gray-600">
                        Total{' '}
                        {stats.total_berita +
                            stats.total_infografis +
                            stats.total_publikasi +
                            stats.total_layanan +
                            stats.total_pengaduan +
                            stats.total_pengguna}{' '}
                        data aktif
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                <Newspaper className="mr-2 h-4 w-4 text-blue-600" />
                                Berita
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_berita / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengaduan + stats.total_pengguna, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-12 text-right text-sm font-semibold text-gray-800">{stats.total_berita}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                <ImageIcon className="mr-2 h-4 w-4 text-green-600" />
                                Infografis
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-green-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_infografis / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengaduan + stats.total_pengguna, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-12 text-right text-sm font-semibold text-gray-800">{stats.total_infografis}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                <FileText className="mr-2 h-4 w-4 text-orange-600" />
                                Publikasi
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-orange-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_publikasi / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengaduan + stats.total_pengguna, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-12 text-right text-sm font-semibold text-gray-800">{stats.total_publikasi}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                                Layanan
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-indigo-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_layanan / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengaduan + stats.total_pengguna, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-12 text-right text-sm font-semibold text-gray-800">{stats.total_layanan}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                <MessageSquare className="mr-2 h-4 w-4 text-red-600" />
                                Pengaduan
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-red-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_pengaduan / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengaduan + stats.total_pengguna, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-12 text-right text-sm font-semibold text-gray-800">{stats.total_pengaduan}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                <Users className="mr-2 h-4 w-4 text-purple-600" />
                                Pengguna
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-purple-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_pengguna / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengaduan + stats.total_pengguna, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-12 text-right text-sm font-semibold text-gray-800">{stats.total_pengguna}</div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Summary Section */}
                <div className="rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-800 sm:text-xl">Ringkasan Aktivitas</h2>
                    <p className="mb-4 text-sm text-gray-600">Statistik keseluruhan sistem</p>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                                {stats.total_berita + stats.total_infografis + stats.total_publikasi}
                            </div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Total Konten</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-green-600 sm:text-3xl">
                                {Math.round((stats.total_berita + stats.total_infografis + stats.total_publikasi) / 7)}
                            </div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Konten/Minggu</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-orange-600 sm:text-3xl">{stats.total_pengaduan}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Pengaduan Masyarakat</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-indigo-600 sm:text-3xl">{stats.total_layanan}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Permohonan Layanan</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-purple-600 sm:text-3xl">{stats.total_pengguna}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Admin Aktif</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
