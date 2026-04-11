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
    Newspaper,
    Plus,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
        };
    };
    stats: {
        total_berita: number;
        total_infografis: number;
        total_publikasi: number;
        total_pengguna: number;
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
    chartData: {
        [key: string]: {
            label: string;
            date: string;
            total: number;
        }[];
    };
    jenisLayananList: string[];
    availableYears: number[];
    [key: string]: unknown;
}

type Granularity = 'hari' | 'minggu' | 'bulan';

const BULAN_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCardWithHover = ({
    title,
    value,
    icon,
    colorClass,
    bgGradient,
    link,
    showAction,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
    bgGradient: string;
    link: string;
    showAction: boolean; // kontrol apakah tombol "Tambah" ditampilkan
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

            {/* Tombol Tambah — hanya muncul jika showAction = true */}
            {showAction && (
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
            )}
        </div>
    );
};

// ─── TimeSeriesChart ──────────────────────────────────────────────────────────

const TimeSeriesChart = ({
    chartData,
    jenisLayananList,
    availableYears,
}: {
    chartData: DashboardProps['chartData'];
    jenisLayananList: string[];
    availableYears: number[];
}) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [granularity, setGranularity] = useState<Granularity>('bulan');
    const [selectedJenis, setSelectedJenis] = useState<string>('semua');
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

    const dataKey = useMemo(() => {
        if (granularity === 'bulan') return `${selectedJenis}_bulan_${selectedYear}`;
        if (granularity === 'minggu') return `${selectedJenis}_minggu_${selectedYear}_${selectedMonth}`;
        return `${selectedJenis}_hari_${selectedYear}_${selectedMonth}`;
    }, [granularity, selectedJenis, selectedYear, selectedMonth]);

    const rawData = chartData?.[dataKey] ?? [];
    const maxVal = useMemo(() => Math.max(...rawData.map((d) => d.total), 1), [rawData]);
    const total = rawData.reduce((s, d) => s + d.total, 0);
    const avg = rawData.length > 0 ? Math.round(total / rawData.length) : 0;

    const yearOptions = useMemo(() => {
        const s = new Set([...availableYears, currentYear]);
        return Array.from(s).sort((a, b) => b - a);
    }, [availableYears, currentYear]);

    const unitLabel = granularity === 'hari' ? 'hari' : granularity === 'minggu' ? 'minggu' : 'bulan';

    const contextLabel = useMemo(() => {
        const suffix = selectedJenis !== 'semua' ? ` · ${selectedJenis}` : '';
        if (granularity === 'bulan') return `Per bulan — tahun ${selectedYear}${suffix}`;
        return `Per ${unitLabel} — ${BULAN_ID[selectedMonth - 1]} ${selectedYear}${suffix}`;
    }, [granularity, selectedJenis, selectedYear, selectedMonth, unitLabel]);

    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-800 sm:text-lg">Tren Pengajuan Layanan</h2>
                        <p className="text-xs text-gray-500">Jumlah permohonan masuk berdasarkan waktu</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedJenis}
                        onChange={(e) => setSelectedJenis(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    >
                        <option value="semua">Semua Layanan</option>
                        {jenisLayananList.map((j) => (
                            <option key={j} value={j}>
                                {j}
                            </option>
                        ))}
                    </select>

                    <div className="flex overflow-hidden rounded-md border border-gray-300">
                        {(['hari', 'minggu', 'bulan'] as Granularity[]).map((g) => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g)}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                    granularity === g ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {g === 'hari' ? 'Per Hari' : g === 'minggu' ? 'Per Minggu' : 'Per Bulan'}
                            </button>
                        ))}
                    </div>

                    {(granularity === 'hari' || granularity === 'minggu') && (
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        >
                            {BULAN_ID.map((nama, idx) => (
                                <option key={idx + 1} value={idx + 1}>
                                    {nama}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="mb-3 text-xs text-gray-400">{contextLabel}</p>

            {rawData.length === 0 ? (
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-400">Belum ada data untuk periode ini</p>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-full border-t border-dashed border-gray-100" />
                            ))}
                        </div>

                        <div className="flex items-end gap-1 overflow-x-auto pb-1" style={{ minHeight: '220px' }}>
                            {rawData.map((point, idx) => {
                                const heightPx = maxVal > 0 ? (point.total / maxVal) * 180 : 0;
                                return (
                                    <div
                                        key={idx}
                                        className="group relative flex flex-1 flex-col items-center"
                                        style={{ minWidth: rawData.length > 20 ? '24px' : '36px' }}
                                    >
                                        <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
                                            <div className="rounded-md bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
                                                <div className="font-semibold">{point.total} pengajuan</div>
                                                <div className="text-gray-300">{point.label}</div>
                                            </div>
                                            <div className="mx-auto -mt-1 h-1.5 w-1.5 rotate-45 bg-gray-800" />
                                        </div>

                                        {point.total > 0 && (
                                            <span className="mb-1 text-xs font-semibold text-orange-600 opacity-0 transition-opacity group-hover:opacity-100">
                                                {point.total}
                                            </span>
                                        )}

                                        <div
                                            className={`w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 ${
                                                point.total > 0 ? 'bg-orange-500' : 'bg-orange-100'
                                            }`}
                                            style={{ height: `${Math.max(heightPx, point.total > 0 ? 4 : 2)}px` }}
                                        />

                                        <span
                                            className="mt-1.5 truncate text-center text-gray-500"
                                            style={{ fontSize: '10px', maxWidth: '100%' }}
                                            title={point.label}
                                        >
                                            {point.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 border-t pt-4">
                        <span className="text-xs text-gray-600">
                            Total: <span className="font-bold text-orange-600">{total}</span> pengajuan
                        </span>
                        <span className="text-xs text-gray-600">
                            Rata-rata: <span className="font-bold text-orange-600">{avg}</span> / {unitLabel}
                        </span>
                        <span className="text-xs text-gray-600">
                            Tertinggi: <span className="font-bold text-orange-600">{maxVal}</span> pengajuan
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard({ auth, stats, settings, chartData, jenisLayananList, availableYears }: DashboardProps) {
    const namaDesa = settings?.nama_desa || 'Desa';

    // Admin BPS tidak mendapat aksi tambah konten & lihat semua layanan
    const isAdminBps = auth.user.role === 'admin_bps';
    const showAction = !isAdminBps; // tombol Tambah di stat card
    const showLihatSemua = !isAdminBps; // tombol "Lihat Semua →" di status layanan

    const totalAll = stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengguna;
    const barPct = (val: number) => `${(val / Math.max(totalAll, 1)) * 100}%`;

    return (
        <AuthenticatedLayout auth={auth} title="Dashboard">
            <div className="space-y-6 px-4 sm:space-y-8 sm:px-0">
                {/* Welcome */}
                <div className="rounded-lg border-l-4 border-orange-500 bg-gradient-to-r from-white to-orange-50 p-4 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-xl leading-tight font-bold text-gray-800 sm:text-2xl">Selamat Datang, {auth.user.name}!</h1>
                            <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">Pusat kendali Sistem Informasi {namaDesa}</p>
                        </div>
                        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-orange-100 sm:flex">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Stat Cards — semua role melihat angka, hanya admin_desa yang dapat tombol Tambah */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCardWithHover
                        title="Berita"
                        value={stats.total_berita}
                        icon={<Newspaper className="h-5 w-5 text-blue-600" />}
                        colorClass="text-blue-600"
                        bgGradient="bg-gradient-to-br from-blue-50 to-blue-100"
                        link={route('admin.berita.create')}
                        showAction={showAction}
                    />
                    <StatCardWithHover
                        title="Infografis"
                        value={stats.total_infografis}
                        icon={<ImageIcon className="h-5 w-5 text-green-600" />}
                        colorClass="text-green-600"
                        bgGradient="bg-gradient-to-br from-green-50 to-green-100"
                        link={route('admin.infografis.create')}
                        showAction={showAction}
                    />
                    <StatCardWithHover
                        title="Publikasi"
                        value={stats.total_publikasi}
                        icon={<FileText className="h-5 w-5 text-orange-600" />}
                        colorClass="text-orange-600"
                        bgGradient="bg-gradient-to-br from-orange-50 to-orange-100"
                        link={route('admin.publikasi.create')}
                        showAction={showAction}
                    />
                </div>

                {/* Status Layanan */}
                <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Status Permohonan Layanan</h2>
                            <p className="text-sm text-gray-500">Pantau status semua permohonan layanan masyarakat</p>
                        </div>
                        {/* Tombol "Lihat Semua" hanya untuk admin_desa */}
                        {showLihatSemua && (
                            <Link
                                href={route('admin.layanan.index')}
                                className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                            >
                                Lihat Semua →
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            {
                                label: 'Menunggu',
                                val: stats.layanan_pending,
                                border: 'border-yellow-500',
                                bg: 'bg-yellow-50',
                                text: 'text-yellow-600',
                                bold: 'text-yellow-700',
                                icon: <Clock className="h-8 w-8 text-yellow-500" />,
                            },
                            {
                                label: 'Diproses',
                                val: stats.layanan_diproses,
                                border: 'border-blue-500',
                                bg: 'bg-blue-50',
                                text: 'text-blue-600',
                                bold: 'text-blue-700',
                                icon: <AlertCircle className="h-8 w-8 text-blue-500" />,
                            },
                            {
                                label: 'Selesai',
                                val: stats.layanan_selesai,
                                border: 'border-green-500',
                                bg: 'bg-green-50',
                                text: 'text-green-600',
                                bold: 'text-green-700',
                                icon: <CheckCircle className="h-8 w-8 text-green-500" />,
                            },
                            {
                                label: 'Ditolak',
                                val: stats.layanan_ditolak,
                                border: 'border-red-500',
                                bg: 'bg-red-50',
                                text: 'text-red-600',
                                bold: 'text-red-700',
                                icon: <XCircle className="h-8 w-8 text-red-500" />,
                            },
                        ].map(({ label, val, border, bg, text, bold, icon }) => (
                            <div key={label} className={`rounded-lg border-l-4 ${border} ${bg} p-4`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${text}`}>{label}</p>
                                        <p className={`mt-1 text-2xl font-bold ${bold}`}>{val}</p>
                                    </div>
                                    {icon}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistik Sistem */}
                <div className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl">Statistik Sistem</h2>
                    <p className="mb-5 text-sm text-gray-500">Total {totalAll} data aktif</p>
                    <div className="space-y-4">
                        {[
                            {
                                label: 'Berita',
                                val: stats.total_berita,
                                color: 'bg-blue-600',
                                icon: <Newspaper className="mr-2 h-4 w-4 text-blue-600" />,
                            },
                            {
                                label: 'Infografis',
                                val: stats.total_infografis,
                                color: 'bg-green-600',
                                icon: <ImageIcon className="mr-2 h-4 w-4 text-green-600" />,
                            },
                            {
                                label: 'Publikasi',
                                val: stats.total_publikasi,
                                color: 'bg-orange-600',
                                icon: <FileText className="mr-2 h-4 w-4 text-orange-600" />,
                            },
                            {
                                label: 'Layanan',
                                val: stats.total_layanan,
                                color: 'bg-indigo-600',
                                icon: <FileText className="mr-2 h-4 w-4 text-indigo-600" />,
                            },
                            {
                                label: 'Pengguna',
                                val: stats.total_pengguna,
                                color: 'bg-purple-600',
                                icon: <Users className="mr-2 h-4 w-4 text-purple-600" />,
                            },
                        ].map(({ label, val, color, icon }) => (
                            <div key={label} className="flex items-center">
                                <div className="flex w-32 items-center text-sm font-medium text-gray-700">
                                    {icon}
                                    {label}
                                </div>
                                <div className="mx-4 flex-1">
                                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                        <div className={`h-full ${color} transition-all duration-300`} style={{ width: barPct(val) }} />
                                    </div>
                                </div>
                                <div className="w-12 text-right text-sm font-semibold text-gray-800">{val}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ringkasan */}
                <div className="rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl">Ringkasan Aktivitas</h2>
                    <p className="mb-5 text-sm text-gray-500">Statistik keseluruhan sistem</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                                {stats.total_berita + stats.total_infografis + stats.total_publikasi}
                            </div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Total Konten</div>
                        </div>
                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-indigo-600 sm:text-3xl">{stats.total_layanan}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Permohonan Layanan</div>
                        </div>
                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-green-600 sm:text-3xl">{stats.layanan_selesai}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Layanan Selesai</div>
                        </div>
                        <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-purple-600 sm:text-3xl">{stats.total_pengguna}</div>
                            <div className="mt-1 text-xs text-gray-600 sm:text-sm">Pengguna Terdaftar</div>
                        </div>
                    </div>
                </div>

                {/* Grafik Time Series */}
                <TimeSeriesChart chartData={chartData ?? {}} jenisLayananList={jenisLayananList ?? []} availableYears={availableYears ?? []} />
            </div>
        </AuthenticatedLayout>
    );
}
