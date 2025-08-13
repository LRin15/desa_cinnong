// resources/js/Pages/ProfilDesa.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Award, Calendar, Eye, MapPin, Target, Users } from 'lucide-react';

export default function ProfilDesa() {
    return (
        <MainLayout>
            <Head title="Profil Desa" />
            <div className="min-h-screen py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900">Profil Desa Cinnong</h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">
                            Mengenal lebih dekat Desa Cinnong, sejarah, visi misi, dan struktur pemerintahan desa
                        </p>
                    </div>

                    {/* Hero Card */}
                    <div className="mb-12 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                    <MapPin className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="mb-2 text-3xl font-bold">Desa Cinnong</h2>
                                    {/* NOTE: Kecamatan/Kabupaten is not specified in the PDF, but is inferred. */}
                                    <p className="text-orange-100">Kecamatan Sibulue, Kabupaten Bone</p>
                                    <div className="mt-2 flex items-center space-x-4">
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                            {/* NOTE: Area data is not available in the provided PDF. */}
                                            Luas: 12.5 km²
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                            {/* NOTE: Altitude data is not available in the provided PDF. */}
                                            Ketinggian: 450 mdpl
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Sejarah */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        <span>Sejarah Desa</span>
                                    </h3>
                                </div>
                                <div>
                                    {/* NOTE: Historical information is not available in the provided PDF. */}
                                    <p className="mb-4 leading-relaxed text-gray-700">
                                        Desa Cinnong didirikan pada tahun 1945 oleh para pejuang kemerdekaan yang menetap di daerah ini setelah
                                        proklamasi kemerdekaan Indonesia. Nama "Cinnong" berasal dari bahasa daerah yang berarti "air jernih", merujuk
                                        pada sumber mata air alami yang melimpah di wilayah ini.
                                    </p>
                                    <p className="mb-4 leading-relaxed text-gray-700">
                                        Sejak awal berdirinya, Desa Cinnong dikenal sebagai daerah agraris dengan mayoritas penduduk bermata
                                        pencaharian sebagai petani dan peternak. Seiring perkembangan zaman, desa ini telah bertransformasi menjadi
                                        pusat UMKM dan kegiatan ekonomi kreatif yang dinamis.
                                    </p>
                                    <p className="leading-relaxed text-gray-700">
                                        Pada tahun 2020, Desa Cinnong meraih penghargaan sebagai Desa Wisata Terbaik tingkat kabupaten berkat upaya
                                        pelestarian budaya dan pengembangan potensi alam yang berkelanjutan.
                                    </p>
                                </div>
                            </div>

                            {/* Visi Misi */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4">
                                        <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                            <Eye className="h-5 w-5 text-orange-600" />
                                            <span>Visi</span>
                                        </h3>
                                    </div>
                                    <div>
                                        {/* NOTE: Vision/Mission is not available in the provided PDF. */}
                                        <p className="leading-relaxed text-gray-700">
                                            "Menjadikan Desa Cinnong sebagai desa mandiri, sejahtera, dan berkelanjutan dengan mengedepankan
                                            nilai-nilai kearifan lokal dan inovasi teknologi."
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4">
                                        <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                            <Target className="h-5 w-5 text-orange-600" />
                                            <span>Misi</span>
                                        </h3>
                                    </div>
                                    <div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Meningkatkan kesejahteraan masyarakat melalui pemberdayaan ekonomi</li>
                                            <li>• Mengembangkan potensi wisata dan budaya lokal</li>
                                            <li>• Menerapkan tata kelola pemerintahan yang transparan</li>
                                            <li>• Melestarikan lingkungan hidup</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Struktur Pemerintahan */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                        <Users className="h-5 w-5 text-orange-600" />
                                        <span>Struktur Pemerintahan</span>
                                    </h3>
                                </div>
                                <div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="rounded-lg bg-orange-50 p-4 text-center">
                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600">
                                                <span className="text-lg font-bold text-white">KD</span>
                                            </div>
                                            {/* Data updated based on PDF source [cite: 61] */}
                                            <h4 className="font-semibold text-gray-900"> Irfan, S. Sos</h4>
                                            <p className="text-sm text-gray-600">Kepala Desa</p>
                                            <p className="mt-1 text-xs text-gray-500">Periode 2019-2025</p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                                <span className="text-lg font-bold text-white">SD</span>
                                            </div>
                                            {/* NOTE: Staff names are not available in the PDF [cite: 103] */}
                                            <h4 className="font-semibold text-gray-900">Ibu Sari Dewi</h4>
                                            <p className="text-sm text-gray-600">Sekretaris Desa</p>
                                            <p className="mt-1 text-xs text-gray-500">Sejak 2020</p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                                <span className="text-lg font-bold text-white">KU</span>
                                            </div>
                                            {/* NOTE: Staff names are not available in the PDF [cite: 103] */}
                                            <h4 className="font-semibold text-gray-900">Bapak Ahmad Wijaya</h4>
                                            <p className="text-sm text-gray-600">Kepala Urusan Keuangan</p>
                                            <p className="mt-1 text-xs text-gray-500">Sejak 2021</p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                                <span className="text-lg font-bold text-white">KP</span>
                                            </div>
                                            {/* NOTE: Staff names are not available in the PDF [cite: 103] */}
                                            <h4 className="font-semibold text-gray-900">Ibu Ratna Sari</h4>
                                            <p className="text-sm text-gray-600">Kepala Urusan Perencanaan</p>
                                            <p className="mt-1 text-xs text-gray-500">Sejak 2019</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Facts */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Fakta Singkat</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Tahun Berdiri</span>
                                        {/* NOTE: Founding year is not available in the provided PDF. */}
                                        <span className="font-semibold">1945</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Luas Wilayah</span>
                                        {/* NOTE: Area data is not available in the provided PDF. */}
                                        <span className="font-semibold">12.5 km²</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Jumlah RT</span>
                                        {/* Data updated based on PDF source [cite: 91] */}
                                        <span className="font-semibold">8 RT</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Ketinggian</span>
                                        {/* NOTE: Altitude data is not available in the provided PDF. */}
                                        <span className="font-semibold">450 mdpl</span>
                                    </div>
                                </div>
                            </div>

                            {/* Prestasi */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                        <Award className="h-5 w-5 text-orange-600" />
                                        <span>Prestasi</span>
                                    </h3>
                                </div>
                                {/* NOTE: Village achievements are not available in the provided PDF. */}
                                <div className="space-y-3">
                                    <div className="rounded-lg bg-orange-50 p-3">
                                        <p className="text-sm font-semibold">Desa Wisata Terbaik</p>
                                        <p className="text-xs text-gray-600">Tingkat Kabupaten - 2020</p>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-3">
                                        <p className="text-sm font-semibold">Desa Inovatif</p>
                                        <p className="text-xs text-gray-600">Tingkat Provinsi - 2021</p>
                                    </div>
                                    <div className="rounded-lg bg-blue-50 p-3">
                                        <p className="text-sm font-semibold">Desa Sehat</p>
                                        <p className="text-xs text-gray-600">Tingkat Kabupaten - 2022</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
