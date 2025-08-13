// resources/js/Pages/DetailBerita.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';

// Tipe data untuk properti detail berita
interface BeritaDetailItem {
    id: number;
    judul: string;
    kategori: string;
    isi: string;
    gambar: string;
    tanggal_terbit: string;
}

// Tipe data untuk props halaman
interface DetailPageProps {
    auth?: any;
    berita: BeritaDetailItem;
}

export default function DetailBerita({ auth, berita }: DetailPageProps) {
    // Fungsi untuk badge kategori (sama seperti di halaman daftar)
    const getCategoryClass = (category: string) => {
        switch (category) {
            case 'Pengumuman':
                return 'bg-orange-100 text-orange-800';
            case 'Program Desa':
                return 'bg-green-100 text-green-800';
            // ... (tambahkan case lain jika ada)
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <MainLayout auth={auth}>
            <Head title={berita.judul} />

            <div className="bg-white py-12 sm:py-16">
                <div className="container mx-auto max-w-4xl px-4">
                    <article>
                        {/* Tombol Kembali */}
                        <div className="mb-8">
                            <Link
                                href={route('berita')}
                                className="inline-flex items-center text-sm font-semibold text-orange-600 transition-colors hover:text-orange-800"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar Berita
                            </Link>
                        </div>

                        {/* Header Artikel */}
                        <header className="mb-6">
                            <span
                                className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getCategoryClass(
                                    berita.kategori,
                                )}`}
                            >
                                {berita.kategori}
                            </span>
                            <h1 className="mb-3 text-3xl leading-tight font-bold text-gray-900 md:text-4xl">{berita.judul}</h1>
                            <div className="flex items-center text-base text-gray-500">
                                <Calendar className="mr-2 h-5 w-5" />
                                <span>Diterbitkan pada {berita.tanggal_terbit}</span>
                            </div>
                        </header>

                        {/* Gambar Utama */}
                        <figure className="my-8">
                            <img src={berita.gambar} alt={berita.judul} className="h-auto w-full rounded-lg border object-cover shadow-md" />
                        </figure>

                        {/* Konten Artikel */}
                        <div className="prose prose-lg prose-orange max-w-none" dangerouslySetInnerHTML={{ __html: berita.isi }} />
                    </article>
                </div>
            </div>
        </MainLayout>
    );
}
