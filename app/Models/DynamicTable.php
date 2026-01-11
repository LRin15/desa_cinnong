<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DynamicTable extends Model
{
    protected $fillable = [
        'name',
        'table_name',
        'description',
        'columns',
        'has_column_total',
        'has_row_total',
        'charts',
    ];

    protected $casts = [
        'columns' => 'array',
        'has_column_total' => 'boolean',
        'has_row_total' => 'boolean',
        'charts' => 'array',
    ];

    public function tableData(): HasMany
    {
        return $this->hasMany(DynamicTableData::class);
    }
}