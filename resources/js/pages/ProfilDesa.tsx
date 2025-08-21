// resources/js/Pages/ProfilDesa.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Eye, MapPin, Target, Users } from 'lucide-react';

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
                                    <p className="text-orange-100">Kecamatan Sibulue, Kabupaten Bone</p>
                                    <div className="mt-2 flex items-center space-x-4">
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
                    <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                <MapPin className="h-5 w-5 text-orange-600" />
                                <span>Peta Wilayah Desa Cinnong</span>
                            </h3>
                        </div>
                        <div className="flex justify-center">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <img
                                    src="/images/peta.png"
                                    alt="Peta Desa Cinnong menunjukkan pembagian wilayah RT"
                                    className="h-auto max-w-full rounded-lg shadow-md"
                                    style={{ maxHeight: '500px' }}
                                />
                                <p className="mt-3 text-center text-sm text-gray-600">Peta wilayah Desa Cinnong dengan pembagian 8 RT</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Sejarah */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                    <Calendar className="h-5 w-5 text-orange-600" />
                                    <span>Sejarah Desa</span>
                                </h3>
                            </div>
                            <div>
                                <p className="mb-4 leading-relaxed text-gray-700">
                                    Sejarah kepemimpinan Desa Cinnong dapat dimulai dari tahun 70-an sampai tahun 1994 dibawah Pemerintahan Asapah.
                                    Pada tahun yang sama pucuk kepemimpinan diambil alih oleh H. Muh. Anshar sebagai Kepala Desa Cinnong sampai tahun
                                    2010.
                                </p>
                                <p className="mb-4 leading-relaxed text-gray-700">
                                    Pada tahun 2010 diadakan Pemilihan Kepala Desa tongkat estafet kepemimpinan berpindah kepada Irfan, S.Kom selaku
                                    Kepala Desa Cinnong sampai pada tahun 2016 dan kembali memimpin desa Cinnong setelah terpilih kedua kalinya pada
                                    Pemilihan serentak Kepala Desa tahap II untuk memimpin Desa Cinnong sampai pada tahun 2022, yang kemudian kembali
                                    memimpin setelah terpilih yang ketiga kalinya pada Pemilihan kepala desa serentak gel. II untuk memimpin desa
                                    Cinnong Periode 2023-2030.
                                </p>
                            </div>
                        </div>

                        {/* Visi */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                    <Eye className="h-5 w-5 text-orange-600" />
                                    <span>Visi</span>
                                </h3>
                            </div>
                            <div>
                                <p className="mb-6 leading-relaxed text-gray-700">
                                    "Menjadikan Desa Cinnong sebagai desa mandiri, sejahtera, dan berkelanjutan dengan mengedepankan nilai-nilai
                                    kearifan lokal dan inovasi teknologi."
                                </p>

                                <h4 className="mb-3 flex items-center space-x-2 text-lg font-semibold text-gray-900">
                                    <Target className="h-4 w-4 text-orange-600" />
                                    <span>Misi</span>
                                </h4>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Meningkatkan kesejahteraan masyarakat melalui pemberdayaan ekonomi</li>
                                    <li>• Mengembangkan potensi wisata dan budaya lokal</li>
                                    <li>• Menerapkan tata kelola pemerintahan yang transparan</li>
                                    <li>• Melestarikan lingkungan hidup</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Foto Struktur Pemerintahan */}
                    <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                <Users className="h-5 w-5 text-orange-600" />
                                <span>Tim Pemerintahan Desa Cinnong</span>
                            </h3>
                        </div>
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <img
                                    src="/images/struktur.png"
                                    alt="Foto bersama tim pemerintahan Desa Cinnong"
                                    className="h-auto max-w-full rounded-lg shadow-md"
                                    style={{ maxHeight: '400px' }}
                                />
                                <p className="mt-3 text-center text-sm text-gray-600">Tim Pemerintahan Desa Cinnong periode 2023-2030</p>
                            </div>
                        </div>
                    </div>

                    {/* Struktur Pemerintahan Detail */}
                    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                                <Users className="h-5 w-5 text-orange-600" />
                                <span>Struktur Pemerintahan</span>
                            </h3>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-orange-50 p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-md">
                                        <img
                                            src="/images/kades.png"
                                            alt="Irfan, S.Kom - Kepala Desa Cinnong"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-semibold text-gray-900">IRFAN, S.Kom</h4>
                                    <p className="text-sm text-gray-600">Kepala Desa</p>
                                    <p className="mt-1 text-xs text-gray-500">Periode 2023-2030</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                        <span className="text-lg font-bold text-white">SD</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">HERLINA, S.Sos</h4>
                                    <p className="text-sm text-gray-600">Sekretaris Desa</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                        <span className="text-lg font-bold text-white">KU</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">IRMAWATI, SP.d</h4>
                                    <p className="text-sm text-gray-600">Kaur Keuangan</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                        <span className="text-lg font-bold text-white">KU</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">MARVINA</h4>
                                    <p className="text-sm text-gray-600">Kaur Umum & Perencanaan</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                        <span className="text-lg font-bold text-white">KP</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">NASIR NGATTA</h4>
                                    <p className="text-sm text-gray-600">Kasi Pemerintahan</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                        <span className="text-lg font-bold text-white">KK</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900">ARDI JUMADIL</h4>
                                    <p className="text-sm text-gray-600">Kasi Kesejahteraan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
