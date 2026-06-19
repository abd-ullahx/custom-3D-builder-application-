<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;


class DealerAuthController extends Controller
{
    /**
     * Show the B2B Dealer Login form (redirects to storefront).
     */
     public function showLogin()
     {
         return redirect()->route('auth');
     }
 
     /**
      * Authenticate and login B2B Dealer.
      */
     public function login(Request $request)
     {
         return redirect()->route('auth');
     }
 
     /**
      * Logout and destroy B2B Dealer session.
      */
     public function logout(Request $request)
     {
         Auth::logout();
 
         $request->session()->invalidate();
         $request->session()->regenerateToken();
 
         return redirect()->route('home')->with('success', 'Logged out from dealer portal successfully.');
     }

    /**
     * Show the forgot-password form.
     */
    public function showForgotPassword()
    {
        return Inertia::render('Dealer/ForgotPassword');
    }

    /**
     * Generate a password-reset token and redirect to the reset form.
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $dealer = User::where('role', 'dealer')->where('email', $request->email)->first();

        if (!$dealer) {
            return redirect()->back()->withErrors([
                'email' => 'We could not find a dealer account with that email address.',
            ]);
        }

        // Generate a token and store it
        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $dealer->email],
            [
                'token'      => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Redirect directly to the reset form with the token in the URL
        return redirect("/dealer/reset-password/{$token}?email=" . urlencode($dealer->email))
            ->with('success', 'Password reset link generated. Please set your new password.');
    }

    /**
     * Show the reset-password form.
     */
    public function showResetForm(Request $request, $token)
    {
        return Inertia::render('Dealer/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * Reset the dealer's password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return redirect()->back()->withErrors([
                'email' => 'This password reset link is invalid or has expired.',
            ]);
        }

        // Check if token is older than 60 minutes
        if (now()->diffInMinutes($record->created_at) > 60) {
            return redirect()->back()->withErrors([
                'email' => 'This password reset link has expired. Please request a new one.',
            ]);
        }

        // Update dealer's password
        $dealer = User::where('role', 'dealer')->where('email', $request->email)->first();

        if (!$dealer) {
            return redirect()->back()->withErrors([
                'email' => 'We could not find a dealer account with that email address.',
            ]);
        }

        $dealer->password = Hash::make($request->password);
        $dealer->save();

        // Clean up the token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return redirect()->route('dealer.login')->with('success', 'Your password has been reset successfully! Please sign in with your new password.');
    }
}
