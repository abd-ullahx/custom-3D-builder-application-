<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'last_name', 'phone', 'profile_image', 'email_notifications', 'newsletter', 'two_factor_auth', 'role', 'address', 'city', 'latitude', 'longitude', 'status', 'area_id', 'approved_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'email_notifications' => 'boolean',
            'newsletter' => 'boolean',
            'two_factor_auth' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * Get the area associated with the dealer.
     */
    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    /**
     * Get the orders placed by this dealer.
     */
    public function dealerOrders()
    {
        return $this->hasMany(DealerOrder::class, 'dealer_id');
    }

    /**
     * Get the coupons assigned exclusively to this B2B dealer.
     */
    public function coupons()
    {
        return $this->hasMany(Coupon::class, 'dealer_id');
    }

    /**
     * Get orders placed by this user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get saved designs created by this user.
     */
    public function savedDesigns()
    {
        return $this->hasMany(SavedDesign::class);
    }

    /**
     * Get coupon usage history for this user.
     */
    public function couponUses()
    {
        return $this->hasMany(CouponUse::class);
    }
}
