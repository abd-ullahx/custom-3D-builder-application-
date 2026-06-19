@extends('admin.master')

@section('title', 'Coupon Management')

@section('header', 'Coupon Settings')

@section('content')
<div class="container-fluid py-4">
    <!-- Header Summary row -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 fw-bold">Active Coupons & Discounts</h4>
            <small class="text-muted">Manage storefront coupon validation, dealer-exclusive promos and auto discount schemes.</small>
        </div>
        <a href="{{ route('admin.coupons.create') }}" class="btn btn-primary fw-bold rounded-3 shadow-sm hover-up">
            <i class="bi bi-plus-circle me-1"></i> Add New Coupon
        </a>
    </div>

    <!-- Coupons table card -->
    <div class="card border-0 shadow-sm rounded-3 bg-white">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4 py-3">Code</th>
                            <th>Type</th>
                            <th>Discount Value</th>
                            <th>Min Order</th>
                            <th>Uses (Current/Max)</th>
                            <th>Expiry</th>
                            <th>For Dealers</th>
                            <th>Auto Apply</th>
                            <th>Status</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($coupons as $coupon)
                            <tr>
                                <td class="ps-4 fw-bold">
                                    <span class="badge bg-light text-dark border px-3 py-2 fs-6 font-monospace" style="letter-spacing: 0.5px;">
                                        {{ $coupon->code }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-secondary rounded-pill px-2 py-1 text-capitalize">
                                        {{ $coupon->type }}
                                    </span>
                                </td>
                                <td class="fw-semibold text-primary">
                                    {{ $coupon->type === 'percentage' ? $coupon->value . '%' : 'Rs. ' . number_format($coupon->value, 2) }}
                                </td>
                                <td class="text-secondary">
                                    {{ $coupon->min_order_amount ? 'Rs. ' . number_format($coupon->min_order_amount) : 'None' }}
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="fw-bold">{{ $coupon->used_count }}</span>
                                        <span class="text-muted">/</span>
                                        <span class="text-secondary">{{ $coupon->max_uses ?? '∞' }}</span>
                                    </div>
                                </td>
                                <td class="text-secondary small">
                                    @if($coupon->expires_at)
                                        <span class="{{ $coupon->expires_at->isPast() ? 'text-danger fw-bold' : '' }}">
                                            {{ $coupon->expires_at->format('M d, Y') }}
                                        </span>
                                    @else
                                        <span class="text-muted">No Expiry</span>
                                    @endif
                                </td>
                                <td>
                                    @if($coupon->for_dealers_only)
                                        <span class="badge bg-warning text-dark px-2 py-1 rounded">
                                            <i class="bi bi-briefcase me-1"></i> Dealers Only
                                        </span>
                                        @if($coupon->dealer)
                                            <small class="d-block text-muted mt-1" style="font-size: 0.7rem;">
                                                Assignee: {{ $coupon->dealer->name }}
                                            </small>
                                        @endif
                                    @else
                                        <span class="badge bg-light text-secondary px-2 py-1 rounded">All Users</span>
                                    @endif
                                </td>
                                <td>
                                    @if($coupon->auto_apply)
                                        <span class="badge bg-success text-white px-2 py-1 rounded">
                                            <i class="bi bi-magic me-1"></i> Auto Applied
                                        </span>
                                    @else
                                        <span class="badge bg-light text-secondary px-2 py-1 rounded">Manual</span>
                                    @endif
                                </td>
                                <td>
                                    <a href="{{ route('admin.coupons.toggle', $coupon->id) }}" class="text-decoration-none">
                                        <span class="badge {{ $coupon->is_active ? 'bg-success text-white' : 'bg-danger text-white' }} rounded-pill px-3 py-2 hover-opacity">
                                            {{ $coupon->is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </a>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="d-flex justify-content-end gap-2">
                                        <!-- Share Button -->
                                        <button class="btn btn-sm btn-outline-info" 
                                                onclick="openShareModal('{{ $coupon->code }}', '{{ $coupon->type }}', '{{ $coupon->value }}', '{{ $coupon->for_dealers_only }}')"
                                                title="Share Promo Code">
                                            <i class="bi bi-share"></i> Share
                                        </button>

                                        <!-- Edit -->
                                        <a href="{{ route('admin.coupons.edit', $coupon->id) }}" class="btn btn-sm btn-outline-primary" title="Edit Settings">
                                            <i class="bi bi-pencil"></i>
                                        </a>

                                        <!-- Delete -->
                                        <form action="{{ route('admin.coupons.destroy', $coupon->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this coupon code?');" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger" title="Remove Coupon">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="10" class="text-center py-5 text-muted">
                                    <div class="mb-3">
                                        <i class="bi bi-ticket-perforated fs-1 text-secondary"></i>
                                    </div>
                                    <h5 class="fw-bold">No coupons found</h5>
                                    <p class="small text-muted">Create custom storefront promotional discounts or exclusive dealer B2B campaigns to get started.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Beautiful Dynamic Share Modal -->
<div class="modal fade" id="shareCouponModal" tabindex="-1" aria-labelledby="shareCouponModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
            <div class="modal-header border-0 bg-light py-3 px-4">
                <h5 class="modal-title fw-bold" id="shareCouponModalLabel"><i class="bi bi-share text-primary me-2"></i>Share Promo Code</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4 text-center">
                <div class="mb-3">
                    <small class="text-muted d-block uppercase tracking-wider mb-2 font-semibold">COUPON PROMO CODE</small>
                    <h2 class="fw-bold text-primary font-monospace bg-light rounded py-3 px-4 d-inline-block border shadow-inner mb-2" id="shareCodeText" style="letter-spacing: 2px;">
                        SAVE10
                    </h2>
                </div>

                <!-- Exclusive Dealer alert inside modal -->
                <div class="alert alert-warning border-0 bg-warning-subtle text-warning-emphasis d-none mb-4 py-2" id="dealerExclusiveAlert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i><strong>This is a B2B dealer-exclusive coupon.</strong> It will only work for registered partner accounts.
                </div>

                <div class="row g-3">
                    <!-- Copy to Clipboard -->
                    <div class="col-6">
                        <button class="btn btn-outline-secondary w-100 py-3 fw-bold rounded-3" id="copyCodeBtn" onclick="copyCouponCodeToClipboard()">
                            <i class="bi bi-clipboard me-2"></i><span id="copyBtnText">Copy Code</span>
                        </button>
                    </div>

                    <!-- WhatsApp Distribution Link -->
                    <div class="col-6">
                        <a href="#" target="_blank" class="btn btn-success w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center" id="whatsappShareBtn">
                            <i class="bi bi-whatsapp me-2"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .hover-up:hover {
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
    }
    .hover-opacity:hover {
        opacity: 0.9;
    }
    .font-monospace {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }
</style>

<script>
    let currentShareCode = '';
    let currentShareType = '';
    let currentShareValue = '';

    function openShareModal(code, type, value, forDealersOnly) {
        currentShareCode = code;
        currentShareType = type;
        currentShareValue = parseFloat(value);

        // Update modal dynamic text
        document.getElementById('shareCodeText').innerText = code;
        document.getElementById('copyBtnText').innerText = 'Copy Code';

        // Check if B2B exclusive
        const alertBox = document.getElementById('dealerExclusiveAlert');
        if (forDealersOnly === '1' || forDealersOnly === true || forDealersOnly === 'true') {
            alertBox.classList.remove('d-none');
        } else {
            alertBox.classList.add('d-none');
        }

        // Construct pre-filled WhatsApp message
        let discountStr = type === 'percentage' ? `${currentShareValue}%` : `Rs. ${currentShareValue}`;
        let message = `Use code ${code} at checkout on EAY Sports to get ${discountStr} off! Shop now: ${window.location.origin}`;
        
        document.getElementById('whatsappShareBtn').href = `https://wa.me/?text=${encodeURIComponent(message)}`;

        // Trigger modal opening
        var myModal = new bootstrap.Modal(document.getElementById('shareCouponModal'));
        myModal.show();
    }

    function copyCouponCodeToClipboard() {
        navigator.clipboard.writeText(currentShareCode).then(() => {
            const btnText = document.getElementById('copyBtnText');
            btnText.innerText = 'Copied! ✓';
            setTimeout(() => {
                btnText.innerText = 'Copy Code';
            }, 2000);
        }).catch(err => {
            alert('Failed to copy. Please copy it manually.');
        });
    }
</script>
@endsection
