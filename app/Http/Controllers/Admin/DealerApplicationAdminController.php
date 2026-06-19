<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DealerApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DealerApplicationAdminController extends Controller
{
    /**
     * Display a listing of dealer applications in admin panel.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');
        
        $query = DealerApplication::with('area')
            ->orderBy('created_at', 'desc');

        if (in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        $applications = $query->paginate(15)->withQueryString();

        return view('admin.dealer-applications.index', compact('applications', 'status'));
    }

    /**
     * Display the specified dealer application details.
     */
    public function show($id)
    {
        $application = DealerApplication::with('area')->findOrFail($id);
        return view('admin.dealer-applications.show', compact('application'));
    }

    /**
     * Approve the dealer application and generate credentials.
     */
    public function approve($id)
    {
        $application = DealerApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return redirect()->back()->with('error', 'This application has already been processed.');
        }

        try {
            $tempPassword = Str::random(8);

            DB::transaction(function () use ($application, $tempPassword) {
                // Determine or dynamically create Area if custom_zip_code is specified
                $areaId = $application->area_id;

                if (!$areaId && $application->custom_zip_code) {
                    $existingArea = \App\Models\Area::where('zip_code', trim($application->custom_zip_code))->first();
                    if ($existingArea) {
                        $areaId = $existingArea->id;
                    } else {
                        // Create a new Area dynamically with exact user coordinates!
                        $newArea = \App\Models\Area::create([
                            'name' => 'Custom Area (' . trim($application->custom_zip_code) . ')',
                            'zip_code' => trim($application->custom_zip_code),
                            'latitude' => $application->custom_latitude ?? 37.7749, 
                            'longitude' => $application->custom_longitude ?? -122.4194,
                            'status' => 'active'
                        ]);
                        $areaId = $newArea->id;
                    }
                }

                // Create the B2B storefront User record directly with role = 'dealer' and B2B attributes
                $user = \App\Models\User::create([
                    'name' => $application->name,
                    'last_name' => 'B2B Partner',
                    'email' => $application->email,
                    'password' => Hash::make($tempPassword),
                    'phone' => $application->phone,
                    'role' => 'dealer',
                    'address' => $application->address,
                    'city' => $application->city,
                    'latitude' => $application->custom_latitude ?? 37.7749,
                    'longitude' => $application->custom_longitude ?? -122.4194,
                    'status' => 'active',
                    'area_id' => $areaId,
                    'approved_at' => now(),
                ]);

                // Update application status
                $application->update([
                    'status' => 'approved',
                    'approved_at' => now()
                ]);
            });

            // Redirect back and pass password in session flash to show in blade!
            return redirect()->route('admin.dealer-applications.index')
                ->with('success', "Dealer application successfully approved! A B2B account has been created. Please share these credentials with the dealer.")
                ->with('dealer_email', $application->email)
                ->with('dealer_password', $tempPassword);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to approve application: ' . $e->getMessage());
        }
    }

    /**
     * Reject the dealer application.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => ['required', 'string', 'max:500'],
        ]);

        $application = DealerApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return redirect()->back()->with('error', 'This application has already been processed.');
        }

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason
        ]);

        return redirect()->route('admin.dealer-applications.index')
            ->with('success', 'Dealer application has been rejected cleanly.');
    }
}
