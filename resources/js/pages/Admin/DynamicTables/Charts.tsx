// resources/js/Pages/Admin/DynamicTables/Charts.tsx

import { FieldError, inputAdmin } from '@/components/ui/FieldError';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { ArrowLeft, BarChart3, Plus, Settings, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

interface Column {
    name: string;
    type: string;
    required?: boolean;
    options?: string;
    subColumns?: Column[];
}
interface ChartConfig {
    id: string;
    name: string;
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'radar';
    xAxis: string;
    yAxis: string[];
}
interface TableData {
    id: number;
    data: Record<string, any>;
}

interface ChartsPageProps {
    auth: { user: { id: number; name: string; email: string } };
    table: { id: number; name: string; description: string | null; columns: Column[]; charts: ChartConfig[] };
    tableData: TableData[];
    flash?: { success?: string; error?: string };
    [key: string]: any;
}

const CHART_TYPES = [
    { value: 'bar' as const, label: 'Bar Chart', icon: '📊' },
    { value: 'line' as const, label: 'Line Chart', icon: '📈' },
    { value: 'area' as const, label: 'Area Chart', icon: '📉' },
    { value: 'pie' as const, label: 'Pie Chart', icon: '🥧' },
    { value: 'doughnut' as const, label: 'Doughnut Chart', icon: '🍩' },
    { value: 'radar' as const, label: 'Radar Chart', icon: '🎯' },
];

const COLORS = ['rgb(249,115,22)', 'rgb(59,130,246)', 'rgb(34,197,94)', 'rgb(168,85,247)', 'rgb(236,72,153)', 'rgb(107,114,128)'];

export default function Charts() {
    const { auth, table, tableData, flash } = usePage<ChartsPageProps>().props;

    const [charts, setCharts] = useState<ChartConfig[]>(table.charts || []);
    const [isAddingChart, setIsAddingChart] = useState(false);
    const [editingChartId, setEditingChartId] = useState<string | null>(null);

    // ── Flatten kolom termasuk subColumns ──────────────────────────────────────
    const flattenedColumns = useMemo(() => {
        const flatten = (cols: Column[], prefix = ''): Array<{ name: string; displayName: string; type: string }> =>
            cols.flatMap((col) => {
                const fullName = prefix ? `${prefix}.${col.name}` : col.name;
                if (col.type === 'group' && col.subColumns) return flatten(col.subColumns, fullName);
                return [{ name: fullName, displayName: fullName, type: col.type }];
            });
        return flatten(table.columns);
    }, [table.columns]);

    const numericColumns = flattenedColumns.filter((c) => c.type === 'number');
    const labelColumns = flattenedColumns.filter((c) => ['text', 'select', 'date'].includes(c.type));

    // ── Helper: ambil nilai nested ─────────────────────────────────────────────
    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((cur, k) => cur?.[k], obj);

    // ── Siapkan data untuk chart.js ────────────────────────────────────────────
    const prepareChartData = (cfg: ChartConfig) => ({
        labels: tableData.map((row) => getNestedValue(row.data, cfg.xAxis) ?? 'N/A'),
        datasets: cfg.yAxis.map((yCol, i) => {
            const color = COLORS[i % COLORS.length];
            return {
                label: yCol,
                data: tableData.map((row) => {
                    const v = getNestedValue(row.data, yCol);
                    return typeof v === 'number' ? v : parseFloat(v) || 0;
                }),
                backgroundColor:
                    cfg.type === 'pie' || cfg.type === 'doughnut'
                        ? COLORS.slice(0, tableData.length)
                        : color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
                borderColor: color,
                borderWidth: 2,
                fill: cfg.type === 'area',
            };
        }),
    });

    // ── Simpan satu grafik ke server ───────────────────────────────────────────
    const persistCharts = (updatedCharts: ChartConfig[]) => {
        router.post(route('admin.dynamic-tables.save-charts', table.id), {
            charts: JSON.stringify(updatedCharts),
        });
    };

    const handleAddChart = (chartData: ChartConfig) => {
        const added = [...charts, { ...chartData, id: Date.now().toString() }];
        setCharts(added);
        setIsAddingChart(false);
        persistCharts(added);
    };

    const handleUpdateChart = (updated: ChartConfig) => {
        const next = charts.map((c) => (c.id === updated.id ? updated : c));
        setCharts(next);
        setEditingChartId(null);
        persistCharts(next);
    };

    const handleDeleteChart = (id: string) => {
        if (!confirm('Hapus grafik ini?')) return;
        const next = charts.filter((c) => c.id !== id);
        setCharts(next);
        persistCharts(next);
    };

    // ── Render chart.js component ──────────────────────────────────────────────
    const renderChart = (cfg: ChartConfig) => {
        const data = prepareChartData(cfg);
        const opts = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' as const }, title: { display: true, text: cfg.name } },
        };
        switch (cfg.type) {
            case 'bar':
                return <Bar data={data} options={opts} />;
            case 'line':
            case 'area':
                return <Line data={data} options={opts} />;
            case 'pie':
                return <Pie data={data} options={opts} />;
            case 'doughnut':
                return <Doughnut data={data} options={opts} />;
            case 'radar':
                return <Radar data={data} options={opts} />;
        }
    };

    // ── Form tambah / edit grafik ──────────────────────────────────────────────
    const ChartForm = ({ chart, onSave, onCancel }: { chart: ChartConfig; onSave: (c: ChartConfig) => void; onCancel: () => void }) => {
        const [form, setForm] = useState<ChartConfig>(chart);
        const [errs, setErrs] = useState<{ name?: string; xAxis?: string; yAxis?: string }>({});

        const validate = () => {
            const next: typeof errs = {};
            if (!form.name.trim()) next.name = 'Nama grafik wajib diisi.';
            if (!form.xAxis) next.xAxis = 'Sumbu X wajib dipilih.';
            if (!form.yAxis.length) next.yAxis = 'Pilih minimal satu kolom untuk Sumbu Y.';
            setErrs(next);
            return !Object.keys(next).length;
        };

        const handleSave = () => {
            if (validate()) onSave(form);
        };

        return (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-base font-semibold text-gray-900">{chart.id ? 'Edit Grafik' : 'Tambah Grafik Baru'}</h3>

                <div className="space-y-5">
                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Grafik <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            placeholder="Contoh: Penjualan Bulanan"
                            onChange={(ev) => setForm({ ...form, name: ev.target.value })}
                            className={inputAdmin(errs.name)}
                        />
                        <FieldError message={errs.name} />
                    </div>

                    {/* Tipe grafik */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Tipe Grafik</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {CHART_TYPES.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, type: t.value })}
                                    className={`flex items-center gap-2 rounded-md border p-3 text-left transition ${
                                        form.type === t.value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-lg">{t.icon}</span>
                                    <span className="text-sm font-medium">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sumbu X */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sumbu X (Label) <span className="text-red-500">*</span>
                        </label>
                        <select value={form.xAxis} onChange={(ev) => setForm({ ...form, xAxis: ev.target.value })} className={inputAdmin(errs.xAxis)}>
                            <option value="">Pilih kolom untuk label</option>
                            {labelColumns.map((c) => (
                                <option key={c.name} value={c.name}>
                                    {c.displayName}
                                </option>
                            ))}
                        </select>
                        {labelColumns.length === 0 ? (
                            <FieldError message="Tidak ada kolom yang cocok (text, select, atau date)." />
                        ) : (
                            <FieldError message={errs.xAxis} />
                        )}
                    </div>

                    {/* Sumbu Y */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sumbu Y (Nilai) <span className="text-red-500">*</span>
                        </label>
                        {numericColumns.length === 0 ? (
                            <FieldError message="Tidak ada kolom numerik. Tambahkan kolom bertipe number terlebih dahulu." />
                        ) : (
                            <div
                                className={`mt-1 max-h-48 space-y-1 overflow-y-auto rounded-md border p-3 ${errs.yAxis ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            >
                                {numericColumns.map((c) => (
                                    <label key={c.name} className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={form.yAxis.includes(c.name)}
                                            onChange={(ev) =>
                                                setForm({
                                                    ...form,
                                                    yAxis: ev.target.checked ? [...form.yAxis, c.name] : form.yAxis.filter((y) => y !== c.name),
                                                })
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">{c.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {form.yAxis.length > 0 && <p className="mt-1 text-xs text-gray-500">{form.yAxis.length} kolom dipilih</p>}
                        <FieldError message={errs.yAxis} />
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex gap-2 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={labelColumns.length === 0 || numericColumns.length === 0}
                            className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {chart.id ? 'Perbarui Grafik' : 'Simpan Grafik'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Render utama ───────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout auth={auth} title={`Grafik - ${table.name}`}>
            <Head title={`Grafik - ${table.name}`} />

            <div className="space-y-4 sm:space-y-6">
                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 sm:p-4">
                        <p className="text-sm text-green-700">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 sm:p-4">
                        <p className="text-sm text-red-700">{flash.error}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.dynamic-tables.index')}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 sm:h-10 sm:w-10"
                            title="Kembali ke Daftar Tabel"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Grafik: {table.name}</h1>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Kelola grafik dan visualisasi data</p>
                        </div>
                    </div>

                    {/* Tombol Simpan Semua dihapus — tiap grafik disimpan otomatis */}
                    {!isAddingChart && (
                        <button
                            onClick={() => setIsAddingChart(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 sm:px-4"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Grafik
                        </button>
                    )}
                </div>

                {/* Form tambah grafik */}
                {isAddingChart && (
                    <ChartForm
                        chart={{ id: '', name: '', type: 'bar', xAxis: '', yAxis: [] }}
                        onSave={handleAddChart}
                        onCancel={() => setIsAddingChart(false)}
                    />
                )}

                {/* Konten: kosong / daftar grafik */}
                {tableData.length === 0 ? (
                    <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Data</h3>
                        <p className="mt-2 text-sm text-gray-500">Tambahkan data terlebih dahulu sebelum membuat grafik.</p>
                        <Link
                            href={route('admin.dynamic-tables.insert', table.id)}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Data
                        </Link>
                    </div>
                ) : charts.length === 0 && !isAddingChart ? (
                    <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Grafik</h3>
                        <p className="mt-2 text-sm text-gray-500">Buat grafik pertama Anda untuk memvisualisasikan data.</p>
                        <button
                            onClick={() => setIsAddingChart(true)}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                        >
                            <Plus className="h-4 w-4" />
                            Buat Grafik
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {charts.map((chart) => (
                            <div key={chart.id} className="rounded-lg border bg-white p-6 shadow-sm">
                                {editingChartId === chart.id ? (
                                    <ChartForm chart={chart} onSave={handleUpdateChart} onCancel={() => setEditingChartId(null)} />
                                ) : (
                                    <>
                                        <div className="mb-4 flex items-start justify-between">
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">{chart.name}</h3>
                                                <p className="text-sm text-gray-500">{CHART_TYPES.find((t) => t.value === chart.type)?.label}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setEditingChartId(chart.id)}
                                                    className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteChart(chart.id)}
                                                    className="rounded-md p-2 text-red-600 hover:bg-red-50"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="aspect-video">{renderChart(chart)}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
