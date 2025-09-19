// resources/js/Pages/Admin/Users/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Mail, Pencil, Plus, Search, Trash2, User, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
    const isInitialMount = useRef(true);

    // Add error handling and debugging
    let pageProps;
    try {
        pageProps = usePage<UsersIndexPageProps>().props;
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

    const { auth, users, flash, filters } = pageProps;

    // Search state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debounced search
    useEffect(() => {
        // Jika ini adalah render pertama, jangan lakukan apa-apa,
        // cukup tandai bahwa render pertama sudah selesai.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Untuk render selanjutnya (saat searchTerm/selectedKategori berubah),
        // jalankan logika debounce.
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

    const handleDeleteUser = (user: User) => {
        // Prevent users from deleting themselves
        if (user.id === auth.user.id) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }

        if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) {
            const deleteUrl = `/admin/users/${user.id}`;

            router.delete(deleteUrl, {
                onSuccess: () => {
                    // Success handled by flash messages
                },
                onError: (errors) => {
                    console.error('Error deleting user:', errors);
                    alert('Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.');
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

    const usersData = users?.data || users || [];
    const usersArray = Array.isArray(usersData) ? usersData : [];

    if (!users) {
        return (
            <AuthenticatedLayout auth={auth} title="Kelola Pengguna">
                <div className="py-12 text-center">
                    <h2 className="text-lg font-semibold text-gray-600 sm:text-xl">Loading users...</h2>
                    <p className="mt-2 text-sm text-gray-500">If this persists, please check the console for errors.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Card component for mobile view
    const UserCard = ({ user }: { user: User }) => (
        <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 sm:h-20 sm:w-20">
                        <User className="h-8 w-8 text-orange-600 sm:h-10 sm:w-10" />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{user.name}</h3>
                        {user.id === auth.user.id && (
                            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Anda</span>
                        )}
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center text-xs text-gray-500">
                            <Mail className="mr-1 h-3 w-3" />
                            {user.email}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Aktif
                        </span>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                            title={`Edit ${user.name}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        {user.id !== auth.user.id && (
                            <button
                                onClick={() => handleDeleteUser(user)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                title={`Hapus ${user.name}`}
                                type="button"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Pengguna">
            <Head title="Kelola Pengguna" />
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
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Daftar Pengguna</h2>
                        {users.total && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
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

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/users/create"
                            className="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:px-4"
                        >
                            <Plus className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                            <span className="xs:inline hidden">Tambah </span>Pengguna
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
                            placeholder="Cari pengguna berdasarkan nama atau email..."
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
                    {usersArray.length === 0 ? (
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="py-12 text-center">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                                    {searchTerm ? 'Tidak ada pengguna yang sesuai dengan pencarian' : 'Tidak ada pengguna'}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
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
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className={`${viewMode === 'table' ? 'hidden lg:hidden' : 'block lg:hidden'} space-y-3 sm:space-y-4`}>
                                {usersArray.map((user) => (
                                    <UserCard key={user.id} user={user} />
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
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {usersArray.map((user) => (
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
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 0 && usersArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={users.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
