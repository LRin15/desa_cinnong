// resources/js/Pages/Admin/DynamicTables/Insert.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Edit2, Plus, Trash2, X } from 'lucide-react';
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
    name: string;
    description: string | null;
    columns: Column[];
    has_column_total?: boolean;
    has_row_total?: boolean;
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

    const [editingRowId, setEditingRowId] = useState<number | 'new' | null>(null);
    const [editingData, setEditingData] = useState<Record<string, any>>({});

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

    const initializeFormData = (columns: Column[], prefix: string = ''): Record<string, any> => {
        const formData: Record<string, any> = {};
        columns.forEach((col) => {
            const fieldName = prefix ? `${prefix}.${col.name}` : col.name;
            if (col.type === 'group' && col.subColumns) {
                Object.assign(formData, initializeFormData(col.subColumns, fieldName));
            } else {
                formData[fieldName] = '';
            }
        });
        return formData;
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

    const unflattenData = (flatData: Record<string, any>): Record<string, any> => {
        const result: Record<string, any> = {};

        for (const key in flatData) {
            const keys = key.split('.');
            let current = result;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = flatData[key];
        }

        return result;
    };

    // Calculate row total (sum of all number columns in a row)
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

    // Calculate column total (sum of all rows for a specific column)
    const calculateColumnTotal = (fieldName: string, dataArray: DataRow[]) => {
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

    const organizedHeaders: Array<{
        type: 'regular' | 'group';
        name: string;
        fields: Array<{ fieldName: string; displayName: string; column: Column }>;
    }> = [];

    table.columns.forEach((col) => {
        if (col.type === 'group' && col.subColumns) {
            const groupFields = col.subColumns.map((subCol) => ({
                fieldName: `${col.name}.${subCol.name}`,
                displayName: subCol.name,
                column: subCol,
            }));
            organizedHeaders.push({
                type: 'group',
                name: col.name,
                fields: groupFields,
            });
        } else {
            organizedHeaders.push({
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

    // Get all fields in flat structure
    const allFields = organizedHeaders.flatMap((h) => h.fields);

    const dataArray = Array.isArray(tableData?.data) ? tableData.data : [];

    const handleAddNew = () => {
        const initialData = initializeFormData(table.columns);
        setEditingData(initialData);
        setEditingRowId('new');
    };

    const handleEdit = (row: DataRow) => {
        const flatData = flattenData(row.data);
        setEditingData(flatData);
        setEditingRowId(row.id);
    };

    const handleCancel = () => {
        setEditingRowId(null);
        setEditingData({});
    };

    const handleSave = () => {
        const nestedData = unflattenData(editingData);

        if (editingRowId === 'new') {
            router.post(
                route('admin.dynamic-tables.insert-data', table.id),
                { data: nestedData },
                {
                    onSuccess: () => {
                        setEditingRowId(null);
                        setEditingData({});
                    },
                    onError: (errors) => {
                        console.error('Error saving data:', errors);
                    },
                },
            );
        } else if (editingRowId) {
            router.put(
                route('admin.dynamic-tables.update-data', { dynamicTable: table.id, data: editingRowId }),
                { data: nestedData },
                {
                    onSuccess: () => {
                        setEditingRowId(null);
                        setEditingData({});
                    },
                    onError: (errors) => {
                        console.error('Error updating data:', errors);
                    },
                },
            );
        }
    };

    const handleDelete = (row: DataRow) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('admin.dynamic-tables.delete-data', { dynamicTable: table.id, data: row.id }), {
                onSuccess: () => {},
                onError: (errors) => {
                    console.error('Error deleting data:', errors);
                    alert('Terjadi kesalahan saat menghapus data. Silakan coba lagi.');
                },
            });
        }
    };

    const updateFieldValue = (fieldName: string, value: any) => {
        setEditingData({ ...editingData, [fieldName]: value });
    };

    const renderCell = (fieldName: string, column: Column, value: any, isEditing: boolean) => {
        if (!isEditing) {
            return <span>{value || '-'}</span>;
        }

        const currentValue = editingData[fieldName] || '';

        switch (column.type) {
            case 'textarea':
                return (
                    <textarea
                        value={currentValue}
                        onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                        className="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        rows={2}
                        required={column.required}
                    />
                );
            case 'select':
                const options = column.options ? column.options.split(',').map((opt) => opt.trim()) : [];
                return (
                    <select
                        value={currentValue}
                        onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                        className="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        required={column.required}
                    >
                        <option value="">Pilih</option>
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
                        value={currentValue}
                        onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                        className="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        required={column.required}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={currentValue}
                        onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                        className="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        required={column.required}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                        className="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        required={column.required}
                    />
                );
        }
    };

    return (
        <AuthenticatedLayout auth={auth} title={`Isi Data: ${table.name}`}>
            <Head title={`Isi Data: ${table.name}`} />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
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
                        onClick={handleAddNew}
                        disabled={editingRowId !== null}
                        className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                    >
                        <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                        Tambah Data
                    </button>
                </div>

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

                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Data Tersimpan</h2>
                        {tableData.total !== undefined && <p className="mt-1 text-xs text-gray-500 sm:text-sm">Total {tableData.total} data</p>}
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
                                    <th
                                        rowSpan={2}
                                        className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6"
                                    >
                                        Aksi
                                    </th>
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
                                {dataArray.length === 0 && editingRowId !== 'new' ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                organizedHeaders.reduce((total, h) => total + h.fields.length, 0) +
                                                2 +
                                                (table.has_column_total ? 1 : 0)
                                            }
                                            className="px-4 py-8 text-center sm:px-6"
                                        >
                                            <p className="text-sm text-gray-500">Belum ada data. Klik tombol "Tambah Data" untuk mulai.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    dataArray.map((row, idx) => {
                                        const flatData = flattenData(row.data);
                                        const isEditing = editingRowId === row.id;
                                        const rowTotal = table.has_column_total ? calculateRowTotal(flatData, allFields) : 0;

                                        return (
                                            <tr key={row.id} className={isEditing ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                                                <td className="border-r border-gray-200 px-4 py-4 text-sm whitespace-nowrap text-gray-900 sm:px-6">
                                                    {tableData.from ? tableData.from + idx : idx + 1}
                                                </td>
                                                {organizedHeaders.map((header, colIdx) =>
                                                    header.fields.map((field, fieldIdx) => (
                                                        <td
                                                            key={`${colIdx}-${fieldIdx}`}
                                                            className="border-r border-gray-200 px-4 py-4 text-sm sm:px-6"
                                                        >
                                                            {renderCell(field.fieldName, field.column, flatData[field.fieldName], isEditing)}
                                                        </td>
                                                    )),
                                                )}
                                                {table.has_column_total && (
                                                    <td className="border-r border-gray-200 bg-yellow-50 px-4 py-4 text-center text-sm font-semibold whitespace-nowrap sm:px-6">
                                                        {isEditing ? calculateRowTotal(editingData, allFields).toFixed(2) : rowTotal.toFixed(2)}
                                                    </td>
                                                )}
                                                <td className="px-4 py-4 text-center text-sm font-medium whitespace-nowrap sm:px-6">
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={handleSave}
                                                                className="text-green-600 transition-colors hover:text-green-900"
                                                                type="button"
                                                                title="Simpan"
                                                            >
                                                                <Check className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                className="text-gray-600 transition-colors hover:text-gray-900"
                                                                type="button"
                                                                title="Batal"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(row)}
                                                                disabled={editingRowId !== null}
                                                                className="text-blue-600 transition-colors hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                                type="button"
                                                                title="Edit Data"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(row)}
                                                                disabled={editingRowId !== null}
                                                                className="text-red-600 transition-colors hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                                type="button"
                                                                title="Hapus Data"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                {editingRowId === 'new' && (
                                    <tr className="bg-blue-50">
                                        <td className="border-r border-gray-200 px-4 py-4 text-sm whitespace-nowrap text-gray-900 sm:px-6">
                                            <span className="font-semibold text-blue-600">Baru</span>
                                        </td>
                                        {organizedHeaders.map((header, colIdx) =>
                                            header.fields.map((field, fieldIdx) => (
                                                <td key={`${colIdx}-${fieldIdx}`} className="border-r border-gray-200 px-4 py-4 text-sm sm:px-6">
                                                    {renderCell(field.fieldName, field.column, '', true)}
                                                </td>
                                            )),
                                        )}
                                        {table.has_column_total && (
                                            <td className="border-r border-gray-200 bg-yellow-50 px-4 py-4 text-center text-sm font-semibold whitespace-nowrap sm:px-6">
                                                {calculateRowTotal(editingData, allFields).toFixed(2)}
                                            </td>
                                        )}
                                        <td className="px-4 py-4 text-center text-sm font-medium whitespace-nowrap sm:px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="text-green-600 transition-colors hover:text-green-900"
                                                    type="button"
                                                    title="Simpan"
                                                >
                                                    <Check className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="text-gray-600 transition-colors hover:text-gray-900"
                                                    type="button"
                                                    title="Batal"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {/* Row Total */}
                                {table.has_row_total && dataArray.length > 0 && (
                                    <tr className="bg-blue-50 font-semibold">
                                        <td className="border-r border-gray-200 px-4 py-4 text-center text-sm uppercase sm:px-6" colSpan={1}>
                                            Total
                                        </td>
                                        {organizedHeaders.map((header, colIdx) =>
                                            header.fields.map((field, fieldIdx) => (
                                                <td
                                                    key={`total-${colIdx}-${fieldIdx}`}
                                                    className="border-r border-gray-200 px-4 py-4 text-center text-sm sm:px-6"
                                                >
                                                    {field.column.type === 'number'
                                                        ? calculateColumnTotal(field.fieldName, dataArray).toFixed(2)
                                                        : '-'}
                                                </td>
                                            )),
                                        )}
                                        {table.has_column_total && (
                                            <td className="border-r border-gray-200 bg-yellow-100 px-4 py-4 text-center text-sm sm:px-6">
                                                {allFields
                                                    .filter((f) => f.column.type === 'number')
                                                    .reduce((sum, field) => sum + calculateColumnTotal(field.fieldName, dataArray), 0)
                                                    .toFixed(2)}
                                            </td>
                                        )}
                                        <td className="px-4 py-4 text-center text-sm sm:px-6">-</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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
