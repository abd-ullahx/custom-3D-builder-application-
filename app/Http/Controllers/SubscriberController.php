<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SubscriberController extends Controller
{
    /**
     * Store a new subscriber in the database.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'email', 'max:255'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a valid email address.',
                'errors' => $e->errors()
            ], 422);
        }

        // Check if email already exists in subscribers
        $existing = Subscriber::where('email', $request->email)->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already subscribed!'
            ], 200); // Return 200 so UI can treat it nicely or standard response
        }

        Subscriber::create([
            'email' => $request->email,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing to our newsletter!'
        ], 201);
    }
}
