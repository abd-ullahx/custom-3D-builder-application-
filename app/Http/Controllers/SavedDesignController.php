<?php

namespace App\Http\Controllers;

use App\Models\SavedDesign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavedDesignController extends Controller
{
    /**
     * Display a list of saved designs for the authenticated customer.
     */
    public function index(Request $request)
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Smart dynamic query to load designs saved by this user
        $designs = SavedDesign::where('user_id', $userId)
            ->latest()
            ->get()
            ->map(function ($design) {
                return [
                    'id' => $design->id,
                    'name' => $design->name,
                    'model_name' => $design->model_name,
                    'date' => 'Saved on ' . $design->created_at->format('Y-m-d'),
                    'design_data' => $design->design_data,
                    'image' => $design->thumbnail ? $design->thumbnail : 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80',
                ];
            });

        return response()->json($designs);
    }

    /**
     * Save a custom 3D design configuration to the database.
     */
    public function store(Request $request)
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Please sign in to save your custom design!'
            ], 401);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'model_name' => ['required', 'string', 'max:255'],
            'design_data' => ['required', 'array'],
            'thumbnail' => ['nullable', 'string'],
        ]);

        $design = SavedDesign::create([
            'user_id' => $userId,
            'name' => $request->name,
            'model_name' => $request->model_name,
            'design_data' => $request->design_data,
            'thumbnail' => $request->thumbnail,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Design saved to profile successfully!',
            'design' => [
                'id' => $design->id,
                'name' => $design->name,
                'model_name' => $design->model_name,
            ]
        ], 201);
    }

    /**
     * Display a specific saved design configuration.
     */
    public function show($id)
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $design = SavedDesign::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$design) {
            return response()->json([
                'success' => false,
                'message' => 'Saved design not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'id' => $design->id,
            'name' => $design->name,
            'model_name' => $design->model_name,
            'design_data' => $design->design_data,
            'image' => $design->thumbnail,
        ]);
    }

    /**
     * Remove a saved design configuration from the database.
     */
    public function destroy($id)
    {
        $userId = $this->getAuthenticatedUserId();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $design = SavedDesign::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$design) {
            return response()->json([
                'success' => false,
                'message' => 'Saved design not found.'
            ], 404);
        }

        $design->delete();

        return response()->json([
            'success' => true,
            'message' => 'Design removed from saved library.'
        ]);
    }

    /**
     * Get the active authenticated user ID (works for web and dealer guards).
     */
    private function getAuthenticatedUserId()
    {
        return Auth::id();
    }
}

