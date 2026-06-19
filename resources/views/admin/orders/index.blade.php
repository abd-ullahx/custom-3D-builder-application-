@extends('admin.master')

@section('title', 'Retail Orders')

@section('header', 'Storefront Retail Orders')

@section('content')
    <!-- Alert Messages -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <style>
        .toggle-arrow {
            transition: transform 0.2s ease-in-out;
        }
        button:not(.collapsed) .toggle-arrow {
            transform: rotate(180deg);
        }
    </style>

    <!-- Filters and Search Bar -->
    <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
        <!-- Row 1: Search Input & Toggle Button -->
        <div class="row g-3 align-items-center">
            <div class="col-md-9 col-12">
                <div class="input-group" style="height: 42px;">
                    <span class="input-group-text bg-light border-end-0 border-slate-200 text-muted" style="border-top-left-radius: 0.75rem; border-bottom-left-radius: 0.75rem; padding: 0.6rem 0.75rem; height: 100%;"><i class="bi bi-search"></i></span>
                    <input type="text" id="search" name="search" form="filterForm" class="form-control bg-light border-start-0 border-slate-200 text-sm text-dark fw-normal" style="border-top-right-radius: 0.75rem; border-bottom-right-radius: 0.75rem; height: 100%;" placeholder="Search orders by Name, Email, Phone, Order ID..." value="{{ request('search') }}">
                </div>
            </div>
            <div class="col-md-3 col-12 d-flex gap-2">
                <button type="submit" form="filterForm" class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-1.5" style="border-radius: 0.75rem; height: 42px;">
                    <i class="bi bi-search"></i> Search
                </button>
                <button type="button" class="btn btn-light border d-inline-flex align-items-center justify-content-center gap-1.5 collapsed" data-bs-toggle="collapse" data-bs-target="#advancedFilters" aria-expanded="false" aria-controls="advancedFilters" style="border-radius: 0.75rem; height: 42px; min-width: 120px;">
                    <i class="bi bi-funnel"></i> Filters
                    <i class="bi bi-chevron-down toggle-arrow"></i>
                </button>
            </div>
        </div>

        <!-- Row 2: Collapsible Advanced Filters -->
        <div class="collapse {{ request()->anyFilled(['status', 'date_from', 'date_to']) ? 'show' : '' }}" id="advancedFilters">
            <hr class="my-3 border-slate-200">
            <form id="filterForm" action="{{ route('admin.orders.index') }}" method="GET" class="row g-3 align-items-end">
                <!-- Status filter -->
                <div class="col-lg-3 col-md-6 col-12">
                    <label for="status" class="form-label text-xs text-secondary uppercase mb-2 d-block fw-normal" style="letter-spacing: 0.5px;">Filter by Status</label>
                    <select id="status" name="status" class="form-select bg-light border-slate-200 text-sm text-dark fw-normal cursor-pointer" style="border-radius: 0.75rem; height: 42px; padding: 0.6rem 0.75rem;">
                        <option value="">All Statuses</option>
                        @foreach($statuses as $status)
                            <option value="{{ $status->name }}" {{ request('status') === $status->name ? 'selected' : '' }}>
                                {{ $status->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- Date From filter -->
                <div class="col-lg-3 col-md-3 col-6">
                    <label for="date_from" class="form-label text-xs text-secondary uppercase mb-2 d-block fw-normal" style="letter-spacing: 0.5px;">Date From</label>
                    <input type="date" id="date_from" name="date_from" class="form-control bg-light border-slate-200 text-sm text-dark fw-normal" style="border-radius: 0.75rem; height: 42px; padding: 0.6rem 0.75rem;" value="{{ request('date_from') }}">
                </div>

                <!-- Date To filter -->
                <div class="col-lg-3 col-md-3 col-6">
                    <label for="date_to" class="form-label text-xs text-secondary uppercase mb-2 d-block fw-normal" style="letter-spacing: 0.5px;">Date To</label>
                    <input type="date" id="date_to" name="date_to" class="form-control bg-light border-slate-200 text-sm text-dark fw-normal" style="border-radius: 0.75rem; height: 42px; padding: 0.6rem 0.75rem;" value="{{ request('date_to') }}">
                </div>

                <!-- Filter Actions -->
                <div class="col-lg-3 col-md-12 col-12 d-flex gap-2">
                    <button type="submit" class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-1.5" style="border-radius: 0.75rem; height: 42px;">
                        <i class="bi bi-funnel-fill"></i> Apply
                    </button>
                    @if(request()->anyFilled(['search', 'status', 'date_from', 'date_to']))
                        <a href="{{ route('admin.orders.index') }}" class="btn btn-light border px-3 fw-medium text-sm d-inline-flex align-items-center justify-content-center gap-1.5" style="border-radius: 0.75rem; height: 42px;">
                            <i class="bi bi-arrow-counterclockwise"></i> Reset
                        </a>
                    @endif
                </div>
            </form>
        </div>
    </div>

    <!-- Orders Table Card -->
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white mb-4">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light text-muted small text-uppercase">
                    <tr>
                      <th class="ps-4 py-3">Order ID</th>
                      <th class="py-3">Customer</th>
                      <th class="py-3">Order Date</th>
                      <th class="py-3">Items</th>
                      <th class="py-3">Total</th>
                      <th class="py-3">Status</th>
                      <th class="text-end pe-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @forelse($orders as $order)
                        <tr>
                            <td class="ps-4 py-3 fw-bold text-slate-800">#ORD-{{ 1000 + $order->id }}</td>
                            <td>
                                <div class="fw-bold text-dark">{{ $order->billing_name ?? ($order->user ? $order->user->name : 'Guest User') }}</div>
                                <small class="text-muted">{{ $order->billing_email ?? ($order->user ? $order->user->email : 'N/A') }}</small>
                            </td>
                            <td class="text-secondary small">
                                {{ $order->created_at->format('M d, Y h:i A') }}
                            </td>
                            <td>{{ $order->items_count }} items</td>
                            <td class="fw-bold text-dark">${{ number_format($order->total, 2) }}</td>
                            <td>
                                @php
                                    $badgeColor = $order->statusDetails ? $order->statusDetails->badge_color : 'secondary';
                                    $textColor = in_array($badgeColor, ['warning', 'info']) ? 'text-dark' : 'text-white';
                                @endphp
                                <span class="badge bg-{{ $badgeColor }} {{ $textColor }} rounded-pill px-3 py-2 text-uppercase font-bold" style="font-size: 10px;">
                                    {{ $order->status }}
                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <a href="{{ route('admin.orders.show', $order->id) }}" 
                                   class="btn btn-sm btn-light border fw-semibold">
                                    View Details <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-5 text-muted">
                                <i class="bi bi-bag-check fs-2 d-block mb-3 text-secondary opacity-50"></i>
                                <span class="fw-bold">No retail customer orders recorded yet.</span>
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
        {{ $orders->links() }}
    </div>
@endsection
