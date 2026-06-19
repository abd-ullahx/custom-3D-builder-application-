@extends('admin.master')

@section('title', 'Wholesale Orders')

@section('header', 'B2B Wholesale Orders')

@section('content')
    <!-- Alert Messages -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <!-- Orders Table Card -->
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white mb-4">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light text-muted small text-uppercase">
                    <tr>
                      <th class="ps-4 py-3">Order ID</th>
                      <th class="py-3">Wholesale Partner (Dealer)</th>
                      <th class="py-3">submission Date</th>
                      <th class="py-3">Uniform Items</th>
                      <th class="py-3">Total Wholesale</th>
                      <th class="py-3">Production Status</th>
                      <th class="text-end pe-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @forelse($orders as $order)
                        <tr>
                            <td class="ps-4 py-3 fw-bold text-slate-800">#B2B-{{ $order->id }}</td>
                            <td>
                                <div class="fw-bold text-dark">{{ $order->dealer ? $order->dealer->name : 'Unknown Dealer' }}</div>
                                <small class="text-muted">{{ $order->dealer ? $order->dealer->email : 'N/A' }}</small>
                            </td>
                            <td class="text-secondary small">
                                {{ $order->created_at->format('M d, Y h:i A') }}
                            </td>
                            <td>{{ $order->items_count }} items</td>
                            <td class="fw-bold text-dark">${{ number_format($order->total_price, 2) }}</td>
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
                                <a href="{{ route('admin.dealer-orders.show', $order->id) }}" 
                                   class="btn btn-sm btn-light border fw-semibold">
                                    View Details <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-5 text-muted">
                                <i class="bi bi-bag-check fs-2 d-block mb-3 text-secondary opacity-50"></i>
                                <span class="fw-bold">No wholesale bulk orders recorded yet.</span>
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
