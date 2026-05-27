<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Infografis;
use App\Models\LayananSetting;
use App\Models\LayananSubmission;
use App\Models\Publikasi;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_berita'     => Berita::count(),
            'total_infografis' => Infografis::count(),
            'total_publikasi'  => Publikasi::count(),
            'total_pengguna'   => User::where('role', User::ROLE_PENGGUNA_TERDAFTAR)->count(),
            'total_layanan'    => LayananSubmission::count(),
            'layanan_pending'  => LayananSubmission::where('status', 'pending')->count(),
            'layanan_diproses' => LayananSubmission::where('status', 'diproses')->count(),
            'layanan_selesai'  => LayananSubmission::where('status', 'selesai')->count(),
            'layanan_ditolak'  => LayananSubmission::where('status', 'ditolak')->count(),
        ];

        $settings = Setting::pluck('value', 'key')->toArray();

        // ── Daftar jenis layanan dari tabel LayananSetting ────────────────────
        // Format: [['id' => 1, 'name' => 'Surat Keterangan'], ...]
        $jenisLayananList = LayananSetting::orderBy('name')
            ->get(['id', 'name'])
            ->map(fn($l) => ['id' => $l->id, 'name' => $l->name])
            ->toArray();

        // ── Tahun yang tersedia (berdasarkan data aktual) ─────────────────────
        $availableYears = LayananSubmission::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->map(fn($y) => (int) $y)
            ->toArray();

        // Pastikan tahun sekarang selalu ada
        $currentYear = (int) now()->format('Y');
        if (!in_array($currentYear, $availableYears)) {
            array_unshift($availableYears, $currentYear);
        }

        // ── Bangun chartData ──────────────────────────────────────────────────
        // Key format:
        //   Per bulan  → "{subject}_bulan_{year}"
        //   Per minggu → "{subject}_minggu_{year}_{month}"
        //   Per hari   → "{subject}_hari_{year}_{month}"
        //
        // subject: 'semua' atau layanan_id (integer sebagai string)

        $chartData = [];

        // Subject: 'semua' + setiap layanan_id
        $subjects = array_merge(
            ['semua'],
            array_column($jenisLayananList, 'id')
        );

        foreach ($subjects as $subject) {
            foreach ($availableYears as $year) {
                // Per bulan (seluruh tahun)
                $chartData["{$subject}_bulan_{$year}"] =
                    $this->buildMonthly($subject, $year);

                // Per minggu & per hari — untuk setiap bulan dalam tahun tersebut
                $monthsInYear = ($year === $currentYear)
                    ? range(1, (int) now()->format('n'))
                    : range(1, 12);

                foreach ($monthsInYear as $month) {
                    $chartData["{$subject}_minggu_{$year}_{$month}"] =
                        $this->buildWeekly($subject, $year, $month);

                    $chartData["{$subject}_hari_{$year}_{$month}"] =
                        $this->buildDaily($subject, $year, $month);
                }
            }
        }

        return Inertia::render('Admin/Dashboard', [
            'stats'            => $stats,
            'settings'         => $settings,
            'chartData'        => $chartData,
            'jenisLayananList' => $jenisLayananList,   // [{id, name}]
            'availableYears'   => $availableYears,
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Ambil base query.
     * $subject: 'semua' → tanpa filter; integer → filter layanan_id.
     */
    private function baseQuery(string|int $subject)
    {
        $q = LayananSubmission::query();
        if ($subject !== 'semua') {
            $q->where('layanan_id', (int) $subject);
        }
        return $q;
    }

    /** 12 titik data per bulan dalam satu tahun. */
    private function buildMonthly(string|int $subject, int $year): array
    {
        $rows = $this->baseQuery($subject)
            ->selectRaw("MONTH(created_at) as month, COUNT(*) as total")
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->pluck('total', 'month');

        $result = [];
        for ($m = 1; $m <= 12; $m++) {
            $label    = Carbon::createFromDate($year, $m, 1)
                ->locale('id')
                ->isoFormat('MMM');
            $result[] = [
                'label' => $label,
                'date'  => sprintf('%04d-%02d-01', $year, $m),
                'total' => (int) ($rows[$m] ?? 0),
            ];
        }
        return $result;
    }

    /** Titik data per minggu dalam satu bulan. */
    private function buildWeekly(string|int $subject, int $year, int $month): array
    {
        $startOfMonth = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $endOfMonth   = $startOfMonth->copy()->endOfMonth()->endOfDay();

        $weeks  = [];
        $cursor = $startOfMonth->copy()->startOfWeek(Carbon::MONDAY);

        while ($cursor->lte($endOfMonth)) {
            $weekStart = $cursor->copy()->max($startOfMonth);
            $weekEnd   = $cursor->copy()->endOfWeek(Carbon::SUNDAY)->min($endOfMonth);
            $weeks[]   = [$weekStart, $weekEnd];
            $cursor->addWeek();
        }

        $result = [];
        foreach ($weeks as $i => [$ws, $we]) {
            $count = $this->baseQuery($subject)
                ->whereBetween('created_at', [$ws, $we])
                ->count();

            $label    = 'Mg ' . ($i + 1) . ' (' . $ws->format('d') . '-' . $we->format('d') . ')';
            $result[] = [
                'label' => $label,
                'date'  => $ws->toDateString(),
                'total' => $count,
            ];
        }
        return $result;
    }

    /** Titik data per hari dalam satu bulan. */
    private function buildDaily(string|int $subject, int $year, int $month): array
    {
        $startOfMonth = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $endOfMonth   = $startOfMonth->copy()->endOfMonth()->endOfDay();
        $daysInMonth  = $startOfMonth->daysInMonth;

        $rows = $this->baseQuery($subject)
            ->selectRaw("DAY(created_at) as day, COUNT(*) as total")
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->groupBy('day')
            ->pluck('total', 'day');

        $result = [];
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $date     = Carbon::createFromDate($year, $month, $d);
            $result[] = [
                'label' => $date->format('d'),
                'date'  => $date->toDateString(),
                'total' => (int) ($rows[$d] ?? 0),
            ];
        }
        return $result;
    }
}