<?php

namespace App\Http\Controllers;

use App\Models\BuilderModel;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuilderController extends Controller
{
    /**
     * Show the custom 3D jersey builder page with loaded configurations.
     */
    public function index(Request $request, $id = null)
    {
        $productId = $request->query('product_id');
        $categoryId = $request->query('category_id');

        $query = BuilderModel::where('status', true);

        if ($productId) {
            $product = Product::with('categories')->find($productId);
            if ($product) {
                $categoryIds = $product->categories->pluck('id');
                $query->whereIn('category_id', $categoryIds);
            }
        } elseif ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $defaultMapping = [
            'Body' => 'primary',
            'Front' => 'primary',
            'Back' => 'primary',
            'R_Sleeve' => 'secondary',
            'L_Sleeve' => 'secondary',
            'Neck' => 'third',
            'Mesh' => 'third',
        ];

        $models = $query->get()->map(function ($model) use ($defaultMapping) {
            $mapping = is_array($model->mapping) && !empty($model->mapping) ? $model->mapping : $defaultMapping;
            return [
                'id' => 'M' . $model->id,
                'name' => strtoupper($model->name),
                'modelUrl' => $model->model_url,
                'thumbnail' => $model->thumbnail,
                'mapping' => $mapping,
            ];
        });

        return Inertia::render('BuilderPage', [
            'id' => $id,
            'dynamicDesigns' => $models
        ]);
    }
}
