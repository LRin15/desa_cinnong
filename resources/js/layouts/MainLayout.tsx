// resources/js/layouts/MainLayout.tsx
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, ChevronDown, ExternalLink, Lock, LogIn, Mail, MapPin, Menu, MessageSquare, X } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
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

interface LayananSetting {
    name: string;
    is_active: boolean;
    category: 'kependudukan' | 'umum';
}

interface MainLayoutProps {
    auth?: Auth;
    children: ReactNode;
    villageSettings?: VillageSettings;
}

export default function MainLayout({ auth, children }: MainLayoutProps) {
    const { villageSettings, layananSettings } = usePage<{
        villageSettings: VillageSettings;
        layananSettings: Record<string, LayananSetting>;
    }>().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [complaintModalOpen, setComplaintModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [mobileLayananOpen, setMobileLayananOpen] = useState(false);
    // State untuk modal login prompt
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [loginPromptType, setLoginPromptType] = useState<'layanan' | 'pengaduan'>('layanan');

    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        telepon: '',
        judul: '',
        isi_pengaduan: '',
    });

    // Cek apakah user adalah pengguna terdaftar
    const isPenggunaTerdaftar = auth?.user?.role === 'pengguna_terdaftar';
    const isLoggedIn = !!auth?.user;

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLayananDropdownOpen(false);
                setActiveSubmenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileLayananOpen(false);
    };

    // Handler klik layanan — cek dulu apakah pengguna terdaftar
    const handleLayananClick = (e: React.MouseEvent) => {
        if (!isPenggunaTerdaftar) {
            e.preventDefault();
            setLoginPromptType('layanan');
            setLoginPromptOpen(true);
            closeMobileMenu();
        }
    };

    // Handler klik pengaduan — cek dulu apakah pengguna terdaftar
    const openComplaintModal = () => {
        if (!isPenggunaTerdaftar) {
            setLoginPromptType('pengaduan');
            setLoginPromptOpen(true);
            closeMobileMenu();
            return;
        }
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

    const namaDesa = villageSettings?.nama_desa || 'Desa Cinnong';
    const emailDesa = villageSettings?.email || 'Cinnongsib@gmail.com';
    const teleponDesa = villageSettings?.telepon || '';
    const provinsi = villageSettings?.provinsi || 'Sulawesi Selatan';
    const kabupaten = villageSettings?.kabupaten || 'Kabupaten Bone';
    const kecamatan = villageSettings?.kecamatan || 'Kecamatan Sibulue';

    // Filter layanan berdasarkan status aktif
    const activeLayananKependudukan = useMemo(() => {
        const allLayanan = [
            { name: 'Surat Pengantar KTP', route: 'layanan.ktp', key: 'layanan_ktp' },
            { name: 'Surat Pengantar KK', route: 'layanan.kk', key: 'layanan_kk' },
            { name: 'Surat Keterangan Domisili', route: 'layanan.domisili', key: 'layanan_domisili' },
            { name: 'Surat Keterangan Usaha', route: 'layanan.usaha', key: 'layanan_usaha' },
            { name: 'Surat Keterangan Tidak Mampu (SKTM)', route: 'layanan.sktm', key: 'layanan_sktm' },
            { name: 'Surat Keterangan Kelahiran', route: 'layanan.kelahiran', key: 'layanan_kelahiran' },
            { name: 'Surat Keterangan Kematian', route: 'layanan.kematian', key: 'layanan_kematian' },
        ];

        return allLayanan.filter((layanan) => {
            const setting = layananSettings?.[layanan.key];
            return setting?.is_active === true;
        });
    }, [layananSettings]);

    const activeLayananUmum = useMemo(() => {
        const allLayanan = [
            { name: 'Surat Pengantar Nikah', route: 'layanan.nikah', key: 'layanan_nikah' },
            { name: 'Surat Keterangan Pindah', route: 'layanan.pindah', key: 'layanan_pindah' },
            { name: 'Surat Izin Kegiatan', route: 'layanan.izin-kegiatan', key: 'layanan_izin_kegiatan' },
            { name: 'Surat Rekomendasi Desa', route: 'layanan.rekomendasi', key: 'layanan_rekomendasi' },
        ];

        return allLayanan.filter((layanan) => {
            const setting = layananSettings?.[layanan.key];
            return setting?.is_active === true;
        });
    }, [layananSettings]);

    const hasActiveLayanan = activeLayananKependudukan.length > 0 || activeLayananUmum.length > 0;

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

                            {/* Dropdown Layanan */}
                            {hasActiveLayanan && (
                                <div
                                    className="relative"
                                    ref={dropdownRef}
                                    onMouseEnter={() => {
                                        if (isPenggunaTerdaftar) {
                                            setLayananDropdownOpen(true);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        setLayananDropdownOpen(false);
                                        setActiveSubmenu(null);
                                    }}
                                >
                                    <button
                                        onClick={handleLayananClick}
                                        className="flex items-center text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                                    >
                                        Layanan
                                        {!isPenggunaTerdaftar && <Lock className="ml-1 h-3 w-3 opacity-70" />}
                                        {isPenggunaTerdaftar && <ChevronDown className="ml-1 h-4 w-4" />}
                                    </button>

                                    {/* Dropdown Menu — hanya tampil jika pengguna terdaftar */}
                                    {layananDropdownOpen && isPenggunaTerdaftar && (
                                        <div className="absolute top-full left-0 mt-1 w-64 rounded-md bg-white shadow-lg">
                                            {activeLayananKependudukan.length > 0 && (
                                                <div className="relative" onMouseEnter={() => setActiveSubmenu('kependudukan')}>
                                                    <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50">
                                                        <span>Layanan Administrasi Kependudukan</span>
                                                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                                    </div>

                                                    {activeSubmenu === 'kependudukan' && (
                                                        <div className="absolute top-0 left-full ml-1 w-64 rounded-md bg-white shadow-lg">
                                                            {activeLayananKependudukan.map((layanan, index) => (
                                                                <Link
                                                                    key={index}
                                                                    href={route(layanan.route)}
                                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                                >
                                                                    {layanan.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {activeLayananKependudukan.length > 0 && activeLayananUmum.length > 0 && (
                                                <div className="border-t border-gray-100" />
                                            )}

                                            {activeLayananUmum.length > 0 && (
                                                <div className="relative" onMouseEnter={() => setActiveSubmenu('umum')}>
                                                    <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50">
                                                        <span>Layanan Administrasi Umum</span>
                                                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                                    </div>

                                                    {activeSubmenu === 'umum' && (
                                                        <div className="absolute top-0 left-full ml-1 w-64 rounded-md bg-white shadow-lg">
                                                            {activeLayananUmum.map((layanan, index) => (
                                                                <Link
                                                                    key={index}
                                                                    href={route(layanan.route)}
                                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                                >
                                                                    {layanan.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={openComplaintModal}
                                className="flex items-center text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                            >
                                Pengaduan
                                {!isPenggunaTerdaftar && <Lock className="ml-1 h-3 w-3 opacity-70" />}
                            </button>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center space-x-3 sm:flex">
                            {auth?.user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="hidden max-w-32 truncate text-sm font-medium text-white md:block">Hai, {auth.user.name}</span>
                                    {auth.user.role === 'pengguna_terdaftar' ? (
                                        <Link
                                            href={route('pengguna.profil')}
                                            className="px-2 text-xs font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff] sm:text-sm"
                                        >
                                            Profil
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('dashboard')}
                                            className="px-2 text-xs font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff] sm:text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#c2410c] sm:text-sm"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-white px-4 py-1.5 text-xs font-medium text-orange-600 shadow-sm transition duration-150 ease-in-out hover:bg-orange-50 sm:text-sm"
                                >
                                    Masuk
                                </Link>
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

                        {/* Mobile Layanan */}
                        {hasActiveLayanan && (
                            <div>
                                <button
                                    onClick={(e) => {
                                        if (!isPenggunaTerdaftar) {
                                            handleLayananClick(e);
                                        } else {
                                            setMobileLayananOpen(!mobileLayananOpen);
                                        }
                                    }}
                                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                >
                                    <span className="flex items-center gap-2">
                                        Layanan
                                        {!isPenggunaTerdaftar && <Lock className="h-3.5 w-3.5 opacity-70" />}
                                    </span>
                                    {isPenggunaTerdaftar && (
                                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileLayananOpen ? 'rotate-180' : ''}`} />
                                    )}
                                </button>

                                {mobileLayananOpen && isPenggunaTerdaftar && (
                                    <div className="ml-4 space-y-1">
                                        {activeLayananKependudukan.length > 0 && (
                                            <div className="py-2">
                                                <p className="px-3 text-xs font-semibold text-orange-200 uppercase">Administrasi Kependudukan</p>
                                                {activeLayananKependudukan.map((layanan, index) => (
                                                    <Link
                                                        key={index}
                                                        href={route(layanan.route)}
                                                        onClick={closeMobileMenu}
                                                        className="block rounded-md px-3 py-2 text-sm text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                                    >
                                                        {layanan.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {activeLayananUmum.length > 0 && (
                                            <div className="border-t border-orange-600/20 py-2">
                                                <p className="px-3 text-xs font-semibold text-orange-200 uppercase">Administrasi Umum</p>
                                                {activeLayananUmum.map((layanan, index) => (
                                                    <Link
                                                        key={index}
                                                        href={route(layanan.route)}
                                                        onClick={closeMobileMenu}
                                                        className="block rounded-md px-3 py-2 text-sm text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                                    >
                                                        {layanan.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={openComplaintModal}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Pengaduan
                            {!isPenggunaTerdaftar && <Lock className="h-3.5 w-3.5 opacity-70" />}
                        </button>

                        {auth?.user ? (
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
                        ) : (
                            <div className="mt-3 border-t border-orange-600/20 pt-3">
                                <Link
                                    href={route('login')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-md bg-white px-3 py-3 text-center text-base font-medium text-orange-600 transition duration-150 ease-in-out hover:bg-orange-50"
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ===================== MODAL LOGIN PROMPT ===================== */}
            {loginPromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                        {/* Header strip */}
                        <div className="bg-orange-600 px-6 py-5 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                                <Lock className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Akses Terbatas</h3>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 text-center">
                            <p className="mb-1 text-base font-semibold text-gray-900">
                                {loginPromptType === 'layanan' ? 'Fitur Layanan Desa' : 'Fitur Pengaduan Masyarakat'}
                            </p>
                            <p className="mb-6 text-sm leading-relaxed text-gray-500">
                                {isLoggedIn
                                    ? 'Fitur ini hanya dapat diakses oleh pengguna dengan akun terdaftar sebagai warga desa.'
                                    : 'Anda perlu masuk ke akun terlebih dahulu untuk mengakses fitur ini. Silakan login atau daftarkan diri Anda.'}
                            </p>

                            {/* Buttons */}
                            <div className="space-y-3">
                                {!isLoggedIn && (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
                                        >
                                            <LogIn className="h-4 w-4" />
                                            Masuk ke Akun
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                                        >
                                            Daftar Akun Baru
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={() => setLoginPromptOpen(false)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                >
                                    Kembali
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Pengaduan */}
            {complaintModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        {/* Header */}
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
                            {/* Info akun pengirim — diambil otomatis dari sesi login */}
                            <div className="mb-5 rounded-lg border border-orange-100 bg-orange-50 p-4">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-orange-600 uppercase">Pengaduan dikirim atas nama</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-200 text-sm font-bold text-orange-700">
                                        {auth?.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{auth?.user?.name}</p>
                                        <p className="text-xs text-gray-500">{auth?.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* No. Telepon */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        No. Telepon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        required
                                    />
                                    {errors.telepon && <p className="mt-1 text-sm text-red-600">{errors.telepon}</p>}
                                </div>

                                {/* Judul Pengaduan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Judul Pengaduan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder="Ringkasan singkat pengaduan Anda"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                        required
                                    />
                                    {errors.judul && <p className="mt-1 text-sm text-red-600">{errors.judul}</p>}
                                </div>

                                {/* Isi Pengaduan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Isi Pengaduan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.isi_pengaduan}
                                        onChange={(e) => setData('isi_pengaduan', e.target.value)}
                                        rows={6}
                                        placeholder="Jelaskan pengaduan Anda secara detail..."
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
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
