// resources/js/Pages/Admin/Berita/Edit.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const KategoriOptions = ['Pengumuman', 'Program Desa', 'Informasi', 'Kegiatan Warga', 'Kesehatan', 'Pendidikan'];

interface Berita {
    id: number;
    judul: string;
    kategori: string;
    kutipan: string;
    isi: string;
    tanggal_terbit: string; // Y-m-d format
    gambar_url: string | null;
}

interface EditPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    berita: Berita;
    errors?: {
        judul?: string;
        kategori?: string;
        kutipan?: string;
        isi?: string;
        tanggal_terbit?: string;
        gambar?: string;
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

    const { auth, berita, errors, flash } = pageProps;

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

    if (!berita) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Berita Not Found</h1>
                    <p className="mt-2 text-gray-600">The news article data is missing.</p>
                    <Link href={route('admin.berita.index')} className="mt-4 text-orange-600 hover:text-orange-800">
                        Back to News List
                    </Link>
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
        judul: berita.judul || '',
        kategori: berita.kategori || KategoriOptions[0],
        kutipan: berita.kutipan || '',
        isi: berita.isi || '',
        tanggal_terbit: berita.tanggal_terbit || '',
        gambar: null as File | null,
        _method: 'put' as const,
    });

    // Merge server errors with form errors
    const allErrors = { ...errors, ...formErrors };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.berita.update', berita.id));
    };

    return (
        <AuthenticatedLayout auth={auth} title={`Edit Berita: ${berita.judul}`}>
            <Head title={`Edit Berita: ${berita.judul}`} />
            <div className="mx-auto max-w-4xl rounded-lg border bg-white p-6 shadow-sm">
                {/* Flash Messages */}
                {flash?.success && <div className="mb-6 rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                <h2 className="text-xl font-semibold text-gray-700">Formulir Edit Berita</h2>
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
                        <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <select
                            id="kategori"
                            value={data.kategori}
                            onChange={(e) => setData('kategori', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            {KategoriOptions.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {allErrors.kategori && <p className="mt-2 text-sm text-red-600">{allErrors.kategori}</p>}
                    </div>

                    <div>
                        <label htmlFor="kutipan" className="block text-sm font-medium text-gray-700">
                            Kutipan
                        </label>
                        <textarea
                            id="kutipan"
                            value={data.kutipan}
                            onChange={(e) => setData('kutipan', e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.kutipan && <p className="mt-2 text-sm text-red-600">{allErrors.kutipan}</p>}
                    </div>

                    <div>
                        <label htmlFor="isi" className="block text-sm font-medium text-gray-700">
                            Isi Berita
                        </label>
                        <textarea
                            id="isi"
                            value={data.isi}
                            onChange={(e) => setData('isi', e.target.value)}
                            rows={10}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                        />
                        {allErrors.isi && <p className="mt-2 text-sm text-red-600">{allErrors.isi}</p>}
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
                            Ganti Gambar
                        </label>
                        {berita.gambar_url && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500">Gambar saat ini:</p>
                                <img src={berita.gambar_url} alt="Gambar saat ini" className="mt-1 h-24 w-auto rounded-md border" />
                            </div>
                        )}
                        <input
                            id="gambar"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('gambar', e.target.files ? e.target.files[0] : null)}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengganti gambar.</p>
                        {allErrors.gambar && <p className="mt-2 text-sm text-red-600">{allErrors.gambar}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4">
                        <Link href={route('admin.berita.index')} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
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
