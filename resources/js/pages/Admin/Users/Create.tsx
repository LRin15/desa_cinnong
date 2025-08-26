// resources/js/Pages/Admin/Users/Create.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface CreatePageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    errors?: {
        name?: string;
        email?: string;
        password?: string;
        password_confirmation?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function Create() {
    // Add error handling for page props
    let pageProps: CreatePageProps;

    try {
        pageProps = usePage<CreatePageProps>().props;
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

    const { auth, errors, flash } = pageProps;

    // Safety check for auth
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

    // Merge server errors with form errors
    const allErrors = { ...errors, ...formErrors };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout auth={auth} title="Tambah Pengguna Baru">
            <Head title="Tambah Pengguna Baru" />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 sm:h-10 sm:w-10"
                            title="Kembali ke Daftar Pengguna"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Tambah Pengguna Baru</h1>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Buat akun pengguna baru untuk sistem</p>
                        </div>
                    </div>
                </div>

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

                {/* Form Container */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Formulir Pengguna</h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Isi detail pengguna di bawah ini</p>
                    </div>

                    <form onSubmit={submit} className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Name and Email - Responsive Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:text-base"
                                        placeholder="Masukkan nama pengguna..."
                                        required
                                    />
                                    {allErrors.name && <p className="mt-2 text-sm text-red-600">{allErrors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Alamat Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:text-base"
                                        placeholder="contoh@email.com"
                                        required
                                    />
                                    {allErrors.email && <p className="mt-2 text-sm text-red-600">{allErrors.email}</p>}
                                </div>
                            </div>

                            {/* Password and Confirmation - Responsive Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:text-base"
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                    {allErrors.password && <p className="mt-2 text-sm text-red-600">{allErrors.password}</p>}
                                </div>
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:text-base"
                                        placeholder="Ulangi password"
                                        required
                                    />
                                    {allErrors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600">{allErrors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
