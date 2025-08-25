// resources/js/Pages/DetailInfografis.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';

// Tipe data untuk properti detail infografis
interface InfografisDetailItem {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tanggal_terbit: string;
}

// Tipe data untuk props halaman
interface DetailInfografisProps {
    auth?: any;
    infografis: InfografisDetailItem;
}

export default function DetailInfografis({ auth, infografis }: DetailInfografisProps) {
    return (
        <MainLayout auth={auth}>
            <Head title={infografis.judul} />

            <div className="bg-white py-12 sm:py-16">
                <div className="container mx-auto max-w-4xl px-4">
                    <article>
                        {/* Tombol Kembali */}
                        <div className="mb-8">
                            <Link
                                href={route('infografis.desa')}
                                className="inline-flex items-center text-sm font-semibold text-orange-600 transition-colors hover:text-orange-800"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar Infografis
                            </Link>
                        </div>

                        {/* Header Artikel */}
                        <header className="mb-6">
                            <div className="mb-3">
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                                    Infografis
                                </span>
                            </div>
                            <h1 className="mb-3 text-3xl leading-tight font-bold text-gray-900 md:text-4xl">{infografis.judul}</h1>
                            <div className="flex items-center text-base text-gray-500">
                                <Calendar className="mr-2 h-5 w-5" />
                                <span>Diterbitkan pada {infografis.tanggal_terbit}</span>
                            </div>
                        </header>

                        {/* Deskripsi */}
                        {infografis.deskripsi && (
                            <div className="mb-8">
                                <p className="text-lg leading-relaxed text-gray-700">{infografis.deskripsi}</p>
                            </div>
                        )}

                        {/* Gambar Infografis */}
                        <figure className="my-8">
                            <img
                                src={infografis.gambar}
                                alt={infografis.judul}
                                className="h-auto w-full rounded-lg border bg-gray-50 object-contain shadow-md"
                            />
                            <figcaption className="mt-3 text-center text-sm text-gray-500">{infografis.judul}</figcaption>
                        </figure>
                    </article>
                </div>
            </div>
        </MainLayout>
    );
}
