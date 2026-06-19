<?php

namespace App\Http\Controllers\Dealer;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\DealerApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealerApplicationController extends Controller
{
    /**
     * Show the dealer application form.
     */
    public function showForm()
    {
        $areas = Area::orderBy('zip_code', 'asc')->get(['id', 'zip_code']);
        return Inertia::render('Dealer/Apply', [
            'areas' => $areas
        ]);
    }

    /**
     * Submit a new dealer application.
     */
    public function submit(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'business_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:dealer_applications', 'unique:users'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'area_id' => ['nullable', 'required_without:custom_zip_code'],
            'custom_zip_code' => ['nullable', 'string', 'required_without:area_id', 'max:255'],
            'custom_latitude' => ['nullable', 'numeric', 'required_without:area_id'],
            'custom_longitude' => ['nullable', 'numeric', 'required_without:area_id'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        DealerApplication::create([
            'name' => $request->name,
            'business_name' => $request->business_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country,
            'area_id' => $request->area_id === 'other' ? null : $request->area_id,
            'custom_zip_code' => $request->custom_zip_code,
            'custom_latitude' => $request->custom_latitude,
            'custom_longitude' => $request->custom_longitude,
            'message' => $request->message,
            'status' => 'pending'
        ]);

        return redirect()->back()->with('success', 'Your B2B dealer application has been submitted cleanly. Our operations team will review it and contact you soon!');
    }
}
