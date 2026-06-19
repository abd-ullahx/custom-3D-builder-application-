<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealerOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'dealer_id',
        'total_price',
        'status',
        'shipping_address',
        'city',
        'country',
        'notes',
        'admin_note'
    ];

    /**
     * Get the dealer that owns the order.
     */
    public function dealer()
    {
        return $this->belongsTo(User::class, 'dealer_id');
    }

    /**
     * Get the items for the dealer order.
     */
    public function items()
    {
        return $this->hasMany(DealerOrderItem::class);
    }

    public function statusDetails()
    {
        return $this->belongsTo(OrderStatus::class, 'status', 'name');
    }
}
