<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealerOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'dealer_order_id',
        'product_id',
        'saved_design_id',
        'product_name',
        'qty',
        'size',
        'custom_name',
        'custom_number',
        'unit_price',
        'image'
    ];

    /**
     * Get the order that owns this item.
     */
    public function order()
    {
        return $this->belongsTo(DealerOrder::class, 'dealer_order_id');
    }

    /**
     * Get the catalog product linked to this item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the B2B 3D customizer saved design configuration linked to this item.
     */
    public function savedDesign()
    {
        return $this->belongsTo(SavedDesign::class, 'saved_design_id');
    }
}
