// resources/js/Pages/InfografisDesa.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Image, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InfografisItem {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tanggal_terbit: string;
}

interface Setting {
    [key: string]: string;
}

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
    settings: Setting;
}

export default function InfografisDesa({ auth, infografisList, filters, settings }: InfografisDesaProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Ambil nama desa dari settings, fallback ke "Desa" jika tidak ada
    const namaDesa = settings?.nama_desa || 'Desa';

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
            <Head title={`Infografis - ${namaDesa}`} />

            <div className="bg-white">
                {/* Header Section - Konsisten dengan Berita & Publikasi */}
                <section className="border-b border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="container mx-auto px-3 py-12 text-center sm:px-4 sm:py-16 lg:px-8">
                        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl">Infografis Desa</h1>
                        <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
                            Visualisasi data dan informasi penting tentang {namaDesa} dalam bentuk yang mudah dipahami.
                        </p>

                        {/* Search Form */}
                        <div className="mx-auto mt-6 max-w-md sm:mt-8">
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

                        {/* Search Result Info */}
                        {filters.search && (
                            <div className="mt-3 text-sm text-gray-600 sm:mt-4">
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
                </section>

                {/* Content Section */}
                <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
                            {infografisList.data.length > 0 ? (
                                infografisList.data.map((item) => (
                                    <Link
                                        href={`/infografis/${item.id}`}
                                        key={item.id}
                                        className="block rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                                    >
                                        <article className="flex flex-col overflow-hidden sm:flex-row">
                                            {/* Image container */}
                                            <div className="w-full flex-shrink-0 sm:w-1/3 lg:w-1/4">
                                                <div className="aspect-square overflow-hidden bg-gray-50 sm:aspect-auto sm:h-full">
                                                    <img
                                                        src={item.gambar}
                                                        alt={item.judul}
                                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex w-full flex-col justify-between p-4 sm:w-2/3 sm:p-6 lg:w-3/4">
                                                <div>
                                                    <p className="mb-2 text-xs text-gray-500 sm:text-sm">{item.tanggal_terbit}</p>
                                                    <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors hover:text-orange-600 sm:text-2xl">
                                                        {item.judul}
                                                    </h2>
                                                    <p className="line-clamp-3 text-sm text-gray-600 sm:line-clamp-4 sm:text-base">
                                                        {item.deskripsi}
                                                    </p>
                                                </div>

                                                {/* CTA */}
                                                <div className="mt-4">
                                                    <span className="inline-flex items-center text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700">
                                                        <span className="sm:hidden">Lihat Detail</span>
                                                        <span className="hidden sm:inline">Lihat Infografis Lengkap</span>
                                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))
                            ) : (
                                /* Empty state */
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <Image className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 sm:text-xl">
                                        {filters.search
                                            ? 'Tidak ada infografis yang sesuai dengan pencarian Anda.'
                                            : 'Belum ada infografis yang diterbitkan.'}
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-500">
                                        {filters.search
                                            ? 'Coba gunakan kata kunci yang berbeda.'
                                            : 'Saat ini belum ada infografis yang dipublikasikan.'}
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

                        {/* Pagination */}
                        {infografisList.data.length > 0 && infografisList.links.length > 0 && (
                            <nav className="mt-12 flex items-center justify-center border-t border-gray-200 pt-8 sm:mt-16">
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
                </section>
            </div>
        </MainLayout>
    );
}
