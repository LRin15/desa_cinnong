// resources/js/Pages/Admin/Infografis/Create.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
        judul?: string;
        deskripsi?: string;
        tanggal_terbit?: string;
        gambar?: string;
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
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error Loading Page</h1>
                    <p className="mt-2 text-gray-600">Please check the console for details.</p>
                </div>
            </div>
        );
    }

    const { auth, errors, flash } = pageProps;

    // Safety check for auth
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

    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
    } = useForm({
        judul: '',
        deskripsi: '',
        tanggal_terbit: '',
        gambar: null as File | null,
    });

    // Merge server errors with form errors
    const allErrors = { ...errors, ...formErrors };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.infografis.store'));
    };

    return (
        <AuthenticatedLayout auth={auth} title="Tambah Infografis Baru">
            <Head title="Tambah Infografis Baru" />
            <div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
                {/* Flash Messages */}
                {flash?.success && <div className="mb-6 rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                <h2 className="text-xl font-semibold text-gray-700">Formulir Infografis</h2>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                            Judul
                        </label>
                        <input
                            id="judul"
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.judul && <p className="mt-2 text-sm text-red-600">{allErrors.judul}</p>}
                    </div>

                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.deskripsi && <p className="mt-2 text-sm text-red-600">{allErrors.deskripsi}</p>}
                    </div>

                    <div>
                        <label htmlFor="tanggal_terbit" className="block text-sm font-medium text-gray-700">
                            Tanggal Terbit
                        </label>
                        <input
                            id="tanggal_terbit"
                            type="date"
                            value={data.tanggal_terbit}
                            onChange={(e) => setData('tanggal_terbit', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.tanggal_terbit && <p className="mt-2 text-sm text-red-600">{allErrors.tanggal_terbit}</p>}
                    </div>

                    <div>
                        <label htmlFor="gambar" className="block text-sm font-medium text-gray-700">
                            Gambar
                        </label>
                        <input
                            id="gambar"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('gambar', e.target.files ? e.target.files[0] : null)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
                            required
                        />
                        {allErrors.gambar && <p className="mt-2 text-sm text-red-600">{allErrors.gambar}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={route('admin.infografis.index')}
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
