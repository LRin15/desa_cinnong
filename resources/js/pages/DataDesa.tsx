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
    dataGuru: TingkatPendidikanEntry[]; // Props baru
    totalsGuru: TotalsPendidikan; // Props baru
}

export default function DataDesa({
    dataRekap,
    dusunList,
    bulanList,
    tahun,
    dataPendidikan,
    totalsPendidikan,
    dataGuru,
    totalsGuru, // Terima props baru
}: DataDesaProps) {
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

            {/* Header Halaman */}
            <div className="py-12">
                <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b-4 border-[#f97316] bg-[#ffedd5] p-8 text-gray-900">
                            <h1 className="text-3xl font-bold text-[#9a3412]">Data Kependudukan & Pendidikan Desa Cinnong</h1>
                            <p className="mt-2 text-gray-700">Laporan data kependudukan, sekolah, dan guru untuk tahun {tahun}.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================== */}
            {/* BAGIAN TABEL 1: DATA KEPENDUDUKAN                           */}
            {/* =========================================================== */}
            <div className="bg-slate-50 pt-12">
                <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">LAPORAN DATA KEPENDUDUKAN</h2>
                        <p>
                            <strong>TAHUN:</strong> {tahun}
                        </p>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
                                {/* ... thead dan tbody tabel kependudukan (tidak berubah) ... */}
                                <thead className="bg-[#ffedd5] text-sm font-bold">
                                    <tr>
                                        <th rowSpan={2} className="border border-gray-400 px-2 py-2">
                                            NO.
                                        </th>
                                        <th rowSpan={2} className="border border-gray-400 px-4 py-2">
                                            DUSUN
                                        </th>
                                        {bulanList.map((bulan: string, index: number) => (
                                            <th key={index} colSpan={3} className="border border-gray-400 px-4 py-2 uppercase">
                                                {bulan}
                                            </th>
                                        ))}
                                    </tr>
                                    <tr>
                                        {bulanList.map((_: string, index: number) => (
                                            <React.Fragment key={index}>
                                                <th className="border border-gray-400 bg-[#fed7aa] px-3 py-2">L</th>
                                                <th className="border border-gray-400 bg-[#fed7aa] px-3 py-2">P</th>
                                                <th className="border border-gray-400 bg-[#fecaca] px-3 py-2">J</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-center text-sm">
                                    {dusunList.map((dusun: string, index: number) => (
                                        <tr key={index} className="hover:bg-[#fff7ed]">
                                            <td className="border border-gray-400 px-2 py-2">{index + 1}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-left font-semibold">{dusun}</td>
                                            {bulanList.map((_: string, bulanIndex: number) => {
                                                const data = getDataKependudukan(dusun, bulanIndex);
                                                return (
                                                    <React.Fragment key={bulanIndex}>
                                                        <td className="border border-gray-400 px-3 py-2">{data.l}</td>
                                                        <td className="border border-gray-400 px-3 py-2">{data.p}</td>
                                                        <td className="border border-gray-400 bg-[#fee2e2] px-3 py-2 font-semibold">{data.j}</td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr className="bg-[#ffedd5] font-bold">
                                        <td colSpan={2} className="border border-gray-400 px-4 py-2 text-center">
                                            JUMLAH
                                        </td>
                                        {bulanList.map((_: string, bulanIndex: number) => {
                                            const total = getTotalBulanan(bulanIndex);
                                            return (
                                                <React.Fragment key={bulanIndex}>
                                                    <td className="border border-gray-400 px-3 py-2">{total.l || '-'}</td>
                                                    <td className="border border-gray-400 px-3 py-2">{total.p || '-'}</td>
                                                    <td className="border border-gray-400 bg-[#fecaca] px-3 py-2">{total.j || '-'}</td>
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
            <div className="bg-slate-50 py-12">
                <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">JUMLAH SEKOLAH MENURUT TINGKAT PENDIDIKAN</h2>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
                                {/* ... thead, tbody, tfoot tabel sekolah (tidak berubah) ... */}
                                <thead className="bg-[#ffedd5] text-sm font-bold">
                                    <tr>
                                        <th className="border border-gray-400 px-4 py-3">NO.</th>
                                        <th className="border border-gray-400 px-4 py-3">TINGKAT PENDIDIKAN</th>
                                        <th className="border border-gray-400 px-4 py-3">NEGERI</th>
                                        <th className="border border-gray-400 px-4 py-3">SWASTA</th>
                                        <th className="border border-gray-400 px-4 py-3">JUMLAH</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-center text-sm">
                                    {dataPendidikan.map((item) => (
                                        <tr key={item.no} className="hover:bg-[#fff7ed]">
                                            <td className="border border-gray-400 px-4 py-2">{item.no}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-left font-semibold">{item.tingkat}</td>
                                            <td className="border border-gray-400 px-4 py-2">{item.negeri}</td>
                                            <td className="border border-gray-400 px-4 py-2">{item.swasta}</td>
                                            <td className="border border-gray-400 bg-[#fee2e2] px-4 py-2 font-semibold">{item.jumlah}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#ffedd5] font-bold">
                                    <tr>
                                        <td colSpan={2} className="border border-gray-400 px-4 py-2 text-center">
                                            JUMLAH
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2 text-center">{totalsPendidikan.negeri}</td>
                                        <td className="border border-gray-400 px-4 py-2 text-center">{totalsPendidikan.swasta}</td>
                                        <td className="border border-gray-400 bg-[#fecaca] px-4 py-2 text-center">{totalsPendidikan.jumlah}</td>
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
            <div className="bg-slate-50 pb-12">
                <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">JUMLAH GURU MENURUT TINGKAT PENDIDIKAN</h2>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
                                <thead className="bg-[#ffedd5] text-sm font-bold">
                                    <tr>
                                        <th className="border border-gray-400 px-4 py-3">NO.</th>
                                        <th className="border border-gray-400 px-4 py-3">TINGKAT PENDIDIKAN</th>
                                        <th className="border border-gray-400 px-4 py-3">NEGERI</th>
                                        <th className="border border-gray-400 px-4 py-3">SWASTA</th>
                                        <th className="border border-gray-400 px-4 py-3">JUMLAH</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-center text-sm">
                                    {dataGuru.map((item) => (
                                        <tr key={item.no} className="hover:bg-[#fff7ed]">
                                            <td className="border border-gray-400 px-4 py-2">{item.no}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-left font-semibold">{item.tingkat}</td>
                                            <td className="border border-gray-400 px-4 py-2">{item.negeri}</td>
                                            <td className="border border-gray-400 px-4 py-2">{item.swasta}</td>
                                            <td className="border border-gray-400 bg-[#fee2e2] px-4 py-2 font-semibold">{item.jumlah}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#ffedd5] font-bold">
                                    <tr>
                                        <td colSpan={2} className="border border-gray-400 px-4 py-2 text-center">
                                            JUMLAH
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2 text-center">{totalsGuru.negeri}</td>
                                        <td className="border border-gray-400 px-4 py-2 text-center">{totalsGuru.swasta}</td>
                                        <td className="border border-gray-400 bg-[#fecaca] px-4 py-2 text-center">{totalsGuru.jumlah}</td>
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
