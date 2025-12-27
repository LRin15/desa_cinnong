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
    ];

    protected $casts = [
        'columns' => 'array',
    ];

    public function tableData(): HasMany
    {
        return $this->hasMany(DynamicTableData::class);
    }
}