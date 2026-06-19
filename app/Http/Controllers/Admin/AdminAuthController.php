<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Traits\FlashNotifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    use FlashNotifications;

    public function showLoginForm()
    {
        return view('admin.auth.login');
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
                return back()->withErrors([
                    'email' => 'The provided credentials do not match our records.',
                ])->onlyInput('email');
            }

            $request->session()->regenerate();

        } catch (\Exception $exception) {
            info($exception->getMessage());
            $this->errorNotification('Something went wrong. Please try again later.');
            return back();
        }

        return to_route('admin.dashboard');
    }

    public function logout(Request $request)
    {
        try {
            Auth::guard('admin')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

        } catch (\Exception $exception) {
            info($exception->getMessage());
            $this->errorNotification('Something went wrong. Please try again later.');
            return back();
        }

        //$this->successNotification('Successfully logged out');
        return redirect()->route('admin.login');
    }

    public function showProfileForm()
    {
        $admin = Auth::guard('admin')->user();
        return view('admin.auth.profile', compact('admin'));
    }

    public function updateProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email,' . $admin->id,
        ]);

        try {
            $admin->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);
            
            $this->successNotification('Profile details updated successfully.');
        } catch (\Exception $exception) {
            info($exception->getMessage());
            $this->errorNotification('Failed to update profile details. Please try again.');
        }

        return back();
    }

    public function updatePassword(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $admin->password)) {
            return back()->withErrors(['current_password' => 'The provided current password does not match.']);
        }

        try {
            $admin->update([
                'password' => Hash::make($request->password),
            ]);
            
            $this->successNotification('Password updated successfully.');
        } catch (\Exception $exception) {
            info($exception->getMessage());
            $this->errorNotification('Failed to update password. Please try again.');
        }

        return back();
    }
}
