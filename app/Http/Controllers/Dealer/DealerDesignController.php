<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\SavedDesign;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DealerDesignController extends Controller
{
    /**
     * Show customizer templates saved under dealer's customer profile.
     */
    public function index()
    {
        $dealer = Auth::user();

        $designs = SavedDesign::where('user_id', $dealer->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($design) {
                return [
                    'id' => $design->id,
                    'name' => $design->name,
                    'model_name' => $design->model_name,
                    'image' => $design->thumbnail ? $design->thumbnail : 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80',
                    'date' => $design->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Dealer/Designs/Index', [
            'designs' => $designs
        ]);
    }

    /**
     * Delete a saved uniform design.
     */
    public function destroy($id)
    {
        $dealer = Auth::user();

        $design = SavedDesign::where('id', $id)
            ->where('user_id', $dealer->id)
            ->firstOrFail();

        $design->delete();

        return redirect()->route('dealer.designs.index')->with('success', 'Customizer design template successfully deleted.');
    }
}
