// resources/js/Pages/Admin/Dashboard.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Building,
    Calendar,
    FileText,
    Image as ImageIcon,
    MessageSquare,
    Newspaper,
    PlusCircle,
    TrendingUp,
    Users,
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
    };
    [key: string]: unknown;
}

const StatCard = ({
    title,
    value,
    icon,
    colorClass,
    bgClass,
    link,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
    bgClass: string;
    link: string;
}) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div
            className={`rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6 ${
                isPressed ? 'scale-95' : 'hover:scale-[1.02]'
            }`}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium tracking-wider text-gray-500 uppercase sm:text-sm">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-800 sm:text-3xl">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${bgClass} shadow-sm`}>{icon}</div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 sm:text-sm">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                    <span>Total aktif</span>
                </div>
            </div>

            <Link
                href={link}
                className={`-mx-1 mt-4 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 ${colorClass}`}
            >
                <span>Kelola {title}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </div>
    );
};

const QuickActionButton = ({
    href,
    icon,
    title,
    bgColor,
    hoverColor,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    bgColor: string;
    hoverColor: string;
}) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Link
            href={href}
            className={`flex items-center justify-center rounded-lg p-4 text-white shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 ${bgColor} ${hoverColor} ${
                isPressed ? 'scale-95' : 'hover:scale-[1.02]'
            }`}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
        >
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                <div className="mb-2 sm:mr-3 sm:mb-0">{icon}</div>
                <span className="text-sm leading-tight font-semibold sm:text-base">{title}</span>
            </div>
        </Link>
    );
};

export default function Dashboard({ auth, stats }: DashboardProps) {
    return (
        <AuthenticatedLayout auth={auth} title="Dashboard">
            <div className="space-y-6 px-4 sm:space-y-8 sm:px-0">
                {/* Welcome Header Section */}
                <div className="rounded-lg border-l-4 border-orange-500 bg-gradient-to-r from-white to-orange-50 p-4 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-xl leading-tight font-bold text-gray-800 sm:text-2xl">Selamat Datang, {auth.user.name}!</h1>
                            <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                                Anda berada di pusat kendali Sistem Informasi Desa Cinnong.
                            </p>
                        </div>
                        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-orange-100 sm:flex">
                            <Activity className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs sm:text-sm">
                        <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Sistem Aktif</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
                    <StatCard
                        title="Berita"
                        value={stats.total_berita}
                        icon={<Newspaper className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" />}
                        colorClass="text-blue-600 hover:text-blue-700"
                        bgClass="bg-blue-100"
                        link={route('admin.berita.index')}
                    />
                    <StatCard
                        title="Infografis"
                        value={stats.total_infografis}
                        icon={<ImageIcon className="h-6 w-6 text-green-600 sm:h-7 sm:w-7" />}
                        colorClass="text-green-600 hover:text-green-700"
                        bgClass="bg-green-100"
                        link={route('admin.infografis.index')}
                    />
                    <StatCard
                        title="Publikasi"
                        value={stats.total_publikasi}
                        icon={<FileText className="h-6 w-6 text-orange-600 sm:h-7 sm:w-7" />}
                        colorClass="text-orange-600 hover:text-orange-700"
                        bgClass="bg-orange-100"
                        link={route('admin.publikasi.index')}
                    />
                    <StatCard
                        title="Pengaduan"
                        value={stats.total_pengaduan}
                        icon={<MessageSquare className="h-6 w-6 text-red-600 sm:h-7 sm:w-7" />}
                        colorClass="text-red-600 hover:text-red-700"
                        bgClass="bg-red-100"
                        link={route('admin.pengaduan.index')}
                    />
                    <StatCard
                        title="Pengguna"
                        value={stats.total_pengguna}
                        icon={<Users className="h-6 w-6 text-purple-600 sm:h-7 sm:w-7" />}
                        colorClass="text-purple-600 hover:text-purple-700"
                        bgClass="bg-purple-100"
                        link={route('admin.users.index')}
                    />
                </div>

                {/* Pengaduan Status Cards */}
                <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-800 sm:text-xl">Status Pengaduan Masyarakat</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600">Belum Diproses</p>
                                    <p className="mt-1 text-2xl font-bold text-red-700">{stats.pengaduan_belum_diproses}</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-red-500" />
                            </div>
                        </div>
                        <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Sedang Diproses</p>
                                    <p className="mt-1 text-2xl font-bold text-yellow-700">{stats.pengaduan_sedang_diproses}</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-yellow-500" />
                            </div>
                        </div>
                        <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Selesai</p>
                                    <p className="mt-1 text-2xl font-bold text-green-700">{stats.pengaduan_selesai}</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Aksi Cepat</h2>
                        <p className="mt-1 text-sm text-gray-600">Tambahkan konten baru dengan mudah</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        <QuickActionButton
                            href={route('admin.berita.create')}
                            icon={<PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
                            title="Tambah Berita Baru"
                            bgColor="bg-blue-600"
                            hoverColor="hover:bg-blue-700"
                        />
                        <QuickActionButton
                            href={route('admin.infografis.create')}
                            icon={<PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
                            title="Tambah Infografis Baru"
                            bgColor="bg-green-600"
                            hoverColor="hover:bg-green-700"
                        />
                        <QuickActionButton
                            href={route('admin.publikasi.create')}
                            icon={<PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
                            title="Tambah Publikasi Baru"
                            bgColor="bg-orange-600"
                            hoverColor="hover:bg-orange-700"
                        />
                        <QuickActionButton
                            href={route('admin.users.create')}
                            icon={<PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
                            title="Tambah Pengguna Baru"
                            bgColor="bg-gray-600"
                            hoverColor="hover:bg-gray-700"
                        />
                        <QuickActionButton
                            href={route('admin.profil.edit')}
                            icon={<Building className="h-5 w-5 sm:h-6 sm:w-6" />}
                            title="Kelola Profil Desa"
                            bgColor="bg-teal-600"
                            hoverColor="hover:bg-teal-700"
                        />
                    </div>
                </div>

                {/* Enhanced Summary Section */}
                <div className="rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-800 sm:text-xl">Ringkasan Aktivitas</h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                            <div className="text-2xl font-bold text-orange-600 sm:text-3xl">{stats.total_publikasi}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Dokumen Publik</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-purple-600 sm:text-3xl">{stats.total_pengguna}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Admin Aktif</div>
                        </div>
                    </div>
                </div>

                {/* Content Distribution Chart */}
                <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-800 sm:text-xl">Distribusi Konten</h2>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex w-20 items-center text-sm font-medium text-gray-700">
                                <Newspaper className="mr-2 h-4 w-4 text-blue-600" />
                                Berita
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_berita / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-8 text-right text-sm font-semibold text-gray-800">{stats.total_berita}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-20 items-center text-sm font-medium text-gray-700">
                                <ImageIcon className="mr-2 h-4 w-4 text-green-600" />
                                Infografis
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-green-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_infografis / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-8 text-right text-sm font-semibold text-gray-800">{stats.total_infografis}</div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex w-20 items-center text-sm font-medium text-gray-700">
                                <FileText className="mr-2 h-4 w-4 text-orange-600" />
                                Publikasi
                            </div>
                            <div className="mx-4 flex-1">
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full bg-orange-600 transition-all duration-300"
                                        style={{
                                            width: `${(stats.total_publikasi / Math.max(stats.total_berita + stats.total_infografis + stats.total_publikasi, 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-8 text-right text-sm font-semibold text-gray-800">{stats.total_publikasi}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
