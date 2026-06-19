<?php

namespace App\Http\Controllers;

use App\Models\HomeBanner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\ShowcaseVideo;
use App\Models\HomeCategory;
use App\Traits\ImageOptimizer;

class HomeController extends Controller
{
    use ImageOptimizer;
    /**
     * Render the home page for storefront with active banners.
     */
    public function getHomeBanners()
    {
        try {
            $banners = HomeBanner::where('status', 1)->orderBy('order', 'asc')->get();
            
            $showcaseVideos = ShowcaseVideo::where('status', 1)
                ->orderBy('order', 'asc')
                ->get()
                ->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'phase_name' => $video->phase_name,
                        'video_url' => $video->final_video_url,
                    ];
                });

            $homeCategories = HomeCategory::where('status', 1)
                ->orderBy('order', 'asc')
                ->get()
                ->map(function ($cat) {
                    return [
                        'id' => $cat->id,
                        'name' => $cat->name,
                        'count' => $cat->count,
                        'gradient' => $cat->gradient,
                        'image' => $cat->final_image_url,
                    ];
                });

            return Inertia::render('Home', [
                'banners' => $banners,
                'showcaseVideos' => $showcaseVideos,
                'homeCategories' => $homeCategories,
            ]);
        } catch (\Throwable $th) {
            $error = $th->getMessage();
            return Inertia::render('Home', [
                'error' => $error,
                'banners' => [],
                'showcaseVideos' => [],
                'homeCategories' => [],
            ]);
        }
    }

    /**
     * Alias method mapping for front-end routes calling getBannersForFrontend.
     */
    public function getBannersForFrontend()
    {
        return $this->getHomeBanners();
    }

    /**
     * Return active banners as JSON.
     */
    public function GetBanner()
    {
        try {
            $banners = HomeBanner::where('status', 1)->orderBy('order', 'asc')->get();
            return response()->json($banners);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display a listing of banners in the admin panel.
     */
    public function index(Request $request)
    {
        try {
            $query = HomeBanner::query()->orderBy('order', 'asc');

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            $banners = $query->get();

            return view('admin.banners.index', compact('banners'));
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    /**
     * Show the form for creating a new banner in the admin panel.
     */
    public function create()
    {
        return view('admin.banners.create');
    }

    /**
     * Store a newly created banner in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
                'status' => 'required',
                'order' => 'required|integer',
            ]);

            $image = $request->file('image');
            $imageName = $this->optimizeAndSave($image, public_path('images'), false);

            HomeBanner::create([
                'image' => $imageName,
                'status' => $request->status,
                'order' => $request->order,
            ]);

            return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully');
        } catch (\Throwable $th) {
            return redirect()->back()->withInput()->with('error', $th->getMessage());
        }
    }

    /**
     * Show the form for editing the specified banner in the admin panel.
     */
    public function edit($id)
    {
        try {
            $banner = HomeBanner::findOrFail($id);
            return view('admin.banners.edit', compact('banner'));
        } catch (\Throwable $th) {
            return redirect()->route('admin.banners.index')->with('error', 'Banner not found');
        }
    }

    /**
     * Update the specified banner in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'status' => 'required',
                'order' => 'required|integer',
            ]);

            $banner = HomeBanner::findOrFail($id);
            $data = [
                'status' => $request->status,
                'order' => $request->order,
            ];

            if ($request->hasFile('image')) {
                // Delete the old file if it exists to clean up disk space
                $oldImagePath = public_path('images/' . $banner->image);
                if (file_exists($oldImagePath) && is_file($oldImagePath)) {
                    @unlink($oldImagePath);
                }

                $image = $request->file('image');
                $imageName = $this->optimizeAndSave($image, public_path('images'), false);
                $data['image'] = $imageName;
            }

            $banner->update($data);

            return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully');
        } catch (\Throwable $th) {
            return redirect()->back()->withInput()->with('error', $th->getMessage());
        }
    }

    /**
     * Update the specified banner in storage via a legacy method.
     */
    public function EditBanner(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required',
                'status' => 'required',
                'order' => 'required|integer',
            ]);

            DB::transaction(function () use ($request) {
                $banner = HomeBanner::findOrFail($request->id);
                $banner->update([
                    'status' => $request->status,
                    'order' => $request->order,
                ]);
            });

            return redirect()->back()->with('success', 'Banner updated successfully');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    /**
     * Remove the specified banner from storage.
     */
    public function destroy($id)
    {
        try {
            $banner = HomeBanner::findOrFail($id);
            
            // Delete physical image file
            $imagePath = public_path('images/' . $banner->image);
            if (file_exists($imagePath) && is_file($imagePath)) {
                @unlink($imagePath);
            }

            $banner->delete();

            return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }
}
