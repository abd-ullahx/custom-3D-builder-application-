@extends('admin.master')

@section('title', 'Update Dealer')

@section('header', 'Update Dealer')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">Dealer Information</h5>
                        <a href="{{ route('admin.dealers.index') }}"
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

                    <form action="{{ route('admin.dealers.update', $dealer->id) }}" method="POST">
                        @csrf
                        @method('PATCH')

                        <div class="row g-3">

                            <!-- Name -->
                            <div class="col-md-6">
                                <label for="name" class="form-label">
                                    Name <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="name"
                                       name="name"
                                       value="{{ old('name', $dealer->name) }}"
                                       required>
                            </div>

                            <!-- Phone -->
                            <div class="col-md-6">
                                <label for="phone" class="form-label">
                                    Phone
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="phone"
                                       name="phone"
                                       value="{{ old('phone', $dealer->phone) }}">
                            </div>

                            <!-- Email -->
                            <div class="col-md-6">
                                <label for="email" class="form-label">
                                    Email
                                </label>
                                <input type="email"
                                       class="form-control"
                                       id="email"
                                       name="email"
                                       value="{{ old('email', $dealer->email) }}">
                            </div>

                            <!-- City -->
                            <div class="col-md-6">
                                <label for="city" class="form-label">
                                    City
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="city"
                                       name="city"
                                       value="{{ old('city', $dealer->city) }}">
                            </div>

                            <!-- Address -->
                            <div class="col-12">
                                <label for="address" class="form-label">
                                    Address
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="address"
                                       name="address"
                                       value="{{ old('address', $dealer->address) }}">
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
                                       value="{{ old('latitude', $dealer->latitude) }}"
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
                                       value="{{ old('longitude', $dealer->longitude) }}"
                                       required>
                            </div>

                            <!-- Status -->
                            <div class="col-md-4">
                                <label for="status" class="form-label">
                                    Status <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="status" name="status" required>
                                    <option value="active" {{ old('status', $dealer->status) == 'active' ? 'selected' : '' }}>Active</option>
                                    <option value="inactive" {{ old('status', $dealer->status) == 'inactive' ? 'selected' : '' }}>Inactive</option>
                                </select>
                            </div>

                            <!-- Submit -->
                            <div class="col-12 text-end mt-4">
                                <button type="submit" class="btn btn-primary px-4">
                                    Update Dealer
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
