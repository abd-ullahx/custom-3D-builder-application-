<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $productsData = [
            [
                'title' => 'Pro Performance Jersey',
                'slug' => 'pro-performance-jersey',
                'sku' => 'PRO-JER-001',
                'short_description' => 'Professional Grade Athletic Jersey',
                'description' => 'Our premium Pro Performance Jersey is designed for athletes who demand the best. Made with advanced moisture-wicking fabric, this jersey keeps you cool and dry during intense activity.',
                'price' => 49.99,
                'featured_image' => null,
                'category_slug' => 'baseball-full-button-jerseys',
            ],
            [
                'title' => 'Elite Training T-Shirt',
                'slug' => 'elite-training-t-shirt',
                'sku' => 'ELT-TEE-002',
                'short_description' => 'Elite Training Gear',
                'description' => 'Premium elite training shirt optimized for heavy athletics and gym exercises with dry-fit cooling panels.',
                'price' => 29.99,
                'featured_image' => null,
                'category_slug' => 'sports-wears-polo-shirts',
            ],
            [
                'title' => 'Premium Team Hoodie',
                'slug' => 'premium-team-hoodie',
                'sku' => 'PRM-HUD-003',
                'short_description' => 'Warm and Comfortable Pullover Hoodie',
                'description' => 'Stay warm with this heavy duty premium team pullover fleece hoodie featuring front storage pouches and custom drawstrings.',
                'price' => 79.99,
                'featured_image' => null,
                'category_slug' => 'sports-wears-hodies',
            ],
            [
                'title' => 'Athletic Performance Shorts',
                'slug' => 'athletic-performance-shorts',
                'sku' => 'ATH-SHO-004',
                'short_description' => 'Lightweight Athletic Shorts',
                'description' => 'Breathable, ultra-lightweight training shorts built to allow maximum range of motion for sprints and squats.',
                'price' => 34.99,
                'featured_image' => null,
                'category_slug' => 'lacrosse-shorts',
            ],
            [
                'title' => 'Complete Tracksuit Set',
                'slug' => 'complete-tracksuit-set',
                'sku' => 'CMP-TRK-005',
                'short_description' => 'Premium Warmup Set',
                'description' => 'Full jogger tracksuit set containing dynamic warm-up fleece zip jacket and matching tapered utility pants.',
                'price' => 129.99,
                'featured_image' => null,
                'category_slug' => 'sports-wears-track-suits',
            ],
            [
                'title' => 'Sports Cap Collection',
                'slug' => 'sports-cap-collection',
                'sku' => 'SPS-CAP-006',
                'short_description' => 'Classic Curved Team Cap',
                'description' => 'A structured classic curved sports cap with laser-perforated back vents and quick-adjustable strap.',
                'price' => 19.99,
                'featured_image' => null,
                'category_slug' => 'softball-caps',
            ],
            [
                'title' => 'Classic Sports Jersey',
                'slug' => 'classic-sports-jersey',
                'sku' => 'CLS-JER-007',
                'short_description' => 'Match Day Football Jersey',
                'description' => 'Durable match day jersey built with robust stitching and custom athletic side mesh extensions.',
                'price' => 54.99,
                'featured_image' => null,
                'category_slug' => 'softball-two-button-jerseys',
            ],
            [
                'title' => 'Compression Training Shirt',
                'slug' => 'compression-training-shirt',
                'sku' => 'CMP-TEE-008',
                'short_description' => 'Under-armor Compression Gear',
                'description' => 'High tension athletic compression top designed to stabilize core muscles and improve local blood flow.',
                'price' => 39.99,
                'featured_image' => null,
                'category_slug' => 'sports-wears-polo-shirts',
            ],
            [
                'title' => 'Custom Zip Hoodie',
                'slug' => 'custom-zip-hoodie',
                'sku' => 'CST-HUD-009',
                'short_description' => 'Casual Zip-Up Hoodie',
                'description' => 'Super soft custom cotton warmups featuring zip closures and deep interior media storage pockets.',
                'price' => 89.99,
                'featured_image' => null,
                'category_slug' => 'sports-wears-hodies',
            ],
            [
                'title' => 'Football Training Shorts',
                'slug' => 'football-training-shorts',
                'sku' => 'FTB-SHO-010',
                'short_description' => 'Field Performance Shorts',
                'description' => 'High durability training shorts engineered with side mesh vents to guarantee peak breathability.',
                'price' => 24.99,
                'featured_image' => null,
                'category_slug' => 'lacrosse-shorts',
            ],
            [
                'title' => 'Pro Goalkeeper Gloves',
                'slug' => 'pro-goalkeeper-gloves',
                'sku' => 'GLV-GKP-011',
                'short_description' => 'High Grip Latex Palms',
                'description' => 'Elite soccer goalkeeper gloves with extra thick latex palms for exceptional control and wrist support strap.',
                'price' => 44.99,
                'featured_image' => null,
                'category_slug' => 'softball-caps',
            ],
            [
                'title' => 'Team Training Top',
                'slug' => 'team-training-top',
                'slug' => 'team-training-top',
                'sku' => 'TEM-TEE-012',
                'short_description' => 'Official Pre-Match Jersey',
                'description' => 'Highly breathable, lightweight pre-match training top with official contrast panel styling details.',
                'price' => 34.99,
                'featured_image' => null,
                'category_slug' => 'sports-wears-polo-shirts',
            ],
        ];

        foreach ($productsData as $prod) {
            $product = Product::updateOrCreate(
                ['slug' => $prod['slug']],
                [
                    'title' => $prod['title'],
                    'sku' => $prod['sku'],
                    'short_description' => $prod['short_description'],
                    'description' => $prod['description'],
                    'price' => $prod['price'],
                    'featured_image' => $prod['featured_image'],
                    'status' => true,
                    'track_stock' => false,
                    'stock' => 100,
                ]
            );

            // Connect to category via relationship
            $category = Category::where('slug', $prod['category_slug'])->first();
            if ($category) {
                $product->categories()->sync([$category->id]);
            }
        }
    }
}
