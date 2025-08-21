// resources/js/Pages/InfografisDesa.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// 1. Definisikan tipe untuk satu item infografis
interface InfografisItem {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string; // URL lengkap dari asset()
    tanggal_terbit: string; // Sudah diformat dari Laravel
}

// 2. Definisikan tipe untuk props halaman (dengan struktur pagination)
interface InfografisDesaProps {
    auth?: any;
    infografisList: {
        data: InfografisItem[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        search: string;
    };
}

export default function InfografisDesa({ auth, infografisList, filters }: InfografisDesaProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Update local state when filters change (for back button)
    useEffect(() => {
        setSearchQuery(filters.search || '');
    }, [filters.search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/infografis',
            { search: searchQuery },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get(
            '/infografis',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Infografis Desa" />

            {/* Header Halaman */}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b-4 border-[#f97316] bg-[#ffedd5] p-8 text-gray-900">
                            <h1 className="text-3xl font-bold text-[#9a3412]">Infografis Desa Cinnong</h1>
                            <p className="mt-2 text-gray-700">
                                Visualisasi data dan informasi penting tentang Desa Cinnong dalam bentuk yang mudah dipahami.
                            </p>

                            {/* Search Form */}
                            <div className="mx-auto mt-6 max-w-md">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari infografis berdasarkan judul..."
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-10 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-2 w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                    >
                                        Cari Infografis
                                    </button>
                                </form>
                            </div>

                            {/* Search Result Info */}
                            {filters.search && (
                                <div className="mt-4 text-center text-sm text-gray-600">
                                    {infografisList.data.length > 0 ? (
                                        <p>
                                            Ditemukan {infografisList.data.length} hasil untuk "
                                            <span className="font-semibold">{filters.search}</span>"
                                        </p>
                                    ) : (
                                        <p>
                                            Tidak ditemukan hasil untuk "<span className="font-semibold">{filters.search}</span>"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten Daftar Infografis */}
            <div className="bg-slate-50 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {infografisList.data.length > 0 ? (
                            infografisList.data.map((item) => (
                                <Link
                                    href={`/infografis/${item.id}`}
                                    key={item.id}
                                    className="block rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
                                >
                                    <article className="flex flex-col items-start space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                                        <div className="w-full flex-shrink-0 md:w-1/3 lg:w-1/4">
                                            <img src={item.gambar} alt={item.judul} className="h-auto w-full rounded-md border object-cover" />
                                        </div>
                                        <div className="w-full md:w-2/3 lg:w-3/4">
                                            <p className="mb-1 text-sm text-gray-500">{item.tanggal_terbit}</p>
                                            <h2 className="text-2xl font-bold text-slate-800 transition-colors hover:text-orange-600">
                                                {item.judul}
                                            </h2>
                                            <p className="mt-2 line-clamp-3 text-gray-600">{item.deskripsi}</p>
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center">
                                <p className="text-xl text-gray-500">
                                    {filters.search
                                        ? 'Tidak ada infografis yang sesuai dengan pencarian Anda.'
                                        : 'Belum ada infografis yang diterbitkan.'}
                                </p>
                                {filters.search && (
                                    <button
                                        onClick={clearSearch}
                                        className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                                    >
                                        Tampilkan Semua Infografis
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* === BAGIAN PAGINATION BARU === */}
                    {infografisList.data.length > 0 && (
                        <nav className="mt-16 flex items-center justify-center border-t border-gray-200 pt-8">
                            <div className="flex flex-wrap justify-center gap-2">
                                {infografisList.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${link.active ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </nav>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
