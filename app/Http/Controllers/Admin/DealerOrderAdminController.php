<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DealerOrder;
use Illuminate\Http\Request;

class DealerOrderAdminController extends Controller
{
    /**
     * Display a listing of B2B wholesale orders in admin panel.
     */
    public function index()
    {
        $orders = DealerOrder::with(['dealer', 'statusDetails'])
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return view('admin.dealer-orders.index', compact('orders'));
    }

    /**
     * Display the wholesale order details in admin panel.
     */
    public function show($id)
    {
        $order = DealerOrder::with(['dealer', 'items.savedDesign'])->findOrFail($id);
        
        foreach ($order->items as $item) {
            if ($item->savedDesign) {
                $builderModel = \App\Models\BuilderModel::whereRaw('LOWER(name) = ?', [strtolower($item->savedDesign->model_name)])->first();
                $item->model_url = $builderModel ? $builderModel->model_url : null;
            }
        }

        $statuses = \App\Models\OrderStatus::all();

        return view('admin.dealer-orders.show', compact('order', 'statuses'));
    }

    /**
     * Update B2B wholesale order delivery status and admin notes.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', 'string', 'exists:order_statuses,name'],
            'admin_note' => ['nullable', 'string'],
        ]);

        $order = DealerOrder::findOrFail($id);
        
        $order->update([
            'status' => $request->status,
            'admin_note' => $request->admin_note,
        ]);

        return redirect()->back()->with('success', "Order successfully updated!");
    }
}
