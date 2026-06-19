@extends('admin.master')

@section('title', 'Create Order Status')

@section('header', 'Add New Status Stage')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 fw-bold">Create Order Status</h4>
            <small class="text-muted">Define a new order processing state with custom status names and color themes.</small>
        </div>
        <a href="{{ route('admin.order-statuses.index') }}" class="btn btn-light border fw-bold rounded-3">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger alert-dismissible fade show mb-4 shadow-sm" role="alert">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="card border-0 shadow-sm rounded-3 bg-white">
        <div class="card-body p-4">
            <form action="{{ route('admin.order-statuses.store') }}" method="POST">
                @csrf

                <div class="row g-4">
                    <!-- Status Name -->
                    <div class="col-md-6">
                        <label for="name" class="form-label fw-semibold text-secondary">Status Name <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-tag-fill"></i></span>
                            <input type="text" 
                                   class="form-control border-start-0 ps-0 bg-light-focus font-monospace text-capitalize" 
                                   id="name" 
                                   name="name" 
                                   placeholder="e.g. Packaging, On Hold" 
                                   value="{{ old('name') }}" 
                                   required 
                                   maxlength="100">
                        </div>
                        <small class="text-muted mt-1 d-block">This is the title that will show up in order status dropdowns.</small>
                    </div>

                    <!-- Badge Theme Color -->
                    <div class="col-md-6">
                        <label for="badge_color" class="form-label fw-semibold text-secondary">Badge Visual Theme <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-palette-fill"></i></span>
                            <select class="form-select border-start-0 ps-0 bg-light-focus" id="badge_color" name="badge_color" required>
                                <option value="primary" {{ old('badge_color') === 'primary' ? 'selected' : '' }}>Primary Blue</option>
                                <option value="secondary" {{ old('badge_color') === 'secondary' ? 'selected' : '' }}>Secondary Grey</option>
                                <option value="success" {{ old('badge_color') === 'success' ? 'selected' : '' }}>Success Green</option>
                                <option value="danger" {{ old('badge_color') === 'danger' ? 'selected' : '' }}>Danger Red</option>
                                <option value="warning" {{ old('badge_color') === 'warning' ? 'selected' : '' }}>Warning Yellow</option>
                                <option value="info" {{ old('badge_color') === 'info' ? 'selected' : '' }}>Info Cyan</option>
                                <option value="dark" {{ old('badge_color') === 'dark' ? 'selected' : '' }}>Dark Charcoal</option>
                            </select>
                        </div>
                        <small class="text-muted mt-1 d-block">Selects the Bootstrap theme color representing this status badge.</small>
                    </div>
                </div>

                <div class="mt-5 border-t pt-4">
                    <button type="submit" class="btn btn-primary fw-bold px-4 py-2.5 rounded-3 shadow-sm hover-up">
                        <i class="bi bi-check-circle me-1"></i> Save Order Status
                    </button>
                    <a href="{{ route('admin.order-statuses.index') }}" class="btn btn-light border fw-bold px-4 py-2.5 rounded-3 ms-2">
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    .bg-light-focus:focus {
        background-color: #fff !important;
        border-color: #86b7fe !important;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
    }
    .hover-up:hover {
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
    }
    .font-monospace {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }
</style>
@endsection
