<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeCategory;
use App\Traits\FlashNotifications;
use App\Traits\ImageOptimizer;
use Illuminate\Http\Request;

class AdminHomeCategoryController extends Controller
{
    use FlashNotifications, ImageOptimizer;

    /**
     * Display a listing of home categories.
     */
    public function index()
    {
        $categories = HomeCategory::orderBy('order', 'asc')->get();
        return view('admin.home_categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new home category.
     */
    public function create()
    {
        return view('admin.home_categories.create');
    }

    /**
     * Store a newly created home category in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'count' => 'required|string|max:255',
            'gradient' => 'required|string|max:255',
            'image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_url' => 'nullable|url|max:2048',
            'status' => 'required',
            'order' => 'required|integer',
        ]);

        $data = [
            'name' => $request->name,
            'count' => $request->count,
            'gradient' => $request->gradient,
            'image_url' => $request->image_url,
            'status' => $request->status,
            'order' => $request->order,
        ];

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $fileName = $this->optimizeAndSave($file, public_path('images/categories'), false);
            $data['image_path'] = $fileName;
            $data['image_url'] = null;
        }

        HomeCategory::create($data);
        $this->successNotification('Category card created successfully.');

        return redirect()->route('admin.home-categories.index');
    }

    /**
     * Show the form for editing the specified home category.
     */
    public function edit($id)
    {
        $category = HomeCategory::findOrFail($id);
        return view('admin.home_categories.edit', compact('category'));
    }

    /**
     * Update the specified home category in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'count' => 'required|string|max:255',
            'gradient' => 'required|string|max:255',
            'image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_url' => 'nullable|url|max:2048',
            'status' => 'required',
            'order' => 'required|integer',
        ]);

        $category = HomeCategory::findOrFail($id);

        $data = [
            'name' => $request->name,
            'count' => $request->count,
            'gradient' => $request->gradient,
            'image_url' => $request->image_url,
            'status' => $request->status,
            'order' => $request->order,
        ];

        if ($request->hasFile('image_file')) {
            // Delete old file
            if ($category->image_path) {
                $oldPath = public_path('images/categories/' . $category->image_path);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('image_file');
            $fileName = $this->optimizeAndSave($file, public_path('images/categories'), false);
            $data['image_path'] = $fileName;
            $data['image_url'] = null;
        } elseif ($request->filled('image_url')) {
            // Delete old file if dynamic URL entered
            if ($category->image_path) {
                $oldPath = public_path('images/categories/' . $category->image_path);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
                $data['image_path'] = null;
            }
        }

        $category->update($data);
        $this->successNotification('Category card updated successfully.');

        return redirect()->route('admin.home-categories.index');
    }

    /**
     * Remove the specified home category from storage.
     */
    public function destroy($id)
    {
        $category = HomeCategory::findOrFail($id);

        if ($category->image_path) {
            $path = public_path('images/categories/' . $category->image_path);
            if (file_exists($path) && is_file($path)) {
                @unlink($path);
            }
        }

        $category->delete();
        $this->successNotification('Category card deleted successfully.');

        return redirect()->route('admin.home-categories.index');
    }
}
