// resources/js/Pages/Admin/Users/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, Mail, Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
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
            role?: string;
        };
    };
    users: {
        data: UserItem[];
        links?: PaginationLink[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        from?: number;
        to?: number;
    };
    flash?: { success?: string; error?: string };
    filters: { search?: string };
    targetRole: string;
    isReadOnly: boolean;
    [key: string]: unknown;
}

// ─── Status verifikasi badge ──────────────────────────────────────────────────

function VerifiedBadge({ verifiedAt }: { verifiedAt: string | null }) {
    if (verifiedAt) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Terverifikasi
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <Clock className="h-3.5 w-3.5" />
            Belum Verifikasi
        </span>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Index() {
    const isInitialMount = useRef(true);

    let pageProps: UsersIndexPageProps;
    try {
        pageProps = usePage<UsersIndexPageProps>().props;
    } catch {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-600">Error memuat halaman. Cek konsol browser.</p>
            </div>
        );
    }

    const { auth, users, flash, filters, targetRole, isReadOnly } = pageProps;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('admin.users.index'), { search: searchTerm || undefined }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('admin.users.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (user: UserItem) => {
        if (isReadOnly) return;
        if (user.id === auth.user.id) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }
        if (!window.confirm(`Hapus pengguna "${user.name}"?`)) return;
        router.delete(route('admin.users.destroy', user.id), {
            onError: () => alert('Terjadi kesalahan saat menghapus pengguna.'),
        });
    };

    const usersArray: UserItem[] = Array.isArray(users?.data) ? users.data : [];

    const pageTitle = targetRole === 'admin_desa' ? 'Kelola Admin Desa' : 'Daftar Pengguna Terdaftar';

    // ── Mobile card ──
    const UserCard = ({ user }: { user: UserItem }) => (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-700">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        {user.id === auth.user.id && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">Anda</span>
                        )}
                    </div>
                    <p className="mb-3 flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </p>
                    <div className="flex items-center justify-between">
                        <VerifiedBadge verifiedAt={user.email_verified_at} />
                        {/* Aksi hanya untuk admin_bps */}
                        {!isReadOnly && (
                            <div className="flex gap-2">
                                <Link
                                    href={route('admin.users.edit', user.id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    title={`Edit ${user.name}`}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                {user.id !== auth.user.id && (
                                    <button
                                        onClick={() => handleDelete(user)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                        type="button"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth} title={pageTitle}>
            <Head title={pageTitle} />

            <div className="space-y-5 px-4 sm:px-0">
                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}
                {flash?.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{flash.error}</div>}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">{pageTitle}</h2>
                        {users.total !== undefined && (
                            <p className="mt-1 text-sm text-gray-500">
                                {users.from && users.to
                                    ? `Menampilkan ${users.from}–${users.to} dari ${users.total} pengguna`
                                    : `Total ${users.total} pengguna`}
                                {searchTerm && ' (difilter)'}
                            </p>
                        )}
                    </div>

                    {/* Tambah — hanya admin_bps */}
                    {!isReadOnly && (
                        <Link
                            href={route('admin.users.create')}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Admin Desa
                        </Link>
                    )}
                </div>

                {/* Search */}
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        />
                        {searchTerm && (
                            <button onClick={clearSearch} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {usersArray.length === 0 ? (
                    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                            <Users className="h-7 w-7 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada pengguna'}</p>
                        <p className="mt-1 max-w-xs text-xs text-gray-400">
                            {searchTerm
                                ? 'Coba ubah kata kunci pencarian.'
                                : isReadOnly
                                  ? 'Belum ada pengguna terdaftar di sistem.'
                                  : 'Mulai dengan menambahkan akun baru.'}
                        </p>
                        {!searchTerm && !isReadOnly && (
                            <Link
                                href={route('admin.users.create')}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Admin Desa
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Mobile cards */}
                        <div className="block space-y-3 lg:hidden">
                            {usersArray.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">Pengguna</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">Email</th>
                                        {/* Kolom Status hanya untuk admin_desa (read-only), Aksi hanya untuk admin_bps */}
                                        {isReadOnly ? (
                                            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                Status
                                            </th>
                                        ) : (
                                            <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {usersArray.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                        {user.id === auth.user.id && (
                                                            <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                                                Anda
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {isReadOnly ? (
                                                    <VerifiedBadge verifiedAt={user.email_verified_at} />
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                                                            title={`Edit ${user.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                        {user.id !== auth.user.id && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                                                                title={`Hapus ${user.name}`}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Pagination */}
                {users.links && users.links.length > 0 && usersArray.length > 0 && <Pagination links={users.links} />}
            </div>
        </AuthenticatedLayout>
    );
}
