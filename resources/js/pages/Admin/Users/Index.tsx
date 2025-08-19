// resources/js/Pages/Admin/Users/Index.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
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

    const { auth, users, flash } = pageProps;

    // Add debugging logs
    console.log('Users page props:', { auth, users, flash });

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
                    <h2 className="text-2xl font-semibold text-gray-700">Daftar Pengguna</h2>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Pengguna
                    </Link>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    {users.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada pengguna</h3>
                            <p className="mt-2 text-gray-500">Mulai dengan menambahkan pengguna baru.</p>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.users.create')}
                                    className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Pengguna
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="rounded p-1 text-blue-600 transition-colors hover:text-blue-900"
                                                    title={`Edit ${user.name}`}
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </Link>
                                                <Link
                                                    href={route('admin.users.destroy', user.id)}
                                                    method="delete"
                                                    as="button"
                                                    onBefore={() => window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')}
                                                    className="rounded p-1 text-red-600 transition-colors hover:text-red-900"
                                                    title={`Hapus ${user.name}`}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination - TODO */}
                {users.links && users.links.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">Pagination akan ditambahkan nanti</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
