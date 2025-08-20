// resources/js/Pages/Admin/Berita/Index.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';

interface BeritaItem {
    id: number;
    judul: string;
    kategori: string;
    tanggal_terbit: string;
    gambar: string | null;
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
        links?: any[];
    };
    flash?: {
        success?: string;
        error?: string;
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

    const { auth, berita, flash } = pageProps;

    // Add debugging logs
    console.log('Berita page props:', { auth, berita, flash });

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

    // Alternative delete function using fetch API as fallback
    const handleDeleteBeritaFallback = async (item: BeritaItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${item.judul}"?`)) {
            try {
                const response = await fetch(`/admin/berita/${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        Accept: 'application/json',
                    },
                });

                if (response.ok) {
                    // Reload the page or update state
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    console.error('Delete failed:', errorData);
                    alert('Terjadi kesalahan saat menghapus berita.');
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
            }
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

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Berita">
            <Head title="Kelola Berita" />
            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && <div className="rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-700">Daftar Berita</h2>
                    <Link
                        href="/admin/berita/create"
                        className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Berita
                    </Link>
                </div>

                {/* Berita Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    {beritaArray.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada berita</h3>
                            <p className="mt-2 text-gray-500">Mulai dengan menambahkan berita baru.</p>
                            <div className="mt-6">
                                <Link
                                    href="/admin/berita/create"
                                    className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Berita
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Gambar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Judul</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Tanggal Terbit</th>
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
                    )}
                </div>

                {/* Pagination - TODO */}
                {berita?.links && Array.isArray(berita.links) && berita.links.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">Pagination akan ditambahkan nanti</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
