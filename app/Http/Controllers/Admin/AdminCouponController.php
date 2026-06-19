<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\User;
use App\Traits\FlashNotifications;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminCouponController extends Controller
{
    use FlashNotifications;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coupons = Coupon::with('dealer')->latest()->get();
        return view('admin.coupons.index', compact('coupons'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $dealers = User::where('role', 'dealer')->where('email', 'not like', '%@example.%')->get();
        return view('admin.coupons.create', compact('dealers'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|alpha_num|max:20|unique:coupons,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:1|max:' . ($request->type === 'percentage' ? 100 : 99999),
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after_or_equal:today',
            'dealer_id' => 'nullable|exists:users,id',
        ]);

        try {
            Coupon::create([
                'code' => strtoupper($request->code),
                'type' => $request->type,
                'value' => $request->value,
                'min_order_amount' => $request->min_order_amount,
                'max_uses' => $request->max_uses,
                'expires_at' => $request->expires_at ? Carbon::parse($request->expires_at)->endOfDay() : null,
                'for_dealers_only' => $request->has('for_dealers_only'),
                'dealer_id' => $request->has('for_dealers_only') ? $request->dealer_id : null,
                'auto_apply' => $request->has('auto_apply'),
                'is_active' => $request->has('is_active') ? true : false,
            ]);

            $this->successNotification('Coupon created successfully.');
            return redirect()->route('admin.coupons.index');
        } catch (\Exception $e) {
            info($e->getMessage());
            $this->errorNotification('Failed to create coupon. Error: ' . $e->getMessage());
            return back()->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coupon $coupon)
    {
        $dealers = User::where('role', 'dealer')->where('email', 'not like', '%@example.%')->get();
        return view('admin.coupons.edit', compact('coupon', 'dealers'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'code' => 'required|string|alpha_num|max:20|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:1|max:' . ($request->type === 'percentage' ? 100 : 99999),
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after_or_equal:today',
            'dealer_id' => 'nullable|exists:users,id',
        ]);

        try {
            $coupon->update([
                'code' => strtoupper($request->code),
                'type' => $request->type,
                'value' => $request->value,
                'min_order_amount' => $request->min_order_amount,
                'max_uses' => $request->max_uses,
                'expires_at' => $request->expires_at ? Carbon::parse($request->expires_at)->endOfDay() : null,
                'for_dealers_only' => $request->has('for_dealers_only'),
                'dealer_id' => $request->has('for_dealers_only') ? $request->dealer_id : null,
                'auto_apply' => $request->has('auto_apply'),
                'is_active' => $request->has('is_active') ? true : false,
            ]);

            $this->successNotification('Coupon updated successfully.');
            return redirect()->route('admin.coupons.index');
        } catch (\Exception $e) {
            info($e->getMessage());
            $this->errorNotification('Failed to update coupon. Error: ' . $e->getMessage());
            return back()->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        try {
            $coupon->delete();
            $this->successNotification('Coupon deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            $this->errorNotification('Failed to delete coupon.');
        }
        return redirect()->route('admin.coupons.index');
    }

    /**
     * Toggle the status of a coupon.
     */
    public function toggleStatus(Coupon $coupon)
    {
        try {
            $coupon->update([
                'is_active' => !$coupon->is_active
            ]);
            $this->successNotification('Coupon status toggled.');
        } catch (\Exception $e) {
            info($e->getMessage());
            $this->errorNotification('Failed to toggle coupon status.');
        }
        return redirect()->route('admin.coupons.index');
    }
}
