<?php

namespace Database\Seeders;

use App\Models\HomeCategory;
use Illuminate\Database\Seeder;

class HomeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HomeCategory::updateOrCreate(
            ['name' => 'Jerseys'],
            [
                'count' => '50+ Designs',
                'gradient' => 'from-[#0EA5E9]/70 via-[#0284C7]/60 to-[#1D4ED8]/80',
                'image_url' => 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 1,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'T-Shirts'],
            [
                'count' => '40+ Styles',
                'gradient' => 'from-[#EC4899]/70 via-[#C026D3]/60 to-[#9333EA]/80',
                'image_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 2,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Hoodies'],
            [
                'count' => '30+ Options',
                'gradient' => 'from-[#10B981]/70 via-[#059669]/60 to-[#047857]/80',
                'image_url' => 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 3,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Shorts'],
            [
                'count' => '25+ Variants',
                'gradient' => 'from-[#FB923C]/70 via-[#F97316]/60 to-[#DC2626]/80',
                'image_url' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 4,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Jackets'],
            [
                'count' => '35+ Styles',
                'gradient' => 'from-slate-800/80 via-slate-900/70 to-black/80',
                'image_url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 5,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Caps & Hats'],
            [
                'count' => '15+ Colors',
                'gradient' => 'from-indigo-600/70 via-purple-600/60 to-pink-600/80',
                'image_url' => 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 6,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Socks'],
            [
                'count' => '20+ Varieties',
                'gradient' => 'from-emerald-600/70 via-teal-600/60 to-cyan-600/80',
                'image_url' => 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 7,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Bags'],
            [
                'count' => '12+ Types',
                'gradient' => 'from-rose-600/70 via-pink-600/60 to-red-600/80',
                'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 8,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Tracksuits'],
            [
                'count' => '18+ Options',
                'gradient' => 'from-[#0EA5E9]/70 via-[#0284C7]/60 to-[#1D4ED8]/80',
                'image_url' => 'https://images.unsplash.com/photo-1483721310020-03333e577076?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 9,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Footwear'],
            [
                'count' => '45+ Designs',
                'gradient' => 'from-amber-600/70 via-orange-600/60 to-yellow-600/80',
                'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 10,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Base Layer'],
            [
                'count' => '22+ Styles',
                'gradient' => 'from-violet-600/70 via-fuchsia-600/60 to-pink-600/80',
                'image_url' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 11,
            ]
        );

        HomeCategory::updateOrCreate(
            ['name' => 'Accessories'],
            [
                'count' => '50+ Items',
                'gradient' => 'from-cyan-600/70 via-sky-600/60 to-blue-600/80',
                'image_url' => 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&h=700&fit=crop&q=80',
                'status' => true,
                'order' => 12,
            ]
        );
    }
}
