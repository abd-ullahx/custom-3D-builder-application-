@php use Carbon\Carbon; @endphp

@extends('admin.master')

@section('title', 'Contact Queries')

@section('header', 'Storefront Enquiries')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h5 class="card-title mb-0">Contact Messages</h5>
                <div class="d-flex flex-column flex-md-row gap-2">
                    <form action="{{ route('admin.contact-queries.index') }}" method="GET"
                        class="d-flex flex-column flex-md-row gap-2">
                        <div class="input-group">
                            <input type="text" name="search" class="form-control"
                                placeholder="Search sender name, email, subject..." value="{{ request('search') }}">
                            <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                            @if (request('search'))
                                <a href="{{ route('admin.contact-queries.index') }}" class="btn btn-outline-danger"
                                    title="Clear Search">
                                    <i class="bi bi-x-lg"></i>
                                </a>
                            @endif
                        </div>
                    </form>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">#</th>
                            <th>Sender</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Received At</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($contactQueries as $query)
                            <tr>
                                <td class="ps-4 fw-medium">#{{ $query->id }}</td>
                                <td class="fw-semibold text-slate-800">{{ $query->name }}</td>
                                <td>
                                    <a href="mailto:{{ $query->email }}" class="text-decoration-none text-primary">
                                        {{ $query->email }}
                                    </a>
                                </td>
                                <td>{{ $query->subject ?? 'N/A' }}</td>
                                <td class="small text-muted">
                                    {{ Carbon::parse($query->created_at)->isoFormat('LLL') }}
                                </td>
                                <td>
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                        <!-- View Trigger button for modal -->
                                        <button type="button" 
                                            class="btn btn-sm btn-outline-info px-3 text-nowrap" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#viewQueryModal{{ $query->id }}"
                                            title="View Message">
                                            <i class="bi bi-eye-fill"></i> View
                                        </button>
                                        
                                        <form action="{{ route('admin.contact-queries.destroy', $query->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this query?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                class="btn btn-sm btn-outline-danger px-3 w-100 text-nowrap" title="Delete">
                                                <i class="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </form>
                                    </div>

                                    <!-- Bootstrap Modal for Detail View -->
                                    <div class="modal fade text-start" id="viewQueryModal{{ $query->id }}" tabindex="-1" aria-labelledby="viewQueryLabel{{ $query->id }}" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered modal-lg">
                                            <div class="modal-content border-0 shadow-lg">
                                                <div class="modal-header bg-light border-bottom-0 py-3">
                                                    <h5 class="modal-title" id="viewQueryLabel{{ $query->id }}">
                                                        <i class="bi bi-envelope-paper-fill text-indigo me-2"></i> Message Details
                                                    </h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body p-4">
                                                    <div class="row g-3 mb-4">
                                                        <div class="col-sm-6">
                                                            <label class="text-muted small text-uppercase d-block mb-1">Sender Name</label>
                                                            <div class="p-2.5 bg-light rounded font-semibold text-slate-800">{{ $query->name }}</div>
                                                        </div>
                                                        <div class="col-sm-6">
                                                            <label class="text-muted small text-uppercase d-block mb-1">Email Address</label>
                                                            <div class="p-2.5 bg-light rounded">
                                                                <a href="mailto:{{ $query->email }}" class="text-decoration-none font-semibold text-primary">
                                                                    {{ $query->email }}
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div class="col-12">
                                                            <label class="text-muted small text-uppercase d-block mb-1">Subject</label>
                                                            <div class="p-2.5 bg-light rounded font-medium text-slate-850">{{ $query->subject ?? 'No Subject Provided' }}</div>
                                                        </div>
                                                    </div>

                                                    <div class="mb-4">
                                                        <label class="text-muted small text-uppercase d-block mb-1.5">Message Content</label>
                                                        <div class="p-4 bg-light rounded text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner" style="max-height: 350px; overflow-y: auto;">{{ $query->message }}</div>
                                                    </div>

                                                    <div class="d-flex justify-content-between align-items-center text-muted small mt-2">
                                                        <span>Received: {{ Carbon::parse($query->created_at)->isoFormat('LLLL') }}</span>
                                                        <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">ID: #{{ $query->id }}</span>
                                                    </div>
                                                </div>
                                                <div class="modal-footer border-top-0 py-3 bg-light">
                                                    <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Close</button>
                                                    <a href="mailto:{{ $query->email }}?subject=Re: {{ rawurlencode($query->subject) }}" class="btn btn-primary px-4">
                                                        <i class="bi bi-reply-fill me-1"></i> Reply via Email
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">No messages found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $contactQueries->links() }}
            </div>
        </div>
    </div>
@endsection
