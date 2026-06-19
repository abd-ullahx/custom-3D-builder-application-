<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'saved_design_id',
        'product_name',
        'price',
        'quantity',
        'size',
        'color',
        'custom_name',
        'custom_number',
        'image',
    ];

    protected $casts = [
        'price' => 'float',
        'quantity' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function savedDesign()
    {
        return $this->belongsTo(SavedDesign::class);
    }
}
