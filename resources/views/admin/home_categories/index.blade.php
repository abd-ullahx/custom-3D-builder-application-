@extends('admin.master')

@section('title', 'Category Cards')

@section('header', 'Category Cards Management')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-0">Category Cards</h5>
                <a href="{{ route('admin.home-categories.create') }}" class="btn btn-primary btn-sm">
                    <i class="bi bi-plus-circle me-1"></i> Add New Category
                </a>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Count/Subtitle</th>
                            <th>Gradient</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($categories as $category)
                            <tr>
                                <td class="ps-4 fw-medium">#{{ $category->id }}</td>
                                <td>
                                    <div class="rounded border overflow-hidden" style="width: 60px; height: 60px; background-color: #f1f5f9;">
                                        <img src="{{ $category->final_image_url }}" alt="Category" class="w-100 h-100 object-cover">
                                    </div>
                                </td>
                                <td class="fw-bold text-slate-800">{{ $category->name }}</td>
                                <td>
                                    <span class="badge bg-light text-dark border px-2 py-1">{{ $category->count }}</span>
                                </td>
                                <td>
                                    <code class="small text-muted">{{ $category->gradient }}</code>
                                </td>
                                <td>
                                    @if ($category->status)
                                        <span class="badge bg-success">Active</span>
                                    @else
                                        <span class="badge bg-secondary">Inactive</span>
                                    @endif
                                </td>
                                <td>{{ $category->order }}</td>
                                <td>
                                    <div class="d-flex justify-content-end gap-2 pe-4">
                                        <a href="{{ route('admin.home-categories.edit', $category->id) }}"
                                            class="btn btn-sm btn-outline-primary px-3" title="Edit">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.home-categories.destroy', $category->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this category card?');">
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
                                <td colspan="8" class="text-center py-4 text-muted">No category cards found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

        </div>
    </div>
@endsection
