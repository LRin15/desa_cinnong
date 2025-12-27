<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DynamicTable;

class DataDesaController extends Controller
{
    /**
     * Menampilkan semua tabel dinamis untuk Desa Cinnong.
     */
    public function index(Request $request)
    {
        // Ambil semua tabel dinamis beserta datanya
        $tables = DynamicTable::with('tableData')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($table) {
                return [
                    'id' => $table->id,
                    'name' => $table->name,
                    'table_name' => $table->table_name,
                    'description' => $table->description,
                    'columns' => $table->columns,
                    'data' => $table->tableData->map(function ($row) {
                        return [
                            'id' => $row->id,
                            'data' => $row->data,
                            'created_at' => $row->created_at->format('d F Y H:i'),
                        ];
                    }),
                    'columns_count' => count($table->columns),
                    'data_count' => $table->tableData->count(),
                    'created_at' => $table->created_at->format('d F Y'),
                ];
            });

        return Inertia::render('DataDesa', [
            'tables' => $tables,
            'tahun' => date('Y'),
        ]);
    }
}