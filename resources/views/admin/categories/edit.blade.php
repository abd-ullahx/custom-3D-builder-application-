@extends('admin.master')

@section('title', 'Edit Category')

@section('header', 'Edit Category')

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

            <form action="{{ route('admin.categories.update', $category->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="name" class="form-label fw-medium">Category Name <span
                                class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="name" name="name"
                            value="{{ old('name', $category->name) }}" required>
                    </div>

                    <div class="col-md-6">
                        <label for="slug" class="form-label fw-medium">Slug <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="slug" name="slug"
                            value="{{ old('slug', $category->slug) }}" required>
                        <div id="slug-feedback" class="form-text">Changing this will change the category URL.</div>
                    </div>

                    <div class="col-md-6">
                        <label for="parent_id" class="form-label fw-medium">Parent Category</label>
                        <select class="form-select" id="parent_id" name="parent_id">
                            <option value="">None (Root Category)</option>
                            @foreach ($categories as $cat)
                                @if ($cat->id != $category->id)
                                    <option value="{{ $cat->id }}"
                                        {{ old('parent_id', $category->parent_id) == $cat->id ? 'selected' : '' }}>
                                        {{ $cat->name }}
                                    </option>
                                    @foreach ($cat->subcategories as $child)
                                        @if ($child->id != $category->id)
                                            <option value="{{ $child->id }}"
                                                {{ old('parent_id', $category->parent_id) == $child->id ? 'selected' : '' }}>
                                                &nbsp;&nbsp;&nbsp;-- {{ $child->name }}
                                            </option>
                                        @endif
                                    @endforeach
                                @endif
                            @endforeach
                        </select>
                    </div>

                    <div class="col-12 mt-4">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="status" name="status" value="1"
                                {{ old('status', $category->status) ? 'checked' : '' }}>
                            <label class="form-check-label fw-medium" for="status">Active Status</label>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2">
                    <a href="{{ route('admin.categories.index') }}" class="btn btn-light">Cancel</a>
                    <button type="submit" class="btn btn-primary" id="save-btn">
                        <i class="bi bi-save me-1"></i> Update Category
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const slugInput = document.getElementById('slug');
            const feedback = document.getElementById('slug-feedback');
            const saveBtn = document.getElementById('save-btn');
            let timeout = null;

            const categoryId = {{ $category->id }};

            slugInput.addEventListener('input', function() {
                checkSlug(this.value);
            });

            function checkSlug(slug) {
                clearTimeout(timeout);

                if (!slug) {
                    feedback.innerHTML = '<span class="text-danger">Slug is required.</span>';
                    saveBtn.disabled = true;
                    return;
                }

                feedback.innerHTML = '<span class="text-info">Checking availability...</span>';

                timeout = setTimeout(() => {
                    fetch(
                            `{{ route('admin.categories.check-slug') }}?slug=${encodeURIComponent(slug)}&ignore_id=${categoryId}`)
                        .then(response => response.json())
                        .then(data => {
                            slugInput.value = data.slug; // Update with proper slugified format
                            if (data.exists) {
                                feedback.innerHTML =
                                    '<span class="text-danger"><i class="bi bi-x-circle"></i> Slug already exists!</span>';
                                slugInput.classList.add('is-invalid');
                                slugInput.classList.remove('is-valid');
                                saveBtn.disabled = true;
                            } else {
                                feedback.innerHTML =
                                    '<span class="text-success"><i class="bi bi-check-circle"></i> Slug is available!</span>';
                                slugInput.classList.add('is-valid');
                                slugInput.classList.remove('is-invalid');
                                saveBtn.disabled = false;
                            }
                        })
                        .catch(err => {
                            feedback.innerHTML =
                            '<span class="text-danger">Error checking slug.</span>';
                        });
                }, 500); // 500ms debounce
            }
        });
    </script>
@endsection
