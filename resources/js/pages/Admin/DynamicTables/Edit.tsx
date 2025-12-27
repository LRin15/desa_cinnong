// resources/js/Pages/Admin/DynamicTables/Edit.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Column {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    required: boolean;
    options?: string;
    [key: string]: string | boolean | undefined;
}

interface TableData {
    id: number;
    name: string;
    description: string | null;
    columns: Column[];
}

interface EditPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    table: TableData;
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
];

export default function Edit() {
    let pageProps: EditPageProps;

    try {
        pageProps = usePage<EditPageProps>().props;
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

    const { auth, table, errors, flash } = pageProps;

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
        _method: string;
    }>({
        name: table.name || '',
        description: table.description || '',
        columns: table.columns || [{ name: '', type: 'text', required: false, options: '' }],
        _method: 'put',
    });

    const allErrors = { ...errors, ...formErrors };

    const addColumn = () => {
        setData('columns', [...data.columns, { name: '', type: 'text', required: false, options: '' }]);
    };

    const removeColumn = (index: number) => {
        if (data.columns.length > 1) {
            const newColumns = data.columns.filter((_, i) => i !== index);
            setData('columns', newColumns);
        }
    };

    const updateColumn = (index: number, field: keyof Column, value: any) => {
        const newColumns = [...data.columns];
        newColumns[index] = { ...newColumns[index], [field]: value };
        setData('columns', newColumns);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.dynamic-tables.update', table.id));
    };

    return (
        <AuthenticatedLayout auth={auth} title="Edit Tabel">
            <Head title={`Edit Tabel: ${table.name}`} />
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
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Tabel</h1>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui struktur tabel data</p>
                        </div>
                    </div>
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

                {/* Warning Message */}
                <div className="rounded-lg border bg-orange-50 p-4">
                    <p className="text-sm text-orange-800">
                        <strong>Perhatian:</strong> Mengubah struktur kolom dapat mempengaruhi data yang sudah ada. Pastikan perubahan tidak menghapus
                        kolom yang berisi data penting.
                    </p>
                </div>

                {/* Form Container */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Informasi Tabel</h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui nama dan struktur kolom tabel</p>
                    </div>

                    <form onSubmit={submit} className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Nama Tabel */}
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
                                    required
                                />
                                {allErrors.name && <p className="mt-2 text-sm text-red-600">{allErrors.name}</p>}
                            </div>

                            {/* Deskripsi */}
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
                                />
                                {allErrors.description && <p className="mt-2 text-sm text-red-600">{allErrors.description}</p>}
                            </div>

                            {/* Kolom Tabel */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Kolom Tabel <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addColumn}
                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Kolom
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {data.columns.map((column, index) => (
                                        <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Kolom {index + 1}</span>
                                                {data.columns.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeColumn(index)}
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
                                                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600">Tipe Data</label>
                                                    <select
                                                        value={column.type}
                                                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
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
                                                        <label className="block text-xs font-medium text-gray-600">
                                                            Opsi Pilihan (pisahkan dengan koma)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={column.options || ''}
                                                            onChange={(e) => updateColumn(index, 'options', e.target.value)}
                                                            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                                            placeholder="Contoh: Pilihan 1, Pilihan 2, Pilihan 3"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center sm:col-span-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={column.required}
                                                        onChange={(e) => updateColumn(index, 'required', e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <label className="ml-2 text-sm text-gray-700">Wajib diisi</label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {allErrors.columns && <p className="mt-2 text-sm text-red-600">{allErrors.columns}</p>}
                            </div>
                        </div>

                        {/* Action Buttons */}
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
                                {processing ? 'Memperbarui...' : 'Perbarui Tabel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
