import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

// --- Tipe Data untuk Kependudukan ---
interface DataEntryKependudukan {
    jumlah_l: number;
    jumlah_p: number;
}
interface DataRekap {
    [dusun: string]: { [bulan: number]: DataEntryKependudukan[] };
}
interface PopulationData {
    l: number | string;
    p: number | string;
    j: number | string;
}

// --- Tipe Data Umum untuk Tabel Pendidikan & Guru ---
interface TingkatPendidikanEntry {
    no: string | number;
    tingkat: string;
    negeri: string | number;
    swasta: string | number;
    jumlah: string | number;
}
interface TotalsPendidikan {
    negeri: string | number;
    swasta: string | number;
    jumlah: string | number;
}

// --- Gabungan Props untuk Halaman ---
interface DataDesaProps {
    dataRekap: DataRekap;
    dusunList: string[];
    bulanList: string[];
    tahun: string | number;
    dataPendidikan: TingkatPendidikanEntry[];
    totalsPendidikan: TotalsPendidikan;
    dataGuru: TingkatPendidikanEntry[];
    totalsGuru: TotalsPendidikan;
}

export default function DataDesa({ dataRekap, dusunList, bulanList, tahun, dataPendidikan, totalsPendidikan, dataGuru, totalsGuru }: DataDesaProps) {
    // --- Fungsi Helper untuk Tabel Kependudukan ---
    const getDataKependudukan = (dusun: string, bulanIndex: number): PopulationData => {
        const bulanData = dataRekap[dusun]?.[bulanIndex + 1];
        if (bulanData) {
            const data = bulanData[0];
            return { l: data.jumlah_l, p: data.jumlah_p, j: data.jumlah_l + data.jumlah_p };
        }
        return { l: '-', p: '-', j: '-' };
    };
    const getTotalBulanan = (bulanIndex: number): PopulationData => {
        let totalL = 0,
            totalP = 0;
        dusunList.forEach((dusun: string) => {
            const data = getDataKependudukan(dusun, bulanIndex);
            if (data.l !== '-') totalL += data.l as number;
            if (data.p !== '-') totalP += data.p as number;
        });
        return { l: totalL, p: totalP, j: totalL + totalP };
    };

    return (
        <MainLayout>
            <Head title={`Data Kependudukan & Pendidikan ${tahun}`} />

            {/* Header Halaman - Mobile optimized */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b-4 border-[#f97316] bg-[#ffedd5] p-4 text-gray-900 sm:p-6 lg:p-8">
                            <h1 className="text-2xl font-bold text-[#9a3412] sm:text-3xl">Data Kependudukan & Pendidikan Desa Cinnong</h1>
                            <p className="mt-2 text-sm text-gray-700 sm:text-base">
                                Laporan data kependudukan, sekolah, dan guru untuk tahun {tahun}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================== */}
            {/* BAGIAN TABEL 1: DATA KEPENDUDUKAN                           */}
            {/* =========================================================== */}
            <div className="bg-slate-50 pt-8 sm:pt-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg sm:p-6">
                        <div className="mb-4 sm:mb-6">
                            <h2 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">LAPORAN DATA KEPENDUDUKAN</h2>
                            <p className="text-sm sm:text-base">
                                <strong>TAHUN:</strong> {tahun}
                            </p>
                        </div>

                        {/* Mobile: Scroll hint */}
                        <div className="mb-3 text-xs text-gray-500 sm:hidden">← Geser tabel untuk melihat data lengkap →</div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400" style={{ minWidth: '800px' }}>
                                <thead className="bg-[#ffedd5] text-xs font-bold sm:text-sm">
                                    <tr>
                                        <th rowSpan={2} className="border border-gray-400 px-1 py-2 sm:px-2">
                                            NO.
                                        </th>
                                        <th rowSpan={2} className="border border-gray-400 px-2 py-2 sm:px-4">
                                            DUSUN
                                        </th>
                                        {bulanList.map((bulan: string, index: number) => (
                                            <th key={index} colSpan={3} className="border border-gray-400 px-2 py-2 uppercase sm:px-4">
                                                {bulan}
                                            </th>
                                        ))}
                                    </tr>
                                    <tr>
                                        {bulanList.map((_: string, index: number) => (
                                            <React.Fragment key={index}>
                                                <th className="border border-gray-400 bg-[#fed7aa] px-1 py-2 sm:px-3">L</th>
                                                <th className="border border-gray-400 bg-[#fed7aa] px-1 py-2 sm:px-3">P</th>
                                                <th className="border border-gray-400 bg-[#fecaca] px-1 py-2 sm:px-3">J</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-center text-xs sm:text-sm">
                                    {dusunList.map((dusun: string, index: number) => (
                                        <tr key={index} className="hover:bg-[#fff7ed]">
                                            <td className="border border-gray-400 px-1 py-2 sm:px-2">{index + 1}</td>
                                            <td className="border border-gray-400 px-2 py-2 text-left font-semibold sm:px-4">{dusun}</td>
                                            {bulanList.map((_: string, bulanIndex: number) => {
                                                const data = getDataKependudukan(dusun, bulanIndex);
                                                return (
                                                    <React.Fragment key={bulanIndex}>
                                                        <td className="border border-gray-400 px-1 py-2 sm:px-3">{data.l}</td>
                                                        <td className="border border-gray-400 px-1 py-2 sm:px-3">{data.p}</td>
                                                        <td className="border border-gray-400 bg-[#fee2e2] px-1 py-2 font-semibold sm:px-3">
                                                            {data.j}
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr className="bg-[#ffedd5] font-bold">
                                        <td colSpan={2} className="border border-gray-400 px-2 py-2 text-center sm:px-4">
                                            JUMLAH
                                        </td>
                                        {bulanList.map((_: string, bulanIndex: number) => {
                                            const total = getTotalBulanan(bulanIndex);
                                            return (
                                                <React.Fragment key={bulanIndex}>
                                                    <td className="border border-gray-400 px-1 py-2 sm:px-3">{total.l || '-'}</td>
                                                    <td className="border border-gray-400 px-1 py-2 sm:px-3">{total.p || '-'}</td>
                                                    <td className="border border-gray-400 bg-[#fecaca] px-1 py-2 sm:px-3">{total.j || '-'}</td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================== */}
            {/* BAGIAN TABEL 2: DATA SEKOLAH                              */}
            {/* =========================================================== */}
            <div className="bg-slate-50 py-8 sm:py-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg sm:p-6">
                        <h2 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl">JUMLAH SEKOLAH MENURUT TINGKAT PENDIDIKAN</h2>

                        {/* Mobile: Scroll hint */}
                        <div className="mb-3 text-xs text-gray-500 sm:hidden">← Geser tabel untuk melihat data lengkap →</div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400" style={{ minWidth: '500px' }}>
                                <thead className="bg-[#ffedd5] text-xs font-bold sm:text-sm">
                                    <tr>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">NO.</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">TINGKAT PENDIDIKAN</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">NEGERI</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">SWASTA</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">JUMLAH</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-center text-xs sm:text-sm">
                                    {dataPendidikan.map((item) => (
                                        <tr key={item.no} className="hover:bg-[#fff7ed]">
                                            <td className="border border-gray-400 px-2 py-2 sm:px-4">{item.no}</td>
                                            <td className="border border-gray-400 px-2 py-2 text-left font-semibold sm:px-4">{item.tingkat}</td>
                                            <td className="border border-gray-400 px-2 py-2 sm:px-4">{item.negeri}</td>
                                            <td className="border border-gray-400 px-2 py-2 sm:px-4">{item.swasta}</td>
                                            <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold sm:px-4">{item.jumlah}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#ffedd5] font-bold">
                                    <tr>
                                        <td colSpan={2} className="border border-gray-400 px-2 py-2 text-center sm:px-4">
                                            JUMLAH
                                        </td>
                                        <td className="border border-gray-400 px-2 py-2 text-center sm:px-4">{totalsPendidikan.negeri}</td>
                                        <td className="border border-gray-400 px-2 py-2 text-center sm:px-4">{totalsPendidikan.swasta}</td>
                                        <td className="border border-gray-400 bg-[#fecaca] px-2 py-2 text-center sm:px-4">
                                            {totalsPendidikan.jumlah}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================== */}
            {/* BAGIAN TABEL 3: DATA GURU (BARU)                            */}
            {/* =========================================================== */}
            <div className="bg-slate-50 pb-8 sm:pb-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg sm:p-6">
                        <h2 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl">JUMLAH GURU MENURUT TINGKAT PENDIDIKAN</h2>

                        {/* Mobile: Scroll hint */}
                        <div className="mb-3 text-xs text-gray-500 sm:hidden">← Geser tabel untuk melihat data lengkap →</div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400" style={{ minWidth: '500px' }}>
                                <thead className="bg-[#ffedd5] text-xs font-bold sm:text-sm">
                                    <tr>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">NO.</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">TINGKAT PENDIDIKAN</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">NEGERI</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">SWASTA</th>
                                        <th className="border border-gray-400 px-2 py-3 sm:px-4">JUMLAH</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-center text-xs sm:text-sm">
                                    {dataGuru.map((item) => (
                                        <tr key={item.no} className="hover:bg-[#fff7ed]">
                                            <td className="border border-gray-400 px-2 py-2 sm:px-4">{item.no}</td>
                                            <td className="border border-gray-400 px-2 py-2 text-left font-semibold sm:px-4">{item.tingkat}</td>
                                            <td className="border border-gray-400 px-2 py-2 sm:px-4">{item.negeri}</td>
                                            <td className="border border-gray-400 px-2 py-2 sm:px-4">{item.swasta}</td>
                                            <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold sm:px-4">{item.jumlah}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#ffedd5] font-bold">
                                    <tr>
                                        <td colSpan={2} className="border border-gray-400 px-2 py-2 text-center sm:px-4">
                                            JUMLAH
                                        </td>
                                        <td className="border border-gray-400 px-2 py-2 text-center sm:px-4">{totalsGuru.negeri}</td>
                                        <td className="border border-gray-400 px-2 py-2 text-center sm:px-4">{totalsGuru.swasta}</td>
                                        <td className="border border-gray-400 bg-[#fecaca] px-2 py-2 text-center sm:px-4">{totalsGuru.jumlah}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
