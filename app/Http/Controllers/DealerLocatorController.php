<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealerLocatorController extends Controller
{

public function index(Request $request)
{
    $zip      = $request->input('zip');
    $distance = $request->input('distance', 50);

    // Fetch all registered areas for frontend ZIP autocomplete
    $areas = Area::all(['zip_code', 'latitude', 'longitude']);

    $flashError = null;
    $exactMatch = false;
    $dealers = collect([]);

    if ($zip) {

        // Find searched ZIP in areas table
        $searchedArea = Area::where('zip_code', $zip)->first();

        if ($searchedArea) {

            $dealers = User::where('role', 'dealer')
                ->where('status', 'active')
                ->selectRaw("
                    *,
                    (
                        6371 * acos(
                            cos(radians(?))
                            * cos(radians(latitude))
                            * cos(radians(longitude) - radians(?))
                            + sin(radians(?))
                            * sin(radians(latitude))
                        )
                    ) AS distance
                ", [
                    $searchedArea->latitude,
                    $searchedArea->longitude,
                    $searchedArea->latitude,
                ])
                ->having('distance', '<=', $distance)
                ->orderBy('distance', 'asc')
                ->get();

            if ($dealers->isNotEmpty()) {
                $exactMatch = true;
            } else {
                $flashError = "No dealer found within {$distance} KM of this ZIP code.";
            }

        } else {
            $flashError = "ZIP code not found in our directory!";
        }
    }

    return Inertia::render('DealerLocator', [
        'dealers'          => $dealers,
        'areas'            => $areas,
        'searchedZip'      => $zip,
        'searchedDistance' => (int) $distance,
        'flashError'       => $flashError,
        'nearestFallback'  => false,
        'exactMatch'       => $exactMatch,
    ]);
}
}
