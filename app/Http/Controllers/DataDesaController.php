<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Revolution\Google\Sheets\Facades\Sheets;

class DataDesaController extends Controller
{
    public function index()
    {
        // ID spreadsheet bisa diambil dari URL:
        // https://docs.google.com/spreadsheets/d/ SPREADSHEET_ID /edit
        $spreadsheetId = '1Ff5IO1ABom9kLrmjB6CiuzLX9Tw11jcpZYVtdGehCXA';
        $sheetName = 'LAPORAN DATA KEPENDUDUKAN';

        // Ambil semua data dari sheet. Ini adalah satu-satunya sumber data.
        $sheetData = Sheets::spreadsheet($spreadsheetId)->sheet($sheetName)->get();
        
        // Header berada di baris pertama dari data yang diambil (index 0)
        $header = array_shift($sheetData);

        // Inisialisasi variabel untuk dikirim ke frontend
        $dusunList = [];
        $bulanList = [];
        $dataRekap = [];
        $tahun = date('Y'); // Atau sesuaikan jika tahun dinamis

        // --- 1. Ekstrak Daftar Bulan ---
        // Bulan berada di baris kedua (di sheet asli), yaitu $header di sini
        foreach ($header as $key => $col) {
            // Kita hanya ambil nama bulan, bukan L, P, J atau NO, DUSUN
            if (!empty($col) && !in_array(strtoupper($col), ['NO.', 'DUSUN', 'L', 'P', 'J'])) {
                $bulanList[] = ucwords(strtolower($col));
            }
        }
        
        // --- 2. Proses Setiap Baris Data (Dusun) ---
        foreach ($sheetData as $row) {
            // Lewati baris "JUMLAH" atau baris kosong
            if (empty($row[1]) || strtoupper($row[1]) === 'JUMLAH') {
                continue;
            }
            
            $dusunNama = $row[1];
            $dusunList[] = $dusunNama;
            $dataRekap[$dusunNama] = [];

            // Loop melalui daftar bulan yang sudah kita dapatkan
            foreach ($bulanList as $indexBulan => $namaBulan) {
                // Tentukan kolom L dan P berdasarkan posisi bulan
                // Kolom C (Januari L) adalah index 2
                // Setiap bulan memiliki 3 kolom (L, P, J)
                $colIndexL = ($indexBulan * 3) + 2;
                $colIndexP = $colIndexL + 1;

                $jumlahL = isset($row[$colIndexL]) && is_numeric($row[$colIndexL]) ? (int) $row[$colIndexL] : 0;
                $jumlahP = isset($row[$colIndexP]) && is_numeric($row[$colIndexP]) ? (int) $row[$colIndexP] : 0;

                // Strukturnya harus cocok dengan tipe di frontend: { [bulan]: DataEntry[] }
                // Nomor bulan dimulai dari 1
                $dataRekap[$dusunNama][$indexBulan + 1] = [
                    [
                        'jumlah_l' => $jumlahL,
                        'jumlah_p' => $jumlahP,
                    ]
                ];
            }
        }

        return Inertia::render('DataDesa', [
            'dataRekap' => $dataRekap,
            'dusunList' => $dusunList,
            'bulanList' => $bulanList,
            'tahun' => $tahun,
        ]);
    }
}