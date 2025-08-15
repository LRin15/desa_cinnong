// resources/js/layouts/MainLayout.tsx
import { Link } from '@inertiajs/react';
import { ExternalLink, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { ReactNode } from 'react';

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
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            {/* Navigasi dengan hex codes */}
            <nav className="border-b border-gray-100 bg-[#ea580c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo dan Menu Navigasi Kiri */}
                        <div className="flex items-center space-x-8">
                            <Link href={route('beranda')} className="text-lg font-bold text-[#ffffff]">
                                Desa Cinnong
                            </Link>
                            <div className="hidden space-x-6 sm:flex">
                                <Link href={route('beranda')} className="text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]">
                                    Beranda
                                </Link>
                                <Link href={route('profil.desa')} className="text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]">
                                    Profil Desa
                                </Link>
                                <Link href={route('data.desa')} className="text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]">
                                    Data Desa
                                </Link>
                                <Link
                                    href={route('infografis.desa')}
                                    className="text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                                >
                                    Infografis
                                </Link>
                                <Link href={route('berita')} className="text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]">
                                    Berita
                                </Link>
                            </div>
                        </div>

                        {/* Tombol Masuk/Keluar di Kanan */}
                        <div className="flex items-center space-x-4">
                            {auth?.user ? (
                                // Jika Pengguna SUDAH Login
                                <div className="flex items-center space-x-4">
                                    <span className="hidden font-medium text-white sm:block">Selamat datang, {auth.user.name}</span>

                                    {/* === AKTIFKAN TAUTAN INI === */}
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-md bg-[#d97706] px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-[#b45309]"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                // Jika Pengguna BELUM Login (Guest) - Hanya tombol Masuk
                                <div className="flex items-center">
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#c2410c]"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button (Optional - bisa ditambahkan nanti) */}
                        <div className="flex items-center sm:hidden">{/* Tombol hamburger untuk mobile bisa ditambahkan di sini */}</div>
                    </div>
                </div>

                {/* Mobile Navigation Menu (Hidden by default) */}
                <div className="border-t border-orange-600/20 sm:hidden">
                    <div className="space-y-1 px-4 py-3">
                        <Link
                            href={route('beranda')}
                            className="block rounded-md px-3 py-2 text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Beranda
                        </Link>
                        <Link
                            href={route('profil.desa')}
                            className="block rounded-md px-3 py-2 text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Profil Desa
                        </Link>
                        <Link
                            href={route('data.desa')}
                            className="block rounded-md px-3 py-2 text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Data Desa
                        </Link>
                        <Link
                            href={route('infografis.desa')}
                            className="block rounded-md px-3 py-2 text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                        >
                            Infografis
                        </Link>

                        {/* Mobile Auth Buttons - Hanya tombol Masuk */}
                        {!auth?.user && (
                            <div className="border-t border-orange-600/20 pt-2">
                                <Link
                                    href={route('login')}
                                    className="block rounded-md px-3 py-2 text-[#fed7aa] transition duration-150 ease-in-out hover:bg-white/10 hover:text-[#ffffff]"
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-[#ea580c] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
                        {/* About Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Desa Cinnong</h3>
                            <p className="text-sm leading-relaxed text-orange-100">
                                Sistem informasi desa yang menyediakan data terkini tentang profil desa, statistik penduduk, dan informasi ekonomi
                                untuk transparansi dan kemudahan akses.
                            </p>
                            <div className="flex space-x-3">
                                <a
                                    href="#"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a
                                    href="#"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a
                                    href="#"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Menu Utama</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href={route('beranda')} className="text-orange-100 transition-colors hover:text-white">
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('profil.desa')} className="text-orange-100 transition-colors hover:text-white">
                                        Profil Desa
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('data.desa')} className="text-orange-100 transition-colors hover:text-white">
                                        Data Desa
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('infografis.desa')} className="text-orange-100 transition-colors hover:text-white">
                                        Infografis
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('berita')} className="text-orange-100 transition-colors hover:text-white">
                                        Berita
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Kontak Kami</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-200" />
                                    <div>
                                        <p className="text-orange-100">
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
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4 flex-shrink-0 text-orange-200" />
                                    <span className="text-orange-100">+62 812-3456-7890</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 flex-shrink-0 text-orange-200" />
                                    <span className="text-orange-100">desa.cinnong@bone.go.id</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-orange-600/30 py-6">
                        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                            <div className="text-center text-sm text-orange-100 md:text-left">
                                <p>© 2025 Desa Cinnong. Sistem Informasi Desa.</p>
                                <p>Dibuat dengan ❤️ untuk transparansi dan kemudahan akses informasi.</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <a href="#" className="text-orange-100 transition-colors hover:text-white">
                                    Kebijakan Privasi
                                </a>
                                <span className="text-orange-300">•</span>
                                <a href="#" className="text-orange-100 transition-colors hover:text-white">
                                    Syarat & Ketentuan
                                </a>
                                <span className="text-orange-300">•</span>
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
