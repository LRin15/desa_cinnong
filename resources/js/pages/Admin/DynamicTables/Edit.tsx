// resources/js/Pages/Admin/DynamicTables/Edit.tsx

import { FieldError, inputAdminLg } from '@/components/ui/FieldError';
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
interface TableData {
    id: number;
    name: string;
    description: string | null;
    columns: Column[];
    has_column_total?: boolean;
    has_row_total?: boolean;
    source?: string;
    notes?: string;
}
interface EditPageProps {
    auth: { user: { id: number; name: string; email: string } };
    table: TableData;
    errors?: { name?: string; description?: string; columns?: string };
    flash?: { success?: string; error?: string };
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

export default function Edit() {
    const { auth, table, errors, flash } = usePage<EditPageProps>().props;

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
        source: string;
        notes: string;
        _method: string;
    }>({
        name: table.name || '',
        description: table.description || '',
        columns: table.columns || [{ name: '', type: 'text', required: false, options: '' }],
        has_column_total: table.has_column_total || false,
        has_row_total: table.has_row_total || false,
        source: table.source || '',
        notes: table.notes || '',
        _method: 'put',
    });

    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
        const s = new Set<string>();
        const walk = (cols: Column[], path: number[] = []) =>
            cols.forEach((c, i) => {
                const p = [...path, i];
                if (c.type === 'group') {
                    s.add(p.join('-'));
                    if (c.subColumns) walk(c.subColumns, p);
                }
            });
        walk(table.columns);
        return s;
    });

    const e = { ...errors, ...formErrors };

    const toggleGroup = (path: string) => {
        const s = new Set(expandedGroups);
        s.has(path) ? s.delete(path) : s.add(path);
        setExpandedGroups(s);
    };
    const getColumnByPath = (cols: Column[], path: number[]): Column | null => {
        let cur: any = { subColumns: cols };
        for (const i of path) {
            if (!cur.subColumns?.[i]) return null;
            cur = cur.subColumns[i];
        }
        return cur;
    };
    const addColumn = (path: number[] = []) => {
        const cols = [...data.columns];
        const nc: Column = { name: '', type: 'text', required: false, options: '' };
        if (!path.length) cols.push(nc);
        else {
            const p = getColumnByPath(cols, path);
            if (p?.type === 'group') p.subColumns = [...(p.subColumns || []), nc];
        }
        setData('columns', cols);
    };
    const removeColumn = (path: number[]) => {
        const cols = [...data.columns];
        if (path.length === 1) {
            if (cols.length > 1) cols.splice(path[0], 1);
        } else {
            const p = getColumnByPath(cols, path.slice(0, -1));
            if (p?.subColumns && p.subColumns.length > 1) p.subColumns.splice(path[path.length - 1], 1);
        }
        setData('columns', cols);
    };
    const updateColumn = (path: number[], field: keyof Column, value: any) => {
        const cols = [...data.columns];
        const col = getColumnByPath(cols, path);
        if (col) {
            if (field === 'type') {
                col[field] = value;
                if (value === 'group') {
                    col.subColumns = col.subColumns || [{ name: '', type: 'text', required: false, options: '' }];
                    setExpandedGroups(new Set(expandedGroups).add(path.join('-')));
                } else delete col.subColumns;
            } else col[field] = value;
        }
        setData('columns', cols);
    };
    const submit: FormEventHandler = (ev) => {
        ev.preventDefault();
        post(route('admin.dynamic-tables.update', table.id));
    };

    const inputCol =
        'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none';

    const renderColumn = (column: Column, path: number[], level = 0) => {
        const pk = path.join('-');
        const isExp = expandedGroups.has(pk);
        const canRm = path.length === 1 ? data.columns.length > 1 : true;
        return (
            <div key={pk} className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4" style={{ marginLeft: `${level * 20}px` }}>
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {column.type === 'group' && (
                                <button type="button" onClick={() => toggleGroup(pk)} className="text-gray-600 hover:text-gray-800">
                                    {isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            )}
                            {column.type === 'group' && <Folder className="h-4 w-4 text-blue-600" />}
                            <span className="text-sm font-medium text-gray-700">
                                {level === 0 ? `Kolom ${path[0] + 1}` : column.name || 'Sub Kolom'}
                            </span>
                        </div>
                        {canRm && (
                            <button type="button" onClick={() => removeColumn(path)} className="text-red-600 hover:text-red-700" title="Hapus Kolom">
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
                                onChange={(ev) => updateColumn(path, 'name', ev.target.value)}
                                className={inputCol}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Tipe Data</label>
                            <select value={column.type} onChange={(ev) => updateColumn(path, 'type', ev.target.value)} className={inputCol}>
                                {COLUMN_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
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
                                    placeholder="Contoh: Pilihan 1, Pilihan 2, Pilihan 3"
                                    onChange={(ev) => updateColumn(path, 'options', ev.target.value)}
                                    className={inputCol}
                                />
                            </div>
                        )}
                        {column.type !== 'group' && (
                            <div className="flex items-center sm:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={column.required}
                                    onChange={(ev) => updateColumn(path, 'required', ev.target.checked)}
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
                                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                            >
                                <Plus className="h-3 w-3" />
                                Tambah Sub Kolom
                            </button>
                        </div>
                    )}
                </div>
                {column.type === 'group' && isExp && column.subColumns && (
                    <div className="space-y-3">{column.subColumns.map((sc, si) => renderColumn(sc, [...path, si], level + 1))}</div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout auth={auth} title="Edit Tabel">
            <Head title={`Edit Tabel: ${table.name}`} />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.dynamic-tables.index')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 sm:h-10 sm:w-10"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Tabel</h1>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui struktur tabel data</p>
                    </div>
                </div>

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

                <div className="rounded-lg border bg-orange-50 p-4">
                    <p className="text-sm text-orange-800">
                        <strong>Perhatian:</strong> Mengubah struktur kolom dapat mempengaruhi data yang sudah ada. Pastikan perubahan tidak menghapus
                        kolom yang berisi data penting.
                    </p>
                </div>

                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Informasi Tabel</h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui nama dan struktur kolom tabel</p>
                    </div>

                    <form onSubmit={submit} noValidate className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Nama Tabel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(ev) => setData('name', ev.target.value)}
                                    className={inputAdminLg(e.name)}
                                />
                                <FieldError message={e.name} />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Deskripsi
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    rows={3}
                                    onChange={(ev) => setData('description', ev.target.value)}
                                    className={inputAdminLg(e.description)}
                                />
                                <FieldError message={e.description} />
                            </div>

                            {/* Sumber & Catatan */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Sumber &amp; Catatan Tabel</h3>
                                <p className="mb-4 text-xs text-gray-500">
                                    Informasi ini akan ditampilkan di bawah tabel pada halaman publik Data Desa.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                                            Sumber Data
                                        </label>
                                        <input
                                            id="source"
                                            type="text"
                                            value={data.source}
                                            onChange={(ev) => setData('source', ev.target.value)}
                                            placeholder="Contoh: BPS Kabupaten, Dinas Kependudukan, Hasil Survei 2024"
                                            className={inputAdminLg(undefined)}
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Tuliskan asal atau referensi data pada tabel ini.</p>
                                    </div>
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Catatan
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            rows={3}
                                            onChange={(ev) => setData('notes', ev.target.value)}
                                            placeholder="Contoh: Data diperbarui setiap bulan. Angka dalam satuan jiwa."
                                            className={inputAdminLg(undefined)}
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            Keterangan tambahan, satuan, atau penjelasan khusus mengenai tabel.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Opsi Total */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Opsi Total Otomatis</h3>
                                <div className="space-y-3">
                                    {[
                                        {
                                            id: 'has_column_total',
                                            label: 'Tambah Kolom Total (Kanan)',
                                            desc: 'Menambahkan kolom total otomatis di ujung kanan yang menjumlahkan semua kolom angka dalam setiap baris',
                                        },
                                        {
                                            id: 'has_row_total',
                                            label: 'Tambah Baris Total (Bawah)',
                                            desc: 'Menambahkan baris total otomatis di paling bawah yang menjumlahkan semua kolom angka',
                                        },
                                    ].map(({ id, label, desc }) => (
                                        <div key={id} className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id={id}
                                                checked={(data as any)[id]}
                                                onChange={(ev) => setData(id as any, ev.target.checked)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            />
                                            <label htmlFor={id} className="ml-2">
                                                <span className="text-sm font-medium text-gray-700">{label}</span>
                                                <p className="mt-1 text-xs text-gray-500">{desc}</p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kolom */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Kolom Tabel <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => addColumn()}
                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Kolom
                                    </button>
                                </div>
                                <div className="space-y-4">{data.columns.map((col, idx) => renderColumn(col, [idx]))}</div>
                                <FieldError message={e.columns} />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.dynamic-tables.index')}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
