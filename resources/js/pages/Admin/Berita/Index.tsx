// resources/js/Pages/Admin/Berita/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, FileText, Filter, ImageIcon, Pencil, Plus, Search, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeritaItem {
    id: number;
    judul: string;
    kategori: string;
    tanggal_terbit: string;
    gambar: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BeritaIndexPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    berita: {
        data: BeritaItem[];
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
        kategori?: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
    const [showFilters, setShowFilters] = useState(false);

    // Add error handling and debugging
    let pageProps;
    try {
        pageProps = usePage<BeritaIndexPageProps>().props;
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

    const { auth, berita, flash, filters } = pageProps;

    // Search states
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedKategori, setSelectedKategori] = useState(filters.kategori || '');

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedKategori]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm) {
            params.set('search', searchTerm);
        }

        if (selectedKategori) {
            params.set('kategori', selectedKategori);
        }

        const queryString = params.toString();
        const url = queryString ? `/admin/berita?${queryString}` : '/admin/berita';

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
        setSelectedKategori('');
        router.get(
            '/admin/berita',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDeleteBerita = (item: BeritaItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${item.judul}"?`)) {
            const deleteUrl = `/admin/berita/${item.id}`;

            router.delete(deleteUrl, {
                onSuccess: () => {
                    // Success handled by flash messages
                },
                onError: (errors) => {
                    console.error('Error deleting berita:', errors);
                    alert('Terjadi kesalahan saat menghapus berita. Silakan coba lagi.');
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

    const beritaData = berita?.data || berita || [];
    const beritaArray = Array.isArray(beritaData) ? beritaData : [];

    if (!berita) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Berita">
                <div className="py-12 text-center">
                    <h2 className="text-lg font-semibold text-gray-600 sm:text-xl">Loading berita...</h2>
                    <p className="mt-2 text-sm text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const categories = [...new Set(beritaArray.map((item) => item.kategori))];

    // Card component for mobile view
    const BeritaCard = ({ item }: { item: BeritaItem }) => (
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
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                            <Tag className="mr-1 h-3 w-3" />
                            {item.kategori}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {item.tanggal_terbit}
                        </span>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link
                            href={`/admin/berita/${item.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                            title={`Edit ${item.judul}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={() => handleDeleteBerita(item)}
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
        <AuthenticatedLayout auth={auth} title="Kelola Berita">
            <Head title="Kelola Berita" />
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
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Daftar Berita</h2>
                        {berita.total && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {berita.from && berita.to ? (
                                    <>
                                        Menampilkan {berita.from} - {berita.to} dari {berita.total} berita
                                        {(searchTerm || selectedKategori) && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {berita.total} berita</>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/berita/create"
                            className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:px-4"
                        >
                            <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                            <span className="xs:inline hidden">Tambah </span>Berita
                        </Link>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari berita berdasarkan judul..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:py-3 sm:pl-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {searchTerm ? (
                                <button onClick={() => setSearchTerm('')} className="text-gray-400 transition-colors hover:text-gray-600">
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`transition-colors ${showFilters ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    {(showFilters || selectedKategori) && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="kategori" className="mb-1 block text-xs font-medium text-gray-700">
                                        Kategori
                                    </label>
                                    <select
                                        id="kategori"
                                        value={selectedKategori}
                                        onChange={(e) => setSelectedKategori(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map((kategori) => (
                                            <option key={kategori} value={kategori}>
                                                {kategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {(searchTerm || selectedKategori) && (
                                    <div className="flex items-end">
                                        <button
                                            onClick={clearSearch}
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {beritaArray.length === 0 ? (
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                                    {searchTerm || selectedKategori ? 'Tidak ada berita yang sesuai dengan pencarian' : 'Tidak ada berita'}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                    {searchTerm || selectedKategori
                                        ? 'Coba ubah kata kunci pencarian atau filter kategori.'
                                        : 'Mulai dengan menambahkan berita baru.'}
                                </p>
                                {!searchTerm && !selectedKategori && (
                                    <div className="mt-6">
                                        <Link
                                            href="/admin/berita/create"
                                            className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Berita
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className={`${viewMode === 'table' ? 'hidden lg:hidden' : 'block lg:hidden'} space-y-3 sm:space-y-4`}>
                                {beritaArray.map((item) => (
                                    <BeritaCard key={item.id} item={item} />
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
                                                    Kategori
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
                                            {beritaArray.map((item) => (
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
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                                                            {item.kategori}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.tanggal_terbit}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={`/admin/berita/${item.id}/edit`}
                                                                className="rounded p-1 text-blue-600 transition-colors hover:text-blue-900"
                                                                title={`Edit ${item.judul}`}
                                                            >
                                                                <Pencil className="h-5 w-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteBerita(item)}
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
                {berita.links && berita.links.length > 0 && beritaArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={berita.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
