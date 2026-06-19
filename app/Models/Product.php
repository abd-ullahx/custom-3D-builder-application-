<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title',
        'slug',
        'sku',
        'short_description',
        'description',
        'price',
        'sale_price',
        'stock',
        'track_stock',
        'is_featured',
        'status',
        'featured_image',
        'features',
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order', 'asc');
    }
}
