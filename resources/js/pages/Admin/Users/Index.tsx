// resources/js/Pages/Admin/Users/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface UsersIndexPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    users: {
        data: User[];
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
    // Add error handling and debugging
    let pageProps;
    try {
        pageProps = usePage<UsersIndexPageProps>().props;
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

    const { auth, users, flash, filters } = pageProps;

    // Search state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Add debugging logs
    console.log('Users page props:', { auth, users, flash, filters });

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm) {
            params.set('search', searchTerm);
        }

        const queryString = params.toString();
        const url = queryString ? `/admin/users?${queryString}` : '/admin/users';

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
            '/admin/users',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Function to handle user deletion with improved error handling
    const handleDeleteUser = (user: User) => {
        // Prevent users from deleting themselves
        if (user.id === auth.user.id) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }

        if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) {
            console.log('Attempting to delete user:', user.id);

            // Use explicit URL instead of route() helper
            const deleteUrl = `/admin/users/${user.id}`;

            router.delete(deleteUrl, {
                onStart: () => {
                    console.log('Delete request started');
                },
                onSuccess: (page) => {
                    console.log('User deleted successfully', page);
                },
                onError: (errors) => {
                    console.error('Error deleting user:', errors);
                    alert('Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.');
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

    if (!users || !users.data) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Pengguna">
                <div className="py-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Loading users...</h2>
                    <p className="mt-2 text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Pengguna">
            <Head title="Kelola Pengguna" />
            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && <div className="rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">Daftar Pengguna</h2>
                        {users.total && (
                            <p className="mt-1 text-sm text-gray-500">
                                {users.from && users.to ? (
                                    <>
                                        Menampilkan {users.from} - {users.to} dari {users.total} pengguna
                                        {searchTerm && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {users.total} pengguna</>
                                )}
                            </p>
                        )}
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Pengguna
                    </Link>
                </div>

                {/* Search */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari pengguna berdasarkan nama atau email..."
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

                        {searchTerm && (
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

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    {users.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                {searchTerm ? 'Tidak ada pengguna yang sesuai dengan pencarian' : 'Tidak ada pengguna'}
                            </h3>
                            <p className="mt-2 text-gray-500">
                                {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan menambahkan pengguna baru.'}
                            </p>
                            {!searchTerm && (
                                <div className="mt-6">
                                    <Link
                                        href="/admin/users/create"
                                        className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Pengguna
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 flex-shrink-0">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                                            <span className="text-xs font-medium text-orange-800">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                            {user.id === auth.user.id && (
                                                                <span className="ml-2 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                                    Anda
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                    Aktif
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="rounded p-1 text-blue-600 transition-colors hover:text-blue-900"
                                                        title={`Edit ${user.name}`}
                                                    >
                                                        <Pencil className="h-5 w-5" />
                                                    </Link>
                                                    {user.id !== auth.user.id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="rounded p-1 text-red-600 transition-colors hover:text-red-900"
                                                            title={`Hapus ${user.name}`}
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {users.links && users.links.length > 0 && <Pagination links={users.links} />}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
