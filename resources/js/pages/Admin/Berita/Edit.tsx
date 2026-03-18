// resources/js/Pages/Admin/Berita/Edit.tsx

import { FieldError, inputAdminLg } from '@/components/ui/FieldError';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { FormEventHandler } from 'react';

const KategoriOptions = ['Pengumuman', 'Program Desa', 'Informasi', 'Kegiatan Warga', 'Kesehatan', 'Pendidikan'];

interface Berita {
    id: number;
    judul: string;
    kategori: string;
    kutipan: string;
    isi: string;
    tanggal_terbit: string;
    gambar_url: string | null;
}
interface EditPageProps {
    auth: { user: { id: number; name: string; email: string } };
    berita: Berita;
    errors?: { judul?: string; kategori?: string; kutipan?: string; isi?: string; tanggal_terbit?: string; gambar?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Edit() {
    const { auth, berita, errors, flash } = usePage<EditPageProps>().props;

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

    const e = { ...errors, ...formErrors };

    const submit: FormEventHandler = (ev) => {
        ev.preventDefault();
        post(route('admin.berita.update', berita.id));
    };

    return (
        <AuthenticatedLayout auth={auth} title="Edit Berita">
            <Head title={`Edit Berita: ${berita.judul}`} />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.berita.index')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 sm:h-10 sm:w-10"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Berita</h1>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui detail artikel berita di bawah</p>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 sm:p-4">
                        <p className="text-sm text-green-700">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 sm:p-4">
                        <p className="text-sm text-red-700">{flash.error}</p>
                    </div>
                )}

                {/* Form */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Formulir Edit Berita</h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Pastikan informasi yang diperbarui sudah benar</p>
                    </div>

                    <form onSubmit={submit} noValidate className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Judul */}
                            <div>
                                <label htmlFor="judul" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Judul Berita <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="judul"
                                    type="text"
                                    value={data.judul}
                                    onChange={(ev) => setData('judul', ev.target.value)}
                                    className={inputAdminLg(e.judul)}
                                />
                                <FieldError message={e.judul} />
                            </div>

                            {/* Kategori + Tanggal */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div>
                                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="kategori"
                                        value={data.kategori}
                                        onChange={(ev) => setData('kategori', ev.target.value)}
                                        className={inputAdminLg(e.kategori)}
                                    >
                                        {KategoriOptions.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError message={e.kategori} />
                                </div>
                                <div>
                                    <label htmlFor="tanggal_terbit" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Tanggal Terbit <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="tanggal_terbit"
                                        type="date"
                                        value={data.tanggal_terbit}
                                        onChange={(ev) => setData('tanggal_terbit', ev.target.value)}
                                        className={inputAdminLg(e.tanggal_terbit)}
                                    />
                                    <FieldError message={e.tanggal_terbit} />
                                </div>
                            </div>

                            {/* Kutipan */}
                            <div>
                                <label htmlFor="kutipan" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Kutipan/Ringkasan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="kutipan"
                                    value={data.kutipan}
                                    rows={3}
                                    onChange={(ev) => setData('kutipan', ev.target.value)}
                                    className={inputAdminLg(e.kutipan)}
                                />
                                <FieldError message={e.kutipan} />
                            </div>

                            {/* Isi */}
                            <div>
                                <label htmlFor="isi" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Isi Berita <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="isi"
                                    value={data.isi}
                                    rows={12}
                                    onChange={(ev) => setData('isi', ev.target.value)}
                                    className={inputAdminLg(e.isi)}
                                />
                                <FieldError message={e.isi} />
                            </div>

                            {/* Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 sm:text-base">Gambar Berita</label>
                                {berita.gambar_url && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500">Gambar saat ini:</p>
                                        <img
                                            src={berita.gambar_url}
                                            alt="Gambar saat ini"
                                            className="mt-1 h-32 w-auto rounded-md border object-cover"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`mt-4 flex justify-center rounded-md border-2 border-dashed px-6 py-8 transition-colors hover:border-gray-400 ${e.gambar ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                            <FileText className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <label htmlFor="gambar" className="cursor-pointer font-medium text-orange-600 hover:text-orange-500">
                                                Upload gambar baru
                                            </label>
                                            <span className="pl-1">atau drag and drop</span>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 2MB. Kosongkan jika tidak ingin ganti.</p>
                                    </div>
                                </div>
                                <input
                                    id="gambar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(ev) => setData('gambar', ev.target.files ? ev.target.files[0] : null)}
                                    className="sr-only"
                                />
                                {data.gambar && <p className="mt-2 text-sm text-gray-600">File baru: {data.gambar.name}</p>}
                                <FieldError message={e.gambar} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.berita.index')}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? 'Memperbarui...' : 'Perbarui Berita'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
