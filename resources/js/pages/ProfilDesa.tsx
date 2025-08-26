// resources/js/Pages/ProfilDesa.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronDown, ChevronUp, Eye, MapPin, Target, Users } from 'lucide-react';
import { useState } from 'react';

export default function ProfilDesa() {
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const toggleHistory = () => {
        setShowFullHistory(!showFullHistory);
    };

    const openImageModal = (src: string) => {
        setSelectedImage(src);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <MainLayout>
            <Head title="Profil Desa" />
            <div className="min-h-screen py-4 sm:py-6 lg:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center sm:mb-12">
                        <h1 className="mb-3 text-2xl leading-tight font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl">Profil Desa Cinnong</h1>
                        <p className="mx-auto max-w-2xl px-4 text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
                            Mengenal lebih dekat Desa Cinnong, sejarah, visi misi, dan struktur pemerintahan desa
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
                                    <h2 className="mb-2 text-xl font-bold sm:text-2xl lg:text-3xl">Desa Cinnong</h2>
                                    <p className="text-sm text-orange-100 sm:text-base">Kecamatan Sibulue, Kabupaten Bone</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                            8 RT
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                            Luas: 16.29 km²
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
                                <span>Peta Wilayah Desa Cinnong</span>
                            </h3>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-2xl rounded-lg bg-gray-50 p-3 sm:p-4">
                                <img
                                    src="/images/peta.png"
                                    alt="Peta Desa Cinnong menunjukkan pembagian wilayah RT"
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                                    onClick={() => openImageModal('/images/peta.png')}
                                />
                                <p className="mt-3 text-center text-xs text-gray-600 sm:text-sm">
                                    Peta wilayah Desa Cinnong dengan pembagian 8 RT (Ketuk untuk memperbesar)
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
                                    Sejarah kepemimpinan Desa Cinnong dapat dimulai dari tahun 70-an sampai tahun 1994 dibawah Pemerintahan Asapah.
                                    Pada tahun yang sama pucuk kepemimpinan diambil alih oleh H. Muh. Anshar sebagai Kepala Desa Cinnong sampai tahun
                                    2010.
                                </p>
                                <div className={`transition-all duration-300 ${showFullHistory ? 'max-h-none' : 'max-h-0 overflow-hidden'}`}>
                                    <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                                        Pada tahun 2010 diadakan Pemilihan Kepala Desa tongkat estafet kepemimpinan berpindah kepada Irfan, S.Kom
                                        selaku Kepala Desa Cinnong sampai pada tahun 2016 dan kembali memimpin desa Cinnong setelah terpilih kedua
                                        kalinya pada Pemilihan serentak Kepala Desa tahap II untuk memimpin Desa Cinnong sampai pada tahun 2022, yang
                                        kemudian kembali memimpin setelah terpilih yang ketiga kalinya pada Pemilihan kepala desa serentak gel. II
                                        untuk memimpin desa Cinnong Periode 2023-2030.
                                    </p>
                                </div>
                                <button
                                    onClick={toggleHistory}
                                    className="mt-2 flex items-center space-x-2 text-sm font-medium text-orange-600 transition-colors hover:text-orange-700 sm:text-base"
                                >
                                    <span>{showFullHistory ? 'Tutup' : 'Selengkapnya'}</span>
                                    {showFullHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Visi */}
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <div className="mb-4">
                                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                    <Eye className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                    <span>Visi</span>
                                </h3>
                            </div>
                            <div>
                                <p className="mb-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3 text-sm leading-relaxed text-gray-700 italic sm:mb-6 sm:p-4 sm:text-base">
                                    "Menjadikan Desa Cinnong sebagai desa mandiri, sejahtera, dan berkelanjutan dengan mengedepankan nilai-nilai
                                    kearifan lokal dan inovasi teknologi."
                                </p>

                                <h4 className="mb-3 flex items-center space-x-2 text-base font-semibold text-gray-900 sm:text-lg">
                                    <Target className="h-4 w-4 flex-shrink-0 text-orange-600" />
                                    <span>Misi</span>
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700 sm:space-y-3 sm:text-base">
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>Meningkatkan kesejahteraan masyarakat melalui pemberdayaan ekonomi</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>Mengembangkan potensi wisata dan budaya lokal</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>Menerapkan tata kelola pemerintahan yang transparan</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>Melestarikan lingkungan hidup</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Foto Struktur Pemerintahan */}
                    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:mt-12 sm:p-6">
                        <div className="mb-4 sm:mb-6">
                            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 sm:text-xl">
                                <Users className="h-5 w-5 flex-shrink-0 text-orange-600" />
                                <span>Tim Pemerintahan Desa Cinnong</span>
                            </h3>
                        </div>
                        <div className="mb-4 flex justify-center sm:mb-6">
                            <div className="w-full max-w-3xl rounded-lg bg-gray-50 p-3 sm:p-4">
                                <img
                                    src="/images/struktur.png"
                                    alt="Foto bersama tim pemerintahan Desa Cinnong"
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    onClick={() => openImageModal('/images/struktur.png')}
                                />
                                <p className="mt-3 text-center text-xs text-gray-600 sm:text-sm">
                                    Tim Pemerintahan Desa Cinnong periode 2023-2030 (Ketuk untuk memperbesar)
                                </p>
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
                                {/* Kepala Desa - Featured */}
                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/kades.png"
                                            alt="Irfan, S.Kom - Kepala Desa Cinnong"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/kades.png')}
                                        />
                                    </div>
                                    <h4 className="text-base font-bold text-gray-900 sm:text-lg">IRFAN, S.Kom</h4>
                                    <p className="text-sm font-semibold text-orange-700 sm:text-base">Kepala Desa</p>
                                    <p className="mt-1 text-xs text-gray-600 sm:text-sm">Periode 2023-2030</p>
                                </div>

                                {/* Staff Lainnya */}
                                <div className="rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700 shadow-md sm:h-18 sm:w-18">
                                        <span className="text-base font-bold text-white sm:text-lg">SD</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">HERLINA, S.Sos</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Sekretaris Desa</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-md sm:h-18 sm:w-18">
                                        <span className="text-base font-bold text-white sm:text-lg">KU</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">IRMAWATI, SP.d</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kaur Keuangan</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-md sm:h-18 sm:w-18">
                                        <span className="text-base font-bold text-white sm:text-lg">UP</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">MARVINA</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kaur Umum & Perencanaan</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-700 shadow-md sm:h-18 sm:w-18">
                                        <span className="text-base font-bold text-white sm:text-lg">KP</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">NASIR NGATTA</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kasi Pemerintahan</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-md sm:h-18 sm:w-18">
                                        <span className="text-base font-bold text-white sm:text-lg">KK</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">ARDI JUMADIL</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kasi Kesejahteraan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={closeImageModal}>
                    <div className="relative max-h-full max-w-full">
                        <img
                            src={selectedImage}
                            alt="Gambar diperbesar"
                            className="max-h-full max-w-full rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:top-4 sm:right-4 sm:h-10 sm:w-10"
                        >
                            ×
                        </button>
                        <p className="absolute right-2 bottom-2 left-2 rounded bg-black/50 p-2 text-center text-xs text-white sm:text-sm">
                            Ketuk di luar gambar untuk menutup
                        </p>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
