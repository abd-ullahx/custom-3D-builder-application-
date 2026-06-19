@extends('admin.master')

@section('title', 'Dealer Applications')

@section('header', 'B2B Dealer Applications')

@section('content')
    <!-- Filter Tabs -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="btn-group" role="group">
            <a href="{{ route('admin.dealer-applications.index', ['status' => 'pending']) }}" 
               class="btn btn-sm {{ $status === 'pending' ? 'btn-primary' : 'btn-outline-secondary' }} px-4 py-2">
                Pending Reviews
            </a>
            <a href="{{ route('admin.dealer-applications.index', ['status' => 'approved']) }}" 
               class="btn btn-sm {{ $status === 'approved' ? 'btn-primary' : 'btn-outline-secondary' }} px-4 py-2">
                Approved Partners
            </a>
            <a href="{{ route('admin.dealer-applications.index', ['status' => 'rejected']) }}" 
               class="btn btn-sm {{ $status === 'rejected' ? 'btn-primary' : 'btn-outline-secondary' }} px-4 py-2">
                Rejected Applications
            </a>
        </div>
    </div>

    <!-- Alert Messages -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ session('success') }}
            @if(session('dealer_email') && session('dealer_password'))
                <div class="mt-3 p-3 bg-white rounded border border-success">
                    <h6 class="fw-bold text-dark mb-2">Temporary Wholesale Account Credentials:</h6>
                    <p class="mb-1 text-slate-700"><strong>Portal URL:</strong> <a href="{{ route('dealer.login') }}" target="_blank">{{ route('dealer.login') }}</a></p>
                    <p class="mb-1 text-slate-700"><strong>Username/Email:</strong> <code>{{ session('dealer_email') }}</code></p>
                    <p class="mb-0 text-slate-700"><strong>Temporary Password:</strong> <code>{{ session('dealer_password') }}</code></p>
                    <small class="text-muted d-block mt-2"><i class="bi bi-exclamation-triangle-fill text-warning me-1"></i> Please copy and share these details immediately. The password will not be shown again.</small>
                </div>
            @endif
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

    <!-- Applications Log Card -->
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white mb-4">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light text-muted small text-uppercase">
                    <tr>
                      <th class="ps-4 py-3">Business / Company</th>
                      <th class="py-3">Representative</th>
                      <th class="py-3">Email & Phone</th>
                      <th class="py-3">Area ZIP</th>
                      <th class="py-3">Status</th>
                      <th class="py-3">Submission Date</th>
                      <th class="text-end pe-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @forelse($applications as $app)
                        <tr>
                            <td class="ps-4 py-3">
                                <div class="fw-bold text-dark">{{ $app->business_name }}</div>
                                <small class="text-muted">{{ $app->city }}, {{ $app->country }}</small>
                            </td>
                            <td>
                                <div class="fw-bold text-slate-800">{{ $app->name }}</div>
                            </td>
                            <td>
                                <div class="text-dark small">{{ $app->email }}</div>
                                <small class="text-muted">{{ $app->phone }}</small>
                            </td>
                            <td>
                                @if($app->area)
                                    <span class="badge bg-light text-indigo-700 border border-indigo-100 rounded px-2.5 py-1.5 fw-bold">
                                        ZIP {{ $app->area->zip_code }}
                                    </span>
                                @elseif($app->custom_zip_code)
                                    <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded px-2.5 py-1.5 fw-bold">
                                        ZIP {{ $app->custom_zip_code }}*
                                    </span>
                                @else
                                    <span class="badge bg-light text-muted border rounded px-2.5 py-1.5 fw-bold">
                                        N/A
                                    </span>
                                @endif
                            </td>
                            <td>
                                @if($app->status === 'pending')
                                    <span class="badge bg-warning text-dark rounded-pill px-3 py-2 text-uppercase font-bold" style="font-size: 10px;">Pending</span>
                                @elseif($app->status === 'approved')
                                    <span class="badge bg-success text-white rounded-pill px-3 py-2 text-uppercase font-bold" style="font-size: 10px;">Approved</span>
                                @else
                                    <span class="badge bg-danger text-white rounded-pill px-3 py-2 text-uppercase font-bold" style="font-size: 10px;">Rejected</span>
                                @endif
                            </td>
                            <td class="text-secondary small">
                                {{ $app->created_at->format('M d, Y h:i A') }}
                            </td>
                            <td class="text-end pe-4">
                                <a href="{{ route('admin.dealer-applications.show', $app->id) }}" 
                                   class="btn btn-sm btn-light border fw-semibold">
                                    Review Application <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-5 text-muted">
                                <i class="bi bi-handshake fs-2 d-block mb-3 text-secondary opacity-50"></i>
                                <span class="fw-bold">No B2B dealer applications found matching status "{{ $status }}".</span>
                            </td>
                        </tr>
                    @endforelse
                  </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center">
        {{ $applications->links() }}
    </div>
@endsection
