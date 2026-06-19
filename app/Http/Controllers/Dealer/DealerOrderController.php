<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\DealerOrder;
use App\Models\DealerOrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DealerOrderController extends Controller
{
    /**
     * Display a listing of the B2B Dealer's orders.
     */
    public function index()
    {
        $dealer = Auth::user();

        $orders = DealerOrder::where('dealer_id', $dealer->id)
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Dealer/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Show the form for creating a new wholesale bulk order.
     */
    public function create()
    {
        $products = Product::orderBy('title', 'asc')->get(['id', 'title as name', 'price', 'featured_image']);
        
        // Auto-resolve storage paths for products featured_image if needed
        $products->map(function ($product) {
            if ($product->featured_image && !str_starts_with($product->featured_image, '/')) {
                $product->featured_image = '/storage/' . $product->featured_image;
            }
            return $product;
        });

        $dealer = Auth::user();

        // Fetch B2B custom 3D designs linked to the dealer's profile
        $savedDesigns = \App\Models\SavedDesign::where('user_id', $dealer->id)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'model_name', 'thumbnail']);

        return Inertia::render('Dealer/Orders/Create', [
            'products' => $products,
            'savedDesigns' => $savedDesigns,
            'dealer' => [
                'address' => $dealer->address,
                'city' => $dealer->city,
                'country' => 'USA' // Default country or fallback
            ]
        ]);
    }

    /**
     * Store a newly created wholesale bulk order in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.saved_design_id' => ['nullable', 'exists:saved_designs,id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.size' => ['required', 'string', 'max:50'],
            'items.*.custom_name' => ['nullable', 'string', 'max:100'],
            'items.*.custom_number' => ['nullable', 'string', 'max:50'],
        ]);

        $dealer = Auth::user();

        try {
            $order = DB::transaction(function () use ($request, $dealer) {
                // Pre-calculate totals from product catalog values
                $totalPrice = 0;
                $itemsData = [];

                foreach ($request->items as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $unitPrice = (double) $product->price;
                    $rowTotal = $unitPrice * (int) $item['qty'];
                    $totalPrice += $rowTotal;

                    // Resolve image path for item details
                    $imagePath = $product->featured_image;
                    if ($imagePath && !str_starts_with($imagePath, '/')) {
                        $imagePath = '/storage/' . $imagePath;
                    }

                    // If a custom 3D design is selected, override static image with design thumbnail
                    if (!empty($item['saved_design_id'])) {
                        $design = \App\Models\SavedDesign::find($item['saved_design_id']);
                        if ($design && $design->thumbnail) {
                            $imagePath = $design->thumbnail;
                        }
                    }

                    $itemsData[] = [
                        'product_id' => $product->id,
                        'saved_design_id' => $item['saved_design_id'] ?? null,
                        'product_name' => $product->title,
                        'qty' => (int) $item['qty'],
                        'size' => $item['size'],
                        'custom_name' => $item['custom_name'] ?? null,
                        'custom_number' => $item['custom_number'] ?? null,
                        'unit_price' => $unitPrice,
                        'image' => $imagePath,
                    ];
                }

                // Create Order
                $order = DealerOrder::create([
                    'dealer_id' => $dealer->id,
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                    'shipping_address' => $request->shipping_address,
                    'city' => $request->city,
                    'country' => $request->country,
                    'notes' => $request->notes,
                ]);

                // Create Order Items
                foreach ($itemsData as $item) {
                    $item['dealer_order_id'] = $order->id;
                    DealerOrderItem::create($item);
                }

                return $order;
            });

            return redirect()->route('dealer.orders.index')->with('success', "Wholesale bulk order #{$order->id} placed successfully!");

        } catch (\Exception $e) {
            return redirect()->back()->withInput()->withErrors([
                'items' => 'An error occurred while processing bulk order: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display granular wholesale order breakdown.
     */
    public function show($id)
    {
        $dealer = Auth::user();

        $order = DealerOrder::where('id', $id)
            ->where('dealer_id', $dealer->id)
            ->with(['items.savedDesign'])
            ->firstOrFail();

        return Inertia::render('Dealer/Orders/Show', [
            'order' => $order
        ]);
    }
}
