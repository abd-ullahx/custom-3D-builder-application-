<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::updateOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
        ]);
    }
}
