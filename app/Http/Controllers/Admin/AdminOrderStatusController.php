<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderStatus;
use App\Traits\FlashNotifications;
use Illuminate\Http\Request;

class AdminOrderStatusController extends Controller
{
    use FlashNotifications;

    /**
     * Display a listing of order statuses.
     */
    public function index()
    {
        $statuses = OrderStatus::all();
        return view('admin.order-statuses.index', compact('statuses'));
    }

    /**
     * Show the form for creating a new order status.
     */
    public function create()
    {
        return view('admin.order-statuses.create');
    }

    /**
     * Store a newly created order status in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:order_statuses,name',
            'badge_color' => 'required|string|max:50',
        ]);

        try {
            OrderStatus::create([
                'name' => trim($request->name),
                'badge_color' => $request->badge_color,
            ]);

            $this->successNotification('Order status created successfully.');
            return redirect()->route('admin.order-statuses.index');
        } catch (\Exception $e) {
            $this->errorNotification('Failed to create order status. Error: ' . $e->getMessage());
            return back()->withInput();
        }
    }

    /**
     * Show the form for editing the specified order status.
     */
    public function edit($id)
    {
        $orderStatus = OrderStatus::findOrFail($id);
        return view('admin.order-statuses.edit', compact('orderStatus'));
    }

    /**
     * Update the specified order status in database.
     */
    public function update(Request $request, $id)
    {
        $orderStatus = OrderStatus::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:order_statuses,name,' . $orderStatus->id,
            'badge_color' => 'required|string|max:50',
        ]);

        try {
            $orderStatus->update([
                'name' => trim($request->name),
                'badge_color' => $request->badge_color,
            ]);

            $this->successNotification('Order status updated successfully.');
            return redirect()->route('admin.order-statuses.index');
        } catch (\Exception $e) {
            $this->errorNotification('Failed to update order status. Error: ' . $e->getMessage());
            return back()->withInput();
        }
    }

    /**
     * Remove the specified order status from database.
     */
    public function destroy($id)
    {
        $orderStatus = OrderStatus::findOrFail($id);
        try {
            $orderStatus->delete();
            $this->successNotification('Order status deleted successfully.');
        } catch (\Exception $e) {
            $this->errorNotification('Failed to delete order status.');
        }
        return redirect()->route('admin.order-statuses.index');
    }
}
