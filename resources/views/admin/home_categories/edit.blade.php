@extends('admin.master')

@section('title', 'Edit Category Card')

@section('header', 'Edit Category Card')

@section('content')
    <div class="row justify-content-center">
        <div class="col-xxl-8 col-xl-12 col-lg-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="card-title fw-bold">Category Card Settings</h5>
                        <a href="{{ route('admin.home-categories.index') }}"
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

                    @if($category->final_image_url)
                        <div class="mb-4 p-3 bg-light rounded border text-center">
                            <label class="form-label fw-bold d-block text-start">Current Category Image Preview:</label>
                            <div class="mx-auto rounded border overflow-hidden mt-2" style="width: 150px; height: 180px;">
                                <img src="{{ $category->final_image_url }}" alt="Category Preview" class="w-100 h-100 object-cover">
                            </div>
                        </div>
                    @endif

                    <form action="{{ route('admin.home-categories.update', $category->id) }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="row g-3">

                            <!-- Category Name -->
                            <div class="col-md-6">
                                <label for="name" class="form-label fw-bold">
                                    Category Name <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="name"
                                       name="name"
                                       value="{{ old('name', $category->name) }}"
                                       required>
                                <small class="text-muted">Example: Jerseys, T-Shirts, Hoodies</small>
                            </div>

                            <!-- Count / Subtitle -->
                            <div class="col-md-6">
                                <label for="count" class="form-label fw-bold">
                                    Subtitle / Count <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       id="count"
                                       name="count"
                                       value="{{ old('count', $category->count) }}"
                                       required>
                                <small class="text-muted">Example: 50+ Designs, 30+ Options</small>
                            </div>

                            <!-- Gradient Classes -->
                            <div class="col-md-12">
                                <label for="gradient_preset" class="form-label fw-bold">
                                    Card Gradient Color Preset <span class="text-danger">*</span>
                                </label>
                                <select id="gradient_preset" class="form-select mb-3 shadow-sm border-2">
                                    <option value="from-[#0EA5E9]/70 via-[#0284C7]/60 to-[#1D4ED8]/80">Jerseys Blue (Default)</option>
                                    <option value="from-[#EC4899]/70 via-[#C026D3]/60 to-[#9333EA]/80">T-Shirts Pink</option>
                                    <option value="from-[#10B981]/70 via-[#059669]/60 to-[#047857]/80">Hoodies Green</option>
                                    <option value="from-[#FB923C]/70 via-[#F97316]/60 to-[#DC2626]/80">Shorts Orange</option>
                                    <option value="from-slate-800/80 via-slate-900/70 to-black/80">Elegant Dark Gray</option>
                                    <option value="custom">Custom Color Gradient (For Technical Users)</option>
                                </select>

                                <div id="custom_gradient_container" style="display: none;" class="p-3 bg-light border rounded mb-3">
                                    <label for="gradient" class="form-label fw-bold text-indigo">
                                        Custom Tailwind Gradient Classes
                                    </label>
                                    <input type="text"
                                           class="form-control"
                                           id="gradient"
                                           name="gradient"
                                           value="{{ old('gradient', $category->gradient) }}"
                                           placeholder="e.g. from-indigo-500/70 via-purple-500/60 to-pink-500/80"
                                           required>
                                    <small class="text-muted d-block mt-2">
                                        Type custom Tailwind classes. Make sure they use layout gradients like <code>from-... via-... to-...</code>
                                    </small>
                                </div>
                            </div>

                            <!-- Option 1: Upload File -->
                            <div class="col-md-12 mt-4">
                                <label for="image_file" class="form-label fw-bold">
                                    Upload Category Image
                                </label>
                                <input type="file"
                                       class="form-control"
                                       id="image_file"
                                       name="image_file"
                                       accept="image/*">
                                <small class="text-muted">Recommended: vertical aspect ratio. <strong>Note: Uploading a file will override any URL below.</strong></small>
                            </div>

                            <div class="col-12 py-1 text-center">
                                <span class="badge bg-secondary px-3 py-2">OR</span>
                            </div>

                            <!-- Option 2: Image URL -->
                            <div class="col-md-12">
                                <label for="image_url" class="form-label fw-bold">
                                    Image URL
                                </label>
                                <input type="url"
                                       class="form-control"
                                       id="image_url"
                                       name="image_url"
                                       value="{{ old('image_url', $category->image_url) }}"
                                       placeholder="https://images.unsplash.com/...">
                                <small class="text-muted">Or paste an online direct image link (e.g. Unsplash). <strong>Note: Using a URL will clear any previously uploaded category image.</strong></small>
                            </div>

                            <!-- Order -->
                            <div class="col-md-6 mt-4">
                                <label for="order" class="form-label fw-bold">
                                    Order <span class="text-danger">*</span>
                                </label>
                                <input type="number"
                                       class="form-control"
                                       id="order"
                                       name="order"
                                       value="{{ old('order', $category->order) }}"
                                       required>
                            </div>

                            <!-- Status -->
                            <div class="col-md-6 mt-4">
                                <label for="status" class="form-label fw-bold">
                                    Status <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="status" name="status" required>
                                    <option value="1" {{ old('status', $category->status) == '1' ? 'selected' : '' }}>Active</option>
                                    <option value="0" {{ old('status', $category->status) == '0' ? 'selected' : '' }}>Inactive</option>
                                </select>
                            </div>

                            <!-- Submit -->
                            <div class="col-12 text-end mt-4">
                                <button type="submit" class="btn btn-primary px-4 py-2">
                                    <i class="bi bi-save me-1"></i> Save Changes
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const presetSelect = document.getElementById('gradient_preset');
        const gradientInput = document.getElementById('gradient');
        const customContainer = document.getElementById('custom_gradient_container');

        function updateState() {
            const currentValue = gradientInput.value;
            let matched = false;
            
            for (let option of presetSelect.options) {
                if (option.value === currentValue) {
                    presetSelect.value = currentValue;
                    matched = true;
                    break;
                }
            }
            
            if (!matched && currentValue) {
                presetSelect.value = 'custom';
                customContainer.style.display = 'block';
            } else {
                customContainer.style.display = 'none';
            }
        }

        presetSelect.addEventListener('change', function () {
            if (this.value === 'custom') {
                customContainer.style.display = 'block';
            } else {
                customContainer.style.display = 'none';
                gradientInput.value = this.value;
            }
        });

        // Initialize state
        updateState();
    });
</script>
@endpush
