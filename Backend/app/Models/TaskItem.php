<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskItem extends Model
{
    protected $fillable = [
        'name',
        'description',
        'priority_id',
        'status_id',
        'category_id',
        'finished_at',
    ];

    protected $casts = ['finished_at' => 'datetime'];

    public function priority(): BelongsTo
    {
        return $this->belongsTo(Priority::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function taskTags(): HasMany
    {
        return $this->hasMany(TaskTag::class);
    }
}
