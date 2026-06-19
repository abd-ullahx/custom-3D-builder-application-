<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of storefront customer orders in admin panel.
     */
    public function index(Request $request)
    {
        $query = Order::query()->with(['user', 'statusDetails'])->withCount('items');

        // Search text: user name, email, phone, or order ID
        if ($request->filled('search')) {
            $search = $request->search;
            $cleanSearch = preg_replace('/[^0-9]/', '', $search);

            $query->where(function($q) use ($search, $cleanSearch) {
                $q->where('billing_name', 'like', "%{$search}%")
                  ->orWhere('billing_email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });

                if (!empty($cleanSearch)){
                    $orderId = (int)$cleanSearch;
                    $q->orWhere('id', $orderId)
                      ->orWhere('id', $orderId - 1000);
                }
            });
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by Date From
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        // Filter by Date To
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();
        $statuses = \App\Models\OrderStatus::all();

        return view('admin.orders.index', compact('orders', 'statuses'));
    }

    /**
     * Display storefront customer order details in admin panel.
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.savedDesign'])->findOrFail($id);
        
        foreach ($order->items as $item) {
            if ($item->savedDesign) {
                $builderModel = \App\Models\BuilderModel::whereRaw('LOWER(name) = ?', [strtolower($item->savedDesign->model_name)])->first();
                $item->model_url = $builderModel ? $builderModel->model_url : 'http://localhost:5174/shirt.glb';
            }
        }

        $statuses = \App\Models\OrderStatus::all();

        return view('admin.orders.show', compact('order', 'statuses'));
    }

    /**
     * Update storefront customer order delivery status and admin notes.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', 'string', 'exists:order_statuses,name'],
            'admin_note' => ['nullable', 'string'],
        ]);

        $order = Order::findOrFail($id);
        
        $order->update([
            'status' => $request->status,
            'admin_note' => $request->admin_note,
        ]);

        return redirect()->back()->with('success', "Order successfully updated!");
    }
}
