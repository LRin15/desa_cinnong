import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Eye, MapPin, Target, Users } from 'lucide-react';
import { useState } from 'react';

// --- DEFINISI TIPE DATA DARI BACKEND ---
// Tipe untuk objek settings (key-value)
interface Setting {
    [key: string]: string;
}

// Tipe untuk satu aparat desa
interface Official {
    id: number;
    nama: string;
    jabatan: string;
    foto: string | null; // URL foto bisa jadi null
}

// Tipe untuk props yang diterima halaman ini
interface ProfilDesaProps {
    settings: Setting;
    officials: Official[];
}

export default function ProfilDesa({ settings, officials }: ProfilDesaProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openImageModal = (src: string) => {
        setSelectedImage(src);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    // Ambil data dinamis dari settings dengan fallback
    const namaDesa = settings.nama_desa || 'Desa Cinnong';
    const kecamatan = settings.kecamatan || 'Kecamatan Sibulue';
    const kabupaten = settings.kabupaten || 'Kabupaten Bone';
    const provinsi = settings.provinsi || 'Sulawesi Selatan';
    const jumlahRt = settings.jumlah_rt || '8';
    const luas = settings.luas || '16.29';

    return (
        <MainLayout>
            <Head title="Profil Desa" />
            <div className="min-h-screen py-4 sm:py-6 lg:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center sm:mb-12">
                        <h1 className="mb-3 text-2xl leading-tight font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl">Profil {namaDesa}</h1>
                        <p className="mx-auto max-w-2xl px-4 text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
                            Mengenal lebih dekat {namaDesa}, sejarah, visi misi, dan struktur pemerintahan desa
                        </p>
                    </div>

                    {/* Hero Card */}
                    <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm sm:mb-12">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white sm:p-6 lg:p-8">
                            <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16">
                                    <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="mb-2 text-xl font-bold sm:text-2xl lg:text-3xl">{namaDesa}</h2>
                                    <p className="text-sm text-orange-100 sm:text-base">
                                        {kecamatan}, {kabupaten}
                                    </p>
                                    <p className="text-sm text-orange-100 sm:text-base">{provinsi}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                            {jumlahRt} RT
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                            Luas: {luas} km²
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Peta Desa */}
                    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:mb-12 sm:p-6">
                        <div className="mb-4 sm:mb-6">
                            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                <MapPin className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                <span>Peta Wilayah {namaDesa}</span>
                            </h3>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-2xl rounded-lg bg-gray-50 p-3 sm:p-4">
                                <img
                                    src={settings.gambar_peta || '/images/peta.png'} // DATA DINAMIS + FALLBACK
                                    alt={`Peta ${namaDesa} menunjukkan pembagian wilayah RT`}
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                                    onClick={() => openImageModal(settings.gambar_peta || '/images/peta.png')}
                                />
                                <p className="mt-3 text-center text-xs text-gray-600 sm:text-sm">
                                    Peta wilayah {namaDesa} dengan pembagian {jumlahRt} RT (Ketuk untuk memperbesar)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
                        {/* Sejarah */}
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <div className="mb-4">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                    <Calendar className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                    <span>Sejarah Desa</span>
                                </h3>
                            </div>
                            <div>
                                <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                                    {/* DATA DINAMIS + FALLBACK */}
                                    {settings.sejarah || `Sejarah ${namaDesa} belum ditambahkan.`}
                                </p>
                            </div>
                        </div>

                        {/* Visi & Misi */}
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <div className="mb-4">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                    <Eye className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                    <span>Visi</span>
                                </h3>
                            </div>
                            <div>
                                <p className="mb-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3 text-sm leading-relaxed font-semibold text-gray-700 italic sm:mb-6 sm:p-4 sm:text-base">
                                    {/* DATA DINAMIS + FALLBACK */}"{settings.visi || 'Visi belum ditambahkan.'}"
                                </p>

                                <h4 className="mb-3 flex items-center space-x-2 text-base font-semibold text-gray-900 sm:text-lg">
                                    <Target className="h-4 w-4 flex-shrink-0 text-orange-600" />
                                    <span>Misi</span>
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700 sm:space-y-3 sm:text-base">
                                    {/* DATA DINAMIS DARI TEXTAREA, DIPISAH PER BARIS */}
                                    {settings.misi ? (
                                        settings.misi.split('\n').map((item, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Misi belum ditambahkan.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Foto Tim Pemerintahan */}
                    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:mt-12 sm:p-6">
                        <div className="mb-4 sm:mb-6">
                            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                <Users className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                <span>Tim Pemerintahan {namaDesa}</span>
                            </h3>
                        </div>
                        <div className="mb-4 flex justify-center sm:mb-6">
                            <div className="w-full max-w-3xl space-y-4 rounded-lg bg-gray-50 p-3 sm:space-y-6 sm:p-4">
                                <img
                                    src={settings.gambar_tim || '/images/struktur.png'} // DATA DINAMIS + FALLBACK
                                    alt={`Foto bersama tim pemerintahan ${namaDesa}`}
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    onClick={() => openImageModal(settings.gambar_tim || '/images/struktur.png')}
                                />
                                <p className="mt-3 text-center text-xs text-gray-600 sm:text-sm">Tim Pemerintahan {namaDesa}</p>
                            </div>
                        </div>
                    </div>

                    {/* Struktur Pemerintahan Detail */}
                    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
                        <div className="mb-4 sm:mb-6">
                            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                <Users className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                <span>Struktur Pemerintahan</span>
                            </h3>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                                {/* DATA DINAMIS MENGGUNAKAN LOOP */}
                                {officials.map((official) => (
                                    <div
                                        key={official.id}
                                        className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:p-6"
                                    >
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                            <img
                                                src={official.foto || '/images/default-avatar.png'} // Data dinamis + fallback
                                                alt={official.nama}
                                                className="h-full w-full cursor-pointer object-cover"
                                                onClick={() => openImageModal(official.foto || '/images/default-avatar.png')}
                                            />
                                        </div>
                                        <h4 className="text-base font-bold text-gray-900 sm:text-lg">{official.nama}</h4>
                                        <p className="text-sm font-semibold text-orange-700 sm:text-base">{official.jabatan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Image Modal (Tidak perlu diubah) */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={closeImageModal}>
                    <div className="relative flex h-full w-full items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Gambar diperbesar"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-xl text-white transition-colors hover:bg-black/70"
                        >
                            ×
                        </button>
                        <div className="absolute right-4 bottom-4 left-4 rounded bg-black/50 p-3 text-center text-sm text-white">
                            Ketuk di luar gambar untuk menutup
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
