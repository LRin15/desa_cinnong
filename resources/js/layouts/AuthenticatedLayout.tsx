// resources/js/layouts/AuthenticatedLayout.tsx

import { Head, Link } from '@inertiajs/react';
import {
    Building,
    ClipboardList,
    Database,
    FileText,
    Grid,
    Home,
    Image as ImageIcon,
    LogOut,
    Menu,
    Newspaper,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

interface User {
    name: string;
    email: string;
    role?: string; // optional: halaman lain yang belum deklarasikan role tetap kompatibel
}

interface AuthenticatedLayoutProps {
    auth: { user: User };
    header?: ReactNode;
    children: ReactNode;
    title: string;
}

export default function AuthenticatedLayout({ auth, children, title }: AuthenticatedLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdminBps = auth.user.role === 'admin_bps';

    const navItems = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: Grid,
            current: route().current('admin.dashboard'),
        },

        // Menu konten — hanya untuk admin_desa
        ...(!isAdminBps
            ? [
                  {
                      name: 'Kelola Berita',
                      href: route('admin.berita.index'),
                      icon: Newspaper,
                      current: route().current('admin.berita.*'),
                  },
                  {
                      name: 'Kelola Infografis',
                      href: route('admin.infografis.index'),
                      icon: ImageIcon,
                      current: route().current('admin.infografis.*'),
                  },
                  {
                      name: 'Kelola Publikasi',
                      href: route('admin.publikasi.index'),
                      icon: FileText,
                      current: route().current('admin.publikasi.*'),
                  },
              ]
            : []),

        // Layanan: admin_desa → daftar permohonan, admin_bps → pengaturan jenis layanan
        ...(isAdminBps
            ? [
                  {
                      name: 'Pengaturan Layanan',
                      href: route('admin.layanan-settings.index'),
                      icon: Settings,
                      current: route().current('admin.layanan-settings.*') || route().current('admin.layanan.*'),
                  },
              ]
            : [
                  {
                      name: 'Kelola Layanan',
                      href: route('admin.layanan.index'),
                      icon: ClipboardList,
                      current: route().current('admin.layanan.*') || route().current('admin.layanan-settings.*'),
                  },
              ]),

        {
            name: 'Kelola Pengguna',
            href: route('admin.users.index'),
            icon: Users,
            current: route().current('admin.users.*'),
        },
    ];

    const settingsItems = [
        {
            name: 'Profil Desa',
            href: route('admin.profil.edit'),
            icon: Building,
            current: route().current('admin.profil.*'),
        },
        {
            name: 'Tabel Data',
            href: '/admin/dynamic-tables',
            icon: Database,
            current: typeof window !== 'undefined' && window.location.pathname.includes('/admin/dynamic-tables'),
        },
    ];

    return (
        <>
            <Head title={title} />
            <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
                {/* Sidebar */}
                <aside
                    className={`absolute z-20 h-full w-64 transform bg-gray-800 text-white transition-transform duration-300 sm:relative sm:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center justify-between px-6">
                        <Link href={route('admin.dashboard')} className="text-2xl font-bold text-orange-400">
                            Admin SID
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="sm:hidden">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="mt-4">
                        {/* Menu Utama */}
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                                    item.current ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}

                        <div className="mx-4 my-2 border-t border-gray-600" />

                        {/* Pengaturan */}
                        {settingsItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                                    item.current ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}

                        <div className="mx-4 my-2 border-t border-gray-600" />

                        <Link
                            href={route('beranda')}
                            className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            Kembali ke Halaman Utama
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center px-6 py-3 text-left text-sm font-medium text-red-300 transition-colors duration-200 hover:bg-red-600 hover:text-white"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Keluar
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="relative flex flex-1 flex-col overflow-y-auto">
                    <header className="flex h-14 items-center border-b bg-white px-4 sm:hidden">
                        <button onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </button>
                    </header>
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </>
    );
}
