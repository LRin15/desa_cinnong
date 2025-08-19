// resources/js/Pages/Admin/Users/Edit.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface EditPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    user: User;
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

export default function Edit() {
    // Add error handling for page props
    let pageProps: EditPageProps;

    try {
        pageProps = usePage<EditPageProps>().props;
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

    const { auth, user, errors, flash } = pageProps;

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

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">User Not Found</h1>
                    <p className="mt-2 text-gray-600">The user data is missing.</p>
                    <Link href={route('admin.users.index')} className="mt-4 text-orange-600 hover:text-orange-800">
                        Back to Users List
                    </Link>
                </div>
            </div>
        );
    }

    const {
        data,
        setData,
        put,
        processing,
        errors: formErrors,
    } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
    });

    // Merge server errors with form errors
    const allErrors = { ...errors, ...formErrors };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout auth={auth} title={`Edit Pengguna: ${user.name}`}>
            <Head title={`Edit Pengguna: ${user.name}`} />
            <div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
                {/* Flash Messages */}
                {flash?.success && <div className="mb-6 rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                <h2 className="text-xl font-semibold text-gray-700">Formulir Edit Pengguna</h2>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nama
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.name && <p className="mt-2 text-sm text-red-600">{allErrors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.email && <p className="mt-2 text-sm text-red-600">{allErrors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password Baru
                        </label>
                        <p className="text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password.</p>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                        {allErrors.password && <p className="mt-2 text-sm text-red-600">{allErrors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                        {allErrors.password_confirmation && <p className="mt-2 text-sm text-red-600">{allErrors.password_confirmation}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <Link href={route('admin.users.index')} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                        >
                            {processing ? 'Memperbarui...' : 'Perbarui'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
