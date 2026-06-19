@extends('admin.master')

@section('title', 'Create Banner')

@section('header', 'Create Banner')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">Banner Information</h5>
                        <a href="{{ route('admin.banners.index') }}"
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

                    <form action="{{ route('admin.banners.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf

                        <div class="row g-3">

                            <!-- Image -->
                            <div class="col-md-12">
                                <label for="image" class="form-label">
                                    Image <span class="text-danger">*</span>
                                </label>
                                <input type="file"
                                       class="form-control"
                                       id="image"
                                       name="image"
                                       accept="image/*"
                                       required>
                            </div>

                            <!-- Order -->
                            <div class="col-md-6">
                                <label for="order" class="form-label">
                                    Order <span class="text-danger">*</span>
                                </label>
                                <input type="number"
                                       class="form-control"
                                       id="order"
                                       name="order"
                                       value="{{ old('order') }}"
                                       required>
                            </div>

                            <!-- Status -->
                            <div class="col-md-6">
                                <label for="status" class="form-label">
                                    Status <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="status" name="status" required>
                                    <option value="1" {{ old('status', '1') == '1' ? 'selected' : '' }}>Active</option>
                                    <option value="0" {{ old('status') == '0' ? 'selected' : '' }}>Inactive</option>
                                </select>
                            </div>

                            <!-- Submit -->
                            <div class="col-12 text-end mt-4">
                                <button type="submit" class="btn btn-primary px-4">
                                    Create Banner
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
