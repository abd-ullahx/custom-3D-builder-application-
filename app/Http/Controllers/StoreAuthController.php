<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Traits\ImageOptimizer;

class StoreAuthController extends Controller
{
    use ImageOptimizer;
    /**
     * Register a new customer storefront session.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Password::min(6)],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_notifications' => true,
            'newsletter' => true,
            'two_factor_auth' => false,
        ]);

        Auth::login($user);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profile_image' => $user->profile_image,
                'email_notifications' => (bool)$user->email_notifications,
                'newsletter' => (bool)$user->newsletter,
                'two_factor_auth' => (bool)$user->two_factor_auth,
                'role' => $user->role,
            ]
        ], 201);
    }

    /**
     * Authenticate and login customer storefront session.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if ($user->role === 'dealer' && $user->status !== 'active') {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => "Your B2B account status is {$user->status}. Please contact support.",
                ], 422);
            }

            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Signed in successfully!',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'profile_image' => $user->profile_image,
                    'email_notifications' => (bool)$user->email_notifications,
                    'newsletter' => (bool)$user->newsletter,
                    'two_factor_auth' => (bool)$user->two_factor_auth,
                    'role' => $user->role,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'The provided credentials do not match our records.',
        ], 422);
    }

    /**
     * Logout and destroy customer storefront session.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully!'
        ]);
    }

    /**
     * Get the currently authenticated customer profile.
     */
    public function me(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'profile_image' => $user->profile_image,
                    'email_notifications' => (bool)$user->email_notifications,
                    'newsletter' => (bool)$user->newsletter,
                    'two_factor_auth' => (bool)$user->two_factor_auth,
                    'role' => $user->role,
                ]
            ]);
        }

        return response()->json([
            'authenticated' => false
        ]);
    }

    /**
     * Update the authenticated user's profile information.
     */
    public function updateProfile(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
        ]);

        $user->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profile_image' => $user->profile_image,
                'email_notifications' => (bool)$user->email_notifications,
                'newsletter' => (bool)$user->newsletter,
                'two_factor_auth' => (bool)$user->two_factor_auth,
                'role' => $user->role,
            ]
        ]);
    }

    /**
     * Update the authenticated user's profile image (avatar).
     */
    public function updateProfileImage(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        $request->validate([
            'profile_image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('profile_image')) {
            // Delete old profile image if it exists
            if ($user->profile_image) {
                $oldPath = public_path($user->profile_image);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $image = $request->file('profile_image');
            $imageName = $this->optimizeAndSave($image, public_path('uploads/avatars'), false);
            
            $user->profile_image = '/uploads/avatars/' . $imageName;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile image updated successfully!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profile_image' => $user->profile_image,
                'email_notifications' => (bool)$user->email_notifications,
                'newsletter' => (bool)$user->newsletter,
                'two_factor_auth' => (bool)$user->two_factor_auth,
                'role' => $user->role,
            ]
        ]);

    }
    /**
     * Update the authenticated user's account settings.
     */
    public function updateSettings(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        $request->validate([
            'email_notifications' => ['required', 'boolean'],
            'newsletter' => ['required', 'boolean'],
            'two_factor_auth' => ['required', 'boolean'],
        ]);

        $user->update([
            'email_notifications' => $request->email_notifications,
            'newsletter' => $request->newsletter,
            'two_factor_auth' => $request->two_factor_auth,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profile_image' => $user->profile_image,
                'email_notifications' => (bool)$user->email_notifications,
                'newsletter' => (bool)$user->newsletter,
                'two_factor_auth' => (bool)$user->two_factor_auth,
                'role' => $user->role,
            ]
        ]);
    }
}
