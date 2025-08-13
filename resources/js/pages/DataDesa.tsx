// resources/js/Pages/DataDesa.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

// Type definitions
interface DataEntry {
    jumlah_l: number;
    jumlah_p: number;
}

interface DataRekap {
    [dusun: string]: {
        [bulan: number]: DataEntry[];
    };
}

interface DataDesaProps {
    dataRekap: DataRekap;
    dusunList: string[];
    bulanList: string[];
    tahun: string | number;
}

interface PopulationData {
    l: number | string;
    p: number | string;
    j: number | string;
}

export default function DataDesa({ dataRekap, dusunList, bulanList, tahun }: DataDesaProps) {
    const getData = (dusun: string, bulanIndex: number): PopulationData => {
        const bulanData = dataRekap[dusun]?.[bulanIndex + 1];
        if (bulanData) {
            const data = bulanData[0];
            return {
                l: data.jumlah_l,
                p: data.jumlah_p,
                j: data.jumlah_l + data.jumlah_p,
            };
        }
        return { l: '-', p: '-', j: '-' };
    };

    const getTotalBulanan = (bulanIndex: number): PopulationData => {
        let totalL = 0;
        let totalP = 0;

        dusunList.forEach((dusun: string) => {
            const data = getData(dusun, bulanIndex);
            if (data.l !== '-') totalL += data.l as number;
            if (data.p !== '-') totalP += data.p as number;
        });

        return { l: totalL, p: totalP, j: totalL + totalP };
    };

    return (
        <MainLayout>
            <Head title={`Data Kependudukan ${tahun}`} />

            {/* Header Halaman - Sesuai dengan tema Beranda dan Infografis */}
            <div className="py-12">
                <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b-4 border-[#f97316] bg-[#ffedd5] p-8 text-gray-900">
                            <h1 className="text-3xl font-bold text-[#9a3412]">Data Kependudukan Desa Cinnong</h1>
                            <p className="mt-2 text-gray-700">Laporan data kependudukan per dusun dan bulan untuk tahun {tahun}.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten Tabel Data */}
            <div className="bg-slate-50 py-12">
                <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">LAPORAN DATA KEPENDUDUKAN</h2>
                        <p>
                            <strong>TAHUN:</strong> {tahun}
                        </p>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
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
                                                const data = getData(dusun, bulanIndex);
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
        </MainLayout>
    );
}
