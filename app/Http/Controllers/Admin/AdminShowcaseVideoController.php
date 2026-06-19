<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShowcaseVideo;
use App\Traits\FlashNotifications;
use Illuminate\Http\Request;

class AdminShowcaseVideoController extends Controller
{
    use FlashNotifications;

    /**
     * Display a listing of showcase videos.
     */
    public function index()
    {
        $videos = ShowcaseVideo::orderBy('order', 'asc')->get();
        return view('admin.showcase_videos.index', compact('videos'));
    }

    /**
     * Show the form for creating a new showcase video (Optional in pre-seeded mode).
     */
    public function create()
    {
        return view('admin.showcase_videos.create');
    }

    /**
     * Store a newly created showcase video.
     */
    public function store(Request $request)
    {
        $request->validate([
            'phase_name' => 'required|string|max:255',
            'video_file' => 'nullable|mimes:mp4,mov,ogg,qt,webm|max:20480', // Max 20MB
            'video_url' => 'nullable|string',
            'status' => 'required',
            'order' => 'required|integer',
        ]);

        $data = [
            'phase_name' => $request->phase_name,
            'video_url' => $request->video_url,
            'status' => $request->status,
            'order' => $request->order,
        ];

        if ($request->hasFile('video_file')) {
            $file = $request->file('video_file');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            if (!file_exists(public_path('videos'))) {
                mkdir(public_path('videos'), 0755, true);
            }

            $file->move(public_path('videos'), $fileName);
            $data['video_path'] = $fileName;
            $data['video_url'] = null; // Clear URL if file uploaded
        }

        ShowcaseVideo::create($data);
        $this->successNotification('Showcase Video created successfully.');

        return redirect()->route('admin.showcase-videos.index');
    }

    /**
     * Show the form for editing the specified showcase video.
     */
    public function edit($id)
    {
        $video = ShowcaseVideo::findOrFail($id);
        return view('admin.showcase_videos.edit', compact('video'));
    }

    /**
     * Update the specified showcase video in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'phase_name' => 'required|string|max:255',
            'video_file' => 'nullable|mimes:mp4,mov,ogg,qt,webm|max:20480',
            'video_url' => 'nullable|string',
            'status' => 'required',
            'order' => 'required|integer',
        ]);

        $video = ShowcaseVideo::findOrFail($id);

        $data = [
            'phase_name' => $request->phase_name,
            'video_url' => $request->video_url,
            'status' => $request->status,
            'order' => $request->order,
        ];

        if ($request->hasFile('video_file')) {
            // Delete old file
            if ($video->video_path) {
                $oldPath = public_path('videos/' . $video->video_path);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('video_file');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            if (!file_exists(public_path('videos'))) {
                mkdir(public_path('videos'), 0755, true);
            }

            $file->move(public_path('videos'), $fileName);
            $data['video_path'] = $fileName;
            $data['video_url'] = null; // Prioritize upload, clear text URL
        } elseif ($request->filled('video_url')) {
            // If direct URL is entered and no new file, clean up old file
            if ($video->video_path) {
                $oldPath = public_path('videos/' . $video->video_path);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
                $data['video_path'] = null;
            }
        }

        $video->update($data);
        $this->successNotification('Showcase Video updated successfully.');

        return redirect()->route('admin.showcase-videos.index');
    }

    /**
     * Remove the specified showcase video from storage.
     */
    public function destroy($id)
    {
        $video = ShowcaseVideo::findOrFail($id);

        if ($video->video_path) {
            $path = public_path('videos/' . $video->video_path);
            if (file_exists($path) && is_file($path)) {
                @unlink($path);
            }
        }

        $video->delete();
        $this->successNotification('Showcase Video deleted successfully.');

        return redirect()->route('admin.showcase-videos.index');
    }
}
