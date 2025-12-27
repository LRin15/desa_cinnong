// resources/js/Pages/Admin/DynamicTables/Insert.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Column {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    required: boolean;
    options?: string;
}

interface TableData {
    id: number;
    name: string;
    description: string | null;
    columns: Column[];
}

interface DataRow {
    id: number;
    data: Record<string, any>;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface InsertPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    table: TableData;
    tableData: {
        data: DataRow[];
        links?: PaginationLink[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        from?: number;
        to?: number;
    };
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function Insert() {
    let pageProps: InsertPageProps;

    try {
        pageProps = usePage<InsertPageProps>().props;
    } catch (error) {
        console.error('Error getting page props:', error);
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-red-600 sm:text-2xl">Error Loading Page</h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">Please check the console for details.</p>
                </div>
            </div>
        );
    }

    const { auth, table, tableData, errors, flash } = pageProps;

    const [showForm, setShowForm] = useState(false);

    if (!auth || !auth.user) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-red-600 sm:text-2xl">Authentication Error</h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">User authentication data is missing.</p>
                </div>
            </div>
        );
    }

    if (!table) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-red-600 sm:text-2xl">Tabel Not Found</h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">The table data is missing.</p>
                    <Link
                        href={route('admin.dynamic-tables.index')}
                        className="mt-4 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700"
                    >
                        Kembali ke Daftar Tabel
                    </Link>
                </div>
            </div>
        );
    }

    // Initialize form data based on columns
    const initialData: Record<string, any> = {};
    table.columns.forEach((col) => {
        initialData[col.name] = '';
    });

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors: formErrors,
    } = useForm<{
        data: Record<string, any>; // Tipe eksplisit agar useForm tahu struktur data.
    }>({
        data: initialData,
    });

    type AllErrorsType = Record<string, string | undefined>;

    const allErrors: AllErrorsType = {
        ...errors,
        ...formErrors,
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.dynamic-tables.insert-data', table.id), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleDelete = (row: DataRow) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('admin.dynamic-tables.delete-data', { dynamicTable: table.id, data: row.id }), {
                onSuccess: () => {
                    // Success handled by flash messages
                },
                onError: (errors) => {
                    console.error('Error deleting data:', errors);
                    alert('Terjadi kesalahan saat menghapus data. Silakan coba lagi.');
                },
            });
        }
    };

    const renderInput = (column: Column) => {
        const value = data.data[column.name] || '';

        switch (column.type) {
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => setData('data', { ...data.data, [column.name]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        rows={3}
                        required={column.required}
                    />
                );
            case 'select':
                const options = column.options ? column.options.split(',').map((opt) => opt.trim()) : [];
                return (
                    <select
                        value={value}
                        onChange={(e) => setData('data', { ...data.data, [column.name]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        required={column.required}
                    >
                        <option value="">Pilih {column.name}</option>
                        {options.map((opt, idx) => (
                            <option key={idx} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => setData('data', { ...data.data, [column.name]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        required={column.required}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setData('data', { ...data.data, [column.name]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        required={column.required}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setData('data', { ...data.data, [column.name]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        required={column.required}
                    />
                );
        }
    };

    const dataArray = Array.isArray(tableData?.data) ? tableData.data : [];

    return (
        <AuthenticatedLayout auth={auth} title={`Isi Data: ${table.name}`}>
            <Head title={`Isi Data: ${table.name}`} />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.dynamic-tables.index')}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 sm:h-10 sm:w-10"
                            title="Kembali ke Daftar Tabel"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Isi Data: {table.name}</h1>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">{table.description || 'Tambah dan kelola data tabel'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:px-4"
                    >
                        <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                        Tambah Data
                    </button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 sm:p-4">
                        <p className="text-sm text-green-700 sm:text-base">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 sm:p-4">
                        <p className="text-sm text-red-700 sm:text-base">{flash.error}</p>
                    </div>
                )}

                {/* Add Data Form */}
                {showForm && (
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Tambah Data Baru</h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600" title="Tutup Form">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                {table.columns.map((column, index) => (
                                    <div key={index}>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {column.name} {column.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {renderInput(column)}
                                        {allErrors[`data.${column.name}`] && (
                                            <p className="mt-1 text-sm text-red-600">{allErrors[`data.${column.name}`]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setShowForm(false);
                                    }}
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Data Table */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Data Tersimpan</h2>
                        {tableData.total !== undefined && <p className="mt-1 text-xs text-gray-500 sm:text-sm">Total {tableData.total} data</p>}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">No</th>
                                    {table.columns.map((col, idx) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6"
                                        >
                                            {col.name}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {dataArray.length === 0 ? (
                                    <tr>
                                        <td colSpan={table.columns.length + 2} className="px-4 py-8 text-center sm:px-6">
                                            <p className="text-sm text-gray-500">Belum ada data. Klik tombol "Tambah Data" untuk mulai.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    dataArray.map((row, idx) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900 sm:px-6">
                                                {tableData.from ? tableData.from + idx : idx + 1}
                                            </td>
                                            {table.columns.map((col, colIdx) => (
                                                <td key={colIdx} className="px-4 py-4 text-sm text-gray-900 sm:px-6">
                                                    {row.data[col.name] || '-'}
                                                </td>
                                            ))}
                                            <td className="px-4 py-4 text-right text-sm font-medium whitespace-nowrap sm:px-6">
                                                <button
                                                    onClick={() => handleDelete(row)}
                                                    className="text-red-600 transition-colors hover:text-red-900"
                                                    type="button"
                                                    title="Hapus Data"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {tableData.links && tableData.links.length > 0 && dataArray.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                            <Pagination links={tableData.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
