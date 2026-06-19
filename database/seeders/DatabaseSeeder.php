<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        \App\Models\Admin::updateOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'name' => 'Admin User',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        \App\Models\User::updateOrCreate([
            'email' => 'customer@gmail.com',
        ], [
            'name' => 'Customer User',
            'role' => 'customer',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        \App\Models\User::updateOrCreate([
            'email' => 'dealer@gmail.com',
        ], [
            'name' => 'Dealer User',
            'role' => 'dealer',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'address' => '123 Dealer St',
            'city' => 'Dealer City',
            'status' => 'active',
            'approved_at' => now(),
        ]);

        $this->call([
            AreaSeeder::class,
            DealerSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ShowcaseVideoSeeder::class,
            HomeCategorySeeder::class,
        ]);
    }

}
