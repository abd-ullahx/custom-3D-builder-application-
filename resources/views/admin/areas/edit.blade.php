@extends('admin.master')

@section('title', 'Update Area')

@section('header', 'Update Area')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">Area Information</h5>
                        <a href="{{ route('admin.areas.index') }}"
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

                    <form action="{{ route('admin.areas.update', $area->id) }}" method="POST">
                        @csrf
                        @method('PATCH')

                        <div class="row g-3">

                            <!-- Zip Code -->
                            <div class="col-md-4">
                                <label for="zip_code" class="form-label">
                                    Zip Code <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="zip_code"
                                       name="zip_code"
                                       value="{{ old('zip_code', $area->zip_code) }}"
                                       required>
                            </div>

                            <!-- Latitude -->
                            <div class="col-md-4">
                                <label for="latitude" class="form-label">
                                    Latitude <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="latitude"
                                       name="latitude"
                                       value="{{ old('latitude', $area->latitude) }}"
                                       required>
                            </div>

                            <!-- Longitude -->
                            <div class="col-md-4">
                                <label for="longitude" class="form-label">
                                    Longitude <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="longitude"
                                       name="longitude"
                                       value="{{ old('longitude', $area->longitude) }}"
                                       required>
                            </div>

                            <!-- Submit -->
                            <div class="col-12 text-end mt-4">
                                <button type="submit" class="btn btn-primary px-4">
                                    Update Area
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection