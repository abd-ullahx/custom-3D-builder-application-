@extends('admin.master')

@section('title', 'Order Statuses')

@section('header', 'Order Status Management')

@section('content')
<div class="container-fluid py-4">
    <!-- Header Summary row -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 fw-bold">Dynamic Order Statuses</h4>
            <small class="text-muted">Create and manage status stages that populate retail and wholesale order tracking dropdowns.</small>
        </div>
        <a href="{{ route('admin.order-statuses.create') }}" class="btn btn-primary fw-bold rounded-3 shadow-sm hover-up">
            <i class="bi bi-plus-circle me-1"></i> Add New Status
        </a>
    </div>

    <!-- Alert Messages -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <!-- Statuses table card -->
    <div class="card border-0 shadow-sm rounded-3 bg-white">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4 py-3">ID</th>
                            <th>Status Name</th>
                            <th>Badge Class</th>
                            <th>Live Preview</th>
                            <th>Created At</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($statuses as $status)
                            <tr>
                                <td class="ps-4 fw-bold text-secondary">#{{ $status->id }}</td>
                                <td class="fw-bold text-dark">{{ $status->name }}</td>
                                <td><code>bg-{{ $status->badge_color }}</code></td>
                                <td>
                                    <span class="badge bg-{{ $status->badge_color }} rounded-pill px-3 py-2 text-capitalize">
                                        {{ $status->name }}
                                    </span>
                                </td>
                                <td class="text-secondary small">
                                    {{ $status->created_at ? $status->created_at->format('M d, Y h:i A') : 'Default' }}
                                </td>
                                <td class="text-end pe-4">
                                    <div class="d-flex justify-content-end gap-2">
                                        <!-- Edit -->
                                        <a href="{{ route('admin.order-statuses.edit', $status->id) }}" class="btn btn-sm btn-outline-primary" title="Edit Status">
                                            <i class="bi bi-pencil"></i> Edit
                                        </a>

                                        <!-- Delete (protect default seeded statuses from easy accidents, but allow if desired) -->
                                        <form action="{{ route('admin.order-statuses.destroy', $status->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this status? Any order assigned this status might show the raw text name.');" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger" title="Delete Status">
                                                <i class="bi bi-trash"></i> Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-5 text-muted">
                                    <div class="mb-3">
                                        <i class="bi bi-list-task fs-1 text-secondary"></i>
                                    </div>
                                    <h5 class="fw-bold">No order statuses found</h5>
                                    <p class="small text-muted">Create custom order statuses to track your manufacturing and delivery pipelines dynamically.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    .hover-up:hover {
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
    }
</style>
@endsection
