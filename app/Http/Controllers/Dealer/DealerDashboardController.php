<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\DealerOrder;
use App\Models\SavedDesign;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DealerDashboardController extends Controller
{
    /**
     * Display the B2B Dealer dashboard with business stats.
     */
    public function index()
    {
        $dealer = Auth::user();

        $totalOrders = DealerOrder::where('dealer_id', $dealer->id)->count();
        
        $pendingOrders = DealerOrder::where('dealer_id', $dealer->id)
            ->where('status', 'pending')
            ->count();
            
        $totalSpent = DealerOrder::where('dealer_id', $dealer->id)
            ->whereIn('status', ['confirmed', 'processing', 'shipped', 'delivered'])
            ->sum('total_price');

        $designsCount = SavedDesign::where('user_id', $dealer->id)->count();

        $recentOrders = DealerOrder::where('dealer_id', $dealer->id)
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dealer/Dashboard', [
            'stats' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_spent' => (double) $totalSpent,
                'designs_count' => $designsCount,
            ],
            'recentOrders' => $recentOrders,
            'dealerName' => $dealer->name
        ]);
    }
}
