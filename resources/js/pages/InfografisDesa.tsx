// resources/js/Pages/InfografisDesa.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Image, Search, X } from 'lucide-react';
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

            {/* Header Halaman - Mobile optimized */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b-4 border-[#f97316] bg-[#ffedd5] p-4 text-gray-900 sm:p-6 lg:p-8">
                            <h1 className="text-2xl font-bold text-[#9a3412] sm:text-3xl">Infografis Desa Cinnong</h1>
                            <p className="mt-2 text-sm text-gray-700 sm:text-base">
                                Visualisasi data dan informasi penting tentang Desa Cinnong dalam bentuk yang mudah dipahami.
                            </p>

                            {/* Search Form - Mobile optimized */}
                            <div className="mx-auto mt-4 max-w-md sm:mt-6">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari infografis..."
                                            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-10 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-2 w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus:ring-2 focus:ring-orange-200 focus:outline-none active:bg-orange-800"
                                    >
                                        Cari Infografis
                                    </button>
                                </form>
                            </div>

                            {/* Search Result Info - Mobile friendly */}
                            {filters.search && (
                                <div className="mt-3 text-center text-sm text-gray-600 sm:mt-4">
                                    {infografisList.data.length > 0 ? (
                                        <p>
                                            <span className="hidden sm:inline">Ditemukan </span>
                                            <span className="font-semibold">{infografisList.data.length}</span>
                                            <span className="hidden sm:inline"> hasil untuk "</span>
                                            <span className="sm:hidden"> hasil: "</span>
                                            <span className="font-semibold">{filters.search}</span>"
                                        </p>
                                    ) : (
                                        <p>
                                            <span className="hidden sm:inline">Tidak ditemukan hasil untuk "</span>
                                            <span className="sm:hidden">Tidak ada hasil: "</span>
                                            <span className="font-semibold">{filters.search}</span>"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten Daftar Infografis - Mobile optimized */}
            <div className="bg-slate-50 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    <div className="space-y-4 sm:space-y-8">
                        {infografisList.data.length > 0 ? (
                            infografisList.data.map((item) => (
                                <Link
                                    href={`/infografis/${item.id}`}
                                    key={item.id}
                                    className="block rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl active:scale-[0.98] sm:p-6"
                                >
                                    <article className="flex flex-col items-start space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                                        {/* Image container - Mobile full width, desktop 1/4 */}
                                        <div className="w-full flex-shrink-0 sm:w-1/3 lg:w-1/4">
                                            <div className="aspect-square overflow-hidden rounded-md border bg-gray-50 sm:aspect-auto sm:h-48">
                                                <img
                                                    src={item.gambar}
                                                    alt={item.judul}
                                                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="w-full sm:w-2/3 lg:w-3/4">
                                            <p className="mb-1 text-xs text-gray-500 sm:text-sm">{item.tanggal_terbit}</p>
                                            <h2 className="mb-2 line-clamp-2 text-xl font-bold text-slate-800 transition-colors hover:text-orange-600 sm:text-2xl">
                                                {item.judul}
                                            </h2>
                                            <p className="line-clamp-3 text-sm text-gray-600 sm:line-clamp-4 sm:text-base">{item.deskripsi}</p>

                                            {/* Mobile CTA */}
                                            <div className="mt-3 sm:hidden">
                                                <span className="inline-flex items-center text-sm font-medium text-orange-600">
                                                    Lihat Infografis →
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            /* Empty state - Mobile optimized */
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Image className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="mb-4 text-lg text-gray-500 sm:text-xl">
                                    {filters.search
                                        ? 'Tidak ada infografis yang sesuai dengan pencarian Anda.'
                                        : 'Belum ada infografis yang diterbitkan.'}
                                </p>
                                {filters.search && (
                                    <button
                                        onClick={clearSearch}
                                        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:bg-orange-800"
                                    >
                                        Tampilkan Semua Infografis
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination - Mobile optimized */}
                    {infografisList.data.length > 0 && (
                        <nav className="mt-12 flex items-center justify-center border-t border-gray-200 pt-6 sm:mt-16 sm:pt-8">
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                {infografisList.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors sm:h-9 sm:min-w-[36px] sm:px-3 ${
                                            link.active
                                                ? 'border-orange-600 bg-orange-600 text-white'
                                                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
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
