// resources/js/Pages/InfografisDesa.tsx

import MainLayout from '@/layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

// 1. Definisikan tipe data untuk satu item infografis
interface InfografisItem {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tanggal_terbit: string; // Laravel biasanya mengirim tanggal sebagai string
}

// 2. Definisikan tipe untuk props halaman
interface InfografisDesaProps {
    infografisList: InfografisItem[];
}

export default function InfografisDesa({ infografisList }: InfografisDesaProps) {
    // Fungsi untuk format tanggal (opsional)
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <MainLayout>
            <Head title="Infografis Desa" />

            {/* Header Halaman - Sesuai dengan tema Beranda */}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b-4 border-[#f97316] bg-[#ffedd5] p-8 text-gray-900">
                            <h1 className="text-3xl font-bold text-[#9a3412]">Infografis Desa Cinnong</h1>
                            <p className="mt-2 text-gray-700">
                                Visualisasi data dan informasi penting tentang Desa Cinnong dalam bentuk yang mudah dipahami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten Daftar Infografis */}
            <div className="bg-slate-50 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {infografisList.length > 0 ? (
                            infografisList.map((item) => (
                                // Setiap item dibungkus Link agar bisa diklik
                                <Link
                                    href={`/infografis/${item.id}`} // Arahkan ke halaman detail (perlu dibuat nanti)
                                    key={item.id}
                                    className="block rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
                                >
                                    <article className="flex flex-col items-start space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                                        {/* Gambar di Kiri */}
                                        <div className="w-full flex-shrink-0 md:w-1/3 lg:w-1/4">
                                            <img src={item.gambar} alt={item.judul} className="h-auto w-full rounded-md border object-cover" />
                                        </div>

                                        {/* Teks di Kanan */}
                                        <div className="w-full md:w-2/3 lg:w-3/4">
                                            <p className="mb-1 text-sm text-gray-500">{formatDate(item.tanggal_terbit)}</p>
                                            <h2 className="text-2xl font-bold text-slate-800 transition-colors hover:text-orange-600">
                                                {item.judul}
                                            </h2>
                                            <p className="mt-2 line-clamp-3 text-gray-600">{item.deskripsi}</p>
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Belum ada infografis yang diterbitkan.</p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
