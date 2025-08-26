// resources/js/Pages/Admin/Infografis/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, ImageIcon, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InfografisItem {
    id: number;
    judul: string;
    tanggal_terbit: string;
    gambar: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface InfografisIndexPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    infografis: {
        data: InfografisItem[];
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
    const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

    // Add error handling and debugging
    let pageProps;
    try {
        pageProps = usePage<InfografisIndexPageProps>().props;
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

    const { auth, infografis, flash, filters } = pageProps;

    // Search state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debounced search
    useEffect(() => {
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
        const url = queryString ? `/admin/infografis?${queryString}` : '/admin/infografis';

        router.get(
            url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(
            '/admin/infografis',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDeleteInfografis = (item: InfografisItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus infografis "${item.judul}"?`)) {
            const deleteUrl = `/admin/infografis/${item.id}`;

            router.delete(deleteUrl, {
                onSuccess: () => {
                    // Success handled by flash messages
                },
                onError: (errors) => {
                    console.error('Error deleting infografis:', errors);
                    alert('Terjadi kesalahan saat menghapus infografis. Silakan coba lagi.');
                },
            });
        }
    };

    // Safety checks
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

    const infografisData = infografis?.data || infografis || [];
    const infografisArray = Array.isArray(infografisData) ? infografisData : [];

    if (!infografis) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Infografis">
                <div className="py-12 text-center">
                    <h2 className="text-lg font-semibold text-gray-600 sm:text-xl">Loading infografis...</h2>
                    <p className="mt-2 text-sm text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Card component for mobile view
    const InfografisCard = ({ item }: { item: InfografisItem }) => (
        <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    {item.gambar ? (
                        <img src={item.gambar} alt={item.judul} className="h-16 w-20 rounded-md border object-cover sm:h-20 sm:w-24" />
                    ) : (
                        <div className="flex h-16 w-20 items-center justify-center rounded-md border bg-gray-100 sm:h-20 sm:w-24">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">{item.judul}</h3>
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center text-xs text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {item.tanggal_terbit}
                        </span>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link
                            href={`/admin/infografis/${item.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                            title={`Edit ${item.judul}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={() => handleDeleteInfografis(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                            title={`Hapus ${item.judul}`}
                            type="button"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Infografis">
            <Head title="Kelola Infografis" />
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
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Daftar Infografis</h2>
                        {infografis.total && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {infografis.from && infografis.to ? (
                                    <>
                                        Menampilkan {infografis.from} - {infografis.to} dari {infografis.total} infografis
                                        {searchTerm && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {infografis.total} infografis</>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/infografis/create"
                            className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:px-4"
                        >
                            <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                            <span className="xs:inline hidden">Tambah </span>Infografis
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari infografis berdasarkan judul..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:py-3 sm:pl-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="text-gray-400 transition-colors hover:text-gray-600">
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {searchTerm && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex items-end">
                                <button
                                    onClick={clearSearch}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {infografisArray.length === 0 ? (
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="py-12 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                                    {searchTerm ? 'Tidak ada infografis yang sesuai dengan pencarian' : 'Tidak ada infografis'}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                    {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan menambahkan infografis baru.'}
                                </p>
                                {!searchTerm && (
                                    <div className="mt-6">
                                        <Link
                                            href="/admin/infografis/create"
                                            className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Infografis
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className={`${viewMode === 'table' ? 'hidden lg:hidden' : 'block lg:hidden'} space-y-3 sm:space-y-4`}>
                                {infografisArray.map((item) => (
                                    <InfografisCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div
                                className={`${viewMode === 'card' ? 'hidden lg:block' : 'hidden lg:block'} overflow-hidden rounded-lg border bg-white shadow-sm`}
                            >
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Gambar
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Judul
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Tanggal Terbit
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {infografisArray.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        {item.gambar ? (
                                                            <img
                                                                src={item.gambar}
                                                                alt={item.judul}
                                                                className="h-12 w-20 rounded-md border object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-20 items-center justify-center rounded-md border bg-gray-100">
                                                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        <div className="max-w-xs truncate" title={item.judul}>
                                                            {item.judul}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.tanggal_terbit}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={`/admin/infografis/${item.id}/edit`}
                                                                className="rounded p-1 text-blue-600 transition-colors hover:text-blue-900"
                                                                title={`Edit ${item.judul}`}
                                                            >
                                                                <Pencil className="h-5 w-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteInfografis(item)}
                                                                className="rounded p-1 text-red-600 transition-colors hover:text-red-900"
                                                                title={`Hapus ${item.judul}`}
                                                                type="button"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {infografis.links && infografis.links.length > 0 && infografisArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={infografis.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
