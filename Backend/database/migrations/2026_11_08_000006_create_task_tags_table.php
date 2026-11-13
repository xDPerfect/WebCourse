<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->foreignId('task_item_id')->constrained('task_items')->cascadeOnDelete();

            $table->unique(['tag_id', 'task_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_tags');
    }
};
