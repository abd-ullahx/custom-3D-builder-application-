<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * ProductResource
 *
 * Centralizes the product data transformation in ONE place.
 * All controllers use this resource, so any future changes
 * (e.g., adding real ratings from a reviews table) only
 * need to be made here.
 */
class ProductResource extends JsonResource
{
    /**
     * Whether to include full details (description, features, images gallery).
     * Set to true when rendering the single product detail page.
     */
    public bool $detailed = false;

    public function withDetails(): static
    {
        $this->detailed = true;
        return $this;
    }

    public function toArray(Request $request): array
    {
        $cat = $this->categories->first();
        $parentCatName = 'Accessories';
        $subCategorySlug = 'accessories';

        if ($cat) {
            $subCategorySlug = $cat->slug;
            $parentCatName = $cat->parent ? $cat->parent->name : $cat->name;
        }

        $featuredImage = $this->featured_image
            ? '/storage/' . $this->featured_image
            : 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=400&h=400&fit=crop&q=80';

        $base = [
            'id'                => $this->id,
            'name'              => $this->title,
            'slug'              => $this->slug,
            'sku'               => $this->sku,
            'short_description' => $this->short_description,
            'price'             => (float) $this->price,
            'sale_price'        => $this->sale_price ? (float) $this->sale_price : null,
            'badge'             => $this->is_featured ? 'Featured' : null,
            'customizable'      => true,
            // NOTE: Replace with real rating/review aggregation when reviews table exists
            'rating'            => 4.5,
            'reviews'           => 124,
            'colors'            => ['#1D4ED8', '#DC2626', '#16A34A'],
            'sizes'             => ['S', 'M', 'L', 'XL'],
            'image'             => $featuredImage,
            'category'          => $parentCatName,
            'subcategory'       => $subCategorySlug,
        ];

        if ($this->detailed) {
            // Build full image gallery for product detail page
            $images = collect();
            $featuredPath = $this->featured_image ? '/storage/' . $this->featured_image : null;
            if ($featuredPath) {
                $images->push($featuredPath);
            }
            foreach ($this->images ?? [] as $img) {
                $galleryPath = '/storage/' . $img->image_path;
                if ($galleryPath !== $featuredPath) {
                    $images->push($galleryPath);
                }
            }
            if ($images->isEmpty()) {
                $images->push('https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=800&h=1000&fit=crop&q=80');
            }

            $base = array_merge($base, [
                'description' => $this->description,
                'images'      => $images->toArray(),
                'colors'      => [
                    ['name' => 'Blue',  'hex' => '#1D4ED8'],
                    ['name' => 'Red',   'hex' => '#DC2626'],
                    ['name' => 'Black', 'hex' => '#1e293b'],
                    ['name' => 'White', 'hex' => '#ffffff'],
                    ['name' => 'Green', 'hex' => '#16A34A'],
                ],
                'sizes'    => ['XS', 'S', 'M', 'L', 'XL', '2XL'],
                'features' => is_array($this->features) && count($this->features) > 0
                    ? $this->features
                    : [
                        'Moisture-wicking fabric',
                        'Breathable mesh panels',
                        'Reinforced stitching',
                        'Athletic fit',
                        'Quick-dry technology',
                        'Fully customizable',
                    ],
            ]);
        }

        return $base;
    }
}
