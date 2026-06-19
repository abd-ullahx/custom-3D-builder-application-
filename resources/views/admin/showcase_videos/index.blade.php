@extends('admin.master')

@section('title', 'Showcase Videos')

@section('header', 'Showcase Videos Management')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-0">Showcase Videos</h5>
                <a href="{{ route('admin.showcase-videos.create') }}" class="btn btn-primary btn-sm">
                    <i class="bi bi-plus-circle me-1"></i> Add New Slot
                </a>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">#</th>
                            <th>Phase Name</th>
                            <th>Video Source</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($videos as $video)
                            <tr>
                                <td class="ps-4 fw-medium">#{{ $video->id }}</td>
                                <td class="fw-bold text-slate-800">{{ $video->phase_name }}</td>
                                <td>
                                    @if ($video->video_path)
                                        <span class="badge bg-info text-dark">
                                            <i class="bi bi-file-earmark-play-fill me-1"></i> Uploaded File: {{ $video->video_path }}
                                        </span>
                                    @elseif ($video->video_url)
                                        <a href="{{ $video->video_url }}" target="_blank" class="text-decoration-none small text-truncate d-inline-block" style="max-width: 250px;">
                                            <i class="bi bi-link-45deg me-1"></i> {{ $video->video_url }}
                                        </a>
                                    @else
                                        <span class="text-muted small">No video source set</span>
                                    @endif
                                </td>
                                <td>
                                    @if ($video->status)
                                        <span class="badge bg-success">Active</span>
                                    @else
                                        <span class="badge bg-secondary">Inactive</span>
                                    @endif
                                </td>
                                <td>{{ $video->order }}</td>
                                <td>
                                    <div class="d-flex justify-content-end gap-2 pe-4">
                                        <a href="{{ route('admin.showcase-videos.edit', $video->id) }}"
                                            class="btn btn-sm btn-outline-primary px-3" title="Edit">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.showcase-videos.destroy', $video->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this showcase video?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger px-3" title="Delete">
                                                <i class="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">No showcase video slots found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

        </div>
    </div>
@endsection
