<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DynamicTable;
use App\Models\DynamicTableData;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class DynamicTableController extends Controller
{
    /**
     * Menampilkan daftar tabel dinamis
     */
    public function index(Request $request)
    {
        $query = DynamicTable::query();

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        $tables = $query->latest()->paginate(10)->through(fn ($table) => [
            'id' => $table->id,
            'name' => $table->name,
            'table_name' => $table->table_name,
            'description' => $table->description,
            'columns_count' => count($table->columns),
            'data_count' => $table->tableData()->count(),
            'created_at' => $table->created_at->format('d F Y'),
        ]);

        $tables->appends($request->query());

        return Inertia::render('Admin/DynamicTables/Index', [
            'tables' => $tables,
            'filters' => [
                'search' => $request->search,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Menampilkan form pembuatan tabel baru
     */
    public function create()
    {
        return Inertia::render('Admin/DynamicTables/Create');
    }

    /**
     * Menyimpan tabel baru
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'columns' => 'required|array|min:1',
                'columns.*.name' => 'required|string|max:100',
                'columns.*.type' => 'required|in:text,number,date,select,textarea',
                'columns.*.required' => 'boolean',
                'columns.*.options' => 'nullable|string',
            ], [
                'name.required' => 'Nama tabel wajib diisi.',
                'columns.required' => 'Minimal harus ada 1 kolom.',
                'columns.*.name.required' => 'Nama kolom wajib diisi.',
                'columns.*.type.required' => 'Tipe kolom wajib dipilih.',
            ]);

            // Generate table_name dari name
            $tableName = 'tbl_' . Str::slug($validatedData['name'], '_');
            
            // Pastikan table_name unik
            $originalTableName = $tableName;
            $counter = 1;
            while (DynamicTable::where('table_name', $tableName)->exists()) {
                $tableName = $originalTableName . '_' . $counter;
                $counter++;
            }

            $table = DynamicTable::create([
                'name' => $validatedData['name'],
                'table_name' => $tableName,
                'description' => $validatedData['description'],
                'columns' => $validatedData['columns'],
            ]);

            return redirect()->route('admin.dynamic-tables.index')
                ->with('success', "Tabel '{$table->name}' berhasil dibuat.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('error', 'Terdapat kesalahan dalam pengisian form.');

        } catch (\Exception $e) {
            \Log::error('Error creating dynamic table: ' . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menyimpan tabel. Silakan coba lagi.');
        }
    }

    /**
     * Menampilkan form edit tabel
     */
    public function edit(DynamicTable $dynamicTable)
    {
        return Inertia::render('Admin/DynamicTables/Edit', [
            'table' => [
                'id' => $dynamicTable->id,
                'name' => $dynamicTable->name,
                'description' => $dynamicTable->description,
                'columns' => $dynamicTable->columns,
            ]
        ]);
    }

    /**
     * Memperbarui tabel
     */
    public function update(Request $request, DynamicTable $dynamicTable)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'columns' => 'required|array|min:1',
                'columns.*.name' => 'required|string|max:100',
                'columns.*.type' => 'required|in:text,number,date,select,textarea',
                'columns.*.required' => 'boolean',
                'columns.*.options' => 'nullable|string',
            ]);

            $dynamicTable->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'columns' => $validatedData['columns'],
            ]);

            return redirect()->route('admin.dynamic-tables.index')
                ->with('success', "Tabel '{$dynamicTable->name}' berhasil diperbarui.");

        } catch (\Exception $e) {
            \Log::error('Error updating dynamic table: ' . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat memperbarui tabel.');
        }
    }

    /**
     * Menghapus tabel
     */
    public function destroy(DynamicTable $dynamicTable)
    {
        try {
            $tableName = $dynamicTable->name;
            $dynamicTable->delete();

            return redirect()->route('admin.dynamic-tables.index')
                ->with('success', "Tabel '{$tableName}' berhasil dihapus.");

        } catch (\Exception $e) {
            \Log::error('Error deleting dynamic table: ' . $e->getMessage());
            return redirect()->route('admin.dynamic-tables.index')
                ->with('error', 'Terjadi kesalahan saat menghapus tabel.');
        }
    }

    /**
     * Menampilkan form insert data
     */
    public function showInsertForm(DynamicTable $dynamicTable)
    {
        $tableData = $dynamicTable->tableData()->latest()->paginate(10)->through(fn ($row) => [
            'id' => $row->id,
            'data' => $row->data,
            'created_at' => $row->created_at->format('d F Y H:i'),
        ]);

        return Inertia::render('Admin/DynamicTables/Insert', [
            'table' => [
                'id' => $dynamicTable->id,
                'name' => $dynamicTable->name,
                'description' => $dynamicTable->description,
                'columns' => $dynamicTable->columns,
            ],
            'tableData' => $tableData,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Menyimpan data ke tabel
     */
    public function insertData(Request $request, DynamicTable $dynamicTable)
    {
        try {
            // Ambil isi dari objek 'data' yang dikirim Frontend
            $inputData = $request->input('data'); 

            $rules = [];
            foreach ($dynamicTable->columns as $column) {
                $colName = $column['name'];
                $rules[$colName] = $column['required'] ? 'required' : 'nullable';
            }

            // Validasi isi array tersebut
            $validated = \Validator::make($inputData, $rules)->validate();

            // Simpan hanya hasil validasi (array datar)
            DynamicTableData::create([
                'dynamic_table_id' => $dynamicTable->id,
                'data' => $validated, 
            ]);

            return back()->with('success', 'Data berhasil ditambahkan.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus data dari tabel
     */
    public function deleteData(DynamicTable $dynamicTable, DynamicTableData $data)
    {
        try {
            $data->delete();
            return back()->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            \Log::error('Error deleting data: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus data.');
        }
    }
}