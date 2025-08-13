// resources/js/layouts/MainLayout.tsx
import { Link } from '@inertiajs/react';
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
        <div className="min-h-screen bg-gray-100">
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
                            </div>
                        </div>

                        {/* Tombol Masuk/Keluar di Kanan */}
                        <div className="flex items-center space-x-4">
                            {auth?.user ? (
                                // Jika Pengguna SUDAH Login
                                <div className="flex items-center space-x-4">
                                    <span className="hidden font-medium text-white sm:block">Selamat datang, {auth.user.name}</span>
                                    {/* 
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-medium text-[#fed7aa] transition duration-150 ease-in-out hover:text-[#ffffff]"
                                    >
                                        Dashboard
                                    </Link> 
                                    */}
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
            <main>{children}</main>
        </div>
    );
}
