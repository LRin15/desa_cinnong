// resources/js/Pages/Admin/Infografis/Index.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';

interface InfografisItem {
    id: number;
    judul: string;
    tanggal_terbit: string;
    gambar: string | null;
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
        pageProps = usePage<InfografisIndexPageProps>().props;
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

    const { auth, infografis, flash } = pageProps;

    // Add debugging logs
    console.log('Infografis page props:', { auth, infografis, flash });

    // Function to handle infografis deletion with improved error handling
    const handleDeleteInfografis = (item: InfografisItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus infografis "${item.judul}"?`)) {
            console.log('Attempting to delete infografis:', item.id);

            // Use explicit URL instead of route() helper
            const deleteUrl = `/admin/infografis/${item.id}`;

            router.delete(deleteUrl, {
                onStart: () => {
                    console.log('Delete request started');
                },
                onSuccess: (page) => {
                    console.log('Infografis deleted successfully', page);
                },
                onError: (errors) => {
                    console.error('Error deleting infografis:', errors);
                    alert('Terjadi kesalahan saat menghapus infografis. Silakan coba lagi.');
                },
                onFinish: () => {
                    console.log('Delete request finished');
                },
            });
        }
    };

    // Alternative delete function using fetch API as fallback
    const handleDeleteInfografisFallback = async (item: InfografisItem) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus infografis "${item.judul}"?`)) {
            try {
                const response = await fetch(`/admin/infografis/${item.id}`, {
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
                    alert('Terjadi kesalahan saat menghapus infografis.');
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

    if (!infografis || !infografis.data) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Infografis">
                <div className="py-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Loading infografis...</h2>
                    <p className="mt-2 text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Infografis">
            <Head title="Kelola Infografis" />
            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && <div className="rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-700">Daftar Infografis</h2>
                    <Link
                        href="/admin/infografis/create"
                        className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Infografis
                    </Link>
                </div>

                {/* Infografis Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    {infografis.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada infografis</h3>
                            <p className="mt-2 text-gray-500">Mulai dengan menambahkan infografis baru.</p>
                            <div className="mt-6">
                                <Link
                                    href="/admin/infografis/create"
                                    className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Infografis
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Gambar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Judul</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Tanggal Terbit</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {infografis.data.map((item) => (
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
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{item.judul}</td>
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
                    )}
                </div>

                {/* Pagination - TODO */}
                {infografis.links && infografis.links.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">Pagination akan ditambahkan nanti</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
