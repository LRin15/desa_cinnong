// resources/js/Pages/Layanan/FormLayanan.tsx
// Validasi sepenuhnya server-side (Laravel + Inertia).
// Tidak ada atribut `required` di elemen HTML agar browser tidak memunculkan
// tooltip native "Please fill out this field." dan FieldError tampil konsisten.

import { FieldError, inputBase } from '@/components/ui/FieldError';
import MainLayout from '@/layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'textarea' | 'file' | 'tel';
    required: boolean;
    options?: string[];
    accept?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    multiple?: boolean;
}

interface UserInfo {
    name: string;
    email: string;
}

interface FormLayananProps {
    auth?: any;
    jenisLayanan: string;
    deskripsi: string;
    persyaratan: string[];
    formFields: FormField[];
    userInfo: UserInfo;
}

export default function FormLayanan({ auth, jenisLayanan, deskripsi, persyaratan, formFields, userInfo }: FormLayananProps) {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [filePreviews, setFilePreviews] = useState<{ [key: string]: string[] }>({});

    // Inisialisasi data form
    // field_required: JSON array nama field wajib, dikirim ke server agar
    // Laravel tahu mana yang harus divalidasi sebagai required.
    const initialData: Record<string, any> = {
        jenis_layanan: jenisLayanan,
        field_required: JSON.stringify(formFields.filter((f) => f.required).map((f) => f.name)),
    };
    formFields.forEach((field) => {
        if (field.type === 'file') {
            initialData[field.name] = field.multiple ? [] : null;
        } else if (field.type === 'select' && field.options) {
            initialData[field.name] = field.options[0];
        } else if (field.name === 'nama_lengkap') {
            initialData[field.name] = userInfo.name;
        } else {
            initialData[field.name] = '';
        }
    });

    const { data, setData, post, processing, errors, reset } = useForm<Record<string, any>>(initialData);

    const handleFileChange = (fieldName: string, files: FileList | null, multiple: boolean = false) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);

        if (multiple) {
            const currentFiles = data[fieldName] || [];
            setData(fieldName, [...currentFiles, ...fileArray]);
            fileArray.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setFilePreviews((prev) => ({
                            ...prev,
                            [fieldName]: [...(prev[fieldName] || []), reader.result as string],
                        }));
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            setData(fieldName, fileArray[0]);
            if (fileArray[0].type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews((prev) => ({ ...prev, [fieldName]: [reader.result as string] }));
                };
                reader.readAsDataURL(fileArray[0]);
            }
        }
    };

    const removeFile = (fieldName: string, index: number, multiple: boolean = false) => {
        if (multiple) {
            const newFiles = [...(data[fieldName] || [])];
            newFiles.splice(index, 1);
            setData(fieldName, newFiles);
            const newPreviews = [...(filePreviews[fieldName] || [])];
            newPreviews.splice(index, 1);
            setFilePreviews((prev) => ({ ...prev, [fieldName]: newPreviews }));
        } else {
            setData(fieldName, null);
            setFilePreviews((prev) => ({ ...prev, [fieldName]: [] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        // Cegah validasi bawaan browser — validasi ditangani Laravel
        e.preventDefault();
        post(route('layanan.submit'), {
            forceFormData: true,
            onSuccess: () => {
                setSuccessModalOpen(true);
                reset();
                setFilePreviews({});
            },
        });
    };

    const renderField = (field: FormField) => {
        const fieldError = errors[field.name];
        const handleChange = (value: any) => setData(field.name as never, value as never);

        const label = (
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="ml-0.5 text-red-500">*</span>}
                {field.name === 'nama_lengkap' && <span className="ml-2 text-xs font-normal text-orange-500">(dari akun Anda)</span>}
            </label>
        );

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.name}>
                        {label}
                        <textarea
                            value={data[field.name] || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            rows={field.rows || 3}
                            placeholder={field.placeholder}
                            // ⛔ Tidak ada `required` — biarkan Laravel yang memvalidasi
                            className={inputBase(fieldError)}
                        />
                        <FieldError message={fieldError} />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.name}>
                        {label}
                        <select
                            value={data[field.name]}
                            onChange={(e) => handleChange(e.target.value)}
                            // ⛔ Tidak ada `required`
                            className={inputBase(fieldError)}
                        >
                            {field.options?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <FieldError message={fieldError} />
                    </div>
                );

            case 'file': {
                const files = field.multiple ? data[field.name] || [] : data[field.name] ? [data[field.name]] : [];
                const previews = filePreviews[field.name] || [];

                return (
                    <div key={field.name}>
                        {label}
                        <div className="mt-1">
                            <label
                                className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-4 transition hover:bg-orange-50 ${
                                    fieldError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-orange-400'
                                }`}
                            >
                                <div className="text-center">
                                    <Upload className={`mx-auto h-8 w-8 ${fieldError ? 'text-red-400' : 'text-gray-400'}`} />
                                    <p className="mt-2 text-sm text-gray-600">Klik untuk upload file</p>
                                </div>
                                {/* ⛔ Tidak ada `required` pada input file */}
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(field.name, e.target.files, !!field.multiple)}
                                    accept={field.accept}
                                    multiple={field.multiple}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((file: File, index: number) => (
                                    <div key={index} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                                        <div className="flex items-center space-x-3">
                                            {previews[index] ? (
                                                <img src={previews[index]} alt="Preview" className="h-12 w-12 rounded object-cover" />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                                                    <FileText className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(field.name, index, !!field.multiple)}
                                            className="rounded-full p-1 text-red-600 hover:bg-red-50"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <FieldError message={fieldError} />
                    </div>
                );
            }

            default:
                return (
                    <div key={field.name}>
                        {label}
                        <input
                            type={field.type}
                            value={data[field.name] || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder={field.placeholder}
                            maxLength={field.maxLength}
                            // ⛔ Tidak ada `required` — validasi sepenuhnya di Laravel
                            className={inputBase(fieldError)}
                        />
                        <FieldError message={fieldError} />
                    </div>
                );
        }
    };

    return (
        <MainLayout auth={auth}>
            <Head title={jenisLayanan} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        {/* Header card */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <FileText className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{jenisLayanan}</h1>
                                    <p className="text-gray-600">{deskripsi}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Form utama */}
                        <div>
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-xl font-bold text-gray-900">Formulir Permohonan</h2>

                                {/*
                                 * noValidate → matikan validasi bawaan browser sepenuhnya.
                                 * Semua validasi dilakukan oleh Laravel dan ditampilkan
                                 * melalui <FieldError /> yang konsisten di seluruh aplikasi.
                                 */}
                                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {formFields.map((field) => {
                                            const fullWidth =
                                                ['textarea', 'file'].includes(field.type) ||
                                                ['nama_lengkap', 'nik', 'alamat', 'no_telepon'].includes(field.name);
                                            return (
                                                <div key={field.name} className={fullWidth ? 'sm:col-span-2' : ''}>
                                                    {renderField(field)}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                                        <a
                                            href={route('beranda')}
                                            className="rounded-md border border-gray-300 px-6 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Batal
                                        </a>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Mengirim...' : 'Kirim Permohonan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal sukses */}
            {successModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">Permohonan Berhasil Dikirim!</h3>
                        <p className="mb-2 text-sm text-gray-600">
                            Terima kasih, <span className="font-semibold">{userInfo.name}</span>.
                        </p>
                        <p className="mb-6 text-sm text-gray-500">
                            Permohonan <span className="font-medium">{jenisLayanan}</span> Anda akan segera kami proses.
                        </p>
                        <a
                            href={route('beranda')}
                            className="inline-block w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            Kembali ke Beranda
                        </a>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
