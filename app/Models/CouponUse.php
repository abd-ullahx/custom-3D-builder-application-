<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouponUse extends Model
{
    use HasFactory;

    protected $fillable = [
        'coupon_id',
        'user_id',
        'order_id',
        'discount_amount',
    ];

    protected $casts = [
        'discount_amount' => 'float',
    ];

    /**
     * Get the coupon associated with this application.
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get the retail customer who used this coupon.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order where this coupon was applied.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
