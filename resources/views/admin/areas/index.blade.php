@php use Carbon\Carbon; @endphp
@extends('admin.master')

@section('title', 'Areas')

@section('header', 'Areas Management')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h5 class="card-title mb-0">Areas List</h5>
                <div class="d-flex flex-column flex-md-row gap-2">
                    <form action="{{ route('admin.areas.index') }}" method="GET"
                        class="d-flex flex-column flex-md-row gap-2">
                        <div class="input-group">
                            <input type="text" name="search" class="form-control" placeholder="Search zip code..."
                                value="{{ request('search') }}">
                            <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                            @if (request('search'))
                                <a href="{{ route('admin.areas.index') }}" class="btn btn-outline-danger"
                                    title="Clear Filters">
                                    <i class="bi bi-x-lg"></i>
                                </a>
                            @endif
                        </div>
                    </form>
                    <a href="{{ route('admin.areas.create') }}" class="btn btn-primary text-nowrap">
                        <i class="bi bi-plus-circle me-1"></i> Add New
                    </a>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">#</th>
                            <th>Zip Code</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Created At</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($areas as $area)
                            <tr>
                                <td class="ps-4 fw-medium">#{{ $area->id }}</td>
                                <td>{{ $area->zip_code }}</td>
                                <td>{{ $area->latitude }}</td>
                                <td>{{ $area->longitude }}</td>
                                <td class="small">
                                    {{ Carbon::parse($area->created_at)->isoFormat('LLL') }}
                                </td>
                                <td>
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                        <a href="{{ route('admin.areas.edit', $area->id) }}"
                                            class="btn btn-sm btn-outline-primary px-3 text-nowrap" title="Edit">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.areas.destroy', $area->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this area?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                class="btn btn-sm btn-outline-danger px-3 w-100 text-nowrap" title="Delete">
                                                <i class="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center py-4 text-muted">No areas found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $areas->links() }}
            </div>
        </div>
    </div>
@endsection
