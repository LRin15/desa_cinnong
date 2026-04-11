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
     * Menampilkan semua tabel dinamis untuk Desa dengan fitur pencarian.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $tables = DynamicTable::with('tableData')
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%');
                });
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($table) {
                return [
                    'id' => $table->id,
                    'name' => $table->name,
                    'table_name' => $table->table_name,
                    'description' => $table->description,
                    'columns' => $table->columns,
                    'charts' => $table->charts ?? [],
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
                    'source' => $table->source ?? null,
                    'notes' => $table->notes ?? null,
                    'created_at' => $table->created_at->format('d F Y'),
                ];
            });

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('DataDesa', [
            'tables' => $tables,
            'tahun' => date('Y'),
            'settings' => $settings,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    
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
                'source' => $table->source ?? null,
                'notes' => $table->notes ?? null,
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

            if ($table->has_column_total ?? false) {
                $headers[] = 'Total';
            }

            $headers[] = 'Tanggal Input';

            fputcsv($handle, $headers);

            foreach ($table->tableData as $index => $row) {
                $flatData = $this->flattenData($row->data);
                $rowData = [$index + 1];

                $rowTotal = 0;

                foreach ($fieldMapping as $mapping) {
                    $value = $flatData[$mapping['field']] ?? '';
                    
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

                if ($table->has_column_total ?? false) {
                    $rowData[] = $rowTotal;
                }

                $rowData[] = $row->created_at->format('d/m/Y H:i');

                fputcsv($handle, $rowData);
            }

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

            // Tambahkan baris kosong lalu info sumber & catatan di akhir CSV
            fputcsv($handle, []);
            if ($table->source) {
                fputcsv($handle, ['Sumber: ' . $table->source]);
            }
            if ($table->notes) {
                fputcsv($handle, ['Catatan: ' . $table->notes]);
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
        $filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $filename);
        $filename = preg_replace('/_+/', '_', $filename);
        $filename = trim($filename, '_');
        
        return $filename ?: 'table_data';
    }
}