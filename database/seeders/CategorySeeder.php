<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::query()->delete();
        $categoriesData = [
            [
                'name' => 'BASEBALL',
                'subcategories' => [
                    'FULL BUTTON JERSEYS',
                    'CREW NECK JERSEYS',
                    'PANTS',
                    'CAGE JECKETS',
                    'SOCKS',
                ]
            ],
            [
                'name' => 'SOFTBALL',
                'subcategories' => [
                    'TWO BUTTON JERSEYS',
                    'CREW NECK JERSEYS',
                    'KNICKERS PANTS',
                    'CAPS',
                    'SHORTS',
                ]
            ],
            [
                'name' => 'SPORTS WEARS',
                'subcategories' => [
                    'HODIES',
                    'SLEEVELESS HODIES',
                    'HODIES SHIRTS ( SHOTING SHIRTS)',
                    'PULL OVERS',
                    'POLO SHIRTS',
                    'V NECKS',
                    'TRACK SUITS',
                    'SWEAT SHIRTS',
                ]
            ],
            [
                'name' => 'AMERICAN FOOTBALL',
                'subcategories' => [
                    'JERSEY',
                    'PANTS',
                ]
            ],
            [
                'name' => 'BASKETBALL',
                'subcategories' => [
                    'TOPS',
                    'SHORTS',
                ]
            ],
            [
                'name' => 'SOCCER',
                'subcategories' => [
                    'JERSEYS',
                    'SHORTS',
                ]
            ],
            [
                'name' => 'VOLLEYBALL',
                'subcategories' => [
                    'JERSEY',
                    'SHORTS',
                    'SLEEVELESS TOPS',
                ]
            ],
            [
                'name' => 'ICE HOCKEY',
                'subcategories' => [
                    'JERSEYS',
                ]
            ],
            [
                'name' => 'LACROSSE',
                'subcategories' => [
                    'JERSEY',
                    'SHORTS',
                    'TANK TOPS',
                    'SKORTS',
                ]
            ]
        ];

        foreach ($categoriesData as $cat) {
            $parent = Category::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'parent_id' => null,
                    'status' => true
                ]
            );

            foreach ($cat['subcategories'] as $subName) {
                Category::updateOrCreate(
                    ['slug' => \Illuminate\Support\Str::slug($cat['name'] . ' ' . $subName)],
                    [
                        'name' => $subName,
                        'parent_id' => $parent->id,
                        'status' => true
                    ]
                );
            }
        }
    }
}
