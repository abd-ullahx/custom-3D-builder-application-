@php use Carbon\Carbon; @endphp
@extends('admin.master')

@section('title', 'Builder Models')

@section('header', 'Builder Models Management')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h5 class="card-title mb-0">Models List</h5>
                <div class="d-flex flex-column flex-md-row gap-2">
                    <a href="{{ route('admin.builder-models.create') }}" class="btn btn-primary text-nowrap">
                        <i class="bi bi-plus-circle me-1"></i> Add New
                    </a>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">#</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($models as $model)
                            <tr>
                                <td class="ps-4 fw-medium">#{{ $model->id }}</td>
                                <td>{{ $model->name }}</td>
                                <td>{{ $model->category ? $model->category->name : 'N/A' }}</td>
                                <td>
                                    @if($model->status)
                                        <span class="badge bg-success">Active</span>
                                    @else
                                        <span class="badge bg-danger">Inactive</span>
                                    @endif
                                </td>
                                <td class="small">
                                    {{ Carbon::parse($model->created_at)->isoFormat('LLL') }}
                                </td>
                                <td>
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                        <a href="{{ route('admin.builder-models.edit', $model->id) }}"
                                            class="btn btn-sm btn-outline-primary px-3 text-nowrap" title="Edit">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.builder-models.destroy', $model->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this model?');">
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
                                <td colspan="7" class="text-center py-4 text-muted">No builder models found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

        </div>
    </div>
@endsection
