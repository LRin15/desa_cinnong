import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

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

// --- Tipe Data untuk Detail Per Bulan ---
interface DataBulanDetail {
    no: string | number;
    dusun: string;
    penduduk_awal_l: number;
    penduduk_awal_p: number;
    penduduk_awal_j: number;
    lahir_l: number;
    lahir_p: number;
    lahir_j: number;
    mati_l: number;
    mati_p: number;
    mati_j: number;
    pendatang_l: number;
    pendatang_p: number;
    pendatang_j: number;
    pindah_l: number;
    pindah_p: number;
    pindah_j: number;
    penduduk_akhir_l: number;
    penduduk_akhir_p: number;
    penduduk_akhir_j: number;
    ktp_l: number;
    ktp_p: number;
    ktp_j: number;
    kk_l: number;
    kk_p: number;
    kk_j: number;
    akta_l: number;
    akta_p: number;
    akta_j: number;
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
    dataPerBulan: { [bulan: string]: DataBulanDetail[] };
    dataPendidikan: TingkatPendidikanEntry[];
    totalsPendidikan: TotalsPendidikan;
    dataGuru: TingkatPendidikanEntry[];
    totalsGuru: TotalsPendidikan;
    spreadsheetUrl: string;
}

export default function DataDesa({
    dataRekap,
    dusunList,
    bulanList,
    tahun,
    dataPerBulan,
    dataPendidikan,
    totalsPendidikan,
    dataGuru,
    totalsGuru,
    spreadsheetUrl,
}: DataDesaProps) {
    const [viewMode, setViewMode] = useState<'rekap' | 'detail'>('rekap');
    const [selectedMonth, setSelectedMonth] = useState<string>('JANUARI');

    const bulanOptions = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

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

    const currentMonthData = dataPerBulan[selectedMonth] || [];

    // Fungsi untuk Menghitung Total Tabel Detail
    const calculateDetailTotals = (data: DataBulanDetail[]): Omit<DataBulanDetail, 'no' | 'dusun'> => {
        const totals = {
            penduduk_awal_l: 0,
            penduduk_awal_p: 0,
            penduduk_awal_j: 0,
            lahir_l: 0,
            lahir_p: 0,
            lahir_j: 0,
            mati_l: 0,
            mati_p: 0,
            mati_j: 0,
            pendatang_l: 0,
            pendatang_p: 0,
            pendatang_j: 0,
            pindah_l: 0,
            pindah_p: 0,
            pindah_j: 0,
            penduduk_akhir_l: 0,
            penduduk_akhir_p: 0,
            penduduk_akhir_j: 0,
            ktp_l: 0,
            ktp_p: 0,
            ktp_j: 0,
            kk_l: 0,
            kk_p: 0,
            kk_j: 0,
            akta_l: 0,
            akta_p: 0,
            akta_j: 0,
        };

        data.forEach((row) => {
            for (const key in totals) {
                totals[key as keyof typeof totals] += Number(row[key as keyof typeof totals] || 0);
            }
        });

        return totals;
    };

    const detailTotals = calculateDetailTotals(currentMonthData);

    return (
        <MainLayout>
            <Head title={`Data Kependudukan & Pendidikan ${tahun}`} />

            {/* Header Halaman - Mobile optimized */}
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col gap-4 border-b-4 border-[#f97316] bg-[#ffedd5] p-4 text-gray-900 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#9a3412] sm:text-3xl">Data Kependudukan & Pendidikan Desa Cinnong</h1>
                                <p className="mt-2 text-sm text-gray-700 sm:text-base">
                                    Laporan data kependudukan, sekolah, dan guru untuk tahun {tahun}.
                                </p>
                            </div>
                            <a
                                href={spreadsheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-shrink-0 items-center justify-center rounded-lg border-2 border-[#f97316] px-4 py-2 text-sm font-bold text-[#f97316] shadow-sm transition-colors hover:bg-[#f97316] hover:text-white focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Unduh Data
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================== */}
            {/* BAGIAN TABEL 1: DATA KEPENDUDUKAN                          */}
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

                        {/* Toggle View Mode */}
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <div className="flex rounded-lg border border-gray-300 bg-gray-50 p-1">
                                <button
                                    onClick={() => setViewMode('rekap')}
                                    className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                                        viewMode === 'rekap' ? 'bg-[#f97316] text-white shadow' : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Rekap Tahunan
                                </button>
                                <button
                                    onClick={() => setViewMode('detail')}
                                    className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                                        viewMode === 'detail' ? 'bg-[#f97316] text-white shadow' : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Detail Per Bulan
                                </button>
                            </div>

                            {/* Month Selector (shown only in detail mode) */}
                            {viewMode === 'detail' && (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Pilih Bulan:</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                                    >
                                        {bulanOptions.map((bulan) => (
                                            <option key={bulan} value={bulan}>
                                                {bulan}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Mobile: Scroll hint */}
                        <div className="mb-3 text-xs text-gray-500 sm:hidden">← Geser tabel untuk melihat data lengkap →</div>

                        {/* TABEL REKAP TAHUNAN */}
                        {viewMode === 'rekap' && (
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
                        )}

                        {/* TABEL DETAIL PER BULAN */}
                        {viewMode === 'detail' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-300 border border-gray-400" style={{ minWidth: '1400px' }}>
                                    <thead className="bg-[#ffedd5] text-xs font-bold sm:text-sm">
                                        <tr>
                                            <th rowSpan={2} className="border border-gray-400 px-2 py-3">
                                                NO.
                                            </th>
                                            <th rowSpan={2} className="border border-gray-400 px-3 py-3">
                                                DUSUN
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                PENDUDUK AWAL BULAN
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                LAHIR BULAN INI
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                MATI BULAN INI
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                PENDATANG BULAN INI
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                PINDAH BULAN INI
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                PENDUDUK AKHIR BULAN
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                KTP
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                KARTU KELUARGA
                                            </th>
                                            <th colSpan={3} className="border border-gray-400 px-2 py-2">
                                                AKTA KELAHIRAN
                                            </th>
                                        </tr>
                                        <tr>
                                            {[...Array(9)].map((_, idx) => (
                                                <React.Fragment key={idx}>
                                                    <th className="border border-gray-400 bg-[#fed7aa] px-2 py-2">L</th>
                                                    <th className="border border-gray-400 bg-[#fed7aa] px-2 py-2">P</th>
                                                    <th className="border border-gray-400 bg-[#fecaca] px-2 py-2">J</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white text-center text-xs sm:text-sm">
                                        {currentMonthData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-[#fff7ed]">
                                                <td className="border border-gray-400 px-2 py-2">{row.no}</td>
                                                <td className="border border-gray-400 px-3 py-2 text-left font-semibold">{row.dusun}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.penduduk_awal_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.penduduk_awal_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.penduduk_awal_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.lahir_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.lahir_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.lahir_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.mati_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.mati_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.mati_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.pendatang_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.pendatang_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.pendatang_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.pindah_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.pindah_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.pindah_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.penduduk_akhir_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.penduduk_akhir_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">
                                                    {row.penduduk_akhir_j}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">{row.ktp_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.ktp_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.ktp_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.kk_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.kk_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.kk_j}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.akta_l}</td>
                                                <td className="border border-gray-400 px-2 py-2">{row.akta_p}</td>
                                                <td className="border border-gray-400 bg-[#fee2e2] px-2 py-2 font-semibold">{row.akta_j}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-[#ffedd5] text-center text-xs font-bold sm:text-sm">
                                        <tr>
                                            <td colSpan={2} className="border border-gray-400 px-3 py-2">
                                                JUMLAH
                                            </td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.penduduk_awal_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.penduduk_awal_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.penduduk_awal_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.lahir_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.lahir_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.lahir_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.mati_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.mati_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.mati_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.pendatang_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.pendatang_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.pendatang_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.pindah_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.pindah_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.pindah_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.penduduk_akhir_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.penduduk_akhir_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.penduduk_akhir_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.ktp_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.ktp_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.ktp_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.kk_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.kk_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.kk_j}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.akta_l}</td>
                                            <td className="border border-gray-400 px-2 py-2">{detailTotals.akta_p}</td>
                                            <td className="border border-gray-400 bg-[#fecaca] px-2 py-2">{detailTotals.akta_j}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
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
            {/* BAGIAN TABEL 3: DATA GURU (BARU)                          */}
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
