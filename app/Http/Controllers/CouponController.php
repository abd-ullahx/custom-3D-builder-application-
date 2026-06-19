<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    /**
     * Apply a coupon code manually at checkout.
     */
    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'cart_total' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($request->code));
        $cartTotal = (float) $request->cart_total;

        // Fetch coupon
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coupon code.'
            ], 422);
        }

        // Get authenticated user context
        $user = Auth::user();

        // Validate all 7 rules
        $validationResult = $coupon->validateForUser($user, $cartTotal);

        if ($validationResult !== true) {
            return response()->json([
                'success' => false,
                'message' => $validationResult
            ], 422);
        }

        // Calculate discount
        $discountAmount = $coupon->calculateDiscount($cartTotal);
        $finalTotal = round(max(0, $cartTotal - $discountAmount), 2);

        return response()->json([
            'success' => true,
            'coupon_code' => $coupon->code,
            'discount_amount' => $discountAmount,
            'final_total' => $finalTotal,
            'message' => 'Coupon applied! You saved Rs. ' . number_format($discountAmount, 2)
        ]);
    }

    /**
     * Get the best valid auto-apply coupon for the current user and cart total.
     */
    public function autoCoupons(Request $request)
    {
        $request->validate([
            'cart_total' => 'required|numeric|min:0',
        ]);

        $cartTotal = (float) $request->cart_total;

        // Fetch all active, unexpired, auto-apply coupons
        $coupons = Coupon::active()
            ->notExpired()
            ->hasUsesLeft()
            ->autoApply()
            ->get();

        $user = Auth::user();
        
        $bestCoupon = null;
        $highestDiscount = 0;

        foreach ($coupons as $coupon) {
            // Validate for the current user context
            if ($coupon->isValidForUser($user, $cartTotal)) {
                $discount = $coupon->calculateDiscount($cartTotal);
                if ($discount > $highestDiscount) {
                    $highestDiscount = $discount;
                    $bestCoupon = $coupon;
                }
            }
        }

        if ($bestCoupon) {
            $finalTotal = round(max(0, $cartTotal - $highestDiscount), 2);
            return response()->json([
                'success' => true,
                'coupon_code' => $bestCoupon->code,
                'discount_amount' => $highestDiscount,
                'final_total' => $finalTotal,
                'message' => '🎉 Lucky You! Discount ' . $bestCoupon->code . ' auto-applied — You save Rs. ' . number_format($highestDiscount, 2) . '!'
            ]);
        }

        return response()->json([
            'success' => true,
            'coupon' => null
        ]);
    }
}
