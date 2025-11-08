// resources/js/layouts/MainLayout.tsx
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, ExternalLink, Mail, MapPin, Menu, MessageSquare, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Auth {
    user: User | null;
}

interface VillageSettings {
    nama_desa: string;
    email: string;
    telepon: string;
    provinsi?: string;
    kabupaten?: string;
    kecamatan?: string;
}

interface MainLayoutProps {
    auth?: Auth;
    children: ReactNode;
    villageSettings?: VillageSettings;
}

export default function MainLayout({ auth, children }: MainLayoutProps) {
    // Ambil villageSettings dari shared props
    const { villageSettings } = usePage<{ villageSettings: VillageSettings }>().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [complaintModalOpen, setComplaintModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        telepon: '',
        judul: '',
        isi_pengaduan: '',
    });

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const openComplaintModal = () => {
        setComplaintModalOpen(true);
        closeMobileMenu();
    };

    const closeComplaintModal = () => {
        setComplaintModalOpen(false);
        reset();
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pengaduan.store'), {
            onSuccess: () => {
                closeComplaintModal();
                setSuccessModalOpen(true);
            },
        });
    };

    // Gunakan data dari villageSettings atau fallback ke nilai default
    const namaDesa = villageSettings?.nama_desa || 'Desa Cinnong';
    const emailDesa = villageSettings?.email || 'Cinnongsib@gmail.com';
    const teleponDesa = villageSettings?.telepon || '';
    const provinsi = villageSettings?.provinsi || 'Sulawesi Selatan';
    const kabupaten = villageSettings?.kabupaten || 'Kabupaten Bone';
    const kecamatan = villageSettings?.kecamatan || 'Kecamatan Sibulue';

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            {/* Navigasi */}
            <nav className="relative z-50 border-b border-gray-100 bg-[#ea580c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between sm:h-16">
                        <div className="flex items-center">
                            <Link
                                href={route('beranda')}
                                className="truncate text-base font-bold text-[#ffffff] sm:text-lg"
                                onClick={closeMobileMenu}
                            >
                                {namaDesa}
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center space-x-6 lg:flex">
                            <Link
                                href={route('beranda')}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Beranda
                            </Link>
                            <Link
                                href={route('profil.show')}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Profil Desa
                            </Link>
                            <Link
                                href={route('data.desa')}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Data Desa
                            </Link>
                            <Link
                                href={route('infografis.desa')}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Infografis
                            </Link>
                            <Link
                                href={route('berita')}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Berita
                            </Link>
                            <Link
                                href={route('publikasi.index')}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                                preserveScroll={false}
                                preserveState={false}
                            >
                                Publikasi
                            </Link>
                            <button
                                onClick={openComplaintModal}
                                className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Pengaduan
                            </button>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center space-x-3 sm:flex">
                            {auth?.user && (
                                <div className="flex items-center space-x-3">
                                    <span className="hidden max-w-32 truncate text-sm font-medium text-white md:block">Hai, {auth.user.name}</span>
                                    <Link
                                        href={route('dashboard')}
                                        className="px-2 text-xs font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff] sm:text-sm"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#c2410c] sm:text-sm"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center sm:hidden lg:hidden">
                            <button
                                type="button"
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center rounded-md p-2 text-[#fed7aa] transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`${mobileMenuOpen ? 'block' : 'hidden'} border-t border-orange-600/20 bg-[#ea580c] sm:hidden lg:hidden`}>
                    <div className="max-h-96 space-y-1 overflow-y-auto px-4 py-3">
                        {auth?.user && (
                            <div className="mb-2 border-b border-orange-600/20 px-3 py-2">
                                <span className="text-sm font-medium text-white">Selamat datang, {auth.user.name}</span>
                            </div>
                        )}

                        <Link
                            href={route('beranda')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Beranda
                        </Link>
                        <Link
                            href={route('profil.show')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Profil Desa
                        </Link>
                        <Link
                            href={route('data.desa')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Data Desa
                        </Link>
                        <Link
                            href={route('infografis.desa')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Infografis
                        </Link>
                        <Link
                            href={route('berita')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Berita
                        </Link>
                        <Link
                            href={route('publikasi.index')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                            preserveScroll={false}
                            preserveState={false}
                        >
                            Publikasi
                        </Link>
                        <button
                            onClick={openComplaintModal}
                            className="block w-full rounded-md px-3 py-3 text-left text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Pengaduan
                        </button>

                        {auth?.user && (
                            <div className="mt-3 space-y-2 border-t border-orange-600/20 pt-3">
                                <Link
                                    href={route('dashboard')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    onClick={closeMobileMenu}
                                    className="block w-full rounded-md px-3 py-3 text-left text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                >
                                    Keluar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Modal Pengaduan */}
            {complaintModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4 sm:p-6">
                            <div className="flex items-center">
                                <MessageSquare className="mr-2 h-6 w-6 text-orange-600" />
                                <h2 className="text-xl font-bold text-gray-900">Form Pengaduan Masyarakat</h2>
                            </div>
                            <button onClick={closeComplaintModal} className="rounded-full p-1 hover:bg-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        required
                                    />
                                    {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">No. Telepon *</label>
                                    <input
                                        type="tel"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        required
                                    />
                                    {errors.telepon && <p className="mt-1 text-sm text-red-600">{errors.telepon}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Pengaduan *</label>
                                    <input
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        required
                                    />
                                    {errors.judul && <p className="mt-1 text-sm text-red-600">{errors.judul}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Isi Pengaduan *</label>
                                    <textarea
                                        value={data.isi_pengaduan}
                                        onChange={(e) => setData('isi_pengaduan', e.target.value)}
                                        rows={6}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        placeholder="Jelaskan pengaduan Anda secara detail..."
                                        required
                                    />
                                    {errors.isi_pengaduan && <p className="mt-1 text-sm text-red-600">{errors.isi_pengaduan}</p>}
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeComplaintModal}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pengaduan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="p-6 text-center sm:p-8">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>

                            <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Pengaduan Berhasil Dikirim!</h3>

                            <p className="mb-6 text-sm text-gray-600 sm:text-base">
                                Terima kasih telah mengirimkan pengaduan Anda. Tim kami akan segera meninjau dan menindaklanjuti pengaduan Anda.
                            </p>

                            <button
                                onClick={closeSuccessModal}
                                className="mt-6 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 sm:text-base"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="min-h-0 flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-[#ea580c] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 sm:gap-6 sm:py-8 lg:grid-cols-3">
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold">{namaDesa}</h3>
                            <p className="text-base leading-relaxed text-orange-100">
                                Sistem informasi desa yang menyediakan data terkini tentang profil desa, statistik penduduk, dan informasi ekonomi
                                untuk transparansi dan kemudahan akses.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xl font-bold">Menu Utama</h3>
                            <ul className="space-y-2 text-base">
                                <li>
                                    <Link href={route('beranda')} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('profil.show')} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                        Profil Desa
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('data.desa')} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                        Data Desa
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('infografis.desa')} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                        Infografis
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('berita')} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                        Berita
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('publikasi.index')} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                        Publikasi
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                            <h3 className="text-xl font-bold">Kontak Kami</h3>
                            <div className="space-y-3 text-base">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-orange-200" />
                                    <div>
                                        <p className="leading-relaxed text-orange-100">
                                            {namaDesa}
                                            <br />
                                            {kecamatan}
                                            <br />
                                            {kabupaten}
                                            <br />
                                            {provinsi}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={`mailto:${emailDesa}`}
                                    className="flex items-center space-x-3 text-orange-100 transition-colors hover:text-white"
                                >
                                    <Mail className="h-5 w-5 flex-shrink-0 text-orange-200" />
                                    <span className="break-all">{emailDesa}</span>
                                </a>
                                {teleponDesa && (
                                    <div className="flex items-center space-x-3 text-orange-100">
                                        <svg className="h-5 w-5 flex-shrink-0 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <span>{teleponDesa}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-orange-600/30 py-3 sm:py-4">
                        <div className="flex flex-col items-center justify-between space-y-2 text-center sm:text-left lg:flex-row lg:space-y-0">
                            <div className="text-sm text-orange-100">
                                <p>© 2025 {namaDesa}. Sistem Informasi Desa.</p>
                                <p className="mt-1">Dibuat dengan ❤️ untuk transparansi dan kemudahan akses informasi.</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                                <a href="#" className="flex items-center space-x-1 text-orange-100 transition-colors hover:text-white">
                                    <span>Situs Web Resmi</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
