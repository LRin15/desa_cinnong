import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Database, FileJson, FileSpreadsheet, Table2 } from 'lucide-react';
import { useState } from 'react';

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

interface DynamicTable {
    id: number;
    name: string;
    table_name: string;
    description: string | null;
    columns: Column[];
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
    const [expandedTables, setExpandedTables] = useState<{ [key: number]: boolean }>({});
    const [downloadingTable, setDownloadingTable] = useState<number | null>(null);

    // Ambil nama desa dari settings atau gunakan default
    const namaDesa = settings.nama_desa || 'Desa Cinnong';

    const toggleTable = (tableId: number) => {
        setExpandedTables((prev) => ({
            ...prev,
            [tableId]: !prev[tableId],
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

            // Ambil blob dari response
            const blob = await response.blob();

            // Buat URL untuk blob
            const url = window.URL.createObjectURL(blob);

            // Buat link download
            const link = document.createElement('a');
            link.href = url;

            // Set nama file dari header Content-Disposition atau default
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : `table_${table.id}.${format === 'excel' ? 'csv' : 'json'}`;

            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
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
        <MainLayout>
            <Head title={`Data ${namaDesa} ${tahun}`} />

            {/* Header Halaman */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col gap-4 border-b-4 border-[#f97316] bg-[#ffedd5] p-4 text-gray-900 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#9a3412] sm:text-3xl">Data {namaDesa}</h1>
                                <p className="mt-2 text-sm text-gray-700 sm:text-base">
                                    Laporan semua data {namaDesa} {tahun}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-[#f97316]" />
                                <span className="text-lg font-bold text-[#f97316]">{tables.length} Tabel</span>
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
                                const organizedHeaders = organizeHeaders(table.columns);
                                const allFields = organizedHeaders.flatMap((h) => h.fields);

                                return (
                                    <div key={table.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                                        {/* Header Tabel */}
                                        <div className="flex flex-col gap-3 border-b-4 border-[#f97316] bg-[#ffedd5] p-4 sm:p-6">
                                            <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleTable(table.id)}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        {expandedTables[table.id] ? (
                                                            <ChevronDown className="h-5 w-5 text-[#9a3412]" />
                                                        ) : (
                                                            <ChevronRight className="h-5 w-5 text-[#9a3412]" />
                                                        )}
                                                        <h2 className="text-xl font-bold text-[#9a3412] sm:text-2xl">{table.name}</h2>
                                                    </div>
                                                    {table.description && <p className="mt-2 ml-8 text-sm text-gray-700">{table.description}</p>}
                                                </div>
                                                <div className="flex gap-4 text-sm">
                                                    <div className="text-center">
                                                        <div className="font-bold text-[#f97316]">{table.columns_count}</div>
                                                        <div className="text-gray-600">Kolom</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-bold text-[#f97316]">{table.data_count}</div>
                                                        <div className="text-gray-600">Data</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Download Buttons */}
                                            {table.data.length > 0 && (
                                                <div className="ml-8 flex flex-wrap gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(table, 'excel');
                                                        }}
                                                        disabled={downloadingTable === table.id}
                                                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                                                    >
                                                        <FileSpreadsheet className="h-4 w-4" />
                                                        {downloadingTable === table.id ? 'Mengunduh...' : 'Download CSV'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(table, 'json');
                                                        }}
                                                        disabled={downloadingTable === table.id}
                                                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                                                    >
                                                        <FileJson className="h-4 w-4" />
                                                        {downloadingTable === table.id ? 'Mengunduh...' : 'Download JSON'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Konten Tabel */}
                                        {expandedTables[table.id] && (
                                            <div className="p-4 sm:p-6">
                                                {table.data.length === 0 ? (
                                                    <div className="py-8 text-center text-gray-500">Belum ada data pada tabel ini</div>
                                                ) : (
                                                    <>
                                                        <div className="mb-3 text-xs text-gray-500 sm:hidden">
                                                            ← Geser tabel untuk melihat data lengkap →
                                                        </div>

                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th
                                                                            rowSpan={2}
                                                                            className="border-r border-gray-200 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6"
                                                                        >
                                                                            No
                                                                        </th>
                                                                        {organizedHeaders.map((header, idx) => (
                                                                            <th
                                                                                key={idx}
                                                                                rowSpan={header.type === 'regular' ? 2 : 1}
                                                                                colSpan={header.type === 'group' ? header.fields.length : 1}
                                                                                className={`border-r border-gray-200 px-4 py-3 text-${header.type === 'group' ? 'center' : 'left'} text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6 ${header.type === 'group' ? 'bg-gray-100' : ''}`}
                                                                            >
                                                                                {header.name}
                                                                            </th>
                                                                        ))}
                                                                        {table.has_column_total && (
                                                                            <th
                                                                                rowSpan={2}
                                                                                className="border-r border-gray-200 bg-yellow-50 px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6"
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
                                                                                        className="border-r border-gray-200 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6"
                                                                                    >
                                                                                        {field.displayName}
                                                                                    </th>
                                                                                )),
                                                                            )}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                                    {table.data.map((row, idx) => {
                                                                        const flatData = flattenData(row.data);
                                                                        const rowTotal = table.has_column_total
                                                                            ? calculateRowTotal(flatData, allFields)
                                                                            : 0;

                                                                        return (
                                                                            <tr key={row.id} className="hover:bg-gray-50">
                                                                                <td className="border-r border-gray-200 px-4 py-4 text-sm whitespace-nowrap text-gray-900 sm:px-6">
                                                                                    {idx + 1}
                                                                                </td>
                                                                                {organizedHeaders.map((header, colIdx) =>
                                                                                    header.fields.map((field, fieldIdx) => (
                                                                                        <td
                                                                                            key={`${colIdx}-${fieldIdx}`}
                                                                                            className="border-r border-gray-200 px-4 py-4 text-sm sm:px-6"
                                                                                        >
                                                                                            {formatValue(flatData[field.fieldName], field.column)}
                                                                                        </td>
                                                                                    )),
                                                                                )}
                                                                                {table.has_column_total && (
                                                                                    <td className="border-r border-gray-200 bg-yellow-50 px-4 py-4 text-center text-sm font-semibold whitespace-nowrap sm:px-6">
                                                                                        {rowTotal.toLocaleString('id-ID', {
                                                                                            minimumFractionDigits: 2,
                                                                                            maximumFractionDigits: 2,
                                                                                        })}
                                                                                    </td>
                                                                                )}
                                                                            </tr>
                                                                        );
                                                                    })}

                                                                    {/* Row Total */}
                                                                    {table.has_row_total && (
                                                                        <tr className="bg-blue-50 font-semibold">
                                                                            <td className="border-r border-gray-200 px-4 py-4 text-center text-sm uppercase sm:px-6">
                                                                                Total
                                                                            </td>
                                                                            {organizedHeaders.map((header, colIdx) =>
                                                                                header.fields.map((field, fieldIdx) => (
                                                                                    <td
                                                                                        key={`total-${colIdx}-${fieldIdx}`}
                                                                                        className="border-r border-gray-200 px-4 py-4 text-center text-sm sm:px-6"
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
                                                                                <td className="border-r border-gray-200 bg-yellow-100 px-4 py-4 text-center text-sm sm:px-6">
                                                                                    {allFields
                                                                                        .filter((f) => f.column.type === 'number')
                                                                                        .reduce(
                                                                                            (sum, field) =>
                                                                                                sum +
                                                                                                calculateColumnTotal(field.fieldName, table.data),
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
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
