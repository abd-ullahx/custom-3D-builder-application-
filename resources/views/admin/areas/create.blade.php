@extends('admin.master')

@section('title', 'Create Area')

@section('header', 'Create Area')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">Area Information</h5>
                        <a href="{{ route('admin.areas.index') }}" class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-arrow-left me-1"></i> Back
                        </a>
                    </div>

                    <form action="{{ route('admin.areas.store') }}" method="POST">
                        @csrf

                        <div class="row g-3">

                            {{-- Zip Code --}}
                            <div class="col-md-4">
                                <label for="zip_code" class="form-label">
                                    Zip Code <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control @error('zip_code') is-invalid @enderror"
                                       id="zip_code" name="zip_code"
                                       value="{{ old('zip_code') }}"
                                       placeholder="e.g. 51310"
                                       required>
                                @error('zip_code')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            {{-- Latitude --}}
                            <div class="col-md-4">
                                <label for="latitude" class="form-label">
                                    Latitude <span class="text-danger">*</span>
                                    <small class="text-muted">(-90 to 90)</small>
                                </label>
                                <input type="number"
                                       class="form-control @error('latitude') is-invalid @enderror"
                                       id="latitude" name="latitude"
                                       value="{{ old('latitude') }}"
                                       placeholder="e.g. 32.5726"
                                       step="any" min="-90" max="90"
                                       required>
                                @error('latitude')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            {{-- Longitude --}}
                            <div class="col-md-4">
                                <label for="longitude" class="form-label">
                                    Longitude <span class="text-danger">*</span>
                                    <small class="text-muted">(-180 to 180)</small>
                                </label>
                                <input type="number"
                                       class="form-control @error('longitude') is-invalid @enderror"
                                       id="longitude" name="longitude"
                                       value="{{ old('longitude') }}"
                                       placeholder="e.g. 74.5323"
                                       step="any" min="-180" max="180"
                                       required>
                                @error('longitude')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            {{-- Helper info --}}
                            <div class="col-12">
                                <div class="alert alert-info py-2 px-3 d-flex align-items-center gap-2 mb-0" style="font-size:0.82rem;">
                                    <i class="bi bi-info-circle-fill"></i>
                                    <span>You can get lat/lng from <a href="https://maps.google.com" target="_blank">Google Maps</a> — right-click on a location and copy the coordinates.</span>
                                </div>
                            </div>

                            {{-- Submit --}}
                            <div class="col-12 text-end mt-2">
                                <button type="submit" class="btn btn-primary px-4">
                                    <i class="bi bi-plus-circle me-1"></i> Create Area
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
