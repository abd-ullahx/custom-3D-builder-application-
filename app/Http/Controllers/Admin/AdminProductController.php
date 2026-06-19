<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Traits\FlashNotifications;
use App\Traits\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    use FlashNotifications, ImageOptimizer;

    public function index(Request $request)
    {
        $query = Product::with('categories');

        if ($request->has('search') && $request->search != '') {
            $query->where('title', 'like', '%'.$request->search.'%')
                ->orWhere('sku', 'like', '%'.$request->search.'%');
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status == 'active' ? 1 : 0);
        }

        $products = $query->latest('id')->paginate(10);

        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::whereNull('parent_id')->with('subcategories')->get();

        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'sku' => 'nullable|string|max:255|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $slug = $request->slug ? Str::slug($request->slug) : $this->generateUniqueSlug($request->title);

        $featuredImagePath = null;
        if ($request->hasFile('featured_image')) {
            $featuredImagePath = $this->optimizeAndSave($request->file('featured_image'), 'products', true);
        }

        $features = [];
        if ($request->filled('features')) {
            $features = array_filter(array_map('trim', explode("\n", $request->input('features'))));
        }

        $product = Product::create([
            'title' => $request->title,
            'slug' => $slug,
            'sku' => $request->sku,
            'short_description' => $request->short_description,
            'description' => $request->description,
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'stock' => $request->stock,
            'track_stock' => $request->has('track_stock') ? 1 : 0,
            'is_featured' => $request->has('is_featured') ? 1 : 0,
            'status' => $request->has('status') ? 1 : 0,
            'featured_image' => $featuredImagePath,
            'features' => $features,
        ]);

        $product->categories()->sync($request->categories);

        if ($request->hasFile('gallery_images')) {
            $order = 0;
            foreach ($request->file('gallery_images') as $image) {
                $path = $this->optimizeAndSave($image, 'products/gallery', true);
                $product->images()->create([
                    'image_path' => $path,
                    'sort_order' => $order++,
                ]);
            }
        }

        $this->successNotification('Product created successfully.');
        return to_route('admin.products.index');
    }

    public function edit(Product $product)
    {
        $categories = Category::whereNull('parent_id')->with('subcategories')->get();
        $selectedCategories = $product->categories->pluck('id')->toArray();
        $product->load('images');

        return view('admin.products.edit', compact('product', 'categories', 'selectedCategories'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,'.$product->id,
            'sku' => 'nullable|string|max:255|unique:products,sku,'.$product->id,
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $slug = Str::slug($request->slug);

        $features = [];
        if ($request->filled('features')) {
            $features = array_filter(array_map('trim', explode("\n", $request->input('features'))));
        }

        $data = [
            'title' => $request->title,
            'slug' => $slug,
            'sku' => $request->sku,
            'short_description' => $request->short_description,
            'description' => $request->description,
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'stock' => $request->stock,
            'track_stock' => $request->has('track_stock') ? 1 : 0,
            'is_featured' => $request->has('is_featured') ? 1 : 0,
            'status' => $request->has('status') ? 1 : 0,
            'features' => $features,
        ];

        if ($request->hasFile('featured_image')) {
            if ($product->featured_image) {
                Storage::disk('public')->delete($product->featured_image);
            }
            $data['featured_image'] = $this->optimizeAndSave($request->file('featured_image'), 'products', true);
        }

        $product->update($data);

        $product->categories()->sync($request->categories);

        // Update existing gallery image sequence/sort order
        if ($request->filled('gallery_order')) {
            $orderIds = explode(',', $request->input('gallery_order'));
            foreach ($orderIds as $index => $imgId) {
                if (!empty($imgId)) {
                    $product->images()->where('id', $imgId)->update(['sort_order' => $index]);
                }
            }
        }

        if ($request->hasFile('gallery_images')) {
            $maxOrder = $product->images()->max('sort_order') ?? 0;
            foreach ($request->file('gallery_images') as $image) {
                $path = $this->optimizeAndSave($image, 'products/gallery', true);
                $maxOrder++;
                $product->images()->create([
                    'image_path' => $path,
                    'sort_order' => $maxOrder,
                ]);
            }
        }

        $this->successNotification('Product updated successfully.');
        return back();
    }

    public function destroy(Product $product)
    {
        if ($product->featured_image) {
            Storage::disk('public')->delete($product->featured_image);
        }

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        $product->delete();

        $this->successNotification('Product deleted successfully.');
        return back();
    }

    public function deleteGalleryImage($id)
    {
        $image = ProductImage::findOrFail($id);
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['success' => true, 'message' => 'Image deleted successfully']);
    }

    public function checkSlug(Request $request)
    {
        $slug = Str::slug($request->slug);
        $ignoreId = $request->ignore_id ?? 0;

        $exists = Product::where('slug', $slug)->where('id', '!=', $ignoreId)->exists();

        return response()->json([
            'slug' => $slug,
            'exists' => $exists,
        ]);
    }

    private function generateUniqueSlug($title, $ignoreId = 0)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (Product::where('slug', $slug)->where('id', '!=', $ignoreId)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
