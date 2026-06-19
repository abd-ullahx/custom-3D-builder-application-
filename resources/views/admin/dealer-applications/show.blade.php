@extends('admin.master')

@section('title', 'Review Application')

@section('header', 'Review Dealer Application')

@section('content')
    <div class="mb-4">
        <a href="{{ route('admin.dealer-applications.index') }}" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-chevron-left me-1"></i> Back to Applications
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

    @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-exclamation-circle-fill me-2"></i>
            {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="row g-4">
        <!-- Main Application Details -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">Business & Contact Profile</h5>
                
                <div class="row g-4">
                    <!-- Business Name -->
                    <div class="col-md-6">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">Business Name</small>
                        <h6 class="fw-bold text-dark mb-0">{{ $application->business_name }}</h6>
                    </div>
                    
                    <!-- Rep Name -->
                    <div class="col-md-6">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">Representative Name</small>
                        <h6 class="fw-bold text-dark mb-0">{{ $application->name }}</h6>
                    </div>

                    <!-- Email -->
                    <div class="col-md-6">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">Email Address</small>
                        <h6 class="fw-bold text-indigo-700 mb-0">{{ $application->email }}</h6>
                    </div>

                    <!-- Phone -->
                    <div class="col-md-6">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">Phone Number</small>
                        <h6 class="fw-bold text-dark mb-0">{{ $application->phone }}</h6>
                    </div>

                    <!-- City & Country -->
                    <div class="col-md-6">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">City & Country</small>
                        <h6 class="fw-bold text-dark mb-0">{{ $application->city }}, {{ $application->country }}</h6>
                    </div>

                    <!-- ZIP Area -->
                    <div class="col-md-6">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1" style="font-size: 11px; letter-spacing: 0.5px;">Mapped Area ZIP</small>
                        <h6 class="mb-0">
                            @if($application->area)
                                <span class="badge bg-light text-indigo-700 border border-indigo-100 rounded px-2.5 py-1.5 fw-bold" style="font-size: 13px;">
                                    ZIP {{ $application->area->zip_code }}
                                </span>
                            @elseif($application->custom_zip_code)
                                <div class="d-flex flex-column gap-1">
                                    <div>
                                        <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded px-2.5 py-1.5 fw-bold" style="font-size: 13px;">
                                            ZIP {{ $application->custom_zip_code }} (Custom Area)
                                        </span>
                                    </div>
                                    <div class="small text-muted font-monospace mt-1" style="font-size: 11px;">
                                        <strong>Lat:</strong> {{ $application->custom_latitude }} | <strong>Long:</strong> {{ $application->custom_longitude }}
                                    </div>
                                </div>
                            @else
                                <span class="badge bg-light text-muted border rounded px-2.5 py-1.5 fw-bold" style="font-size: 13px;">
                                    N/A
                                </span>
                            @endif
                        </h6>
                    </div>

                    <!-- Store Address -->
                    <div class="col-12 border-top pt-3">
                        <small class="text-muted d-block text-uppercase fw-semibold mb-1.5" style="font-size: 11px; letter-spacing: 0.5px;">Physical Store / Corporate Address</small>
                        <p class="text-dark fw-medium mb-0 bg-light p-3 rounded border" style="line-height: 1.6;">
                            {{ $application->address }}
                        </p>
                    </div>

                    <!-- Message -->
                    @if($application->message)
                        <div class="col-12 pt-2">
                            <small class="text-muted d-block text-uppercase fw-semibold mb-1.5" style="font-size: 11px; letter-spacing: 0.5px;">Wholesale Intention message</small>
                            <p class="text-secondary fw-semibold mb-0 bg-light p-3 rounded border italic" style="line-height: 1.6;">
                                "{{ $application->message }}"
                            </p>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Action Panel -->
        <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">Application Process</h5>

                @if($application->status === 'pending')
                    <div class="space-y-4">
                        <div class="alert alert-info border-0 rounded-3 text-xs fw-semibold mb-4 leading-relaxed">
                            <i class="bi bi-info-circle-fill me-1"></i> Please review their address and business details before approval. Approving will automatically generate B2B active credentials.
                        </div>

                        <!-- Approve trigger -->
                        <form action="{{ route('admin.dealer-applications.approve', $application->id) }}" method="POST" class="mb-4">
                            @csrf
                            <button type="submit" class="btn btn-success w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1">
                                <i class="bi bi-check-lg fs-5"></i> Approve & Activate Partner
                            </button>
                        </form>

                        <!-- Reject trigger -->
                        <div class="border-top pt-4">
                            <h6 class="fw-bold text-dark mb-3 uppercase tracking-wider small">Reject Wholesale Request</h6>
                            <form action="{{ route('admin.dealer-applications.reject', $application->id) }}" method="POST">
                                @csrf
                                <div class="mb-3">
                                    <label class="form-label text-xs font-bold text-muted uppercase">Reason for Rejection</label>
                                    <textarea name="rejection_reason" required class="form-control rounded-xl text-xs py-2 px-3 border-slate-200" rows="3" placeholder="Explain missing business credentials or out of bounds coverage area..."></textarea>
                                    @error('rejection_reason')
                                        <p class="text-xs text-danger mt-1">{{ $message }}</p>
                                    @enderror
                                </div>
                                <button type="submit" class="btn btn-outline-danger w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-1">
                                    <i class="bi bi-x-lg fs-5"></i> Reject Application
                                </button>
                            </form>
                        </div>
                    </div>
                @elseif($application->status === 'approved')
                    <div class="text-center py-4">
                        <div class="w-16 h-16 rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px; font-size: 24px;">
                            <i class="bi bi-check2-circle"></i>
                        </div>
                        <h6 class="fw-bold text-success mb-1">Partner Approved</h6>
                        <small class="text-muted d-block uppercase tracking-wider small fw-bold">Activated B2B Store</small>
                        <p class="text-secondary small mt-3 px-3">Approved on <strong>{{ $application->approved_at ? $application->approved_at->format('M d, Y h:i A') : $application->updated_at->format('M d, Y') }}</strong>.</p>
                    </div>
                @else
                    <div class="text-center py-4">
                        <div class="w-16 h-16 rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px; font-size: 24px;">
                            <i class="bi bi-x-circle"></i>
                        </div>
                        <h6 class="fw-bold text-danger mb-1">Request Rejected</h6>
                        <small class="text-muted d-block uppercase tracking-wider small fw-bold">Rejected Wholesale</small>
                        
                        <div class="text-start mt-4 bg-light p-3 rounded border">
                            <strong class="block text-xs uppercase tracking-wide text-muted font-bold mb-1">Reason for Rejection:</strong>
                            <p class="text-xs text-secondary mb-0 leading-relaxed">"{{ $application->rejection_reason }}"</p>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection
