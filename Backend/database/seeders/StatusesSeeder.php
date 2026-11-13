<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('statuses')->upsert([
            ['id' => 1, 'name' => 'Новая'],
            ['id' => 2, 'name' => 'В процессе'],
            ['id' => 3, 'name' => 'Выполнена'],
            ['id' => 4, 'name' => 'Отложена'],
        ], 'id');
    }
}
