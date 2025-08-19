// resources/js/layouts/AuthenticatedLayout.tsx

import { Head, Link } from '@inertiajs/react';
import { Grid, Image as ImageIcon, LogOut, Menu, Newspaper, Users, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

// Tipe untuk data pengguna
interface User {
    name: string;
    email: string;
}

// Tipe untuk props layout
interface AuthenticatedLayoutProps {
    auth: { user: User };
    header?: ReactNode;
    children: ReactNode;
    title: string;
}

export default function AuthenticatedLayout({ auth, children, title }: AuthenticatedLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), icon: Grid, current: route().current('dashboard') },
        { name: 'Kelola Berita', href: '#', icon: Newspaper, current: false }, // Ganti href nanti
        { name: 'Kelola Infografis', href: '#', icon: ImageIcon, current: false }, // Ganti href nanti
        { name: 'Kelola Pengguna', href: '#', icon: Users, current: false }, // Ganti href nanti
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
                        <Link href={route('dashboard')} className="text-2xl font-bold text-orange-400">
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
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center px-6 py-3 text-left text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
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
                        <div className="text-xl font-semibold text-gray-800">{title}</div>
                        <div className="hidden sm:block">
                            <span className="font-medium text-gray-600">{auth.user.name}</span>
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </>
    );
}
