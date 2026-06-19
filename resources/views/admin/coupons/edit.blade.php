@extends('admin.master')

@section('title', 'Edit Coupon')

@section('header', 'Edit Coupon Details')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-0 fw-bold">Edit Coupon Settings</h4>
            <small class="text-muted">Modify promotional campaign metrics, validation deadlines, B2B mappings or auto redemption settings.</small>
        </div>
        <a href="{{ route('admin.coupons.index') }}" class="btn btn-light border fw-bold rounded-3">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger alert-dismissible fade show mb-4 shadow-sm" role="alert">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="card border-0 shadow-sm rounded-3 bg-white">
        <div class="card-body p-4">
            <form action="{{ route('admin.coupons.update', $coupon->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="row g-4">
                    <!-- Coupon Code -->
                    <div class="col-md-4">
                        <label for="code" class="form-label fw-semibold text-secondary">Coupon Code <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-tag-fill"></i></span>
                            <input type="text" 
                                   class="form-control border-start-0 ps-0 bg-light-focus font-monospace text-uppercase" 
                                   id="code" 
                                   name="code" 
                                   placeholder="e.g. SAVE20" 
                                   value="{{ old('code', $coupon->code) }}" 
                                   required 
                                   maxlength="20"
                                   style="letter-spacing: 1px;">
                        </div>
                        <small class="text-muted mt-1 d-block">Alphanumeric character sequence, uppercase only.</small>
                    </div>

                    <!-- Type -->
                    <div class="col-md-4">
                        <label for="type" class="form-label fw-semibold text-secondary">Discount Type <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-percent"></i></span>
                            <select class="form-select border-start-0 ps-0 bg-light-focus" id="type" name="type" required onchange="updateValueLabels()">
                                <option value="percentage" {{ old('type', $coupon->type) === 'percentage' ? 'selected' : '' }}>Percentage Discount (%)</option>
                                <option value="fixed" {{ old('type', $coupon->type) === 'fixed' ? 'selected' : '' }}>Fixed Amount Discount (Rs.)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Value -->
                    <div class="col-md-4">
                        <label for="value" class="form-label fw-semibold text-secondary" id="valueLabel">Discount Value <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted" id="valueIcon"><i class="bi bi-percent"></i></span>
                            <input type="number" 
                                   step="any" 
                                   class="form-control border-start-0 ps-0 bg-light-focus" 
                                   id="value" 
                                   name="value" 
                                   placeholder="e.g. 10" 
                                   value="{{ old('value', $coupon->value) }}" 
                                   required 
                                   min="1">
                        </div>
                    </div>

                    <!-- Min Order Amount -->
                    <div class="col-md-4">
                        <label for="min_order_amount" class="form-label fw-semibold text-secondary">Minimum Order Amount (Rs.)</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-cart"></i></span>
                            <input type="number" 
                                   step="any" 
                                   class="form-control border-start-0 ps-0 bg-light-focus" 
                                   id="min_order_amount" 
                                   name="min_order_amount" 
                                   placeholder="e.g. 1000" 
                                   value="{{ old('min_order_amount', $coupon->min_order_amount) }}" 
                                   min="0">
                        </div>
                        <small class="text-muted mt-1 d-block">Applies only if checkout meets this minimum.</small>
                    </div>

                    <!-- Max Uses -->
                    <div class="col-md-4">
                        <label for="max_uses" class="form-label fw-semibold text-secondary">Usage Limit (Max Uses)</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-calculator"></i></span>
                            <input type="number" 
                                   class="form-control border-start-0 ps-0 bg-light-focus" 
                                   id="max_uses" 
                                   name="max_uses" 
                                   placeholder="e.g. 100" 
                                   value="{{ old('max_uses', $coupon->max_uses) }}" 
                                   min="1">
                        </div>
                        <small class="text-muted mt-1 d-block">Leave blank for unlimited usage.</small>
                    </div>

                    <!-- Expires At -->
                    <div class="col-md-4">
                        <label for="expires_at" class="form-label fw-semibold text-secondary">Expiry Date</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-calendar-event"></i></span>
                            <input type="date" 
                                   class="form-control border-start-0 ps-0 bg-light-focus" 
                                   id="expires_at" 
                                   name="expires_at" 
                                   min={{ today() }}
                                   
                                   value="{{ old('expires_at', $coupon->expires_at ? $coupon->expires_at->format('Y-m-d') : '') }}">
                        </div>
                        <small class="text-muted mt-1 d-block">Leave blank for no expiration.</small>
                    </div>

                    <hr class="my-4">

                    <!-- Options / Toggles -->
                    <div class="col-md-12">
                        <h5 class="fw-bold mb-3"><i class="bi bi-gear-wide-connected text-primary me-2"></i>Coupon Configuration Options</h5>
                        
                        <div class="row g-3">
                            <!-- B2B Dealer Exclusive -->
                            <div class="col-md-4">
                                <div class="form-check form-switch p-3 border rounded-3 bg-light-subtle shadow-sm">
                                    <input class="form-check-input ms-0 me-2" type="checkbox" role="switch" id="for_dealers_only" name="for_dealers_only" {{ old('for_dealers_only', $coupon->for_dealers_only) ? 'checked' : '' }}>
                                    <label class="form-check-label fw-bold text-dark" for="for_dealers_only">For B2B Dealers Only</label>
                                    <small class="d-block text-muted mt-1" style="font-size: 0.75rem;">If enabled, only logged-in dealers can redeem this coupon.</small>
                                </div>
                            </div>

                            <!-- Auto Apply -->
                            <div class="col-md-4">
                                <div class="form-check form-switch p-3 border rounded-3 bg-light-subtle shadow-sm">
                                    <input class="form-check-input ms-0 me-2" type="checkbox" role="switch" id="auto_apply" name="auto_apply" {{ old('auto_apply', $coupon->auto_apply) ? 'checked' : '' }}>
                                    <label class="form-check-label fw-bold text-dark" for="auto_apply">Auto Apply Discount</label>
                                    <small class="d-block text-muted mt-1" style="font-size: 0.75rem;">If enabled, applies silently at checkout without entering code.</small>
                                </div>
                            </div>

                            <!-- Active status -->
                            <div class="col-md-4">
                                <div class="form-check form-switch p-3 border rounded-3 bg-light-subtle shadow-sm">
                                    <input class="form-check-input ms-0 me-2" type="checkbox" role="switch" id="is_active" name="is_active" {{ old('is_active', $coupon->is_active) ? 'checked' : '' }}>
                                    <label class="form-check-label fw-bold text-dark" for="is_active">Is Active</label>
                                    <small class="d-block text-muted mt-1" style="font-size: 0.75rem;">Control coupon active status state instantly.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-5 border-t pt-4">
                    <button type="submit" class="btn btn-primary fw-bold px-4 py-2.5 rounded-3 shadow-sm hover-up">
                        <i class="bi bi-check-circle me-1"></i> Update Coupon Settings
                    </button>
                    <a href="{{ route('admin.coupons.index') }}" class="btn btn-light border fw-bold px-4 py-2.5 rounded-3 ms-2">
                        Cancel
                    </a>
                </div>
            </form>
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
    .font-monospace {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }
</style>

<script>
    function updateValueLabels() {
        const typeSelect = document.getElementById('type');
        const valueLabel = document.getElementById('valueLabel');
        const valueIcon = document.getElementById('valueIcon');
        const valueInput = document.getElementById('value');

        if (typeSelect.value === 'percentage') {
            valueLabel.innerHTML = 'Discount Value (%) <span class="text-danger">*</span>';
            valueIcon.innerHTML = '<i class="bi bi-percent"></i>';
            valueInput.max = '100';
        } else {
            valueLabel.innerHTML = 'Discount Value (Rs.) <span class="text-danger">*</span>';
            valueIcon.innerHTML = '<i class="bi bi-currency-dollar"></i>';
            valueInput.removeAttribute('max');
        }
    }

    // Run on initial load to maintain state if validation failed
    document.addEventListener('DOMContentLoaded', function() {
        updateValueLabels();
    });
</script>
@endsection
