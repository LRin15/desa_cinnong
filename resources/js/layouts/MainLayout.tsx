// resources/js/layouts/MainLayout.tsx
import { Link } from '@inertiajs/react';
import { ExternalLink, Mail, MapPin, Menu, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

// Definisi tipe untuk user
interface User {
    id: number;
    name: string;
    email: string;
}

// Definisi tipe untuk auth
interface Auth {
    user: User | null;
}

// Props untuk MainLayout
interface MainLayoutProps {
    auth?: Auth;
    children: ReactNode;
}

export default function MainLayout({ auth, children }: MainLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            {/* Navigasi dengan hex codes */}
            <nav className="relative z-50 border-b border-gray-100 bg-[#ea580c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between sm:h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href={route('beranda')}
                                className="truncate text-base font-bold text-[#ffffff] sm:text-lg"
                                onClick={closeMobileMenu}
                            >
                                Desa Cinnong
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
                                href={route('profil.desa')}
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
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center space-x-3 sm:flex">
                            {auth?.user ? (
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
                                        className="rounded-md bg-[#d97706] px-3 py-1.5 text-xs font-medium text-white transition duration-150 ease-in-out hover:bg-[#b45309] sm:text-sm"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#c2410c] sm:text-sm"
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
                                aria-label="Toggle menu"
                                id="mobile-menu-button"
                                name="mobile-menu-button"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`${mobileMenuOpen ? 'block' : 'hidden'} border-t border-orange-600/20 bg-[#ea580c] sm:hidden lg:hidden`}>
                    <div className="max-h-96 space-y-1 overflow-y-auto px-4 py-3">
                        {/* Mobile Auth Info */}
                        {auth?.user && (
                            <div className="mb-2 border-b border-orange-600/20 px-3 py-2">
                                <span className="text-sm font-medium text-white">Selamat datang, {auth.user.name}</span>
                            </div>
                        )}

                        {/* Mobile Navigation Links */}
                        <Link
                            href={route('beranda')}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Beranda
                        </Link>
                        <Link
                            href={route('profil.desa')}
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

                        {/* Mobile Auth Buttons */}
                        <div className="mt-3 space-y-2 border-t border-orange-600/20 pt-3">
                            {auth?.user ? (
                                <>
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
                                </>
                            ) : (
                                <Link
                                    href={route('login')}
                                    onClick={closeMobileMenu}
                                    className="block rounded-md px-3 py-3 text-base font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="min-h-0 flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-[#ea580c] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 sm:gap-8 sm:py-12 lg:grid-cols-3">
                        {/* About Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Desa Cinnong</h3>
                            <p className="text-sm leading-relaxed text-orange-100">
                                Sistem informasi desa yang menyediakan data terkini tentang profil desa, statistik penduduk, dan informasi ekonomi
                                untuk transparansi dan kemudahan akses.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Menu Utama</h3>
                            <ul className="space-y-3 text-sm sm:space-y-2">
                                <li>
                                    <Link
                                        href={route('beranda')}
                                        className="block py-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                    >
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('profil.desa')}
                                        className="block py-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                    >
                                        Profil Desa
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('data.desa')}
                                        className="block py-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                    >
                                        Data Desa
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('infografis.desa')}
                                        className="block py-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                    >
                                        Infografis
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('berita')}
                                        className="block py-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                    >
                                        Berita
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('publikasi.index')}
                                        className="block py-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                        preserveScroll={false}
                                        preserveState={false}
                                    >
                                        Publikasi
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                            <h3 className="text-lg font-bold">Kontak Kami</h3>
                            <div className="space-y-4 text-sm sm:space-y-3">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-200 sm:h-4 sm:w-4" />
                                    <div>
                                        <p className="leading-relaxed text-orange-100">
                                            Desa Cinnong
                                            <br />
                                            Kecamatan Sibulue
                                            <br />
                                            Kabupaten Bone
                                            <br />
                                            Sulawesi Selatan
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="mailto:Cinnongsib@gmail.com"
                                    className="flex items-center space-x-3 text-orange-100 transition-colors hover:text-white active:text-white"
                                >
                                    <Mail className="h-5 w-5 flex-shrink-0 text-orange-200 sm:h-4 sm:w-4" />
                                    <span className="break-all">Cinnongsib@gmail.com</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-orange-600/30 py-4 sm:py-6">
                        <div className="flex flex-col items-center justify-between space-y-4 text-center sm:text-left lg:flex-row lg:space-y-0">
                            <div className="text-xs text-orange-100 sm:text-sm">
                                <p>© 2025 Desa Cinnong. Sistem Informasi Desa.</p>
                                <p className="mt-1">Dibuat dengan ❤️ untuk transparansi dan kemudahan akses informasi.</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                                <a href="#" className="text-orange-100 transition-colors hover:text-white active:text-white">
                                    Kebijakan Privasi
                                </a>
                                <span className="hidden text-orange-300 sm:inline">•</span>
                                <a href="#" className="text-orange-100 transition-colors hover:text-white active:text-white">
                                    Syarat & Ketentuan
                                </a>
                                <span className="hidden text-orange-300 sm:inline">•</span>
                                <a
                                    href="#"
                                    className="flex items-center space-x-1 text-orange-100 transition-colors hover:text-white active:text-white"
                                >
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
