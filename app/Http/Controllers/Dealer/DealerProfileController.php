<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DealerProfileController extends Controller
{
    /**
     * Show the B2B Dealer Profile editor.
     */
    public function show()
    {
        $dealer = Auth::user();

        return Inertia::render('Dealer/Profile', [
            'dealer' => [
                'id' => $dealer->id,
                'name' => $dealer->name,
                'email' => $dealer->email,
                'phone' => $dealer->phone,
                'address' => $dealer->address,
                'city' => $dealer->city,
                'status' => $dealer->status,
            ]
        ]);
    }

    /**
     * Update the B2B Dealer profile details.
     */
    public function update(Request $request)
    {
        $dealer = Auth::user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:255'],
        ]);

        $dealer->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
        ]);

        return redirect()->back()->with('success', 'B2B Dealer Profile details saved cleanly!');
    }
}
