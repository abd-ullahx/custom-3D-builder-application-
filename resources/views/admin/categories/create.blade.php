@extends('admin.master')

@section('title', 'Add Category')

@section('header', 'Add New Category')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-0">Category Details</h5>
                <a href="{{ route('admin.categories.index') }}" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-left me-1"></i> Back to List
                </a>
            </div>

            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('admin.categories.store') }}" method="POST">
                @csrf

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="name" class="form-label fw-medium">Category Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}" required>
                    </div>

                    <div class="col-md-6">
                        <label for="slug" class="form-label fw-medium">Slug</label>
                        <input type="text" class="form-control" id="slug" name="slug" value="{{ old('slug') }}">
                        <div id="slug-feedback" class="form-text">Leave blank to auto-generate.</div>
                    </div>

                    <div class="col-md-6">
                        <label for="parent_id" class="form-label fw-medium">Parent Category</label>
                        <select class="form-select" id="parent_id" name="parent_id">
                            <option value="">None (Root Category)</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" {{ old('parent_id') == $category->id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                                @foreach($category->subcategories as $child)
                                    <option value="{{ $child->id }}" {{ old('parent_id') == $child->id ? 'selected' : '' }}>
                                        &nbsp;&nbsp;&nbsp;-- {{ $child->name }}
                                    </option>
                                    {{-- Intentionally limiting to 2 levels of parents to ensure max 3 levels deep --}}
                                @endforeach
                            @endforeach
                        </select>
                    </div>

                    <div class="col-12 mt-4">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="status" name="status" value="1" {{ old('status', true) ? 'checked' : '' }}>
                            <label class="form-check-label fw-medium" for="status">Active Status</label>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2">
                    <a href="{{ route('admin.categories.index') }}" class="btn btn-light">Cancel</a>
                    <button type="submit" class="btn btn-primary" id="save-btn">
                        <i class="bi bi-save me-1"></i> Save Category
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const nameInput = document.getElementById('name');
        const slugInput = document.getElementById('slug');
        const feedback = document.getElementById('slug-feedback');
        const saveBtn = document.getElementById('save-btn');
        let timeout = null;
        let isManuallyEdited = false;

        slugInput.addEventListener('input', function() {
            isManuallyEdited = true;
            checkSlug(this.value);
        });

        nameInput.addEventListener('input', function() {
            if (!isManuallyEdited) {
                let slug = this.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                slugInput.value = slug;
                checkSlug(slug);
            }
        });

        function checkSlug(slug) {
            clearTimeout(timeout);
            
            if (!slug) {
                feedback.innerHTML = 'Leave blank to auto-generate.';
                feedback.className = 'form-text text-muted';
                saveBtn.disabled = false;
                return;
            }

            feedback.innerHTML = '<span class="text-info">Checking availability...</span>';
            
            timeout = setTimeout(() => {
                fetch(`{{ route('admin.categories.check-slug') }}?slug=${encodeURIComponent(slug)}`)
                    .then(response => response.json())
                    .then(data => {
                        slugInput.value = data.slug; // Update with proper slugified format
                        if (data.exists) {
                            feedback.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Slug already exists!</span>';
                            slugInput.classList.add('is-invalid');
                            slugInput.classList.remove('is-valid');
                            saveBtn.disabled = true;
                        } else {
                            feedback.innerHTML = '<span class="text-success"><i class="bi bi-check-circle"></i> Slug is available!</span>';
                            slugInput.classList.add('is-valid');
                            slugInput.classList.remove('is-invalid');
                            saveBtn.disabled = false;
                        }
                    })
                    .catch(err => {
                        feedback.innerHTML = '<span class="text-danger">Error checking slug.</span>';
                    });
            }, 500); // 500ms debounce
        }
    });
</script>
@endsection
