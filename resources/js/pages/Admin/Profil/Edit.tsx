// resources/js/Pages/Admin/ProfilDesa/Edit.tsx

import { FieldError, inputAdmin } from '@/components/ui/FieldError';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BarChart3, Building2, Calendar, Image as ImageIcon, Mail, MapPin, Phone, Plus, Trash2, TrendingUp, Users } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

interface Setting {
    [key: string]: string;
}

interface Official {
    id?: number;
    nama: string;
    jabatan: string;
    foto: File | null;
    existing_foto: string;
    urutan: number;
}

interface EditProfilProps {
    auth: { user: { id: number; name: string; email: string } };
    settings: Setting;
    officials: Official[];
    isAdminBps: boolean;
    errors?: any;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

// ── Field helper ─────────────────────────────────────────────────────────────
function Field({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    locked,
    error,
    icon,
    step,
    min,
}: {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    locked?: boolean;
    error?: string;
    icon?: React.ReactNode;
    step?: string;
    min?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                {icon}
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(ev) => onChange(ev.target.value)}
                placeholder={locked ? undefined : placeholder}
                disabled={locked}
                step={step}
                min={min}
                className={
                    locked
                        ? 'mt-1 block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-400 focus:outline-none'
                        : inputAdmin(error)
                }
            />
            <FieldError message={error} />
        </div>
    );
}

