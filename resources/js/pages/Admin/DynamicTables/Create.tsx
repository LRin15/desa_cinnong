// resources/js/Pages/Admin/DynamicTables/Create.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, ChevronRight, Folder, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Column {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'group';
    required: boolean;
    options?: string;
    subColumns?: Column[];
    [key: string]: any;
}

interface CreatePageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    errors?: {
        name?: string;
        description?: string;
        columns?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const COLUMN_TYPES = [
    { value: 'text', label: 'Teks' },
    { value: 'number', label: 'Angka' },
    { value: 'date', label: 'Tanggal' },
    { value: 'select', label: 'Pilihan (Dropdown)' },
    { value: 'textarea', label: 'Teks Panjang' },
    { value: 'group', label: 'Grup (Sub Kolom)' },
];

export default function Create() {
    let pageProps: CreatePageProps;

    try {
        pageProps = usePage<CreatePageProps>().props;
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

    const { auth, errors, flash } = pageProps;

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

    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
    } = useForm<{
        name: string;
        description: string;
        columns: Column[];
        has_column_total: boolean;
        has_row_total: boolean;
    }>({
        name: '',
        description: '',
        columns: [{ name: '', type: 'text', required: false, options: '' }],
        has_column_total: false,
        has_row_total: false,
    });

    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const allErrors = { ...errors, ...formErrors };

    const toggleGroup = (path: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedGroups(newExpanded);
    };

    const addColumn = (path: number[] = []) => {
        const newColumns = [...data.columns];
        const newColumn: Column = { name: '', type: 'text', required: false, options: '' };

        if (path.length === 0) {
            newColumns.push(newColumn);
        } else {
            const parent = getColumnByPath(newColumns, path);
            if (parent && parent.type === 'group') {
                if (!parent.subColumns) parent.subColumns = [];
                parent.subColumns.push(newColumn);
            }
        }

        setData('columns', newColumns);
    };

    const removeColumn = (path: number[]) => {
        const newColumns = [...data.columns];

        if (path.length === 1) {
            if (newColumns.length > 1) {
                newColumns.splice(path[0], 1);
            }
        } else {
            const parentPath = path.slice(0, -1);
            const parent = getColumnByPath(newColumns, parentPath);
            if (parent && parent.subColumns && parent.subColumns.length > 1) {
                parent.subColumns.splice(path[path.length - 1], 1);
            }
        }

        setData('columns', newColumns);
    };

    const updateColumn = (path: number[], field: keyof Column, value: any) => {
        const newColumns = [...data.columns];
        const column = getColumnByPath(newColumns, path);

        if (column) {
            if (field === 'type') {
                column[field] = value;
                if (value === 'group') {
                    column.subColumns = column.subColumns || [{ name: '', type: 'text', required: false, options: '' }];
                    setExpandedGroups(new Set(expandedGroups).add(path.join('-')));
                } else {
                    delete column.subColumns;
                }
            } else {
                column[field] = value;
            }
        }

        setData('columns', newColumns);
    };

    const getColumnByPath = (columns: Column[], path: number[]): Column | null => {
        let current: any = { subColumns: columns };

        for (const index of path) {
            if (!current.subColumns || !current.subColumns[index]) return null;
            current = current.subColumns[index];
        }

        return current;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.dynamic-tables.store'));
    };

    const renderColumn = (column: Column, path: number[], level: number = 0) => {
        const pathKey = path.join('-');
        const isExpanded = expandedGroups.has(pathKey);
        const canRemove = path.length === 1 ? data.columns.length > 1 : true;

        return (
            <div key={pathKey} className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4" style={{ marginLeft: `${level * 20}px` }}>
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {column.type === 'group' && (
                                <button type="button" onClick={() => toggleGroup(pathKey)} className="text-gray-600 hover:text-gray-800">
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            )}
                            {column.type === 'group' && <Folder className="h-4 w-4 text-blue-600" />}
                            <span className="text-sm font-medium text-gray-700">
                                {level === 0 ? `Kolom ${path[0] + 1}` : column.name || 'Sub Kolom'}
                            </span>
                        </div>
                        {canRemove && (
                            <button
                                type="button"
                                onClick={() => removeColumn(path)}
                                className="text-red-600 transition-colors hover:text-red-700"
                                title="Hapus Kolom"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Nama Kolom</label>
                            <input
                                type="text"
                                value={column.name}
                                onChange={(e) => updateColumn(path, 'name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                placeholder="Contoh: Nama, Umur, Alamat"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600">Tipe Data</label>
                            <select
                                value={column.type}
                                onChange={(e) => updateColumn(path, 'type', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            >
                                {COLUMN_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {column.type === 'select' && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600">Opsi Pilihan (pisahkan dengan koma)</label>
                                <input
                                    type="text"
                                    value={column.options || ''}
                                    onChange={(e) => updateColumn(path, 'options', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                    placeholder="Contoh: Pilihan 1, Pilihan 2, Pilihan 3"
                                />
                            </div>
                        )}

                        {column.type !== 'group' && (
                            <div className="flex items-center sm:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={column.required}
                                    onChange={(e) => updateColumn(path, 'required', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Wajib diisi</label>
                            </div>
                        )}
                    </div>

                    {column.type === 'group' && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <button
                                type="button"
                                onClick={() => addColumn(path)}
                                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                            >
                                <Plus className="h-3 w-3" />
                                Tambah Sub Kolom
                            </button>
                        </div>
                    )}
                </div>

                {column.type === 'group' && isExpanded && column.subColumns && (
                    <div className="space-y-3">
                        {column.subColumns.map((subCol, subIndex) => renderColumn(subCol, [...path, subIndex], level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout auth={auth} title="Buat Tabel Baru">
            <Head title="Buat Tabel Baru" />
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
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Buat Tabel Baru</h1>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Definisikan struktur tabel dengan sub kolom</p>
                        </div>
                    </div>
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
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Informasi Tabel</h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Definisikan nama dan struktur kolom tabel</p>
                    </div>

                    <form onSubmit={submit} className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Nama Tabel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:text-base"
                                    placeholder="Contoh: Data Penduduk, Inventaris Desa"
                                    required
                                />
                                {allErrors.name && <p className="mt-2 text-sm text-red-600">{allErrors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Deskripsi
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:text-base"
                                    placeholder="Deskripsi singkat tentang tabel ini..."
                                />
                                {allErrors.description && <p className="mt-2 text-sm text-red-600">{allErrors.description}</p>}
                            </div>

                            {/* Total Options */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Opsi Total Otomatis</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="has_column_total"
                                            checked={data.has_column_total}
                                            onChange={(e) => setData('has_column_total', e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="has_column_total" className="ml-2">
                                            <span className="text-sm font-medium text-gray-700">Tambah Kolom Total (Kanan)</span>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Menambahkan kolom total otomatis di ujung kanan yang menjumlahkan semua kolom angka dalam setiap baris
                                            </p>
                                        </label>
                                    </div>
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="has_row_total"
                                            checked={data.has_row_total}
                                            onChange={(e) => setData('has_row_total', e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="has_row_total" className="ml-2">
                                            <span className="text-sm font-medium text-gray-700">Tambah Baris Total (Bawah)</span>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Menambahkan baris total otomatis di paling bawah yang menjumlahkan semua kolom angka
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Kolom Tabel <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => addColumn()}
                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Kolom
                                    </button>
                                </div>

                                <div className="space-y-4">{data.columns.map((column, index) => renderColumn(column, [index]))}</div>

                                {allErrors.columns && <p className="mt-2 text-sm text-red-600">{allErrors.columns}</p>}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.dynamic-tables.index')}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Tabel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
