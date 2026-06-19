@extends('admin.master')

@section('title', 'Create Showcase Video')

@section('header', 'Create Showcase Video')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">New Showcase Video Slot</h5>
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

                    <form action="{{ route('admin.showcase-videos.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf

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
                                       value="{{ old('phase_name') }}"
                                       required>
                                <small class="text-muted">Example: Action Phase, Craft Phase</small>
                            </div>

                            <!-- Option 1: Upload Video -->
                            <div class="col-md-12">
                                <label for="video_file" class="form-label fw-bold">
                                    Upload Video File
                                </label>
                                <input type="file"
                                       class="form-control"
                                       id="video_file"
                                       name="video_file"
                                       accept="video/mp4,video/ogg,video/webm">
                                <small class="text-muted">Upload a video file (MP4, WebM, OGG).</small>
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
                                       value="{{ old('video_url') }}"
                                       placeholder="https://example.com/video.mp4">
                                <small class="text-muted">Or paste a direct link to a video file hosted online.</small>
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
                                       value="{{ old('order', '1') }}"
                                       required>
                            </div>

                            <!-- Status -->
                            <div class="col-md-6 mt-4">
                                <label for="status" class="form-label fw-bold">
                                    Status <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="status" name="status" required>
                                    <option value="1" {{ old('status', '1') == '1' ? 'selected' : '' }}>Active</option>
                                    <option value="0" {{ old('status') == '0' ? 'selected' : '' }}>Inactive</option>
                                </select>
                            </div>

                            <!-- Submit -->
                            <div class="col-12 text-end mt-4">
                                <button type="submit" class="btn btn-primary px-4 py-2">
                                    <i class="bi bi-plus-circle me-1"></i> Create Video Slot
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
