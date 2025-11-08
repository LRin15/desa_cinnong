import MainLayout from '@/layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, File as FileIcon, FileSpreadsheet, FileText, FileType, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PublikasiItem {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal_publikasi: string;
    tipe_file: string;
    ukuran_file: string;
}

interface Setting {
    [key: string]: string;
}

interface PageProps {
    auth?: any;
    publikasiList: {
        data: PublikasiItem[];
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

const FileTypeIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
        case 'pdf':
            return <FileText className="h-8 w-8 text-red-500" />;
        case 'doc':
        case 'docx':
            return <FileType className="h-8 w-8 text-blue-500" />;
        case 'xls':
        case 'xlsx':
            return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
        default:
            return <FileIcon className="h-8 w-8 text-gray-500" />;
    }
};

export default function Publikasi({ auth, publikasiList, filters, settings }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Ambil nama desa dari settings, fallback ke "Desa" jika tidak ada
    const namaDesa = settings?.nama_desa || 'Desa';

    // Update local state when filters change (for back button)
    useEffect(() => {
        setSearchQuery(filters.search || '');
    }, [filters.search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('publikasi.index'),
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
            route('publikasi.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <MainLayout auth={auth}>
            <Head title={`Publikasi Dokumen - ${namaDesa}`} />

            <div className="bg-white">
                {/* Header Section dengan Search */}
                <section className="border-b border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="container mx-auto px-3 py-12 text-center sm:px-4 sm:py-16 lg:px-8">
                        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl">Publikasi Dokumen Desa</h1>
                        <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
                            Akses dan unduh dokumen resmi dan informasi publik dari {namaDesa}.
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
                                        placeholder="Cari dokumen..."
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
                                    Cari Dokumen
                                </button>
                            </form>
                        </div>

                        {/* Search Result Info */}
                        {filters.search && (
                            <div className="mt-3 text-sm text-gray-600 sm:mt-4">
                                {publikasiList.data.length > 0 ? (
                                    <p>
                                        <span className="hidden sm:inline">Ditemukan </span>
                                        <span className="font-semibold">{publikasiList.data.length}</span>
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
                <section className="bg-slate-50 py-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="space-y-6">
                            {publikasiList.data.length > 0 ? (
                                publikasiList.data.map((item) => (
                                    <div key={item.id} className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                                        <div className="flex flex-col items-start gap-4 sm:flex-row">
                                            <div className="flex-shrink-0">
                                                <FileTypeIcon type={item.tipe_file} />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold text-gray-800">{item.judul}</h2>
                                                <p className="mt-1 text-sm text-gray-600">{item.deskripsi}</p>
                                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                                                    <span>Dipublikasikan: {item.tanggal_publikasi}</span>
                                                    <span className="hidden sm:inline">|</span>
                                                    <span>
                                                        Tipe: <span className="font-medium uppercase">{item.tipe_file}</span>
                                                    </span>
                                                    <span className="hidden sm:inline">|</span>
                                                    <span>Ukuran: {item.ukuran_file}</span>
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-auto">
                                                <a
                                                    href={route('publikasi.download', item.id)}
                                                    className="inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:w-auto"
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Unduh
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Empty state */
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <FileIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 sm:text-xl">
                                        {filters.search ? 'Tidak ada dokumen yang sesuai dengan pencarian Anda.' : 'Belum Ada Publikasi'}
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-500">
                                        {filters.search ? 'Coba gunakan kata kunci yang berbeda.' : 'Saat ini belum ada dokumen yang dipublikasikan.'}
                                    </p>
                                    {filters.search && (
                                        <button
                                            onClick={clearSearch}
                                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:bg-orange-800"
                                        >
                                            Tampilkan Semua Dokumen
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {publikasiList.data.length > 0 && publikasiList.links.length > 0 && (
                            <nav className="mt-12 flex items-center justify-center border-t border-gray-200 pt-8">
                                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                    {publikasiList.links.map((link, index) => (
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
