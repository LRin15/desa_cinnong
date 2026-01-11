<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DynamicTable;
use App\Models\Setting;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
                    'charts' => $table->charts ?? [], // Tambahkan charts
                    'data' => $table->tableData->map(function ($row) {
                        return [
                            'id' => $row->id,
                            'data' => $row->data,
                            'created_at' => $row->created_at->format('d F Y H:i'),
                        ];
                    }),
                    'columns_count' => count($table->columns),
                    'data_count' => $table->tableData->count(),
                    'has_column_total' => $table->has_column_total ?? false,
                    'has_row_total' => $table->has_row_total ?? false,
                    'created_at' => $table->created_at->format('d F Y'),
                ];
            });

        // Ambil data settings untuk nama desa
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('DataDesa', [
            'tables' => $tables,
            'tahun' => date('Y'),
            'settings' => $settings,
        ]);
    }

    // ... method download, downloadJson, downloadExcel, flattenData, dan sanitizeFilename tetap sama
    
    /**
     * Download data tabel dalam format Excel atau JSON
     */
    public function download(Request $request, $tableId)
    {
        $format = $request->query('format', 'excel');
        
        $table = DynamicTable::with('tableData')->findOrFail($tableId);
        
        if ($format === 'json') {
            return $this->downloadJson($table);
        } else {
            return $this->downloadExcel($table);
        }
    }

    /**
     * Download data dalam format JSON
     */
    private function downloadJson(DynamicTable $table)
    {
        $data = [
            'table_info' => [
                'id' => $table->id,
                'name' => $table->name,
                'description' => $table->description,
                'created_at' => $table->created_at->format('Y-m-d H:i:s'),
            ],
            'columns' => $table->columns,
            'data' => $table->tableData->map(function ($row) {
                return [
                    'id' => $row->id,
                    'data' => $row->data,
                    'created_at' => $row->created_at->format('Y-m-d H:i:s'),
                ];
            }),
        ];

        $filename = $this->sanitizeFilename($table->name) . '_' . date('Y-m-d_His') . '.json';

        return response()->json($data, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Download data dalam format Excel (CSV)
     */
    private function downloadExcel(DynamicTable $table)
    {
        $filename = $this->sanitizeFilename($table->name) . '_' . date('Y-m-d_His') . '.csv';

        return new StreamedResponse(function () use ($table) {
            $handle = fopen('php://output', 'w');
            
            // Add UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Flatten columns untuk header
            $headers = ['No'];
            $fieldMapping = [];
            
            foreach ($table->columns as $column) {
                if ($column['type'] === 'group' && isset($column['subColumns'])) {
                    foreach ($column['subColumns'] as $subCol) {
                        $fieldName = $column['name'] . '.' . $subCol['name'];
                        $headers[] = $column['name'] . ' - ' . $subCol['name'];
                        $fieldMapping[] = [
                            'field' => $fieldName,
                            'type' => $subCol['type']
                        ];
                    }
                } else {
                    $headers[] = $column['name'];
                    $fieldMapping[] = [
                        'field' => $column['name'],
                        'type' => $column['type']
                    ];
                }
            }

            // Tambahkan header untuk kolom total jika ada
            if ($table->has_column_total ?? false) {
                $headers[] = 'Total';
            }

            $headers[] = 'Tanggal Input';

            // Write headers
            fputcsv($handle, $headers);

            // Write data rows
            foreach ($table->tableData as $index => $row) {
                $flatData = $this->flattenData($row->data);
                $rowData = [$index + 1];

                // Hitung total baris jika diperlukan
                $rowTotal = 0;

                foreach ($fieldMapping as $mapping) {
                    $value = $flatData[$mapping['field']] ?? '';
                    
                    // Format value berdasarkan tipe
                    if ($mapping['type'] === 'date' && $value) {
                        try {
                            $value = date('d/m/Y', strtotime($value));
                        } catch (\Exception $e) {
                            // Keep original value if parsing fails
                        }
                    } elseif ($mapping['type'] === 'number' && $value !== '') {
                        $numValue = floatval($value);
                        $rowTotal += $numValue;
                        $value = $numValue;
                    }
                    
                    $rowData[] = $value;
                }

                // Tambahkan kolom total jika ada
                if ($table->has_column_total ?? false) {
                    $rowData[] = $rowTotal;
                }

                $rowData[] = $row->created_at->format('d/m/Y H:i');

                fputcsv($handle, $rowData);
            }

            // Write total row jika diperlukan
            if ($table->has_row_total ?? false) {
                $totalRow = ['TOTAL'];
                
                foreach ($fieldMapping as $mapping) {
                    if ($mapping['type'] === 'number') {
                        $columnTotal = $table->tableData->sum(function ($row) use ($mapping) {
                            $flatData = $this->flattenData($row->data);
                            return floatval($flatData[$mapping['field']] ?? 0);
                        });
                        $totalRow[] = $columnTotal;
                    } else {
                        $totalRow[] = '-';
                    }
                }

                // Grand total jika ada kolom total
                if ($table->has_column_total ?? false) {
                    $grandTotal = 0;
                    foreach ($fieldMapping as $mapping) {
                        if ($mapping['type'] === 'number') {
                            $grandTotal += $table->tableData->sum(function ($row) use ($mapping) {
                                $flatData = $this->flattenData($row->data);
                                return floatval($flatData[$mapping['field']] ?? 0);
                            });
                        }
                    }
                    $totalRow[] = $grandTotal;
                }

                $totalRow[] = '';

                fputcsv($handle, $totalRow);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Flatten nested array dengan dot notation
     */
    private function flattenData(array $data, string $prefix = ''): array
    {
        $result = [];
        
        foreach ($data as $key => $value) {
            $newKey = $prefix ? "{$prefix}.{$key}" : $key;
            
            if (is_array($value) && !empty($value)) {
                $result = array_merge($result, $this->flattenData($value, $newKey));
            } else {
                $result[$newKey] = $value;
            }
        }
        
        return $result;
    }

    /**
     * Sanitize filename untuk menghindari karakter yang tidak valid
     */
    private function sanitizeFilename(string $filename): string
    {
        // Remove or replace invalid characters
        $filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $filename);
        $filename = preg_replace('/_+/', '_', $filename);
        $filename = trim($filename, '_');
        
        return $filename ?: 'table_data';
    }
}