export default function Edit() {
    const { auth, settings, officials, isAdminBps, errors, flash } = usePage<EditProfilProps>().props;
    const [showFlash, setShowFlash] = useState(true);
    const topRef = useRef<HTMLDivElement>(null);

    // ✅ State untuk error validasi foto aparatur di sisi client
    const [fotoErrors, setFotoErrors] = useState<Record<number, string>>({});

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const t = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
    } = useForm({
        _method: 'POST',
        nama_desa: settings.nama_desa || '',
        kecamatan: settings.kecamatan || '',
        kabupaten: settings.kabupaten || '',
        provinsi: settings.provinsi || '',
        jumlah_rt: settings.jumlah_rt || '',
        luas: settings.luas || '',
        email: settings.email || '',
        telepon: settings.telepon || '',
        sejarah: settings.sejarah || '',
        visi: settings.visi || '',
        misi: settings.misi || '',
        gambar_peta: null as File | null,
        gambar_tim: null as File | null,
        stat1_label: settings.stat1_label || 'Total Penduduk',
        stat1_value: settings.stat1_value || '',
        stat2_label: settings.stat2_label || 'Jumlah Dusun',
        stat2_value: settings.stat2_value || '',
        stat3_label: settings.stat3_label || 'Sekolah',
        stat3_value: settings.stat3_value || '',
        data_terakhir: settings.data_terakhir || new Date().getFullYear().toString(),
        officials: officials.map((o) => ({
            id: o.id,
            nama: o.nama,
            jabatan: o.jabatan,
            foto: null as File | null,
            existing_foto: (o as any).foto || '',
            urutan: o.urutan,
        })),
    });

    const e = { ...errors, ...formErrors };
    const locked = !isAdminBps;

    const handleOfficialChange = (index: number, field: keyof Official, value: any) => {
        const updated = [...data.officials];
        (updated[index] as any)[field] = value;
        setData('officials', updated);
    };

    // ✅ Handler khusus untuk foto aparatur dengan validasi ukuran client-side
    const handleFotoChange = (index: number, file: File | null) => {
        const MAX_SIZE = 1024 * 1024; // 1 MB
        if (file && file.size > MAX_SIZE) {
            setFotoErrors((prev) => ({
                ...prev,
                [index]: `Ukuran foto terlalu besar (${(file.size / 1024).toFixed(0)} KB). Maksimal 1MB.`,
            }));
            // Reset file input agar tidak terkirim
            handleOfficialChange(index, 'foto', null);
            return;
        }
        // Hapus error jika file valid atau dihapus
        setFotoErrors((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
        handleOfficialChange(index, 'foto', file);
    };

    const addOfficial = () =>
        setData('officials', [
            ...data.officials,
            {
                id: undefined,
                nama: '',
                jabatan: '',
                foto: null,
                existing_foto: '',
                urutan: data.officials.length + 1,
            },
        ]);

    const removeOfficial = (index: number) => {
        // Hapus error foto untuk index yang dihapus dan re-index sisanya
        setFotoErrors((prev) => {
            const next: Record<number, string> = {};
            Object.entries(prev).forEach(([k, v]) => {
                const i = Number(k);
                if (i < index) next[i] = v;
                else if (i > index) next[i - 1] = v;
            });
            return next;
        });
        setData(
            'officials',
            data.officials.filter((_, i) => i !== index).map((o, i) => ({ ...o, urutan: i + 1 })),
        );
    };

    // ✅ Cegah submit jika ada error foto client-side
    const submit: FormEventHandler = (ev) => {
        ev.preventDefault();
        if (Object.keys(fotoErrors).length > 0) {
            topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        post(route('admin.profil.update'), { forceFormData: true });
    };

    const textareaClass = (err?: string) =>
        `mt-1 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm focus:ring-2 focus:outline-none transition ${
            err
                ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400 focus:ring-red-400/30'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/30'
        }`;

    return (
        <AuthenticatedLayout auth={auth} title="Edit Profil Desa">
            <Head title="Edit Profil Desa" />
            <style>{`
                @keyframes flash-shrink {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `}</style>
            <div ref={topRef} className="space-y-6 px-4 sm:px-0">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Profil Desa</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Perbarui informasi publik mengenai desa</p>
                    </div>
                </div>

                {/* ✅ Flash success — muncul setelah redirect dari update berhasil */}
                {showFlash && flash?.success && (
                    <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-sm">
                        <div className="flex items-start gap-3 px-4 py-3.5">
                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">Berhasil disimpan</p>
                                <p className="mt-0.5 text-sm text-green-600">{flash.success}</p>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="ml-2 flex-shrink-0 text-green-400 hover:text-green-600">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="h-1 w-full bg-green-100">
                            <div className="h-1 bg-green-400" style={{ animation: 'flash-shrink 5s linear forwards' }} />
                        </div>
                    </div>
                )}

                {/* Flash error */}
                {showFlash && flash?.error && (
                    <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm">
                        <div className="flex items-start gap-3 px-4 py-3.5">
                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800">Gagal menyimpan</p>
                                <p className="mt-0.5 text-sm text-red-600">{flash.error}</p>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="ml-2 flex-shrink-0 text-red-400 hover:text-red-600">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="h-1 w-full bg-red-100">
                            <div className="h-1 bg-red-400" style={{ animation: 'flash-shrink 5s linear forwards' }} />
                        </div>
                    </div>
                )}

                <form onSubmit={submit} noValidate>
                    <div className="space-y-6">
                        {/* ════ INFORMASI DESA ════ */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Informasi Desa</h2>
                                <p className="mt-0.5 text-sm text-gray-500">Identitas, lokasi, kontak, serta visi, misi, dan sejarah desa</p>
                            </div>
                            <div className="space-y-6 p-6">
                                {/* Identitas */}
                                <div>
                                    <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Identitas & Lokasi</p>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field
                                            label="Nama Desa"
                                            id="nama_desa"
                                            value={data.nama_desa}
                                            onChange={(v) => setData('nama_desa', v)}
                                            placeholder="Contoh: Desa Sukamaju"
                                            locked={locked}
                                            error={e.nama_desa}
                                            icon={<Building2 className="h-3.5 w-3.5 text-gray-400" />}
                                        />
                                        <Field
                                            label="Kecamatan"
                                            id="kecamatan"
                                            value={data.kecamatan}
                                            onChange={(v) => setData('kecamatan', v)}
                                            placeholder="Contoh: Sukajaya"
                                            locked={locked}
                                            error={e.kecamatan}
                                            icon={<MapPin className="h-3.5 w-3.5 text-gray-400" />}
                                        />
                                        <Field
                                            label="Kabupaten"
                                            id="kabupaten"
                                            value={data.kabupaten}
                                            onChange={(v) => setData('kabupaten', v)}
                                            placeholder="Contoh: Bandung"
                                            locked={locked}
                                            error={e.kabupaten}
                                        />
                                        <Field
                                            label="Provinsi"
                                            id="provinsi"
                                            value={data.provinsi}
                                            onChange={(v) => setData('provinsi', v)}
                                            placeholder="Contoh: Jawa Barat"
                                            locked={locked}
                                            error={e.provinsi}
                                        />
                                    </div>
                                </div>

                                {/* Kontak */}
                                <div className="border-t border-gray-100 pt-5">
                                    <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Data Wilayah & Kontak</p>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field
                                            label="Jumlah RT"
                                            id="jumlah_rt"
                                            type="number"
                                            value={data.jumlah_rt}
                                            onChange={(v) => setData('jumlah_rt', v)}
                                            placeholder="Contoh: 12"
                                            min="0"
                                            error={e.jumlah_rt}
                                        />
                                        <Field
                                            label="Luas Wilayah (Km²)"
                                            id="luas"
                                            type="number"
                                            value={data.luas}
                                            onChange={(v) => setData('luas', v)}
                                            placeholder="Contoh: 25.5"
                                            step="0.01"
                                            min="0"
                                            error={e.luas}
                                        />
                                        <Field
                                            label="Email"
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(v) => setData('email', v)}
                                            placeholder="contoh@desa.id"
                                            error={e.email}
                                            icon={<Mail className="h-3.5 w-3.5 text-gray-400" />}
                                        />
                                        <Field
                                            label="Nomor Telepon"
                                            id="telepon"
                                            type="tel"
                                            value={data.telepon}
                                            onChange={(v) => setData('telepon', v)}
                                            placeholder="0812-3456-7890"
                                            error={e.telepon}
                                            icon={<Phone className="h-3.5 w-3.5 text-gray-400" />}
                                        />
                                    </div>
                                </div>

                                {/* Visi Misi Sejarah */}
                                <div className="border-t border-gray-100 pt-5">
                                    <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Visi, Misi & Sejarah</p>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'sejarah', label: 'Sejarah', rows: 5, ph: 'Masukkan sejarah singkat desa...' },
                                            { id: 'visi', label: 'Visi', rows: 3, ph: 'Masukkan visi desa...' },
                                        ].map(({ id, label, rows, ph }) => (
                                            <div key={id}>
                                                <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
                                                    {label}
                                                </label>
                                                <textarea
                                                    id={id}
                                                    value={(data as any)[id]}
                                                    rows={rows}
                                                    placeholder={ph}
                                                    onChange={(ev) => setData(id as any, ev.target.value)}
                                                    className={textareaClass(e[id])}
                                                />
                                                <FieldError message={e[id]} />
                                            </div>
                                        ))}
                                        <div>
                                            <label htmlFor="misi" className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Misi <span className="font-normal text-gray-400"></span>
                                            </label>
                                            <textarea
                                                id="misi"
                                                value={data.misi}
                                                rows={5}
                                                placeholder={'1. Misi pertama\n2. Misi kedua\n3. Misi ketiga...'}
                                                onChange={(ev) => setData('misi', ev.target.value)}
                                                className={textareaClass(e.misi)}
                                            />
                                            <FieldError message={e.misi} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ════ STATISTIK ════ */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">
                                    <BarChart3 className="mr-2 inline h-4 w-4 text-gray-400" />
                                    Data Statistik Desa
                                </h2>
                                <p className="mt-0.5 text-sm text-gray-500">Data statistik yang ditampilkan di halaman utama</p>
                            </div>
                            <div className="space-y-4 p-6">
                                {[
                                    { num: 1, icon: <Users className="h-4 w-4 text-orange-600" /> },
                                    { num: 2, icon: <Building2 className="h-4 w-4 text-orange-600" /> },
                                    { num: 3, icon: <TrendingUp className="h-4 w-4 text-orange-600" /> },
                                ].map(({ num, icon }) => (
                                    <div key={num} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">{icon}</div>
                                            <h3 className="text-sm font-semibold text-gray-700">Statistik {num}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {['label', 'value'].map((field) => (
                                                <div key={field}>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        {field === 'label' ? 'Label' : 'Nilai'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={(data as any)[`stat${num}_${field}`]}
                                                        onChange={(ev) => setData(`stat${num}_${field}` as any, ev.target.value)}
                                                        placeholder={field === 'label' ? 'Contoh: Total Penduduk' : 'Contoh: 1.868'}
                                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-700">Tahun Data Terakhir</h3>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.data_terakhir}
                                        onChange={(ev) => setData('data_terakhir', ev.target.value)}
                                        placeholder="Contoh: 2025"
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:max-w-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ════ ASET GAMBAR ════ */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Aset Gambar</h2>
                                <p className="mt-0.5 text-sm text-gray-500">Gambar peta dan foto tim pemerintahan</p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                                {[
                                    {
                                        key: 'gambar_peta' as const,
                                        label: 'Gambar Peta',
                                        icon: <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />,
                                        alt: 'Peta Desa',
                                    },
                                    {
                                        key: 'gambar_tim' as const,
                                        label: 'Gambar Tim',
                                        icon: <Users className="mx-auto h-10 w-10 text-gray-400" />,
                                        alt: 'Tim Pemerintahan',
                                    },
                                ].map(({ key, label, icon, alt }) => (
                                    <div key={key}>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
                                        {settings[key] && !data[key] && (
                                            <img src={settings[key]} alt={alt} className="mb-3 h-40 w-full rounded-xl border object-cover" />
                                        )}
                                        {data[key] && (
                                            <img
                                                src={URL.createObjectURL(data[key] as File)}
                                                alt={`Preview ${label}`}
                                                className="mb-3 h-40 w-full rounded-xl border object-cover"
                                            />
                                        )}
                                        <div
                                            className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-8 transition hover:border-orange-400 ${e[key] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                        >
                                            <div className="text-center">
                                                {icon}
                                                <label
                                                    htmlFor={key}
                                                    className="mt-3 block cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700"
                                                >
                                                    Upload gambar baru
                                                    <input
                                                        id={key}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(ev) => setData(key, ev.target.files?.[0] || null)}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="mt-1 text-xs text-gray-400">PNG, JPG, JPEG hingga 2MB</p>
                                                {data[key] && <p className="mt-2 text-xs font-medium text-gray-600">{(data[key] as File).name}</p>}
                                            </div>
                                        </div>
                                        <FieldError message={e[key]} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ════ STRUKTUR PEMERINTAHAN ════ */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Struktur Pemerintahan</h2>
                                    <p className="mt-0.5 text-sm text-gray-500">Daftar aparatur pemerintahan desa</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addOfficial}
                                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Pegawai
                                </button>
                            </div>
                            <div className="space-y-4 p-6">
                                {data.officials.length === 0 ? (
                                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                                        <Users className="mx-auto h-12 w-12 text-gray-300" />
                                        <p className="mt-3 text-sm font-medium text-gray-700">Belum ada data pegawai</p>
                                        <button
                                            type="button"
                                            onClick={addOfficial}
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Tambahkan Pegawai Pertama
                                        </button>
                                    </div>
                                ) : (
                                    data.officials.map((official, index) => {
                                        const imageSrc =
                                            official.foto instanceof File ? URL.createObjectURL(official.foto) : official.existing_foto || '';

                                        // ✅ Ambil error foto: bisa dari client-side atau dari server (Inertia)
                                        const fotoError = fotoErrors[index] || (e as any)[`officials.${index}.foto`] || undefined;

                                        return (
                                            <div
                                                key={index}
                                                className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-orange-200"
                                            >
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                                                        {index + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOfficial(index)}
                                                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Hapus</span>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600">Nama Lengkap *</label>
                                                        <input
                                                            type="text"
                                                            value={official.nama}
                                                            placeholder="Contoh: Ahmad Suryadi"
                                                            onChange={(ev) => handleOfficialChange(index, 'nama', ev.target.value)}
                                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600">Jabatan *</label>
                                                        <input
                                                            type="text"
                                                            value={official.jabatan}
                                                            placeholder="Contoh: Kepala Desa"
                                                            onChange={(ev) => handleOfficialChange(index, 'jabatan', ev.target.value)}
                                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600">Foto</label>
                                                        <div className="flex items-center gap-3">
                                                            {imageSrc && (
                                                                <img
                                                                    src={imageSrc}
                                                                    alt={official.nama}
                                                                    className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-orange-200 object-cover"
                                                                />
                                                            )}
                                                            {/* ✅ Wrapper div untuk input + teks hint + error */}
                                                            <div className="flex-1">
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg,image/png,image/jpg"
                                                                    onChange={(ev) => handleFotoChange(index, ev.target.files?.[0] || null)}
                                                                    className={`w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-orange-700 hover:file:bg-orange-100 ${
                                                                        fotoError ? 'file:bg-red-50' : 'file:bg-orange-50'
                                                                    }`}
                                                                />
                                                                {/* ✅ Teks batas ukuran foto */}
                                                                <p className="mt-1 text-xs text-gray-400">PNG, JPG, JPEG hingga 1MB</p>
                                                                {/* ✅ Pesan error jika foto terlalu besar */}
                                                                {fotoError && (
                                                                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                                                                        <svg
                                                                            className="h-3.5 w-3.5 flex-shrink-0"
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                        {fotoError}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.dashboard')}
                                className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || Object.keys(fotoErrors).length > 0}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && (
                                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                )}
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
