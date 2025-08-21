// resources/js/Pages/Admin/Berita/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, ImageIcon, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
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
    // Add error handling and debugging
    let pageProps;
    try {
        pageProps = usePage<BeritaIndexPageProps>().props;
    } catch (error) {
        console.error('Error getting page props:', error);
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error Loading Page</h1>
                    <p className="mt-2 text-gray-600">Please check the console for details.</p>
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

    // Add debugging logs
    console.log('Berita page props:', { auth, berita, flash, filters });

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

    // Function to handle berita deletion with improved error handling
    const handleDeleteBerita = (item: BeritaItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${item.judul}"?`)) {
            console.log('Attempting to delete berita:', item.id);

            // Use explicit URL instead of route() helper as fallback
            const deleteUrl = `/admin/berita/${item.id}`;

            router.delete(deleteUrl, {
                onStart: () => {
                    console.log('Delete request started');
                },
                onSuccess: (page) => {
                    console.log('Berita deleted successfully', page);
                },
                onError: (errors) => {
                    console.error('Error deleting berita:', errors);
                    alert('Terjadi kesalahan saat menghapus berita. Silakan coba lagi.');
                },
                onFinish: () => {
                    console.log('Delete request finished');
                },
            });
        }
    };

    // Safety checks
    if (!auth || !auth.user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
                    <p className="mt-2 text-gray-600">User authentication data is missing.</p>
                </div>
            </div>
        );
    }

    // Handle different data structures that might come from the backend
    const beritaData = berita?.data || berita || [];
    const beritaArray = Array.isArray(beritaData) ? beritaData : [];

    if (!berita) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Berita">
                <div className="py-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Loading berita...</h2>
                    <p className="mt-2 text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Get unique categories for filter dropdown
    const categories = [...new Set(beritaArray.map((item) => item.kategori))];

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Berita">
            <Head title="Kelola Berita" />
            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && <div className="rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">Daftar Berita</h2>
                        {berita.total && (
                            <p className="mt-1 text-sm text-gray-500">
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
                    <Link
                        href="/admin/berita/create"
                        className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Berita
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari berita berdasarkan judul..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedKategori}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                                className="block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((kategori) => (
                                    <option key={kategori} value={kategori}>
                                        {kategori}
                                    </option>
                                ))}
                            </select>

                            {(searchTerm || selectedKategori) && (
                                <button
                                    onClick={clearSearch}
                                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Berita Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    {beritaArray.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                {searchTerm || selectedKategori ? 'Tidak ada berita yang sesuai dengan pencarian' : 'Tidak ada berita'}
                            </h3>
                            <p className="mt-2 text-gray-500">
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
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Gambar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Kategori</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Tanggal Terbit
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {beritaArray.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                {item.gambar ? (
                                                    <img src={item.gambar} alt={item.judul} className="h-12 w-20 rounded-md border object-cover" />
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

                            {/* Pagination */}
                            {berita.links && berita.links.length > 0 && <Pagination links={berita.links} />}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
