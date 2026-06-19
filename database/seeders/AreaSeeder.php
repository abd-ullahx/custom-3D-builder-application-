<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating 10,000 areas. This may take a minute...');
        Area::factory()->count(100)->create();
    }
}
