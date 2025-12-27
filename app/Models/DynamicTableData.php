<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DynamicTableData extends Model
{
    protected $fillable = [
        'dynamic_table_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function dynamicTable(): BelongsTo
    {
        return $this->belongsTo(DynamicTable::class);
    }
}