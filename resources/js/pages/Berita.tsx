// resources/js/Pages/Berita.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ChevronsRight } from 'lucide-react';

// 1. Definisikan tipe untuk satu item berita
interface BeritaItem {
    id: number;
    judul: string;
    slug: string;
    kategori: string;
    kutipan: string;
    gambar: string;
    tanggal_terbit: string;
}

// 2. Definisikan tipe untuk props halaman (dengan struktur pagination yang benar)
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
}

// Fungsi untuk menentukan warna badge berdasarkan kategori
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

export default function Berita({ auth, beritaList }: BeritaPageProps) {
    return (
        <MainLayout auth={auth}>
            <Head title="Berita" />

            <div className="bg-white">
                <section className="border-b border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="container mx-auto px-4 py-16 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Berita & Pengumuman</h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-700">
                            Ikuti perkembangan, kegiatan, dan informasi terbaru dari Pemerintah Desa Cinnong.
                        </p>
                    </div>
                </section>

                <section className="py-16 sm:py-20">
                    <div className="container mx-auto px-4">
                        {beritaList.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                                {beritaList.data.map((news) => (
                                    <article
                                        key={news.id}
                                        className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
                                    >
                                        <Link href={`/berita/${news.slug}`} className="block">
                                            <img src={news.gambar} alt={news.judul} className="h-48 w-full object-cover" />
                                        </Link>
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryClass(news.kategori)}`}
                                                    >
                                                        {news.kategori}
                                                    </span>
                                                </div>
                                                <Link href={`/berita/${news.slug}`} className="block">
                                                    <h3 className="mb-2 text-xl leading-tight font-bold text-gray-900 transition-colors duration-200 hover:text-orange-600">
                                                        {news.judul}
                                                    </h3>
                                                </Link>
                                                <p className="mb-4 line-clamp-3 text-base text-gray-600">{news.kutipan}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {news.tanggal_terbit}
                                                </p>
                                                <Link
                                                    href={`/berita/${news.slug}`}
                                                    className="flex items-center text-sm font-semibold text-orange-600 transition-colors duration-200 hover:text-orange-800"
                                                >
                                                    Baca Selengkapnya <ChevronsRight className="ml-1 h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-xl text-gray-500">Belum ada berita yang diterbitkan.</p>
                            </div>
                        )}

                        {/* Komponen Pagination Dinamis */}
                        {beritaList.data.length > 0 && (
                            <nav className="mt-16 flex items-center justify-center border-t border-gray-200 pt-8">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {/* 👇 PERUBAHAN ADA DI BARIS INI (MENGHAPUS .meta) 👇 */}
                                    {beritaList.links.map((link, index) => (
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
                </section>
            </div>
        </MainLayout>
    );
}
