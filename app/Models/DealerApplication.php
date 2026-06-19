<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealerApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'business_name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'area_id',
        'custom_zip_code',
        'custom_latitude',
        'custom_longitude',
        'message',
        'status',
        'rejection_reason',
        'approved_at'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Get the area associated with the dealer application.
     */
    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
