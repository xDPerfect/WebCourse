<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskTag extends Model
{
    public $timestamps = false;

    protected $fillable = ['tag_id', 'task_item_id'];

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    public function taskItem(): BelongsTo
    {
        return $this->belongsTo(TaskItem::class);
    }
}
