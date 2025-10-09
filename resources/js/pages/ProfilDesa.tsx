// resources/js/Pages/ProfilDesa.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Eye, MapPin, Target, Users } from 'lucide-react';
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
                                <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                                    Pada tahun 2010 diadakan Pemilihan Kepala Desa tongkat estafet kepemimpinan berpindah kepada Irfan, S.Kom selaku
                                    Kepala Desa Cinnong sampai pada tahun 2016 dan kembali memimpin desa Cinnong setelah terpilih kedua kalinya pada
                                    Pemilihan serentak Kepala Desa tahap II untuk memimpin Desa Cinnong sampai pada tahun 2022, yang kemudian kembali
                                    memimpin setelah terpilih yang ketiga kalinya pada Pemilihan kepala desa serentak gel. II untuk memimpin desa
                                    Cinnong Periode 2023-2030.
                                </p>
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
                                    "MENINGKATKAN MUTU KESEJAHTERAAN MASYARAKAT DESA CINNONG UNTUK MENCAPAI TARAF KEHIDUPAN YANG LEBIH BAIK DAN LAYAK
                                    SEHINGGA MENJADI DESA YANG MAJU DAN MANDIRI."
                                </p>

                                <h4 className="mb-3 flex items-center space-x-2 text-base font-semibold text-gray-900 sm:text-lg">
                                    <Target className="h-4 w-4 flex-shrink-0 text-orange-600" />
                                    <span>Misi</span>
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700 sm:space-y-3 sm:text-base">
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>Meningkatkan Profesionalisme Pelayanan Publik</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>
                                            Meningkatkan Pengelolaan Jalan desa, Jalan Dusun, Sarana Hunian Pemukiman yang Layak Huni, Peningkatan
                                            Sarana Air Bersih, Saluran Air Pertanian, Sarana Keagamaan, Pendidikan dan Kesehatan serta Infrastruktur
                                            lainnya
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>
                                            Meningkatkan Sarana Kesehatan, Kebersihan desa serta mengusahakan Jaminan Kesehatan Masyarakat melalui
                                            program pemerintah
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>
                                            Meningkatkan kesejahteraan masyarakat desa dengan mewujudkan Badan Usaha Milik Desa (BUMDes) dan program
                                            lain untuk membuka lapangan kerja bagi masyarakat desa, serta meningkatkan produksi rumah tangga kecil
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="mt-1 flex-shrink-0 font-bold text-orange-500">•</span>
                                        <span>
                                            Memberdayakan lembaga yang ada dan mengoptimalkan kegiatan pemuda dan olah raga guna menekan tingkat
                                            kenakalan remaja
                                        </span>
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
                            <div className="w-full max-w-3xl space-y-4 rounded-lg bg-gray-50 p-3 sm:space-y-6 sm:p-4">
                                <img
                                    src="/images/struktur.png"
                                    alt="Foto bersama tim pemerintahan Desa Cinnong"
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    onClick={() => openImageModal('/images/struktur.png')}
                                />
                                <img
                                    src="/images/struktur2.png"
                                    alt="Foto bersama tim pemerintahan Desa Cinnong"
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    onClick={() => openImageModal('/images/struktur2.png')}
                                />
                                <img
                                    src="/images/struktur3.png"
                                    alt="Foto bersama tim pemerintahan Desa Cinnong"
                                    className="h-auto w-full cursor-pointer rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                                    onClick={() => openImageModal('/images/struktur3.png')}
                                />
                                <p className="mt-3 text-center text-xs text-gray-600 sm:text-sm">Tim Pemerintahan Desa Cinnong</p>
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
                                </div>

                                {/* Staff Lainnya */}
                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/herlina.png"
                                            alt="HERLINA, S.Sos - Sekretaris Desa"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/herlina.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">HERLINA, S.Sos</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Sekretaris Desa</p>
                                </div>

                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/irwati.png"
                                            alt="IRMAWATI, SP.d - Kaur Keuangan"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/irwati.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">IRMAWATI, SP.d</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kaur Keuangan</p>
                                </div>

                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/suriati.png"
                                            alt="SURIATI - Bendahara"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/suriati.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">SURIANTI S.Sos</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Staf Kaur Keuangan</p>
                                </div>

                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/marvina.png"
                                            alt="MARVINA - Kaur Umum & Perencanaan"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/marvina.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">MARVINA</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kaur Umum & Perencanaan</p>
                                </div>

                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/nasir.png"
                                            alt="NASIR NGATTA - Kasi Pemerintahan"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/nasir.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">NASIR NGATTA</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kasi Pemerintahan</p>
                                </div>

                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/ardi.png"
                                            alt="ARDI - Kasi Kesejahteraan"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/ardi.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">ARDI JUMADIL</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Kasi Kesejahteraan</p>
                                </div>

                                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 text-center sm:col-span-2 sm:p-6 lg:col-span-1">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                                        <img
                                            src="/images/herianti.png"
                                            alt="HERIANTI - Operator Desa"
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() => openImageModal('/images/herianti.png')}
                                        />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900 sm:text-base">HERIANTI</h4>
                                    <p className="text-xs text-gray-600 sm:text-sm">Operator Desa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Image Modal */}
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
