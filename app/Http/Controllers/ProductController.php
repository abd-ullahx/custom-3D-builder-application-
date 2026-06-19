<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display the storefront product catalog with database-level search and filtering.
     * Uses server-side pagination to avoid loading all products into memory.
     */
    public function index(Request $request)
    {
        $query = Product::where('status', true)->with(['categories.parent']);

        // 1. Search Query (Title, Description, or SKU)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // 2. Category Filter
        if ($request->filled('category') && strtolower($request->input('category')) !== 'all') {
            $categorySlug = strtolower($request->input('category'));
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                  ->orWhereHas('parent', function ($pq) use ($categorySlug) {
                      $pq->where('slug', $categorySlug);
                  });
            });
        }

        // 3. Subcategory Filter
        if ($request->filled('subcategory')) {
            $subcategorySlug = strtolower($request->input('subcategory'));
            $query->whereHas('categories', function ($q) use ($subcategorySlug) {
                $q->where('slug', $subcategorySlug);
            });
        }

        // 4. Price Filter
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->input('price_max'));
        }

        // 5. Sorting
        $sort = $request->input('sort', 'featured');
        if ($sort === 'low_high') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'high_low') {
            $query->orderBy('price', 'desc');
        } else {
            $query->latest('id'); // Featured or Latest
        }

        // Server-side pagination — only load 12 products at a time, not all of them
        $paginated = $query->paginate(12)->withQueryString();

        // Transform using the centralized ProductResource
        $products = ProductResource::collection($paginated->items())->toArray(request());

        $dbCategories = Category::where('status', true)
            ->whereNull('parent_id')
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn($cat) => ['name' => $cat->name, 'slug' => $cat->slug])
            ->toArray();

        return Inertia::render('Products', [
            'products'   => $products,
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
            ],
            'categories' => array_merge([['name' => 'All', 'slug' => 'all']], $dbCategories),
            'filters'    => $request->only(['search', 'category', 'subcategory', 'price_max', 'sort']),
        ]);
    }

    /**
     * Display details of a single product.
     * Explicitly handles numeric IDs vs slugs to avoid orWhere ambiguity.
     */
    public function show(string $id)
    {
        // Unambiguous lookup: numeric string = ID, otherwise = slug
        if (is_numeric($id)) {
            $product = Product::with(['categories.parent', 'images'])->find((int) $id);
        } else {
            $product = Product::with(['categories.parent', 'images'])->where('slug', $id)->first();
        }

        $mappedProduct   = null;
        $relatedProducts = [];

        if ($product) {
            // Use resource in detailed mode for full gallery + features
            $mappedProduct = (new ProductResource($product))->withDetails()->toArray(request());

            // Fetch related products from same category
            $categoryIds  = $product->categories->pluck('id')->toArray();
            $relatedQuery = Product::where('status', true)
                ->where('id', '!=', $product->id)
                ->whereHas('categories', fn($q) => $q->whereIn('categories.id', $categoryIds))
                ->with(['categories.parent'])
                ->limit(3)
                ->get();

            if ($relatedQuery->count() < 3) {
                $additional = Product::where('status', true)
                    ->where('id', '!=', $product->id)
                    ->whereNotIn('id', $relatedQuery->pluck('id')->toArray())
                    ->with(['categories.parent'])
                    ->limit(3 - $relatedQuery->count())
                    ->get();
                $relatedQuery = $relatedQuery->concat($additional);
            }

            $relatedProducts = ProductResource::collection($relatedQuery)->toArray(request());
        }

        return Inertia::render('ProductDetails', [
            'id'              => $id,
            'product'         => $mappedProduct,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Search products via clean backend database query (used by search overlay).
     */
    public function search(Request $request)
    {
        $search = $request->query('query', '');

        if (strlen($search) < 2) {
            return response()->json(['products' => [], 'total' => 0]);
        }

        $query = Product::where('status', true)
            ->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });

        $totalCount = $query->count();

        $products = $query->with(['categories'])
            ->limit(10)
            ->get()
            ->map(fn($product) => [
                'id'       => $product->id,
                'name'     => $product->title,
                'slug'     => $product->slug,
                'price'    => (float) $product->price,
                'rating'   => 4.5,
                'image'    => $product->featured_image
                    ? '/storage/' . $product->featured_image
                    : 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=80&h=80&fit=crop',
                'category' => $product->categories->first()?->name ?? 'Accessories',
            ]);

        return response()->json(['products' => $products, 'total' => $totalCount]);
    }
}
