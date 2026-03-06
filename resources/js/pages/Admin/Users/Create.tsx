// resources/js/Pages/Admin/Users/Create.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

interface CreatePageProps {
    auth: { user: { id: number; name: string; email: string } };
    targetRole: string;
    errors?: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Create() {
    const { auth, errors, flash, targetRole } = usePage<CreatePageProps>().props;

    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
    } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const allErrors = { ...errors, ...formErrors };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout auth={auth} title="Tambah Admin Desa">
            <Head title="Tambah Admin Desa" />

            <div className="space-y-5 px-4 sm:px-0">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Tambah Admin Desa</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Buat akun admin desa baru</p>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{flash.success}</div>
                )}
                {flash?.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{flash.error}</div>}

                {/* Role indicator */}
                <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                    <Shield className="h-4 w-4 flex-shrink-0 text-indigo-600" />
                    <p className="text-sm text-indigo-700">
                        Akun yang dibuat akan memiliki role <strong>Admin Desa</strong> secara otomatis.
                    </p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-5">
                        <h2 className="text-base font-semibold text-gray-900">Formulir Pengguna</h2>
                        <p className="mt-0.5 text-sm text-gray-500">Isi detail akun admin desa baru</p>
                    </div>

                    <form onSubmit={submit} className="p-6">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* Nama */}
                                <div>
                                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap..."
                                        required
                                        className={`block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:ring-2 focus:outline-none ${allErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/30'}`}
                                    />
                                    {allErrors.name && <p className="mt-1 text-xs text-red-600">{allErrors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Alamat Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
                                        required
                                        className={`block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:ring-2 focus:outline-none ${allErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/30'}`}
                                    />
                                    {allErrors.email && <p className="mt-1 text-xs text-red-600">{allErrors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        required
                                        className={`block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:ring-2 focus:outline-none ${allErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/30'}`}
                                    />
                                    {allErrors.password && <p className="mt-1 text-xs text-red-600">{allErrors.password}</p>}
                                </div>

                                {/* Konfirmasi */}
                                <div>
                                    <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password"
                                        required
                                        className={`block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:ring-2 focus:outline-none ${allErrors.password_confirmation ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/30'}`}
                                    />
                                    {allErrors.password_confirmation && (
                                        <p className="mt-1 text-xs text-red-600">{allErrors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Admin Desa'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
