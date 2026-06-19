@extends('admin.master')

@section('title', 'Edit Showcase Video')

@section('header', 'Edit Showcase Video')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">Video Showcase Phase Settings</h5>
                        <a href="{{ route('admin.showcase-videos.index') }}"
                           class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-arrow-left me-1"></i> Back
                        </a>
                    </div>

                    @if($errors->any())
                        <div class="alert alert-danger">
                            <ul class="mb-0">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    @if($video->video_path)
                        <div class="mb-4 p-3 bg-light rounded border">
                            <label class="form-label fw-bold d-block">Current Video File:</label>
                            <span class="badge bg-info text-dark mb-2">
                                <i class="bi bi-file-earmark-play-fill me-1"></i> {{ $video->video_path }}
                            </span>
                            <video width="320" height="180" controls class="d-block rounded mt-1 border">
                                <source src="{{ asset('videos/' . $video->video_path) }}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    @elseif($video->video_url)
                        <div class="mb-4 p-3 bg-light rounded border">
                            <label class="form-label fw-bold d-block">Current Video URL:</label>
                            <a href="{{ $video->video_url }}" target="_blank" class="text-truncate d-inline-block mb-2 text-decoration-none" style="max-width: 100%;">
                                <i class="bi bi-link-45deg me-1"></i> {{ $video->video_url }}
                            </a>
                            <video width="320" height="180" controls class="d-block rounded mt-1 border">
                                <source src="{{ $video->video_url }}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    @endif

                    <form action="{{ route('admin.showcase-videos.update', $video->id) }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="row g-3">

                            <!-- Phase Name -->
                            <div class="col-md-12">
                                <label for="phase_name" class="form-label fw-bold">
                                    Phase / Label Name <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="phase_name"
                                       name="phase_name"
                                       value="{{ old('phase_name', $video->phase_name) }}"
                                       required>
                                <small class="text-muted">Example: Action Phase, Craft Phase</small>
                            </div>

                            <!-- Option 1: Upload File -->
                            <div class="col-md-12">
                                <label for="video_file" class="form-label fw-bold">
                                    Upload Video File
                                </label>
                                <input type="file"
                                       class="form-control"
                                       id="video_file"
                                       name="video_file"
                                       accept="video/mp4,video/ogg,video/webm">
                                <small class="text-muted">Upload a video file (MP4, WebM, OGG). <strong>Note: Uploading a file will override any URL below.</strong></small>
                            </div>

                            <div class="col-12 py-1 text-center">
                                <span class="badge bg-secondary px-3 py-2">OR</span>
                            </div>

                            <!-- Option 2: Video URL -->
                            <div class="col-md-12">
                                <label for="video_url" class="form-label fw-bold">
                                    Video URL
                                </label>
                                <input type="url"
                                       class="form-control"
                                       id="video_url"
                                       name="video_url"
                                       value="{{ old('video_url', $video->video_url) }}"
                                       placeholder="https://example.com/video.mp4">
                                <small class="text-muted">Paste a direct link to a video file hosted online. <strong>Note: Using a URL will clear any previously uploaded video file.</strong></small>
                            </div>

                            <!-- Order -->
                            <div class="col-md-6 mt-4">
                                <label for="order" class="form-label fw-bold">
                                    Order <span class="text-danger">*</span>
                                </label>
                                <input type="number"
                                       class="form-control"
                                       id="order"
                                       name="order"
                                       value="{{ old('order', $video->order) }}"
                                       required>
                            </div>

                            <!-- Status -->
                            <div class="col-md-6 mt-4">
                                <label for="status" class="form-label fw-bold">
                                    Status <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="status" name="status" required>
                                    <option value="1" {{ old('status', $video->status) == '1' ? 'selected' : '' }}>Active</option>
                                    <option value="0" {{ old('status', $video->status) == '0' ? 'selected' : '' }}>Inactive</option>
                                </select>
                            </div>

                            <!-- Submit -->
                            <div class="col-12 text-end mt-4">
                                <button type="submit" class="btn btn-primary px-4 py-2">
                                    <i class="bi bi-save me-1"></i> Save Changes
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
