// resources/js/Pages/Admin/Dashboard.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, Image as ImageIcon, Newspaper, Plus, TrendingUp, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface JenisLayanan {
    id: number;
    name: string;
}

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
    jenisLayananList: JenisLayanan[];
    availableYears: number[];
    [key: string]: unknown;
}

type Granularity = 'hari' | 'minggu' | 'bulan';

const BULAN_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// ─── StatCard (MODIFIED: Minimalist Style) ────────────────────────────────────

const StatCardWithHover = ({
    title,
    value,
    icon,
    colorClass,
    borderColor,
    link,
    showAction,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
    borderColor: string;
    link: string;
    showAction: boolean;
}) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:border-${borderColor.split('-')[1]}-400 hover:shadow-md`}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-2.5 ${colorClass.replace('text-', 'bg-').replace('-600', '-50')}`}>{icon}</div>
                {showAction && (
                    <Link
                        href={link}
                        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        title="Tambah Data"
                    >
                        <Plus className="h-5 w-5" />
                    </Link>
                )}
            </div>
            <div>
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <div className="text-3xl font-bold text-gray-900">{value}</div>
            </div>
            {/* Subtle bottom border accent */}
            <div
                className={`absolute bottom-0 left-0 h-1 w-full bg-${borderColor.split('-')[1]}-500 opacity-0 transition-opacity group-hover:opacity-100`}
            />
        </div>
    );
};

// ─── TimeSeriesChart (Unchanged Logic, UI Polished) ──────────────────────────

