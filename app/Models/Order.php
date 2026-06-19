<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'billing_name',
        'billing_email',
        'shipping_address',
        'city',
        'zip_code',
        'phone',
        'payment_method',
        'notes',
        'subtotal',
        'shipping',
        'tax',
        'total',
        'status',
        'coupon_id',
        'coupon_code',
        'discount_amount',
        'admin_note',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'shipping' => 'float',
        'tax' => 'float',
        'total' => 'float',
        'discount_amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusDetails()
    {
        return $this->belongsTo(OrderStatus::class, 'status', 'name');
    }
}
