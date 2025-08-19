// resources/js/Pages/Admin/Dashboard.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight, Image as ImageIcon, Newspaper, PlusCircle, Users } from 'lucide-react';

// Tipe untuk props halaman
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
        total_pengguna: number;
    };
    [key: string]: unknown;
}

// Komponen untuk kartu statistik
const StatCard = ({
    title,
    value,
    icon,
    colorClass,
    link,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
    link: string;
}) => (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>{icon}</div>
        </div>
        <Link href={link} className="mt-4 inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800">
            Kelola {title} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
    </div>
);

export default function Dashboard({ auth, stats }: DashboardProps) {
    return (
        <AuthenticatedLayout auth={auth} title="Dashboard">
            <div className="space-y-8">
                {/* Bagian Header Sambutan */}
                <div className="rounded-lg border-l-4 border-orange-500 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, {auth.user.name}!</h1>
                    <p className="mt-1 text-gray-600">Anda berada di pusat kendali Sistem Informasi Desa Cinnong.</p>
                </div>

                {/* Grid Kartu Statistik */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Berita"
                        value={stats.total_berita}
                        icon={<Newspaper className="h-6 w-6 text-blue-600" />}
                        colorClass="bg-blue-100"
                        link="#" // Ganti dengan route('admin.berita.index') nanti
                    />
                    <StatCard
                        title="Infografis"
                        value={stats.total_infografis}
                        icon={<ImageIcon className="h-6 w-6 text-green-600" />}
                        colorClass="bg-green-100"
                        link="#" // Ganti dengan route('admin.infografis.index') nanti
                    />
                    <StatCard
                        title="Pengguna"
                        value={stats.total_pengguna}
                        icon={<Users className="h-6 w-6 text-purple-600" />}
                        colorClass="bg-purple-100"
                        link={route('admin.users.index')}
                    />
                </div>

                {/* Bagian Aksi Cepat */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800">Aksi Cepat</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Link
                            href="#"
                            className="flex items-center justify-center rounded-md bg-orange-600 p-4 text-white transition hover:bg-orange-700"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            <span className="font-semibold">Tambah Berita Baru</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center justify-center rounded-md bg-orange-600 p-4 text-white transition hover:bg-orange-700"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            <span className="font-semibold">Tambah Infografis Baru</span>
                        </Link>
                        <Link
                            href={route('admin.users.create')}
                            className="flex items-center justify-center rounded-md bg-gray-600 p-4 text-white transition hover:bg-gray-700"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            <span className="font-semibold">Tambah Pengguna Baru</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
