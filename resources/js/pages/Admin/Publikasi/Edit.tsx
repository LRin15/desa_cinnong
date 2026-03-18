// resources/js/Pages/Admin/Publikasi/Edit.tsx

import { FieldError, inputAdminLg } from '@/components/ui/FieldError';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import { FormEventHandler } from 'react';

interface PublikasiData {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal_publikasi: string;
    file_info: string;
}
interface EditPageProps {
    auth: { user: { id: number; name: string; email: string } };
    publikasi: PublikasiData;
    errors?: { judul?: string; deskripsi?: string; tanggal_publikasi?: string; file?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function Edit() {
    const { auth, publikasi, errors, flash } = usePage<EditPageProps>().props;

    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
        progress,
    } = useForm({
        judul: publikasi.judul || '',
        deskripsi: publikasi.deskripsi || '',
        tanggal_publikasi: publikasi.tanggal_publikasi || '',
        file: null as File | null,
        _method: 'PUT' as const,
    });

    const e = { ...errors, ...formErrors };

    const submit: FormEventHandler = (ev) => {
        ev.preventDefault();
        post(route('admin.publikasi.update', publikasi.id));
    };

    return (
        <AuthenticatedLayout auth={auth} title="Edit Publikasi">
            <Head title={`Edit Publikasi: ${publikasi.judul}`} />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.publikasi.index')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 sm:h-10 sm:w-10"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Publikasi</h1>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui detail publikasi di bawah</p>
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
                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Formulir Edit Publikasi</h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Pastikan informasi yang diperbarui sudah benar</p>
                    </div>

                    <form onSubmit={submit} noValidate className="p-4 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Judul + Tanggal */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div>
                                    <label htmlFor="judul" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Judul <span className="text-red-500">*</span>
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
                                <div>
                                    <label htmlFor="tanggal_publikasi" className="block text-sm font-medium text-gray-700 sm:text-base">
                                        Tanggal Publikasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="tanggal_publikasi"
                                        type="date"
                                        value={data.tanggal_publikasi}
                                        onChange={(ev) => setData('tanggal_publikasi', ev.target.value)}
                                        className={inputAdminLg(e.tanggal_publikasi)}
                                    />
                                    <FieldError message={e.tanggal_publikasi} />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 sm:text-base">
                                    Deskripsi
                                </label>
                                <textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    rows={4}
                                    onChange={(ev) => setData('deskripsi', ev.target.value)}
                                    className={inputAdminLg(e.deskripsi)}
                                />
                                <FieldError message={e.deskripsi} />
                            </div>

                            {/* File */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 sm:text-base">Ganti File Dokumen</label>
                                {publikasi.file_info && (
                                    <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3">
                                        <p className="text-xs text-gray-500">File saat ini:</p>
                                        <p className="text-sm font-medium text-blue-900">{publikasi.file_info}</p>
                                    </div>
                                )}
                                <div
                                    className={`mt-4 flex justify-center rounded-md border-2 border-dashed px-6 py-8 transition-colors hover:border-gray-400 ${e.file ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                                            <Upload className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <label htmlFor="file" className="cursor-pointer font-medium text-orange-600 hover:text-orange-500">
                                                Upload file baru
                                            </label>
                                            <span className="pl-1">atau drag and drop</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC, DOCX, XLS, XLSX hingga 5MB. Kosongkan jika tidak ingin ganti.
                                        </p>
                                    </div>
                                </div>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={(ev) => setData('file', ev.target.files ? ev.target.files[0] : null)}
                                    className="sr-only"
                                />
                                {data.file && <p className="mt-2 text-sm text-gray-600">File baru: {data.file.name}</p>}
                                {progress && (
                                    <div className="mt-2">
                                        <div className="h-2 w-full rounded-full bg-gray-200">
                                            <div
                                                className="h-2 rounded-full bg-orange-600 transition-all duration-300"
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Upload progress: {progress.percentage}%</p>
                                    </div>
                                )}
                                <FieldError message={e.file} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.publikasi.index')}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? 'Memperbarui...' : 'Perbarui Publikasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
