@extends('admin.master')

@section('title', 'Admin Profile Settings')

@section('header', 'Profile Settings')

@section('content')
<div class="container-fluid py-4">
    <div class="row g-4">
        <!-- Profile details column -->
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3 bg-white h-100">
                <div class="card-header bg-white border-0 py-3 border-bottom">
                    <h5 class="mb-0 fw-bold"><i class="bi bi-person-gear text-primary me-2"></i>Profile Information</h5>
                    <small class="text-muted">Update your administrative name and account email address.</small>
                </div>
                <div class="card-body p-4">
                    @if ($errors->any() && !$errors->has('current_password') && !$errors->has('password'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif

                    <form action="{{ route('admin.profile.update') }}" method="POST">
                        @csrf
                        @method('PUT')

                        <div class="mb-3">
                            <label for="name" class="form-label fw-semibold text-secondary">Full Name</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted border-end-0"><i class="bi bi-person"></i></span>
                                <input type="text" class="form-control border-start-0 ps-0 bg-light-focus" id="name" name="name" value="{{ old('name', $admin->name) }}" required>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="email" class="form-label fw-semibold text-secondary">Email Address</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted border-end-0"><i class="bi bi-envelope"></i></span>
                                <input type="email" class="form-control border-start-0 ps-0 bg-light-focus" id="email" name="email" value="{{ old('email', $admin->email) }}" required>
                            </div>
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary fw-bold py-2 rounded-3 shadow-sm hover-up">
                                <i class="bi bi-check-circle me-1"></i> Save Profile Details
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Password change column -->
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3 bg-white h-100">
                <div class="card-header bg-white border-0 py-3 border-bottom">
                    <h5 class="mb-0 fw-bold"><i class="bi bi-shield-lock text-warning me-2"></i>Security & Password</h5>
                    <small class="text-muted">Ensure your account is using a long, random password to stay secure.</small>
                </div>
                <div class="card-body p-4">
                    @if ($errors->has('current_password') || $errors->has('password'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <ul class="mb-0">
                                @if($errors->has('current_password'))
                                    <li>{{ $errors->first('current_password') }}</li>
                                @endif
                                @if($errors->has('password'))
                                    <li>{{ $errors->first('password') }}</li>
                                @endif
                            </ul>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif

                    <form action="{{ route('admin.profile.password') }}" method="POST">
                        @csrf
                        @method('PUT')

                        <div class="mb-3">
                            <label for="current_password" class="form-label fw-semibold text-secondary">Current Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted border-end-0"><i class="bi bi-lock"></i></span>
                                <input type="password" class="form-control border-start-0 ps-0 bg-light-focus" id="current_password" name="current_password" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label fw-semibold text-secondary">New Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted border-end-0"><i class="bi bi-key"></i></span>
                                <input type="password" class="form-control border-start-0 ps-0 bg-light-focus" id="password" name="password" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="password_confirmation" class="form-label fw-semibold text-secondary">Confirm New Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted border-end-0"><i class="bi bi-shield-check"></i></span>
                                <input type="password" class="form-control border-start-0 ps-0 bg-light-focus" id="password_confirmation" name="password_confirmation" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-warning fw-bold py-2 rounded-3 text-dark shadow-sm hover-up">
                                <i class="bi bi-shield-check me-1"></i> Update Security Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
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
</style>
@endsection