const TimeSeriesChart = ({
    chartData,
    jenisLayananList,
    availableYears,
}: {
    chartData: DashboardProps['chartData'];
    jenisLayananList: JenisLayanan[];
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

    const selectedJenisName = useMemo(() => {
        if (selectedJenis === 'semua') return null;
        return jenisLayananList.find((j) => String(j.id) === selectedJenis)?.name ?? selectedJenis;
    }, [selectedJenis, jenisLayananList]);

    const contextLabel = useMemo(() => {
        const suffix = selectedJenisName ? ` · ${selectedJenisName}` : '';
        if (granularity === 'bulan') return `Per bulan — tahun ${selectedYear}${suffix}`;
        return `Per ${unitLabel} — ${BULAN_ID[selectedMonth - 1]} ${selectedYear}${suffix}`;
    }, [granularity, selectedJenisName, selectedYear, selectedMonth, unitLabel]);

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Tren Pengajuan Layanan</h2>
                        <p className="text-sm text-gray-500">{contextLabel}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedJenis}
                        onChange={(e) => setSelectedJenis(e.target.value)}
                        className="rounded-lg border-gray-200 bg-gray-50 py-1.5 text-xs font-medium text-gray-700 focus:border-orange-500 focus:ring-orange-500"
                    >
                        <option value="semua">Semua Layanan</option>
                        {jenisLayananList.map((j) => (
                            <option key={j.id} value={String(j.id)}>
                                {j.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                        {(['hari', 'minggu', 'bulan'] as Granularity[]).map((g) => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g)}
                                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                    granularity === g ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {g === 'hari' ? 'Hari' : g === 'minggu' ? 'Minggu' : 'Bulan'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {rawData.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50">
                    <p className="text-sm text-gray-400">Tidak ada data untuk periode ini</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="relative pt-4">
                        <div className="overflow-x-auto pb-2">
                            <div className="flex h-56 min-w-full gap-2">
                                {rawData.map((point, idx) => {
                                    const heightPct = maxVal > 0 ? (point.total / maxVal) * 100 : 0;
                                    const minColWidth = granularity === 'hari' ? 32 : granularity === 'minggu' ? 76 : 48;

                                    return (
                                        <div
                                            key={idx}
                                            className="group relative flex h-full flex-1 flex-col items-center"
                                            style={{ minWidth: `${minColWidth}px` }}
                                        >
                                            {/* Area bar — flex-1 supaya tingginya definit (h-56 dikurangi tinggi label) */}
                                            <div className="relative flex w-full flex-1 items-end justify-center">
                                                <div
                                                    className={`w-full max-w-[32px] rounded-t-sm transition-all duration-300 ${point.total > 0 ? 'bg-orange-400 group-hover:bg-orange-500' : 'bg-gray-100'}`}
                                                    style={{ height: `${Math.max(heightPct, 5)}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                        {point.total} Pengajuan
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Label — boleh wrap 2 baris untuk teks panjang seperti "Mg 1 (01-05)" */}
                                            <span className="mt-2 shrink-0 text-center text-[10px] leading-tight font-medium text-gray-400">
                                                {point.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 border-t pt-4">
                        <div className="text-center">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Total</p>
                            <p className="text-lg font-bold text-gray-900">{total}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Rata-rata</p>
                            <p className="text-lg font-bold text-gray-900">{avg}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Dashboard (MODIFIED: Cleaner Layout) ────────────────────────────────

export default function Dashboard({ auth, stats, settings, chartData, jenisLayananList, availableYears }: DashboardProps) {
    const namaDesa = settings?.nama_desa || 'Desa';
    const isAdminBps = auth.user.role === 'admin_bps';
    const showAction = !isAdminBps;

    const totalAll = stats.total_berita + stats.total_infografis + stats.total_publikasi + stats.total_layanan + stats.total_pengguna;
    const barPct = (val: number) => `${(val / Math.max(totalAll, 1)) * 100}%`;

    return (
        <AuthenticatedLayout auth={auth} title="Dashboard">
            <div className="space-y-6 pb-10">
                {/* Welcome Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">
                            Selamat datang kembali, {auth.user.name}. Berikut ringkasan sistem {namaDesa}.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <StatCardWithHover
                        title="Berita"
                        value={stats.total_berita}
                        icon={<Newspaper className="h-5 w-5 text-blue-600" />}
                        colorClass="text-blue-600"
                        borderColor="border-blue"
                        link={route('admin.berita.create')}
                        showAction={showAction}
                    />
                    <StatCardWithHover
                        title="Infografis"
                        value={stats.total_infografis}
                        icon={<ImageIcon className="h-5 w-5 text-emerald-600" />}
                        colorClass="text-emerald-600"
                        borderColor="border-emerald"
                        link={route('admin.infografis.create')}
                        showAction={showAction}
                    />
                    <StatCardWithHover
                        title="Publikasi"
                        value={stats.total_publikasi}
                        icon={<FileText className="h-5 w-5 text-orange-600" />}
                        colorClass="text-orange-600"
                        borderColor="border-orange"
                        link={route('admin.publikasi.create')}
                        showAction={showAction}
                    />
                </div>

                {/* Status Layanan & System Stats Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Status Permohonan */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Status Pengajuan</h2>
                            <Link href={route('admin.layanan.index')} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                                Kelola Semua
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                {
                                    label: 'Menunggu',
                                    val: stats.layanan_pending,
                                    color: 'text-amber-600',
                                    border: 'border-amber-200',
                                    icon: <Clock />,
                                },
                                {
                                    label: 'Diproses',
                                    val: stats.layanan_diproses,
                                    color: 'text-blue-600',
                                    border: 'border-blue-200',
                                    icon: <AlertCircle />,
                                },
                                {
                                    label: 'Selesai',
                                    val: stats.layanan_selesai,
                                    color: 'text-emerald-600',
                                    border: 'border-emerald-200',
                                    icon: <CheckCircle />,
                                },
                                {
                                    label: 'Ditolak',
                                    val: stats.layanan_ditolak,
                                    color: 'text-rose-600',
                                    border: 'border-rose-200',
                                    icon: <XCircle />,
                                },
                            ].map((item) => (
                                <div key={item.label} className={`rounded-xl border ${item.border} p-4 transition-colors hover:bg-gray-50`}>
                                    <div
                                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${item.color.replace('text-', 'bg-').replace('-600', '-50')} ${item.color}`}
                                    >
                                        {item.icon}
                                    </div>
                                    <p className="text-xs font-medium text-gray-500">{item.label}</p>
                                    <p className={`text-xl font-bold ${item.color}`}>{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistik Sistem (Right Side) */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold text-gray-900">Data Aktif</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Pengguna', val: stats.total_pengguna, color: 'bg-purple-500' },
                                { label: 'Layanan', val: stats.total_layanan, color: 'bg-indigo-500' },
                                { label: 'Konten', val: stats.total_berita + stats.total_infografis + stats.total_publikasi, color: 'bg-orange-500' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="mb-1 flex justify-between text-xs font-medium">
                                        <span className="text-gray-600">{stat.label}</span>
                                        <span className="font-bold text-gray-900">{stat.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                                        <div className={`h-1.5 rounded-full ${stat.color}`} style={{ width: barPct(stat.val) }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Trend Chart */}
                <TimeSeriesChart chartData={chartData ?? {}} jenisLayananList={jenisLayananList ?? []} availableYears={availableYears ?? []} />
            </div>
        </AuthenticatedLayout>
    );
}
