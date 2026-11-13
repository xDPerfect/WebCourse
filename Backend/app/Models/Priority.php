<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Priority extends Model
{
    public $timestamps = false;

    protected $fillable = ['value', 'name'];

    public function taskItems(): HasMany
    {
        return $this->hasMany(TaskItem::class);
    }
}
