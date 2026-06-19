<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Traits\FlashNotifications;
use Illuminate\Http\Request;

class AdminAreaController extends Controller
{
    use FlashNotifications;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Area::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('zip_code', 'like', "%{$search}%");
        }

        $areas = $query->paginate(20)->withQueryString();

        return view('admin.areas.index', compact('areas'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.areas.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'zip_code'  => 'required|string|max:20|unique:areas,zip_code',
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ], [
            'zip_code.unique'       => 'This ZIP code already exists.',
            'latitude.between'      => 'Latitude must be between -90 and 90.',
            'longitude.between'     => 'Longitude must be between -180 and 180.',
        ]);

        try {
            Area::create($request->only('zip_code', 'latitude', 'longitude'));
            $this->successNotification('Area created successfully.');
        } catch (\Exception $e) {
            $this->errorNotification('Failed to create area: ' . $e->getMessage());
            return back()->withInput();
        }

        return to_route('admin.areas.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $area = Area::findOrFail($id);

        return view('admin.areas.edit', compact('area'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Area $area)
    {
        $request->validate([
            'zip_code'  => 'required|string|max:20|unique:areas,zip_code,' . $area->id,
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ], [
            'zip_code.unique'       => 'This ZIP code already exists.',
            'latitude.between'      => 'Latitude must be between -90 and 90.',
            'longitude.between'     => 'Longitude must be between -180 and 180.',
        ]);

        try {
            $area->update($request->only('zip_code', 'latitude', 'longitude'));
            $this->successNotification('Area updated successfully.');
        } catch (\Exception $e) {
            $this->errorNotification('Failed to update area: ' . $e->getMessage());
            return back()->withInput();
        }

        return back();
    }

    public function destroy(Area $area)
    {
        $area->delete();

        return redirect()->route('admin.areas.index')
            ->with('success', 'Area deleted successfully.');
    }
}
