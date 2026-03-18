// resources/js/layouts/MainLayout.tsx
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ExternalLink, Lock, LogIn, Mail, MapPin, Menu, X } from 'lucide-react';
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
    category: 'kependudukan' | 'umum' | 'pengaduan';
}

interface MainLayoutProps {
    auth?: Auth;
    children: ReactNode;
}

export default function MainLayout({ auth, children }: MainLayoutProps) {
    const { villageSettings, layananSettings } = usePage<{
        villageSettings: VillageSettings;
        layananSettings: Record<string, LayananSetting>;
    }>().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [mobileLayananOpen, setMobileLayananOpen] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const isPenggunaTerdaftar = auth?.user?.role === 'pengguna_terdaftar';
    const isLoggedIn = !!auth?.user;

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

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileLayananOpen(false);
    };

    const handleLayananClick = (e: React.MouseEvent) => {
        if (!isPenggunaTerdaftar) {
            e.preventDefault();
            setLoginPromptOpen(true);
            closeMobileMenu();
        }
    };

    const namaDesa = villageSettings?.nama_desa || 'Desa Cinnong';
    const emailDesa = villageSettings?.email || 'Cinnongsib@gmail.com';
    const teleponDesa = villageSettings?.telepon || '';
    const provinsi = villageSettings?.provinsi || 'Sulawesi Selatan';
    const kabupaten = villageSettings?.kabupaten || 'Kabupaten Bone';
    const kecamatan = villageSettings?.kecamatan || 'Kecamatan Sibulue';

    // ── Layanan Kependudukan ──────────────────────────────────────
    const activeLayananKependudukan = useMemo(() => {
        const all = [
            { name: 'Surat Pengantar KTP', route: 'layanan.ktp', key: 'layanan_ktp' },
            { name: 'Surat Pengantar KK', route: 'layanan.kk', key: 'layanan_kk' },
            { name: 'Surat Keterangan Domisili', route: 'layanan.domisili', key: 'layanan_domisili' },
            { name: 'Surat Keterangan Usaha', route: 'layanan.usaha', key: 'layanan_usaha' },
            { name: 'Surat Keterangan Tidak Mampu (SKTM)', route: 'layanan.sktm', key: 'layanan_sktm' },
            { name: 'Surat Keterangan Kelahiran', route: 'layanan.kelahiran', key: 'layanan_kelahiran' },
            { name: 'Surat Keterangan Kematian', route: 'layanan.kematian', key: 'layanan_kematian' },
        ];
        return all.filter((l) => layananSettings?.[l.key]?.is_active === true);
    }, [layananSettings]);

    // ── Layanan Umum ──────────────────────────────────────────────
    const activeLayananUmum = useMemo(() => {
        const all = [
            { name: 'Surat Pengantar Nikah', route: 'layanan.nikah', key: 'layanan_nikah' },
            { name: 'Surat Keterangan Pindah', route: 'layanan.pindah', key: 'layanan_pindah' },
            { name: 'Surat Izin Kegiatan', route: 'layanan.izin-kegiatan', key: 'layanan_izin_kegiatan' },
            { name: 'Surat Rekomendasi Desa', route: 'layanan.rekomendasi', key: 'layanan_rekomendasi' },
        ];
        return all.filter((l) => layananSettings?.[l.key]?.is_active === true);
    }, [layananSettings]);

    // ── Layanan Pengaduan & Aspirasi ──────────────────────────────
    const activeLayananPengaduan = useMemo(() => {
        const all = [{ name: 'Pengaduan & Aspirasi Masyarakat', route: 'layanan.pengaduan-aspirasi', key: 'layanan_pengaduan_aspirasi' }];
        return all.filter((l) => layananSettings?.[l.key]?.is_active === true);
    }, [layananSettings]);

    const hasActiveLayanan = activeLayananKependudukan.length > 0 || activeLayananUmum.length > 0 || activeLayananPengaduan.length > 0;

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            {/* ── Navigasi ── */}
            <nav className="relative z-50 border-b border-gray-100 bg-[#ea580c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between sm:h-16">
                        {/* Logo / Nama Desa */}
                        <Link href={route('beranda')} onClick={closeMobileMenu} className="truncate text-base font-bold text-white sm:text-lg">
                            {namaDesa}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center space-x-6 lg:flex">
                            {[
                                { label: 'Beranda', href: route('beranda') },
                                { label: 'Profil Desa', href: route('profil.show') },
                                { label: 'Data Desa', href: route('data.desa') },
                                { label: 'Infografis', href: route('infografis.desa') },
                                { label: 'Berita', href: route('berita') },
                            ].map((item) => (
                                <Link key={item.label} href={item.href} className="text-sm font-medium text-[#fed7aa] transition hover:text-white">
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href={route('publikasi.index')}
                                className="text-sm font-medium text-[#fed7aa] transition hover:text-white"
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
                                        if (isPenggunaTerdaftar) setLayananDropdownOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                        setLayananDropdownOpen(false);
                                        setActiveSubmenu(null);
                                    }}
                                >
                                    <button
                                        onClick={handleLayananClick}
                                        className="flex items-center text-sm font-medium text-[#fed7aa] transition hover:text-white"
                                    >
                                        Layanan
                                        {!isPenggunaTerdaftar && <Lock className="ml-1 h-3 w-3 opacity-70" />}
                                        {isPenggunaTerdaftar && <ChevronDown className="ml-1 h-4 w-4" />}
                                    </button>

                                    {layananDropdownOpen && isPenggunaTerdaftar && (
                                        <div className="absolute top-full left-0 mt-1 w-64 rounded-md bg-white shadow-lg">
                                            {/* Kependudukan */}
                                            {activeLayananKependudukan.length > 0 && (
                                                <div className="relative" onMouseEnter={() => setActiveSubmenu('kependudukan')}>
                                                    <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50">
                                                        <span>Layanan Administrasi Kependudukan</span>
                                                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                                    </div>
                                                    {activeSubmenu === 'kependudukan' && (
                                                        <div className="absolute top-0 left-full ml-1 w-64 rounded-md bg-white shadow-lg">
                                                            {activeLayananKependudukan.map((l, i) => (
                                                                <Link
                                                                    key={i}
                                                                    href={route(l.route)}
                                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                                >
                                                                    {l.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {activeLayananKependudukan.length > 0 && activeLayananUmum.length > 0 && (
                                                <div className="border-t border-gray-100" />
                                            )}

                                            {/* Umum */}
                                            {activeLayananUmum.length > 0 && (
                                                <div className="relative" onMouseEnter={() => setActiveSubmenu('umum')}>
                                                    <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50">
                                                        <span>Layanan Administrasi Umum</span>
                                                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                                    </div>
                                                    {activeSubmenu === 'umum' && (
                                                        <div className="absolute top-0 left-full ml-1 w-64 rounded-md bg-white shadow-lg">
                                                            {activeLayananUmum.map((l, i) => (
                                                                <Link
                                                                    key={i}
                                                                    href={route(l.route)}
                                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                                >
                                                                    {l.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {(activeLayananKependudukan.length > 0 || activeLayananUmum.length > 0) &&
                                                activeLayananPengaduan.length > 0 && <div className="border-t border-gray-100" />}

                                            {/* Pengaduan & Aspirasi */}
                                            {activeLayananPengaduan.length > 0 && (
                                                <div className="relative" onMouseEnter={() => setActiveSubmenu('pengaduan')}>
                                                    <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50">
                                                        <span>Pengaduan &amp; Aspirasi</span>
                                                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                                    </div>
                                                    {activeSubmenu === 'pengaduan' && (
                                                        <div className="absolute top-0 left-full ml-1 w-64 rounded-md bg-white shadow-lg">
                                                            {activeLayananPengaduan.map((l, i) => (
                                                                <Link
                                                                    key={i}
                                                                    href={route(l.route)}
                                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                                                >
                                                                    {l.name}
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
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center space-x-3 sm:flex">
                            {auth?.user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="hidden max-w-32 truncate text-sm font-medium text-white md:block">Hai, {auth.user.name}</span>
                                    {auth.user.role === 'pengguna_terdaftar' ? (
                                        <Link
                                            href={route('pengguna.profil')}
                                            className="px-2 text-xs font-medium text-[#fed7aa] transition hover:text-white sm:text-sm"
                                        >
                                            Profil
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('dashboard')}
                                            className="px-2 text-xs font-medium text-[#fed7aa] transition hover:text-white sm:text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#c2410c] sm:text-sm"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-white px-4 py-1.5 text-xs font-medium text-orange-600 shadow-sm transition hover:bg-orange-50 sm:text-sm"
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

                        {[
                            { label: 'Beranda', href: route('beranda') },
                            { label: 'Profil Desa', href: route('profil.show') },
                            { label: 'Data Desa', href: route('data.desa') },
                            { label: 'Infografis', href: route('infografis.desa') },
                            { label: 'Berita', href: route('berita') },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={route('publikasi.index')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
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
                                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
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
                                                {activeLayananKependudukan.map((l, i) => (
                                                    <Link
                                                        key={i}
                                                        href={route(l.route)}
                                                        onClick={closeMobileMenu}
                                                        className="block rounded-md px-3 py-2 text-sm text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                                                    >
                                                        {l.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {activeLayananUmum.length > 0 && (
                                            <div className="border-t border-orange-600/20 py-2">
                                                <p className="px-3 text-xs font-semibold text-orange-200 uppercase">Administrasi Umum</p>
                                                {activeLayananUmum.map((l, i) => (
                                                    <Link
                                                        key={i}
                                                        href={route(l.route)}
                                                        onClick={closeMobileMenu}
                                                        className="block rounded-md px-3 py-2 text-sm text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                                                    >
                                                        {l.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {activeLayananPengaduan.length > 0 && (
                                            <div className="border-t border-orange-600/20 py-2">
                                                <p className="px-3 text-xs font-semibold text-orange-200 uppercase">Pengaduan &amp; Aspirasi</p>
                                                {activeLayananPengaduan.map((l, i) => (
                                                    <Link
                                                        key={i}
                                                        href={route(l.route)}
                                                        onClick={closeMobileMenu}
                                                        className="block rounded-md px-3 py-2 text-sm text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                                                    >
                                                        {l.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {auth?.user ? (
                            <div className="mt-3 space-y-2 border-t border-orange-600/20 pt-3">
                                {auth.user.role === 'pengguna_terdaftar' ? (
                                    <Link
                                        href={route('pengguna.profil')}
                                        onClick={closeMobileMenu}
                                        className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                                    >
                                        Profil Saya
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        onClick={closeMobileMenu}
                                        className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    onClick={closeMobileMenu}
                                    className="block w-full rounded-md px-3 py-3 text-left text-base font-medium text-[#fed7aa] transition hover:bg-white/10 hover:text-white"
                                >
                                    Keluar
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-3 border-t border-orange-600/20 pt-3">
                                <Link
                                    href={route('login')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-md bg-white px-3 py-3 text-center text-base font-medium text-orange-600 transition hover:bg-orange-50"
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Modal Login Prompt ── */}
            {loginPromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="bg-orange-600 px-6 py-5 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                                <Lock className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Akses Terbatas</h3>
                        </div>
                        <div className="px-6 py-6 text-center">
                            <p className="mb-1 text-base font-semibold text-gray-900">Fitur Layanan Desa</p>
                            <p className="mb-6 text-sm leading-relaxed text-gray-500">
                                {isLoggedIn
                                    ? 'Fitur ini hanya dapat diakses oleh pengguna dengan akun terdaftar sebagai warga desa.'
                                    : 'Anda perlu masuk ke akun terlebih dahulu untuk mengakses fitur ini.'}
                            </p>
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

            <main className="min-h-0 flex-1">{children}</main>

            {/* ── Footer ── */}
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
                                {[
                                    { label: 'Beranda', href: route('beranda') },
                                    { label: 'Profil Desa', href: route('profil.show') },
                                    { label: 'Data Desa', href: route('data.desa') },
                                    { label: 'Infografis', href: route('infografis.desa') },
                                    { label: 'Berita', href: route('berita') },
                                    { label: 'Publikasi', href: route('publikasi.index') },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="block py-1 text-orange-100 transition-colors hover:text-white">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                            <h3 className="text-xl font-bold">Kontak Kami</h3>
                            <div className="space-y-3 text-base">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-orange-200" />
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
                                <p>© {namaDesa}. Sistem Informasi Desa.</p>
                                <p className="mt-1">Dibuat dengan ❤️ untuk transparansi dan kemudahan akses informasi.</p>
                            </div>
                            <a href="#" className="flex items-center space-x-1 text-sm text-orange-100 transition-colors hover:text-white">
                                <span>Situs Web Resmi</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
