<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_uses',
        'used_count',
        'expires_at',
        'is_active',
        'for_dealers_only',
        'dealer_id',
        'auto_apply',
    ];

    protected $casts = [
        'value' => 'float',
        'min_order_amount' => 'float',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'is_active' => 'boolean',
        'for_dealers_only' => 'boolean',
        'auto_apply' => 'boolean',
        'expires_at' => 'datetime',
    ];

    /**
     * Set coupon code to always be uppercase.
     */
    public function setCodeAttribute($value)
    {
        $this->attributes['code'] = strtoupper($value);
    }

    /**
     * Get the coupon uses history.
     */
    public function uses()
    {
        return $this->hasMany(CouponUse::class);
    }

    /**
     * Get the exclusive B2B dealer who owns this coupon.
     */
    public function dealer()
    {
        return $this->belongsTo(User::class, 'dealer_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>=', Carbon::today());
        });
    }

    public function scopeHasUsesLeft($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('max_uses')
              ->orWhereColumn('used_count', '<', 'max_uses');
        });
    }

    public function scopeForDealers($query, $forDealers = true)
    {
        return $query->where('for_dealers_only', $forDealers);
    }

    public function scopeAutoApply($query)
    {
        return $query->where('auto_apply', true);
    }

    /**
     * Validate Coupon for a given user context and cart total.
     * Returns true or string error message.
     */
    public function validateForUser($user, $cartTotal)
    {
        // 1. Is active
        if (!$this->is_active) {
            return "This coupon is no longer active.";
        }

        // 2. Not expired
        if ($this->expires_at && $this->expires_at->endOfDay()->isPast()) {
            return "This coupon has expired.";
        }

        // 3. Uses left
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return "This coupon has reached its usage limit.";
        }

        // 4. Cart minimum order amount check
        if ($this->min_order_amount !== null && $cartTotal < $this->min_order_amount) {
            return "Minimum order amount of Rs. " . number_format($this->min_order_amount) . " required.";
        }

        // Check active login context for Dealer
        $isDealer = ($user && $user->role === 'dealer');
        $dealerId = $isDealer ? $user->id : null;

        // 5. Dealer Only validation
        if ($this->for_dealers_only && !$isDealer) {
            return "This coupon is for dealers only.";
        }

        // 6. Specific Dealer validation
        if ($this->dealer_id !== null) {
            if (!$isDealer || $dealerId != $this->dealer_id) {
                return "This coupon is not valid for your account.";
            }
        }

        // 7. Already used check (prevent double usage for logged-in user or dealer)
        if ($user) {
            $alreadyUsed = CouponUse::where('coupon_id', $this->id)
                ->where(function($q) use ($user, $isDealer) {
                    if ($isDealer) {
                        // Track B2B dealer uses via user_id if they have a mapped account, 
                        // or link standard uses.
                        $q->where('user_id', $user->id);
                    } else {
                        $q->where('user_id', $user->id);
                    }
                })
                ->exists();

            if ($alreadyUsed) {
                return "You have already used this coupon.";
            }
        }

        return true;
    }

    /**
     * Interface helper checking validity (boolean)
     */
    public function isValidForUser($user, $cartTotal)
    {
        return $this->validateForUser($user, $cartTotal) === true;
    }

    /**
     * Compute discount amount based on type
     */
    public function calculateDiscount($cartTotal)
    {
        if ($this->type === 'percentage') {
            return round(($this->value / 100) * $cartTotal, 2);
        }

        // Fixed type
        return round(min($this->value, $cartTotal), 2);
    }
}
