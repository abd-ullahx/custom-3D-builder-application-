<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index()
    {
        // Get only root categories with their nested children
        $categories = Category::whereNull('parent_id')->with('subcategories')->get();

        return view('admin.categories.index', compact('categories'));
    }

    public function create()
    {
        $categories = Category::whereNull('parent_id')->with('subcategories')->get();

        return view('admin.categories.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'boolean',
        ]);

        $slug = $request->slug ? Str::slug($request->slug) : $this->generateUniqueSlug($request->name);

        Category::create([
            'name' => $request->name,
            'slug' => $slug,
            'parent_id' => $request->parent_id,
            'status' => $request->has('status') ? 1 : 0,
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        $categories = Category::whereNull('parent_id')->with('subcategories')->get();

        return view('admin.categories.edit', compact('category', 'categories'));
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,'.$category->id,
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'boolean',
        ]);

        // Prevent setting category as its own parent
        if ($request->parent_id == $category->id) {
            return back()->withErrors(['parent_id' => 'A category cannot be its own parent.']);
        }

        $slug = Str::slug($request->slug);

        $category->update([
            'name' => $request->name,
            'slug' => $slug,
            'parent_id' => $request->parent_id,
            'status' => $request->has('status') ? 1 : 0,
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function checkSlug(Request $request)
    {
        $slug = Str::slug($request->slug);
        $ignoreId = $request->ignore_id ?? 0;

        $exists = Category::where('slug', $slug)->where('id', '!=', $ignoreId)->exists();

        return response()->json([
            'slug' => $slug,
            'exists' => $exists,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }

    private function generateUniqueSlug($name, $ignoreId = 0)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->where('id', '!=', $ignoreId)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
