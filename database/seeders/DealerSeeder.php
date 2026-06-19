<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DealerSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creating 100 dealers in users table. This may take a few minutes...');
        \App\Models\User::factory()->count(100)->dealer()->create();
    }
}
