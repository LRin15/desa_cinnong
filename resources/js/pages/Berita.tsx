// resources/js/Pages/Berita.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, ChevronsRight, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeritaItem {
    id: number;
    judul: string;
    slug: string;
    kategori: string;
    kutipan: string;
    gambar: string;
    tanggal_terbit: string;
}

interface Setting {
    [key: string]: string;
}

interface BeritaPageProps {
    auth?: any;
    beritaList: {
        data: BeritaItem[];
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

const getCategoryClass = (category: string) => {
    switch (category) {
        case 'Pengumuman':
            return 'bg-orange-100 text-orange-800';
        case 'Program Desa':
            return 'bg-green-100 text-green-800';
        case 'Informasi':
            return 'bg-blue-100 text-blue-800';
        case 'Kegiatan Warga':
            return 'bg-purple-100 text-purple-800';
        case 'Kesehatan':
            return 'bg-pink-100 text-pink-800';
        case 'Pendidikan':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function Berita({ auth, beritaList, filters, settings }: BeritaPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Ambil nama desa dari settings, fallback ke "Desa" jika tidak ada
    const namaDesa = settings?.nama_desa || 'Desa';

    useEffect(() => {
        setSearchQuery(filters.search || '');
    }, [filters.search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/berita',
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
            '/berita',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <MainLayout auth={auth}>
            <Head title={`Berita - ${namaDesa}`} />

            <div className="bg-white">
                {/* Header Section */}
                <section className="border-b border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="container mx-auto px-3 py-12 text-center sm:px-4 sm:py-16 lg:px-8">
                        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl">Berita & Pengumuman</h1>
                        <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
                            Ikuti perkembangan, kegiatan, dan informasi terbaru dari Pemerintah {namaDesa}.
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
                                        placeholder="Cari berita..."
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
                                    Cari Berita
                                </button>
                            </form>
                        </div>

                        {/* Search Result Info */}
                        {filters.search && (
                            <div className="mt-3 text-sm text-gray-600 sm:mt-4">
                                {beritaList.data.length > 0 ? (
                                    <p>
                                        <span className="hidden sm:inline">Ditemukan </span>
                                        <span className="font-semibold">{beritaList.data.length}</span>
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
                <section className="py-12 sm:py-16 lg:py-20">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                        {beritaList.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                                {beritaList.data.map((news) => (
                                    <article
                                        key={news.id}
                                        className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                                    >
                                        <Link href={`/berita/${news.slug}`} className="block">
                                            <div className="relative aspect-video overflow-hidden">
                                                <img
                                                    src={news.gambar}
                                                    alt={news.judul}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between sm:mb-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium sm:px-2.5 ${getCategoryClass(news.kategori)}`}
                                                    >
                                                        {news.kategori}
                                                    </span>
                                                </div>
                                                <Link href={`/berita/${news.slug}`} className="block">
                                                    <h3 className="mb-2 line-clamp-2 text-lg leading-tight font-bold text-gray-900 transition-colors duration-200 hover:text-orange-600 sm:text-xl">
                                                        {news.judul}
                                                    </h3>
                                                </Link>
                                                <p className="mb-3 line-clamp-3 text-sm text-gray-600 sm:mb-4 sm:text-base">{news.kutipan}</p>
                                            </div>
                                            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                                <p className="flex items-center text-xs text-gray-500 sm:text-sm">
                                                    <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                    {news.tanggal_terbit}
                                                </p>
                                                <Link
                                                    href={`/berita/${news.slug}`}
                                                    className="flex items-center justify-center rounded-md bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition-colors duration-200 hover:bg-orange-100 hover:text-orange-800 sm:justify-start sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
                                                >
                                                    <span className="sm:hidden">Baca</span>
                                                    <span className="hidden sm:inline">Baca Selengkapnya</span>
                                                    <ChevronsRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="mb-4 text-lg text-gray-500 sm:text-xl">
                                    {filters.search ? 'Tidak ada berita yang sesuai dengan pencarian Anda.' : 'Belum ada berita yang diterbitkan.'}
                                </p>
                                {filters.search && (
                                    <button
                                        onClick={clearSearch}
                                        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:bg-orange-800"
                                    >
                                        Tampilkan Semua Berita
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {beritaList.data.length > 0 && (
                            <nav className="mt-12 flex items-center justify-center border-t border-gray-200 pt-6 sm:mt-16 sm:pt-8">
                                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                    {beritaList.links.map((link, index) => {
                                        const isActive = link.active;

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors sm:h-9 sm:min-w-[36px] sm:px-3 ${
                                                    isActive
                                                        ? 'border-orange-600 bg-orange-600 text-white'
                                                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </nav>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
