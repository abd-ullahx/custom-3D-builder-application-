<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuilderModel;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminBuilderModelController extends Controller
{
    public function index()
    {
        $models = BuilderModel::with('category')->latest()->get();
        return view('admin.builder_models.index', compact('models'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('admin.builder_models.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'boolean',
        ]);

        $data = $request->except(['model_file', 'status']);
        $data['status'] = $request->has('status');
        $mapping = [];
        if ($request->has('mapping_keys') && $request->has('mapping_values')) {
            $keys = $request->input('mapping_keys');
            $values = $request->input('mapping_values');
            foreach ($keys as $index => $key) {
                if (!empty($key) && !empty($values[$index])) {
                    $mapping[$key] = $values[$index];
                }
            }
        }
        $data['mapping'] = $mapping;

        if ($request->hasFile('model_file')) {
            $data['model_url'] = '/storage/' . $request->file('model_file')->store('builder_models', 'public');
        }

        BuilderModel::create($data);

        return redirect()->route('admin.builder-models.index')->with('success', 'Builder Model created successfully.');
    }

    public function edit(BuilderModel $builderModel)
    {
        $categories = Category::all();
        return view('admin.builder_models.edit', compact('builderModel', 'categories'));
    }

    public function update(Request $request, BuilderModel $builderModel)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'model_file' => 'nullable|file',
        ]);

        $data = $request->except(['model_file', 'status']);
        $data['status'] = $request->has('status');

        if ($request->hasFile('model_file')) {
            if ($builderModel->model_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $builderModel->model_url));
            }
            $data['model_url'] = '/storage/' . $request->file('model_file')->store('builder_models', 'public');
        }

        $builderModel->update($data);

        return redirect()->route('admin.builder-models.index')->with('success', 'Builder Model updated successfully.');
    }

    public function destroy(BuilderModel $builderModel)
    {
        if ($builderModel->model_url) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $builderModel->model_url));
        }
        if ($builderModel->thumbnail) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $builderModel->thumbnail));
        }
        $builderModel->delete();

        return redirect()->route('admin.builder-models.index')->with('success', 'Builder Model deleted successfully.');
    }
}
