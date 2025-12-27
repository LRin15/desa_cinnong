import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Database, Table2 } from 'lucide-react';
import { useState } from 'react';

interface ColumnDefinition {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    required: boolean;
    options?: string;
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
    columns: ColumnDefinition[];
    data: TableData[];
    columns_count: number;
    data_count: number;
    created_at: string;
}

interface DataDesaProps {
    tables: DynamicTable[];
    tahun: string | number;
}

export default function DataDesa({ tables, tahun }: DataDesaProps) {
    const [expandedTables, setExpandedTables] = useState<{ [key: number]: boolean }>({});

    const toggleTable = (tableId: number) => {
        setExpandedTables((prev) => ({
            ...prev,
            [tableId]: !prev[tableId],
        }));
    };

    const formatValue = (value: any, column: ColumnDefinition): string => {
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

    const calculateColumnTotal = (tableData: TableData[], columnName: string, columnType: string): string => {
        if (columnType !== 'number') return '-';

        const total = tableData.reduce((sum, row) => {
            const value = Number(row.data[columnName]) || 0;
            return sum + value;
        }, 0);

        return total.toLocaleString('id-ID');
    };

    return (
        <MainLayout>
            <Head title={`Data Desa Cinnong ${tahun}`} />

            {/* Header Halaman */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col gap-4 border-b-4 border-[#f97316] bg-[#ffedd5] p-4 text-gray-900 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#9a3412] sm:text-3xl">Data Desa Cinnong</h1>
                                <p className="mt-2 text-sm text-gray-700 sm:text-base">Laporan semua data desa untuk tahun {tahun}</p>
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
                            {tables.map((table) => (
                                <div key={table.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    {/* Header Tabel */}
                                    <div
                                        className="flex cursor-pointer items-center justify-between border-b-4 border-[#f97316] bg-[#ffedd5] p-4 transition-colors hover:bg-[#fed7aa] sm:p-6"
                                        onClick={() => toggleTable(table.id)}
                                    >
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

                                    {/* Konten Tabel */}
                                    {expandedTables[table.id] && (
                                        <div className="p-4 sm:p-6">
                                            {table.data.length === 0 ? (
                                                <div className="py-8 text-center text-gray-500">Belum ada data pada tabel ini</div>
                                            ) : (
                                                <>
                                                    {/* Mobile: Scroll hint */}
                                                    <div className="mb-3 text-xs text-gray-500 sm:hidden">
                                                        ← Geser tabel untuk melihat data lengkap →
                                                    </div>

                                                    <div className="overflow-x-auto">
                                                        <table
                                                            className="min-w-full divide-y divide-gray-300 border border-gray-400"
                                                            style={{ minWidth: '600px' }}
                                                        >
                                                            <thead className="bg-[#ffedd5] text-xs font-bold sm:text-sm">
                                                                <tr>
                                                                    <th className="border border-gray-400 px-3 py-3 text-center">NO.</th>
                                                                    {table.columns.map((column, idx) => (
                                                                        <th key={idx} className="border border-gray-400 px-4 py-3 text-left">
                                                                            {column.name}
                                                                            {column.required && <span className="ml-1 text-red-500">*</span>}
                                                                        </th>
                                                                    ))}
                                                                    <th className="border border-gray-400 px-3 py-3 text-center">TANGGAL INPUT</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200 bg-white text-xs sm:text-sm">
                                                                {table.data.map((row, idx) => (
                                                                    <tr key={row.id} className="hover:bg-[#fff7ed]">
                                                                        <td className="border border-gray-400 px-3 py-2 text-center">{idx + 1}</td>
                                                                        {table.columns.map((column, colIdx) => (
                                                                            <td
                                                                                key={colIdx}
                                                                                className={`border border-gray-400 px-4 py-2 ${
                                                                                    column.type === 'number' ? 'text-right' : 'text-left'
                                                                                }`}
                                                                            >
                                                                                {formatValue(row.data[column.name], column)}
                                                                            </td>
                                                                        ))}
                                                                        <td className="border border-gray-400 px-3 py-2 text-center text-gray-600">
                                                                            {row.created_at}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot className="bg-[#ffedd5] text-xs font-bold sm:text-sm">
                                                                <tr>
                                                                    <td className="border border-gray-400 px-3 py-3 text-center" colSpan={1}>
                                                                        TOTAL
                                                                    </td>
                                                                    {table.columns.map((column, idx) => (
                                                                        <td
                                                                            key={idx}
                                                                            className={`border border-gray-400 px-4 py-3 ${
                                                                                column.type === 'number' ? 'bg-[#fecaca] text-right' : 'text-center'
                                                                            }`}
                                                                        >
                                                                            {calculateColumnTotal(table.data, column.name, column.type)}
                                                                        </td>
                                                                    ))}
                                                                    <td className="border border-gray-400 px-3 py-3" />
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
