<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrioritiesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('priorities')->upsert([
            ['id' => 1, 'name' => 'Высокий', 'value' => 3],
            ['id' => 2, 'name' => 'Средний', 'value' => 2],
            ['id' => 3, 'name' => 'Низкий',  'value' => 1],
        ], 'id');
    }
}
