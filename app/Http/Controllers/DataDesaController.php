<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Revolution\Google\Sheets\Facades\Sheets;

class DataDesaController extends Controller
{
    /**
     * Menampilkan semua data agregat untuk Desa Cinnong.
     */
    public function index(Request $request)
    {
        $spreadsheetId = '1Ff5IO1ABom9kLrmjB6CiuzLX9Tw11jcpZYVtdGehCXA';

        // ===================================================================
        // BAGIAN 1: DATA KEPENDUDUKAN
        // ===================================================================
        $sheetKependudukan = 'LAPORAN DATA KEPENDUDUKAN';
        $sheetDataPenduduk = Sheets::spreadsheet($spreadsheetId)->sheet($sheetKependudukan)->get();
        $headerPenduduk = $sheetDataPenduduk->shift();

        $dusunList = [];
        $bulanList = [];
        $dataRekap = [];
        $tahun = date('Y');

        if ($headerPenduduk) {
            foreach ($headerPenduduk as $col) {
                if (!empty($col) && !in_array(strtoupper($col), ['NO.', 'DUSUN', 'L', 'P', 'J'])) {
                    $bulanList[] = ucwords(strtolower($col));
                }
            }
        }
        
        foreach ($sheetDataPenduduk as $row) {
            if (empty($row[1]) || strtoupper($row[1]) === 'JUMLAH') continue;
            
            $dusunNama = $row[1];
            $dusunList[] = $dusunNama;
            $dataRekap[$dusunNama] = [];

            foreach ($bulanList as $indexBulan => $namaBulan) {
                $colIndexL = ($indexBulan * 3) + 2;
                $colIndexP = $colIndexL + 1;
                $jumlahL = isset($row[$colIndexL]) && is_numeric($row[
$colIndexL]) ? (int) $row[$colIndexL] : 0;
                $jumlahP = isset($row[$colIndexP]) && is_numeric($row[
$colIndexP]) ? (int) $row[$colIndexP] : 0;
                $dataRekap[$dusunNama][$indexBulan + 1] = [['jumlah_l' => $jumlahL, 'jumlah_p' => $jumlahP]];
            }
        }

        // ===================================================================
        // BAGIAN 2: DATA JUMLAH SEKOLAH
        // ===================================================================
        $sheetPendidikan = 'JUMLAH SEKOLAH MENURUT TINGKAT PENDIDIKAN';
        $sheetDataPendidikan = Sheets::spreadsheet($spreadsheetId)->sheet($sheetPendidikan)->get();

        $sheetDataPendidikan->shift();
        $totalRowPendidikan = $sheetDataPendidikan->pop();

        $dataPendidikan = [];
        foreach ($sheetDataPendidikan as $row) {
            if (empty($row[0]) && empty($row[1])) continue;
            
            $dataPendidikan[] = [
                'no'      => $row[0] ?? '-', 'tingkat' => $row[1] ?? 'Tidak Diketahui',
                'negeri'  => $row[2] ?? '-', 'swasta'  => $row[3] ?? '-', 'jumlah'  => $row[4] ?? '-',
            ];
        }

        $totalsPendidikan = [
            'negeri'  => $totalRowPendidikan[2] ?? 0, 'swasta'  => $totalRowPendidikan[3] ?? 0,
            'jumlah'  => $totalRowPendidikan[4] ?? 0,
        ];

        // ===================================================================
        // BAGIAN 3: DATA JUMLAH GURU
        // ===================================================================
        $sheetGuru = 'JUMLAH GURU MENURUT TINGKAT PENDIDIKAN';
        $sheetDataGuru = Sheets::spreadsheet($spreadsheetId)->sheet($sheetGuru)->get();

        $sheetDataGuru->shift();
        $totalRowGuru = $sheetDataGuru->pop();

        $dataGuru = [];
        foreach ($sheetDataGuru as $row) {
            if (empty($row[0]) && empty($row[1])) continue;

            $dataGuru[] = [
                'no'      => $row[0] ?? '-', 'tingkat' => $row[1] ?? 'Tidak Diketahui',
                'negeri'  => $row[2] ?? '-', 'swasta'  => $row[3] ?? '-', 'jumlah'  => $row[4] ?? '-',
            ];
        }

        $totalsGuru = [
            'negeri'  => $totalRowGuru[2] ?? 0, 'swasta'  => $totalRowGuru[3] ?? 0,
            'jumlah'  => $totalRowGuru[4] ?? 0,
        ];

        // ===================================================================
        // KIRIM SEMUA DATA KE VIEW
        // ===================================================================
        return Inertia::render('DataDesa', [
            'dataRekap' => $dataRekap,
            'dusunList' => $dusunList,
            'bulanList' => $bulanList,
            'tahun' => $tahun,
            'dataPendidikan' => $dataPendidikan,
            'totalsPendidikan' => $totalsPendidikan,
            'dataGuru' => $dataGuru,
            'totalsGuru' => $totalsGuru,
        ]);
    }
}