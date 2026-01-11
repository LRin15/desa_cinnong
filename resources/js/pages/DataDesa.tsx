import { Head } from '@inertiajs/react';
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
import { BarChart3, Database, FileJson, FileSpreadsheet, Table2 } from 'lucide-react';
import { useState } from 'react';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

interface Column {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'group';
    required: boolean;
    options?: string;
    subColumns?: Column[];
}

interface TableData {
    id: number;
    data: { [key: string]: any };
    created_at: string;
}

interface ChartConfig {
    id: string;
    name: string;
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'radar';
    xAxis: string;
    yAxis: string[];
}

interface DynamicTable {
    id: number;
    name: string;
    table_name: string;
    description: string | null;
    columns: Column[];
    charts: ChartConfig[];
    data: TableData[];
    columns_count: number;
    data_count: number;
    has_column_total?: boolean;
    has_row_total?: boolean;
    created_at: string;
}

interface Settings {
    nama_desa?: string;
    [key: string]: string | undefined;
}

interface DataDesaProps {
    tables: DynamicTable[];
    tahun: string | number;
    settings: Settings;
}

export default function DataDesa({ tables, tahun, settings }: DataDesaProps) {
    const [downloadingTable, setDownloadingTable] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<Record<number, 'table' | 'chart'>>({});

    const namaDesa = settings.nama_desa || 'Desa Cinnong';

    const toggleViewMode = (tableId: number) => {
        setViewMode((prev) => ({
            ...prev,
            [tableId]: prev[tableId] === 'chart' ? 'table' : 'chart',
        }));
    };

    const flattenData = (obj: Record<string, any>, prefix: string = ''): Record<string, any> => {
        const result: Record<string, any> = {};
        for (const key in obj) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                Object.assign(result, flattenData(value, newKey));
            } else {
                result[newKey] = value;
            }
        }
        return result;
    };

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const prepareChartData = (chartConfig: ChartConfig, tableData: TableData[]) => {
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

    const renderChart = (chartConfig: ChartConfig, tableData: TableData[]) => {
        const data = prepareChartData(chartConfig, tableData);
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

    const organizeHeaders = (
        columns: Column[],
    ): Array<{
        type: 'regular' | 'group';
        name: string;
        fields: Array<{ fieldName: string; displayName: string; column: Column }>;
    }> => {
        const organized: Array<{
            type: 'regular' | 'group';
            name: string;
            fields: Array<{ fieldName: string; displayName: string; column: Column }>;
        }> = [];

        columns.forEach((col) => {
            if (col.type === 'group' && col.subColumns) {
                const groupFields = col.subColumns.map((subCol) => ({
                    fieldName: `${col.name}.${subCol.name}`,
                    displayName: subCol.name,
                    column: subCol,
                }));
                organized.push({
                    type: 'group',
                    name: col.name,
                    fields: groupFields,
                });
            } else {
                organized.push({
                    type: 'regular',
                    name: col.name,
                    fields: [
                        {
                            fieldName: col.name,
                            displayName: col.name,
                            column: col,
                        },
                    ],
                });
            }
        });

        return organized;
    };

    const formatValue = (value: any, column: Column): string => {
        if (value === null || value === undefined || value === '') return '-';

        if (column.type === 'date') {
            try {
                const date = new Date(value);
                return date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                });
            } catch {
                return value;
            }
        }

        if (column.type === 'number') {
            return Number(value).toLocaleString('id-ID');
        }

        return String(value);
    };

    const calculateRowTotal = (flatData: Record<string, any>, fields: Array<{ fieldName: string; column: Column }>) => {
        let total = 0;
        fields.forEach((field) => {
            if (field.column.type === 'number') {
                const value = parseFloat(flatData[field.fieldName] || 0);
                if (!isNaN(value)) {
                    total += value;
                }
            }
        });
        return total;
    };

    const calculateColumnTotal = (fieldName: string, dataArray: TableData[]) => {
        let total = 0;
        dataArray.forEach((row) => {
            const flatData = flattenData(row.data);
            const value = parseFloat(flatData[fieldName] || 0);
            if (!isNaN(value)) {
                total += value;
            }
        });
        return total;
    };

    const handleDownload = async (table: DynamicTable, format: 'excel' | 'json') => {
        setDownloadingTable(table.id);

        try {
            const response = await fetch(`/data-desa/${table.id}/download?format=${format}`);

            if (!response.ok) {
                throw new Error('Download gagal');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : `table_${table.id}.${format === 'excel' ? 'csv' : 'json'}`;

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Terjadi kesalahan saat mengunduh data');
        } finally {
            setDownloadingTable(null);
        }
    };

    return (
        <div>
            <Head title={`Data ${namaDesa} ${tahun}`} />

            {/* Header Halaman */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col gap-4 border-b-4 border-orange-500 bg-orange-100 p-4 text-gray-900 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-8">
                            <div>
                                <h1 className="text-2xl font-bold text-orange-900 sm:text-3xl">Data {namaDesa}</h1>
                                <p className="mt-2 text-sm text-gray-700 sm:text-base">Laporan semua data desa {namaDesa}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-orange-500" />
                                <span className="text-lg font-bold text-orange-500">{tables.length} Tabel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daftar Tabel */}
            <div className="bg-slate-50 pb-8 sm:pb-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    {tables.length === 0 ? (
                        <div className="rounded-lg border bg-white p-8 text-center shadow-sm sm:p-12">
                            <Table2 className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum Ada Data</h3>
                            <p className="mt-2 text-sm text-gray-600">Belum ada tabel yang dibuat. Silakan buat tabel melalui dashboard admin.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tables.map((table) => {
                                const currentView = viewMode[table.id] || 'table';
                                const hasCharts = table.charts && table.charts.length > 0;
                                const organizedHeaders = organizeHeaders(table.columns);
                                const allFields = organizedHeaders.flatMap((h) => h.fields);

                                return (
                                    <div
                                        key={table.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        {/* Header Tabel */}
                                        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                                            <Table2 className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-xl font-bold text-gray-900">{table.name}</h2>
                                                            {table.description && <p className="mt-0.5 text-sm text-gray-600">{table.description}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-1.5 text-gray-600">
                                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                            <span className="font-medium">{table.columns_count}</span>
                                                            <span>kolom</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-600">
                                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                            <span className="font-medium">{table.data_count}</span>
                                                            <span>data</span>
                                                        </div>
                                                        {hasCharts && (
                                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                                                <span className="font-medium">{table.charts.length}</span>
                                                                <span>grafik</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {hasCharts && table.data.length > 0 && (
                                                        <button
                                                            onClick={() => toggleViewMode(table.id)}
                                                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-all ${
                                                                currentView === 'chart'
                                                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {currentView === 'chart' ? (
                                                                <>
                                                                    <Table2 className="h-4 w-4" />
                                                                    Tabel
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <BarChart3 className="h-4 w-4" />
                                                                    Grafik
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    {table.data.length > 0 && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownload(table, 'excel');
                                                                }}
                                                                disabled={downloadingTable === table.id}
                                                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-green-600 hover:to-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <FileSpreadsheet className="h-4 w-4" />
                                                                {downloadingTable === table.id ? 'Mengunduh...' : 'CSV'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownload(table, 'json');
                                                                }}
                                                                disabled={downloadingTable === table.id}
                                                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <FileJson className="h-4 w-4" />
                                                                {downloadingTable === table.id ? 'Mengunduh...' : 'JSON'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Konten */}
                                        <div className="p-6">
                                            {table.data.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                                    <Table2 className="mb-3 h-12 w-12 text-gray-300" />
                                                    <p className="text-sm">Belum ada data pada tabel ini</p>
                                                </div>
                                            ) : currentView === 'chart' && hasCharts ? (
                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                    {table.charts.map((chart) => (
                                                        <div key={chart.id} className="rounded-lg border bg-white p-6 shadow-sm">
                                                            <h3 className="mb-4 text-lg font-semibold text-gray-900">{chart.name}</h3>
                                                            <div className="aspect-video">{renderChart(chart, table.data)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mb-3 text-xs text-gray-500 sm:hidden">
                                                        ← Geser tabel untuk melihat data lengkap →
                                                    </div>

                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full border-collapse" style={{ fontFamily: 'Arial, sans-serif' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th
                                                                        rowSpan={2}
                                                                        className="border border-gray-400 bg-orange-100 px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase sm:px-6"
                                                                    >
                                                                        No.
                                                                    </th>
                                                                    {organizedHeaders.map((header, idx) => (
                                                                        <th
                                                                            key={idx}
                                                                            rowSpan={header.type === 'regular' ? 2 : 1}
                                                                            colSpan={header.type === 'group' ? header.fields.length : 1}
                                                                            className={`border border-gray-400 px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase sm:px-6 ${header.type === 'group' ? 'bg-orange-100' : 'bg-orange-100'}`}
                                                                        >
                                                                            {header.name}
                                                                        </th>
                                                                    ))}
                                                                    {table.has_column_total && (
                                                                        <th
                                                                            rowSpan={2}
                                                                            className="border border-gray-400 bg-orange-100 px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase sm:px-6"
                                                                        >
                                                                            Total
                                                                        </th>
                                                                    )}
                                                                </tr>
                                                                <tr>
                                                                    {organizedHeaders
                                                                        .filter((h) => h.type === 'group')
                                                                        .map((header) =>
                                                                            header.fields.map((field, idx) => (
                                                                                <th
                                                                                    key={idx}
                                                                                    className="border border-gray-400 bg-orange-100 px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase sm:px-6"
                                                                                >
                                                                                    {field.displayName}
                                                                                </th>
                                                                            )),
                                                                        )}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white">
                                                                {table.data.map((row, idx) => {
                                                                    const flatData = flattenData(row.data);
                                                                    const rowTotal = table.has_column_total
                                                                        ? calculateRowTotal(flatData, allFields)
                                                                        : 0;

                                                                    return (
                                                                        <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                            <td className="border border-gray-400 px-4 py-3 text-center text-sm text-gray-900 sm:px-6">
                                                                                {idx + 1}
                                                                            </td>
                                                                            {organizedHeaders.map((header, colIdx) =>
                                                                                header.fields.map((field, fieldIdx) => (
                                                                                    <td
                                                                                        key={`${colIdx}-${fieldIdx}`}
                                                                                        className="border border-gray-400 px-4 py-3 text-center text-sm text-gray-900 sm:px-6"
                                                                                    >
                                                                                        {formatValue(flatData[field.fieldName], field.column)}
                                                                                    </td>
                                                                                )),
                                                                            )}
                                                                            {table.has_column_total && (
                                                                                <td className="border border-gray-400 bg-orange-50 px-4 py-3 text-center text-sm font-semibold text-gray-900 sm:px-6">
                                                                                    {rowTotal.toLocaleString('id-ID', {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    })}
                                                                                </td>
                                                                            )}
                                                                        </tr>
                                                                    );
                                                                })}

                                                                {table.has_row_total && (
                                                                    <tr className="bg-blue-100 font-bold">
                                                                        <td className="border border-gray-400 px-4 py-3 text-center text-sm text-gray-900 uppercase sm:px-6">
                                                                            Total
                                                                        </td>
                                                                        {organizedHeaders.map((header, colIdx) =>
                                                                            header.fields.map((field, fieldIdx) => (
                                                                                <td
                                                                                    key={`total-${colIdx}-${fieldIdx}`}
                                                                                    className="border border-gray-400 px-4 py-3 text-center text-sm text-gray-900 sm:px-6"
                                                                                >
                                                                                    {field.column.type === 'number'
                                                                                        ? calculateColumnTotal(
                                                                                              field.fieldName,
                                                                                              table.data,
                                                                                          ).toLocaleString('id-ID', {
                                                                                              minimumFractionDigits: 2,
                                                                                              maximumFractionDigits: 2,
                                                                                          })
                                                                                        : '-'}
                                                                                </td>
                                                                            )),
                                                                        )}
                                                                        {table.has_column_total && (
                                                                            <td className="border border-gray-400 bg-orange-100 px-4 py-3 text-center text-sm text-gray-900 sm:px-6">
                                                                                {allFields
                                                                                    .filter((f) => f.column.type === 'number')
                                                                                    .reduce(
                                                                                        (sum, field) =>
                                                                                            sum + calculateColumnTotal(field.fieldName, table.data),
                                                                                        0,
                                                                                    )
                                                                                    .toLocaleString('id-ID', {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    })}
                                                                            </td>
                                                                        )}
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
