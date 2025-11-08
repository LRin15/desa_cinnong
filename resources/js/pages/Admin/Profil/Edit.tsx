import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, BarChart3, Building2, Calendar, Image as ImageIcon, Mail, MapPin, Phone, Plus, Trash2, TrendingUp, Users } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

// --- TYPE DEFINITIONS ---
interface Setting {
    [key: string]: string;
}

interface Official {
    id?: number;
    nama: string;
    jabatan: string;
    foto: File | null;
    foto_url: string | null;
    urutan: number;
}

interface EditProfilProps {
    auth: {
        user: { id: number; name: string; email: string };
    };
    settings: Setting;
    officials: Official[];
    errors?: any;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

// --- MAIN COMPONENT ---
export default function Edit() {
    let pageProps: EditProfilProps;

    try {
        pageProps = usePage<EditProfilProps>().props;
    } catch (error) {
        console.error('Error getting page props:', error);
        return <div className="p-4">Error loading page. Check console.</div>;
    }

    const { auth, settings, officials, errors, flash } = pageProps;

    // Auto-hide flash messages
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    // --- GUARD CLAUSES FOR MISSING DATA ---
    if (!auth?.user) {
        return <div className="p-4">Authentication data is missing.</div>;
    }
    if (!settings || !officials) {
        return (
            <div className="p-4">
                Profile data (settings or officials) is missing.
                <Link href={route('admin.dashboard')}>Back to Dashboard</Link>
            </div>
        );
    }

    // --- FORM HOOK SETUP ---
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
        // Statistik dinamis
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
            foto_url: o.foto || null,
            urutan: o.urutan,
        })),
    });

    const allErrors = { ...errors, ...formErrors };

    // --- EVENT HANDLERS ---
    const handleOfficialChange = (index: number, field: keyof Official, value: string | File | number | null) => {
        const updatedOfficials = [...data.officials];
        (updatedOfficials[index] as any)[field] = value;
        setData('officials', updatedOfficials);
    };

    const addOfficial = () => {
        const newOfficial = {
            id: undefined,
            nama: '',
            jabatan: '',
            foto: null,
            foto_url: null,
            urutan: data.officials.length + 1,
        };
        setData('officials', [...data.officials, newOfficial]);
    };

    const removeOfficial = (index: number) => {
        const updatedOfficials = data.officials.filter((_, i) => i !== index);
        const reorderedOfficials = updatedOfficials.map((official, i) => ({
            ...official,
            urutan: i + 1,
        }));
        setData('officials', reorderedOfficials);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('Form data:', data);
        console.log('Route:', route('admin.profil.update'));

        post(route('admin.profil.update'), {
            forceFormData: true,
            onSuccess: (page) => {
                console.log('Success:', page);
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    // --- JSX RENDER ---
    return (
        <AuthenticatedLayout auth={auth} title="Edit Profil Desa">
            <Head title="Edit Profil Desa" />
            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.dashboard')}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 sm:h-10 sm:w-10"
                            title="Kembali ke Dashboard"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Edit Profil Desa</h1>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Perbarui informasi publik mengenai desa</p>
                        </div>
                    </div>
                </div>

                {/* Flash Messages */}
                {showFlash && flash?.success && (
                    <div className="animate-fade-in rounded-md border border-green-200 bg-green-50 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-green-700 sm:text-base">{flash.success}</p>
                            <button onClick={() => setShowFlash(false)} className="text-green-500 hover:text-green-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                {showFlash && flash?.error && (
                    <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-red-700 sm:text-base">{flash.error}</p>
                            <button onClick={() => setShowFlash(false)} className="text-red-500 hover:text-red-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={submit}>
                    <div className="space-y-6">
                        {/* Section 0: Informasi Desa */}
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="border-b px-4 py-4 sm:px-6 sm:py-5">
                                <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Informasi Desa</h2>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">Data identitas dan lokasi desa</p>
                            </div>
                            <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                                {/* Nama Desa */}
                                <div>
                                    <label htmlFor="nama_desa" className="block text-sm font-medium text-gray-700">
                                        <Building2 className="mr-2 inline h-4 w-4" />
                                        Nama Desa
                                    </label>
                                    <input
                                        type="text"
                                        id="nama_desa"
                                        value={data.nama_desa}
                                        onChange={(e) => setData('nama_desa', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Contoh: Desa Sukamaju"
                                    />
                                    {allErrors.nama_desa && <p className="mt-1 text-sm text-red-600">{allErrors.nama_desa}</p>}
                                </div>

                                {/* Lokasi Administratif */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700">
                                            <MapPin className="mr-2 inline h-4 w-4" />
                                            Kecamatan
                                        </label>
                                        <input
                                            type="text"
                                            id="kecamatan"
                                            value={data.kecamatan}
                                            onChange={(e) => setData('kecamatan', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Contoh: Sukajaya"
                                        />
                                        {allErrors.kecamatan && <p className="mt-1 text-sm text-red-600">{allErrors.kecamatan}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="kabupaten" className="block text-sm font-medium text-gray-700">
                                            Kabupaten
                                        </label>
                                        <input
                                            type="text"
                                            id="kabupaten"
                                            value={data.kabupaten}
                                            onChange={(e) => setData('kabupaten', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Contoh: Bandung"
                                        />
                                        {allErrors.kabupaten && <p className="mt-1 text-sm text-red-600">{allErrors.kabupaten}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="provinsi" className="block text-sm font-medium text-gray-700">
                                            Provinsi
                                        </label>
                                        <input
                                            type="text"
                                            id="provinsi"
                                            value={data.provinsi}
                                            onChange={(e) => setData('provinsi', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Contoh: Jawa Barat"
                                        />
                                        {allErrors.provinsi && <p className="mt-1 text-sm text-red-600">{allErrors.provinsi}</p>}
                                    </div>
                                </div>

                                {/* Jumlah RT dan Luas */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="jumlah_rt" className="block text-sm font-medium text-gray-700">
                                            Jumlah RT
                                        </label>
                                        <input
                                            type="number"
                                            id="jumlah_rt"
                                            value={data.jumlah_rt}
                                            onChange={(e) => setData('jumlah_rt', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Contoh: 12"
                                            min="0"
                                        />
                                        {allErrors.jumlah_rt && <p className="mt-1 text-sm text-red-600">{allErrors.jumlah_rt}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="luas" className="block text-sm font-medium text-gray-700">
                                            Luas Wilayah (Km²)
                                        </label>
                                        <input
                                            type="number"
                                            id="luas"
                                            value={data.luas}
                                            onChange={(e) => setData('luas', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Contoh: 25.5"
                                            step="0.01"
                                            min="0"
                                        />
                                        {allErrors.luas && <p className="mt-1 text-sm text-red-600">{allErrors.luas}</p>}
                                    </div>
                                </div>

                                {/* Email dan Telepon */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            <Mail className="mr-2 inline h-4 w-4" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="contoh@desa.id"
                                        />
                                        {allErrors.email && <p className="mt-1 text-sm text-red-600">{allErrors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">
                                            <Phone className="mr-2 inline h-4 w-4" />
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            id="telepon"
                                            value={data.telepon}
                                            onChange={(e) => setData('telepon', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="0812-3456-7890"
                                        />
                                        {allErrors.telepon && <p className="mt-1 text-sm text-red-600">{allErrors.telepon}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Data Statistik */}
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="border-b px-4 py-4 sm:px-6 sm:py-5">
                                <h2 className="text-lg font-medium text-gray-900 sm:text-xl">
                                    <BarChart3 className="mr-2 inline h-5 w-5" />
                                    Data Statistik Desa
                                </h2>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">Kelola data statistik yang ditampilkan di halaman utama</p>
                            </div>
                            <div className="space-y-6 p-4 sm:p-6">
                                {/* Info Box */}
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium">Tips:</p>
                                            <p className="mt-1">
                                                Anda dapat mengubah label dan nilai sesuai kebutuhan. Misalnya mengubah "Sekolah" menjadi "Rumah
                                                Sakit" atau data lainnya.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistik 1 */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                            <Users className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-900">Statistik 1</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="stat1_label" className="mb-1 block text-xs font-medium text-gray-700">
                                                Label <span className="text-gray-500">(Nama Data)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="stat1_label"
                                                value={data.stat1_label}
                                                onChange={(e) => setData('stat1_label', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Contoh: Total Penduduk"
                                            />
                                            {allErrors.stat1_label && <p className="mt-1 text-sm text-red-600">{allErrors.stat1_label}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="stat1_value" className="mb-1 block text-xs font-medium text-gray-700">
                                                Nilai <span className="text-gray-500">(Angka/Data)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="stat1_value"
                                                value={data.stat1_value}
                                                onChange={(e) => setData('stat1_value', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Contoh: 1.868"
                                            />
                                            {allErrors.stat1_value && <p className="mt-1 text-sm text-red-600">{allErrors.stat1_value}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Statistik 2 */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                            <Building2 className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-900">Statistik 2</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="stat2_label" className="mb-1 block text-xs font-medium text-gray-700">
                                                Label <span className="text-gray-500">(Nama Data)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="stat2_label"
                                                value={data.stat2_label}
                                                onChange={(e) => setData('stat2_label', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Contoh: Jumlah Dusun"
                                            />
                                            {allErrors.stat2_label && <p className="mt-1 text-sm text-red-600">{allErrors.stat2_label}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="stat2_value" className="mb-1 block text-xs font-medium text-gray-700">
                                                Nilai <span className="text-gray-500">(Angka/Data)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="stat2_value"
                                                value={data.stat2_value}
                                                onChange={(e) => setData('stat2_value', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Contoh: 4"
                                            />
                                            {allErrors.stat2_value && <p className="mt-1 text-sm text-red-600">{allErrors.stat2_value}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Statistik 3 */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                            <TrendingUp className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-900">Statistik 3</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="stat3_label" className="mb-1 block text-xs font-medium text-gray-700">
                                                Label <span className="text-gray-500">(Nama Data)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="stat3_label"
                                                value={data.stat3_label}
                                                onChange={(e) => setData('stat3_label', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Contoh: Sekolah"
                                            />
                                            {allErrors.stat3_label && <p className="mt-1 text-sm text-red-600">{allErrors.stat3_label}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="stat3_value" className="mb-1 block text-xs font-medium text-gray-700">
                                                Nilai <span className="text-gray-500">(Angka/Data)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="stat3_value"
                                                value={data.stat3_value}
                                                onChange={(e) => setData('stat3_value', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Contoh: 6"
                                            />
                                            {allErrors.stat3_value && <p className="mt-1 text-sm text-red-600">{allErrors.stat3_value}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Data Terakhir */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-900">Data Terakhir</h3>
                                    </div>
                                    <div>
                                        <label htmlFor="data_terakhir" className="mb-1 block text-xs font-medium text-gray-700">
                                            Tahun Data Terakhir
                                        </label>
                                        <input
                                            type="text"
                                            id="data_terakhir"
                                            value={data.data_terakhir}
                                            onChange={(e) => setData('data_terakhir', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:max-w-xs"
                                            placeholder="Contoh: 2025"
                                        />
                                        {allErrors.data_terakhir && <p className="mt-1 text-sm text-red-600">{allErrors.data_terakhir}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 1: General Information */}
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="border-b px-4 py-4 sm:px-6 sm:py-5">
                                <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Informasi Umum</h2>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">Visi, Misi, dan Sejarah Desa</p>
                            </div>
                            <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                                {/* Sejarah */}
                                <div>
                                    <label htmlFor="sejarah" className="block text-sm font-medium text-gray-700">
                                        Sejarah
                                    </label>
                                    <textarea
                                        id="sejarah"
                                        value={data.sejarah}
                                        onChange={(e) => setData('sejarah', e.target.value)}
                                        rows={6}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Masukkan sejarah singkat desa..."
                                    />
                                    {allErrors.sejarah && <p className="mt-1 text-sm text-red-600">{allErrors.sejarah}</p>}
                                </div>
                                {/* Visi */}
                                <div>
                                    <label htmlFor="visi" className="block text-sm font-medium text-gray-700">
                                        Visi
                                    </label>
                                    <textarea
                                        id="visi"
                                        value={data.visi}
                                        onChange={(e) => setData('visi', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Masukkan visi desa..."
                                    />
                                    {allErrors.visi && <p className="mt-1 text-sm text-red-600">{allErrors.visi}</p>}
                                </div>
                                {/* Misi */}
                                <div>
                                    <label htmlFor="misi" className="block text-sm font-medium text-gray-700">
                                        Misi <span className="font-normal text-gray-500">(Satu misi per baris)</span>
                                    </label>
                                    <textarea
                                        id="misi"
                                        value={data.misi}
                                        onChange={(e) => setData('misi', e.target.value)}
                                        rows={5}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="1. Misi pertama&#10;2. Misi kedua&#10;3. Misi ketiga..."
                                    />
                                    {allErrors.misi && <p className="mt-1 text-sm text-red-600">{allErrors.misi}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Image Assets */}
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="border-b px-4 py-4 sm:px-6 sm:py-5">
                                <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Aset Gambar</h2>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">Gambar peta dan foto tim pemerintahan</p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 sm:p-6">
                                {/* Image Uploader for Map */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Gambar Peta</label>
                                    {settings.gambar_peta && !data.gambar_peta && (
                                        <div className="mb-3">
                                            <img src={settings.gambar_peta} alt="Peta Desa" className="h-40 w-full rounded-lg border object-cover" />
                                        </div>
                                    )}
                                    {data.gambar_peta && (
                                        <div className="mb-3">
                                            <img
                                                src={URL.createObjectURL(data.gambar_peta)}
                                                alt="Preview Peta"
                                                className="h-40 w-full rounded-lg border object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-orange-400">
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                                            <div className="mt-3">
                                                <label
                                                    htmlFor="gambar_peta"
                                                    className="cursor-pointer font-medium text-orange-600 hover:text-orange-700"
                                                >
                                                    <span>Upload gambar baru</span>
                                                    <input
                                                        id="gambar_peta"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setData('gambar_peta', e.target.files?.[0] || null)}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG hingga 2MB</p>
                                            {data.gambar_peta && <p className="mt-2 text-xs font-medium text-gray-700">{data.gambar_peta.name}</p>}
                                        </div>
                                    </div>
                                    {allErrors.gambar_peta && <p className="mt-1 text-sm text-red-600">{allErrors.gambar_peta}</p>}
                                </div>
                                {/* Image Uploader for Team Photo */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Gambar Tim</label>
                                    {settings.gambar_tim && !data.gambar_tim && (
                                        <div className="mb-3">
                                            <img
                                                src={settings.gambar_tim}
                                                alt="Tim Pemerintahan"
                                                className="h-40 w-full rounded-lg border object-cover"
                                            />
                                        </div>
                                    )}
                                    {data.gambar_tim && (
                                        <div className="mb-3">
                                            <img
                                                src={URL.createObjectURL(data.gambar_tim)}
                                                alt="Preview Tim"
                                                className="h-40 w-full rounded-lg border object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-orange-400">
                                        <div className="text-center">
                                            <Users className="mx-auto h-10 w-10 text-gray-400" />
                                            <div className="mt-3">
                                                <label
                                                    htmlFor="gambar_tim"
                                                    className="cursor-pointer font-medium text-orange-600 hover:text-orange-700"
                                                >
                                                    <span>Upload gambar baru</span>
                                                    <input
                                                        id="gambar_tim"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setData('gambar_tim', e.target.files?.[0] || null)}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG hingga 2MB</p>
                                            {data.gambar_tim && <p className="mt-2 text-xs font-medium text-gray-700">{data.gambar_tim.name}</p>}
                                        </div>
                                    </div>
                                    {allErrors.gambar_tim && <p className="mt-1 text-sm text-red-600">{allErrors.gambar_tim}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Village Officials */}
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="border-b px-4 py-4 sm:px-6 sm:py-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 sm:text-xl">Struktur Pemerintahan</h2>
                                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Daftar aparatur pemerintahan desa</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addOfficial}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Tambah Pegawai</span>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4 p-4 sm:p-6">
                                {data.officials.length === 0 ? (
                                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                                        <Users className="mx-auto h-16 w-16 text-gray-400" />
                                        <h3 className="mt-4 text-sm font-medium text-gray-900">Belum ada data pegawai</h3>
                                        <p className="mt-1 text-sm text-gray-500">Mulai tambahkan pegawai pemerintahan desa</p>
                                        <button
                                            type="button"
                                            onClick={addOfficial}
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Tambahkan Pegawai Pertama
                                        </button>
                                    </div>
                                ) : (
                                    data.officials.map((official, index) => {
                                        let imageSrc = '';

                                        if (official.foto instanceof File) {
                                            imageSrc = URL.createObjectURL(official.foto);
                                        } else if (typeof official.foto_url === 'string') {
                                            imageSrc = official.foto_url;
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-orange-300"
                                            >
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                                                        {index + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOfficial(index)}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                                                        title="Hapus pegawai"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Hapus</span>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-700">
                                                            Nama Lengkap <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={official.nama}
                                                            onChange={(e) => handleOfficialChange(index, 'nama', e.target.value)}
                                                            placeholder="Contoh: Ahmad Suryadi"
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-700">
                                                            Jabatan <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={official.jabatan}
                                                            onChange={(e) => handleOfficialChange(index, 'jabatan', e.target.value)}
                                                            placeholder="Contoh: Kepala Desa"
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-700">Foto</label>
                                                        <div className="flex items-center gap-3">
                                                            {imageSrc && (
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        src={imageSrc}
                                                                        alt={official.nama}
                                                                        className="h-14 w-14 rounded-full border-2 border-orange-200 object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleOfficialChange(index, 'foto', e.target.files?.[0] || null)}
                                                                className="flex-1 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-700 hover:file:bg-orange-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse gap-3 rounded-lg border bg-white p-4 sm:flex-row sm:justify-end sm:p-6">
                            <Link
                                href={route('admin.dashboard')}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
