<?php

namespace Database\Seeders;

use App\Models\ShowcaseVideo;
use Illuminate\Database\Seeder;

class ShowcaseVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ShowcaseVideo::updateOrCreate(
            ['phase_name' => 'Action Phase'],
            [
                'video_url' => 'https://www.select-sport.com/cdn/shop/videos/c/vp/05b072ff0f6547d0ac4a35024391ff3f/05b072ff0f6547d0ac4a35024391ff3f.HD-1080p-7.2Mbps-22875215.mp4?v=0',
                'status' => true,
                'order' => 1,
            ]
        );

        ShowcaseVideo::updateOrCreate(
            ['phase_name' => 'Craft Phase'],
            [
                'video_url' => 'https://www.select-sport.com/cdn/shop/videos/c/vp/04457a95c3a744be95879b0826d72cc9/04457a95c3a744be95879b0826d72cc9.HD-1080p-7.2Mbps-12161544.mp4?v=0',
                'status' => true,
                'order' => 2,
            ]
        );
    }
}
