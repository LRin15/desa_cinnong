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
import { ArrowLeft, BarChart3, Plus, Save, Settings, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';

// Register ChartJS components
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
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    table: {
        id: number;
        name: string;
        description: string | null;
        columns: Column[];
        charts: ChartConfig[];
    };
    tableData: TableData[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function Charts() {
    const { auth, table, tableData, flash } = usePage<ChartsPageProps>().props;

    const [charts, setCharts] = useState<ChartConfig[]>(table.charts || []);
    const [isAddingChart, setIsAddingChart] = useState(false);
    const [editingChartId, setEditingChartId] = useState<string | null>(null);

    // Flatten columns untuk mendapatkan semua kolom termasuk subColumns
    const flattenedColumns = useMemo(() => {
        const flatten = (cols: Column[], prefix = ''): Array<{ name: string; displayName: string; type: string }> => {
            let result: Array<{ name: string; displayName: string; type: string }> = [];

            cols.forEach((col) => {
                const fullName = prefix ? `${prefix}.${col.name}` : col.name;

                if (col.type === 'group' && col.subColumns) {
                    result = [...result, ...flatten(col.subColumns, fullName)];
                } else {
                    result.push({
                        name: fullName,
                        displayName: fullName,
                        type: col.type,
                    });
                }
            });

            return result;
        };

        return flatten(table.columns);
    }, [table.columns]);

    // Filter kolom yang cocok untuk axis
    const numericColumns = flattenedColumns.filter((col) => col.type === 'number');
    const labelColumns = flattenedColumns.filter((col) => ['text', 'select', 'date'].includes(col.type));

    const [newChart, setNewChart] = useState<ChartConfig>({
        id: '',
        name: '',
        type: 'bar',
        xAxis: '',
        yAxis: [],
    });

    const chartTypes = [
        { value: 'bar' as const, label: 'Bar Chart', icon: '📊' },
        { value: 'line' as const, label: 'Line Chart', icon: '📈' },
        { value: 'area' as const, label: 'Area Chart', icon: '📉' },
        { value: 'pie' as const, label: 'Pie Chart', icon: '🥧' },
        { value: 'doughnut' as const, label: 'Doughnut Chart', icon: '🍩' },
        { value: 'radar' as const, label: 'Radar Chart', icon: '🎯' },
    ];

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const prepareChartData = (chartConfig: ChartConfig) => {
        const labels = tableData.map((row) => getNestedValue(row.data, chartConfig.xAxis) || 'N/A');

        const datasets = chartConfig.yAxis.map((yCol, index) => {
            const colors = [
                'rgb(59, 130, 246)',
                'rgb(34, 197, 94)',
                'rgb(249, 115, 22)',
                'rgb(168, 85, 247)',
                'rgb(236, 72, 153)',
                'rgb(14, 165, 233)',
            ];

            const color = colors[index % colors.length];

            return {
                label: yCol,
                data: tableData.map((row) => {
                    const value = getNestedValue(row.data, yCol);
                    return typeof value === 'number' ? value : parseFloat(value) || 0;
                }),
                backgroundColor:
                    chartConfig.type === 'pie' || chartConfig.type === 'doughnut'
                        ? colors.slice(0, tableData.length)
                        : color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
                borderColor: color,
                borderWidth: 2,
                fill: chartConfig.type === 'area',
            };
        });

        return { labels, datasets };
    };

    const handleAddChart = (chartData: ChartConfig) => {
        // Validasi sudah dilakukan di ChartForm component
        const chartToAdd: ChartConfig = {
            ...chartData,
            id: Date.now().toString(),
        };

        setCharts([...charts, chartToAdd]);
        setNewChart({
            id: '',
            name: '',
            type: 'bar',
            xAxis: '',
            yAxis: [],
        });
        setIsAddingChart(false);
    };

    const handleUpdateChart = (updatedChart: ChartConfig) => {
        setCharts(charts.map((c) => (c.id === updatedChart.id ? updatedChart : c)));
        setEditingChartId(null);
    };

    const handleDeleteChart = (chartId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus grafik ini?')) {
            setCharts(charts.filter((c) => c.id !== chartId));
        }
    };

    const handleSaveCharts = () => {
        router.post(
            `/admin/dynamic-tables/${table.id}/charts`,
            {
                charts: JSON.stringify(charts),
            },
            {
                onSuccess: () => {
                    // Success handled by flash message
                },
                onError: (errors) => {
                    console.error('Error saving charts:', errors);
                },
            },
        );
    };

    const renderChart = (chartConfig: ChartConfig) => {
        const data = prepareChartData(chartConfig);
        const options = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: chartConfig.name,
                },
            },
        };

        switch (chartConfig.type) {
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'line':
                return <Line data={data} options={options} />;
            case 'area':
                return <Line data={data} options={options} />;
            case 'pie':
                return <Pie data={data} options={options} />;
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            case 'radar':
                return <Radar data={data} options={options} />;
            default:
                return null;
        }
    };

    const ChartForm = ({ chart, onSave, onCancel }: { chart: ChartConfig; onSave: (chart: ChartConfig) => void; onCancel: () => void }) => {
        const [formData, setFormData] = useState<ChartConfig>(chart);

        const handleTypeChange = (type: ChartConfig['type']) => {
            setFormData({ ...formData, type });
        };

        const handleSave = () => {
            // Validasi field dengan pengecekan yang lebih robust
            const trimmedName = formData.name ? formData.name.trim() : '';

            if (trimmedName === '') {
                alert('Nama grafik wajib diisi');
                return;
            }

            if (!formData.xAxis || formData.xAxis === '') {
                alert('Sumbu X (Label) wajib dipilih');
                return;
            }

            if (!formData.yAxis || formData.yAxis.length === 0) {
                alert('Minimal pilih satu kolom untuk Sumbu Y (Nilai)');
                return;
            }

            // Semua validasi passed, panggil onSave
            onSave(formData);
        };

        return (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">{chart.id ? 'Edit Grafik' : 'Tambah Grafik Baru'}</h3>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nama Grafik <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            placeholder="Contoh: Penjualan Bulanan"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Tipe Grafik</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {chartTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleTypeChange(type.value)}
                                    className={`flex items-center gap-2 rounded-md border p-3 transition ${
                                        formData.type === type.value
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-lg">{type.icon}</span>
                                    <span className="text-sm font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Sumbu X (Label) <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.xAxis}
                            onChange={(e) => setFormData({ ...formData, xAxis: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        >
                            <option value="">Pilih kolom untuk label</option>
                            {labelColumns.map((col) => (
                                <option key={col.name} value={col.name}>
                                    {col.displayName}
                                </option>
                            ))}
                        </select>
                        {labelColumns.length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                Tidak ada kolom yang cocok untuk sumbu X. Tambahkan kolom dengan tipe text, select, atau date.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Sumbu Y (Nilai) <span className="text-red-500">*</span>
                        </label>
                        {numericColumns.length === 0 ? (
                            <p className="text-sm text-red-500">
                                Tidak ada kolom numerik tersedia. Tambahkan kolom dengan tipe number terlebih dahulu.
                            </p>
                        ) : (
                            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-200 p-3">
                                {numericColumns.map((col) => (
                                    <label key={col.name} className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={formData.yAxis.includes(col.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({
                                                        ...formData,
                                                        yAxis: [...formData.yAxis, col.name],
                                                    });
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        yAxis: formData.yAxis.filter((y) => y !== col.name),
                                                    });
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">{col.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {formData.yAxis.length > 0 && <p className="mt-1 text-sm text-gray-500">{formData.yAxis.length} kolom dipilih</p>}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={labelColumns.length === 0 || numericColumns.length === 0}
                            className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            Simpan
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`Grafik - ${table.name}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
                        <p className="text-sm text-green-700">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">{flash.error}</p>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link href="/admin/dynamic-tables" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Tabel
                        </Link>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900">{table.name}</h1>
                        <p className="mt-1 text-sm text-gray-600">Kelola grafik dan visualisasi data</p>
                    </div>

                    <div className="flex gap-2">
                        {!isAddingChart && (
                            <button
                                onClick={() => setIsAddingChart(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Grafik
                            </button>
                        )}
                        {charts.length > 0 && (
                            <button
                                onClick={handleSaveCharts}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                <Save className="h-4 w-4" />
                                Simpan Semua
                            </button>
                        )}
                    </div>
                </div>

                {/* Add Chart Form */}
                {isAddingChart && (
                    <div className="mb-6">
                        <ChartForm chart={newChart} onSave={handleAddChart} onCancel={() => setIsAddingChart(false)} />
                    </div>
                )}

                {/* Charts Display */}
                {tableData.length === 0 ? (
                    <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Data</h3>
                        <p className="mt-2 text-sm text-gray-500">Tambahkan data terlebih dahulu sebelum membuat grafik.</p>
                        <Link
                            href={`/admin/dynamic-tables/${table.id}/insert`}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
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
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
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
                                                <h3 className="text-lg font-semibold text-gray-900">{chart.name}</h3>
                                                <p className="text-sm text-gray-500">{chartTypes.find((t) => t.value === chart.type)?.label}</p>
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
        </div>
    );
}
