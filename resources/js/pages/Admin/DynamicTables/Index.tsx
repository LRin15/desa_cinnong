// resources/js/Pages/Admin/DynamicTables/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Database, Pencil, Plus, Search, Table2, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TableItem {
    id: number;
    name: string;
    table_name: string;
    description: string | null;
    columns_count: number;
    data_count: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    tables: {
        data: TableItem[];
        links?: PaginationLink[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        from?: number;
        to?: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    filters: {
        search?: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const isInitialMount = useRef(true);

    let pageProps: IndexPageProps;
    try {
        pageProps = usePage<IndexPageProps>().props;
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

    const { auth, tables, flash, filters } = pageProps;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) {
            params.set('search', searchTerm);
        }
        const queryString = params.toString();
        const url = queryString ? `/admin/dynamic-tables?${queryString}` : '/admin/dynamic-tables';
        router.get(url, {}, { preserveState: true, replace: true });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get('/admin/dynamic-tables', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (item: TableItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus tabel "${item.name}"? Semua data di dalamnya akan ikut terhapus.`)) {
            router.delete(`/admin/dynamic-tables/${item.id}`, {
                onSuccess: () => {
                    // Success handled by flash messages
                },
                onError: (errors) => {
                    console.error('Error deleting table:', errors);
                    alert('Terjadi kesalahan saat menghapus tabel. Silakan coba lagi.');
                },
            });
        }
    };

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

    const tablesData = tables?.data || tables || [];
    const tablesArray = Array.isArray(tablesData) ? tablesData : [];

    if (!tables) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Tabel Data">
                <div className="py-12 text-center">
                    <h2 className="text-lg font-semibold text-gray-600 sm:text-xl">Loading tables...</h2>
                    <p className="mt-2 text-sm text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const TableCard = ({ item }: { item: TableItem }) => (
        <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{item.table_name}</p>
                </div>
            </div>

            {item.description && <p className="mb-3 line-clamp-2 text-sm text-gray-600">{item.description}</p>}

            <div className="mb-3 flex gap-4 border-t border-gray-100 pt-3">
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{item.columns_count}</div>
                    <div className="text-xs text-gray-500">Kolom</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{item.data_count}</div>
                    <div className="text-xs text-gray-500">Data</div>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-xs text-gray-500">{item.created_at}</div>
                </div>
            </div>

            <div className="flex gap-2">
                <Link
                    href={`/admin/dynamic-tables/${item.id}/insert`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-100"
                    title={`Isi Data ${item.name}`}
                >
                    <Upload className="h-4 w-4" />
                    Isi Data
                </Link>
                <Link
                    href={`/admin/dynamic-tables/${item.id}/edit`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                    title={`Edit ${item.name}`}
                >
                    <Pencil className="h-4 w-4" />
                </Link>
                <button
                    onClick={() => handleDelete(item)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                    type="button"
                    title={`Hapus ${item.name}`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Tabel Data">
            <Head title="Kelola Tabel Data" />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
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

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Kelola Tabel Data</h2>
                        {tables.total !== undefined && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {tables.from && tables.to ? (
                                    <>
                                        Menampilkan {tables.from} - {tables.to} dari {tables.total} tabel
                                        {searchTerm && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {tables.total} tabel</>
                                )}
                            </p>
                        )}
                    </div>

                    <Link
                        href="/admin/dynamic-tables/create"
                        className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:px-4"
                    >
                        <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                        <span className="xs:inline hidden">Tambah </span>Tabel
                    </Link>
                </div>

                {/* Search */}
                <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari tabel berdasarkan nama atau deskripsi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:py-3 sm:pl-10"
                        />
                        {searchTerm && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <button onClick={clearSearch} className="text-gray-400 transition-colors hover:text-gray-600">
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {tablesArray.length === 0 ? (
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="py-12 text-center">
                                <Table2 className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                                    {searchTerm ? 'Tidak ada tabel yang sesuai dengan pencarian' : 'Belum ada tabel'}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                    {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan membuat tabel data baru.'}
                                </p>
                                {!searchTerm && (
                                    <div className="mt-6">
                                        <Link
                                            href="/admin/dynamic-tables/create"
                                            className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Buat Tabel
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {tablesArray.map((item) => (
                                <TableCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {tables.links && tables.links.length > 0 && tablesArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={tables.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
