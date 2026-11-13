<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    public const COMPLETED_ID = 3;

    public $timestamps = false;

    protected $fillable = ['name'];

    public function taskItems(): HasMany
    {
        return $this->hasMany(TaskItem::class);
    }
}
