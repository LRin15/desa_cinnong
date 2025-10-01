// resources/js/layouts/AuthenticatedLayout.tsx

import { Head, Link } from '@inertiajs/react';
import { FileText, Grid, Home, Image as ImageIcon, LogOut, Menu, MessageSquare, Newspaper, Users, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface AuthenticatedLayoutProps {
    auth: { user: User };
    header?: ReactNode;
    children: ReactNode;
    title: string;
}

export default function AuthenticatedLayout({ auth, children, title }: AuthenticatedLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: Grid, current: route().current('admin.dashboard') },
        { name: 'Kelola Berita', href: route('admin.berita.index'), icon: Newspaper, current: route().current('admin.berita.*') },
        { name: 'Kelola Infografis', href: route('admin.infografis.index'), icon: ImageIcon, current: route().current('admin.infografis.*') },
        { name: 'Kelola Publikasi', href: route('admin.publikasi.index'), icon: FileText, current: route().current('admin.publikasi.*') },
        { name: 'Kelola Pengaduan', href: route('admin.pengaduan.index'), icon: MessageSquare, current: route().current('admin.pengaduan.*') },
        { name: 'Kelola Pengguna', href: route('admin.users.index'), icon: Users, current: route().current('admin.users.*') },
    ];

    return (
        <>
            <Head title={title} />
            <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
                {/* Sidebar */}
                <aside
                    className={`absolute z-20 h-full w-64 transform bg-gray-800 text-white transition-transform duration-300 sm:relative sm:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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

                        {/* Divider */}
                        <div className="mx-4 my-2 border-t border-gray-600"></div>

                        {/* Tombol Kembali ke Halaman Utama */}
                        <Link
                            href={route('beranda')}
                            className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            Kembali ke Halaman Utama
                        </Link>

                        {/* Tombol Logout */}
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
                    {/* Header */}
                    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
                        <button onClick={() => setSidebarOpen(true)} className="sm:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                    </header>
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </>
    );
}
