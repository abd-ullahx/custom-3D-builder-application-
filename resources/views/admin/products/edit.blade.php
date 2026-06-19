@extends('admin.master')

@section('title', 'Edit Product')

@section('header', 'Edit Product: ' . $product->title)

@section('content')
    <form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="row g-4">
            <!-- Left Column: Main Content -->
            <div class="col-lg-8">
                <!-- General Info Card -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold">General Information</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <label for="title" class="form-label fw-medium">Product Title <span
                                    class="text-danger">*</span></label>
                            <input type="text" class="form-control @error('title') is-invalid @enderror" id="title"
                                name="title" value="{{ old('title', $product->title) }}" required>
                            @error('title')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="slug" class="form-label fw-medium">Slug <span
                                    class="text-danger">*</span></label>
                            <input type="text" class="form-control @error('slug') is-invalid @enderror" id="slug"
                                name="slug" value="{{ old('slug', $product->slug) }}" required>
                            <div id="slug-feedback" class="form-text">Changing this will alter the product's URL.</div>
                            @error('slug')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="short_description" class="form-label fw-medium">Short Description</label>
                            <textarea class="form-control @error('short_description') is-invalid @enderror" id="short_description"
                                name="short_description" rows="2">{{ old('short_description', $product->short_description) }}</textarea>
                            @error('short_description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label fw-medium">Full Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description"
                                rows="5">{{ old('description', $product->description) }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-0">
                            <label for="features" class="form-label fw-medium">Product Features (one per line)</label>
                            <textarea class="form-control @error('features') is-invalid @enderror" id="features" name="features" rows="4" placeholder="Moisture-wicking fabric&#10;Breathable mesh panels&#10;Reinforced stitching">{{ old('features', is_array($product->features) ? implode("\n", $product->features) : '') }}</textarea>
                            <div class="form-text">Enter each feature on a new line.</div>
                            @error('features')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Pricing Card -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold">Pricing</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="price" class="form-label fw-medium">Regular Price ($) <span
                                        class="text-danger">*</span></label>
                                <input type="number" step="0.01"
                                    class="form-control @error('price') is-invalid @enderror" id="price" name="price"
                                    value="{{ old('price', $product->price) }}" required>
                                @error('price')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-md-6">
                                <label for="sale_price" class="form-label fw-medium">Sale Price ($)</label>
                                <input type="number" step="0.01"
                                    class="form-control @error('sale_price') is-invalid @enderror" id="sale_price"
                                    name="sale_price" value="{{ old('sale_price', $product->sale_price) }}">
                                @error('sale_price')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inventory Card -->
                <div class="card border-0 shadow-sm rounded-3 mb-4 mb-lg-0">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold">Inventory</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="sku" class="form-label fw-medium">SKU</label>
                                <input type="text" class="form-control @error('sku') is-invalid @enderror" id="sku"
                                    name="sku" value="{{ old('sku', $product->sku) }}">
                                @error('sku')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="stock" class="form-label fw-medium">Stock Quantity <span
                                        class="text-danger">*</span></label>
                                <input type="number" class="form-control @error('stock') is-invalid @enderror"
                                    id="stock" name="stock" value="{{ old('stock', $product->stock) }}" required>
                                @error('stock')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-12 mt-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="track_stock" name="track_stock"
                                        value="1" {{ old('track_stock', $product->track_stock) ? 'checked' : '' }}>
                                    <label class="form-check-label fw-medium" for="track_stock">Track Stock
                                        Quantity</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Sidebar settings -->
            <div class="col-lg-4">
                <!-- Actions Card -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold">Publish</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="status" name="status"
                                    value="1" {{ old('status', $product->status) ? 'checked' : '' }}>
                                <label class="form-check-label fw-medium" for="status">Active Status</label>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="is_featured" name="is_featured"
                                    value="1" {{ old('is_featured', $product->is_featured) ? 'checked' : '' }}>
                                <label class="form-check-label fw-medium text-warning" for="is_featured"><i
                                        class="bi bi-star-fill me-1"></i> Featured Product</label>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="{{ route('admin.products.index') }}" class="btn btn-light flex-grow-1">Cancel</a>
                            <button type="submit" class="btn btn-primary flex-grow-1" id="save-btn">
                                <i class="bi bi-save me-1"></i> Update
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Images Card -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold">Images</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-4">
                            <label for="featured_image" class="form-label fw-medium">Featured Image</label>
                            @if ($product->featured_image)
                                <div class="mb-2">
                                    <img src="{{ asset('storage/' . $product->featured_image) }}" alt="Featured Image"
                                        class="img-thumbnail" style="max-height: 150px;">
                                </div>
                            @endif
                            <input class="form-control @error('featured_image') is-invalid @enderror" type="file"
                                id="featured_image" name="featured_image" accept="image/*">
                            <div class="form-text">Upload a new image to replace the current one.</div>
                            @error('featured_image')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-medium">Gallery Images (Drag to Reorder Sequence)</label>
                            
                            <input type="hidden" name="gallery_order" id="gallery_order" value="{{ implode(',', $product->images->pluck('id')->toArray()) }}">

                            @if ($product->images->count() > 0)
                                <div class="d-flex flex-wrap gap-3 mb-3" id="gallery-container">
                                    @foreach ($product->images as $image)
                                        <div class="position-relative gallery-img-wrapper" id="img-{{ $image->id }}" draggable="true" style="cursor: grab; user-select: none;">
                                            <img src="{{ asset('storage/' . $image->image_path) }}" alt="Gallery Image"
                                                class="img-thumbnail rounded shadow-sm"
                                                style="height: 90px; width: 90px; object-fit: cover; border: 2px solid #e2e8f0; transition: border-color 0.2s;">
                                            <div class="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white text-[9px] text-center rounded-bottom py-0.5 drag-handle" style="pointer-events: none; font-size: 9px;">
                                                <i class="bi bi-arrows-move"></i> Move
                                            </div>
                                            <button type="button"
                                                class="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle p-1 d-flex align-items-center justify-content-center delete-gallery-img z-2 shadow-sm"
                                                data-id="{{ $image->id }}" style="width: 22px; height: 22px;">
                                                <i class="bi bi-x"></i>
                                            </button>
                                        </div>
                                    @endforeach
                                </div>
                            @endif

                            <div class="mb-3">
                                <label for="gallery_images" class="form-label fw-medium text-muted small">Add New Images to Gallery</label>
                                <input class="form-control @error('gallery_images.*') is-invalid @enderror" type="file"
                                    id="gallery_images" name="gallery_images[]" accept="image/*" multiple>
                                <div class="form-text">Upload additional images. You will see their preview below instantly.</div>
                                @error('gallery_images.*')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <!-- New upload live preview container -->
                            <div class="d-flex flex-wrap gap-3 mt-3" id="new-gallery-previews"></div>
                        </div>
                    </div>
                </div>

                <!-- Categories Card -->
                <div class="card border-0 shadow-sm rounded-3 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold">Categories <span class="text-danger">*</span></h6>
                    </div>
                    <div class="card-body p-4" style="max-height: 300px; overflow-y: auto;">
                        @if ($errors->has('categories'))
                            <div class="text-danger small mb-2">{{ $errors->first('categories') }}</div>
                        @endif

                        <div class="category-list">
                            @forelse($categories as $category)
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" name="categories[]"
                                        value="{{ $category->id }}" id="cat_{{ $category->id }}"
                                        {{ (is_array(old('categories')) && in_array($category->id, old('categories'))) || in_array($category->id, $selectedCategories) ? 'checked' : '' }}>
                                    <label class="form-check-label fw-medium" for="cat_{{ $category->id }}">
                                        {{ $category->name }}
                                    </label>
                                </div>
                                @foreach ($category->subcategories as $child)
                                    <div class="form-check ms-3 mb-2">
                                        <input class="form-check-input" type="checkbox" name="categories[]"
                                            value="{{ $child->id }}" id="cat_{{ $child->id }}"
                                            {{ (is_array(old('categories')) && in_array($child->id, old('categories'))) || in_array($child->id, $selectedCategories) ? 'checked' : '' }}>
                                        <label class="form-check-label text-muted" for="cat_{{ $child->id }}">
                                            {{ $child->name }}
                                        </label>
                                    </div>
                                    @foreach ($child->subcategories as $subchild)
                                        <div class="form-check ms-5 mb-2">
                                            <input class="form-check-input" type="checkbox" name="categories[]"
                                                value="{{ $subchild->id }}" id="cat_{{ $subchild->id }}"
                                                {{ (is_array(old('categories')) && in_array($subchild->id, old('categories'))) || in_array($subchild->id, $selectedCategories) ? 'checked' : '' }}>
                                            <label class="form-check-label text-muted small"
                                                for="cat_{{ $subchild->id }}">
                                                {{ $subchild->name }}
                                            </label>
                                        </div>
                                    @endforeach
                                @endforeach
                            @empty
                                <div class="text-muted small">No categories found. Please create categories first.</div>
                            @endforelse
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </form>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const slugInput = document.getElementById('slug');
            const feedback = document.getElementById('slug-feedback');
            const saveBtn = document.getElementById('save-btn');
            let timeout = null;

            const productId = {{ $product->id }};

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
                            `{{ route('admin.products.check-slug') }}?slug=${encodeURIComponent(slug)}&ignore_id=${productId}`)
                        .then(response => response.json())
                        .then(data => {
                            slugInput.value = data.slug;
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
                }, 500);
            }

            // Drag and Drop reordering logic for gallery images
            const container = document.getElementById('gallery-container');
            const orderInput = document.getElementById('gallery_order');

            if (container) {
                let dragEl = null;

                function updateOrder() {
                    const ids = [...container.querySelectorAll('.gallery-img-wrapper')].map(el => el.id.replace('img-', ''));
                    orderInput.value = ids.join(',');
                }

                container.addEventListener('dragstart', function(e) {
                    const target = e.target.closest('.gallery-img-wrapper');
                    if (target) {
                        dragEl = target;
                        e.dataTransfer.effectAllowed = 'move';
                        setTimeout(() => target.classList.add('opacity-50'), 0);
                    }
                });

                container.addEventListener('dragend', function(e) {
                    if (dragEl) {
                        dragEl.classList.remove('opacity-50');
                        dragEl = null;
                        updateOrder();
                    }
                });

                container.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const target = e.target.closest('.gallery-img-wrapper');
                    if (target && target !== dragEl) {
                        const rect = target.getBoundingClientRect();
                        const next = (e.clientX - rect.left) / (rect.right - rect.left) > 0.5;
                        container.insertBefore(dragEl, next ? target.nextSibling : target);
                    }
                });
            }

            // Image compression helper function
            function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.75) {
                return new Promise((resolve) => {
                    if (!file.type.startsWith('image/')) {
                        return resolve(file);
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.onload = function() {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > maxWidth) {
                                    height = Math.round((height * maxWidth) / width);
                                    width = maxWidth;
                                }
                            } else {
                                if (height > maxHeight) {
                                    width = Math.round((width * maxHeight) / height);
                                    height = maxHeight;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;

                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);

                            canvas.toBlob((blob) => {
                                if (blob) {
                                    const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    });
                                    resolve(compressedFile);
                                } else {
                                    resolve(file);
                                }
                            }, 'image/jpeg', quality);
                        };
                        img.onerror = () => resolve(file);
                        img.src = e.target.result;
                    };
                    reader.onerror = () => resolve(file);
                    reader.readAsDataURL(file);
                });
            }

            // ── Featured Image Instant Preview ──────────────────────
            const featuredInput = document.getElementById('featured_image');
            if (featuredInput) {
                featuredInput.addEventListener('change', async function() {
                    let previewContainer = document.getElementById('featured-image-preview');
                    if (!previewContainer) {
                        previewContainer = document.createElement('div');
                        previewContainer.id = 'featured-image-preview';
                        previewContainer.className = 'mt-2';
                        featuredInput.parentNode.insertBefore(previewContainer, featuredInput.nextSibling);
                    }
                    previewContainer.innerHTML = '<div class="text-info small"><i class="spinner-border spinner-border-sm me-1"></i> Optimizing image...</div>';
                    if (this.files && this.files[0]) {
                        const compressed = await compressImage(this.files[0]);

                        const dt = new DataTransfer();
                        dt.items.add(compressed);
                        this.files = dt.files;

                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewContainer.innerHTML = `
                                <img src="${e.target.result}" alt="Featured Preview" class="img-thumbnail rounded shadow-sm" style="max-height: 150px; border: 2px solid #4F46E5;">
                                <div class="text-muted small mt-1"><i class="bi bi-check-circle-fill text-success me-1"></i> Optimized — ready to save</div>
                            `;
                        };
                        reader.readAsDataURL(compressed);
                    } else {
                        previewContainer.innerHTML = '';
                    }
                });
            }

            // ── Gallery New Uploads: Live Preview with Drag-to-Reorder ───
            const galleryImagesInput = document.getElementById('gallery_images');
            const newPreviewsContainer = document.getElementById('new-gallery-previews');
            let newFileList = [];

            if (galleryImagesInput && newPreviewsContainer) {
                galleryImagesInput.addEventListener('change', async function() {
                    newPreviewsContainer.innerHTML = '<div class="text-info small w-100"><i class="spinner-border spinner-border-sm me-1"></i> Optimizing gallery files...</div>';
                    
                    const files = Array.from(this.files);
                    const compressedFiles = [];
                    for (let file of files) {
                        const compressed = await compressImage(file);
                        compressedFiles.push(compressed);
                    }

                    newFileList = compressedFiles;
                    rebuildNewFileInput();
                    renderNewPreviews();
                });
            }

            function renderNewPreviews() {
                newPreviewsContainer.innerHTML = '';
                newFileList.forEach((file, index) => {
                    if (!file.type.startsWith('image/')) return;

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'position-relative gallery-new-img';
                        wrapper.setAttribute('draggable', 'true');
                        wrapper.dataset.index = index;
                        wrapper.style.cssText = 'cursor: grab; user-select: none; width: 90px; height: 110px; display: inline-block;';

                        wrapper.innerHTML = `
                            <img src="${e.target.result}" alt="Preview" class="img-thumbnail rounded shadow-sm" style="height: 90px; width: 90px; object-fit: cover; border: 2px dashed #4F46E5; transition: border-color 0.2s;">
                            <div class="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white text-center rounded-bottom py-0.5" style="pointer-events: none; font-size: 9px;">
                                <i class="bi bi-arrows-move"></i> New #${index + 1}
                            </div>
                            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle p-1 d-flex align-items-center justify-content-center z-2 shadow-sm remove-new-img" data-idx="${index}" style="width: 22px; height: 22px;">
                                <i class="bi bi-x"></i>
                            </button>
                        `;

                        wrapper.addEventListener('dragstart', handleNewDragStart);
                        wrapper.addEventListener('dragover', handleNewDragOver);
                        wrapper.addEventListener('drop', handleNewDrop);
                        wrapper.addEventListener('dragend', handleNewDragEnd);

                        newPreviewsContainer.appendChild(wrapper);
                    };
                    reader.readAsDataURL(file);
                });
            }

            let newDragSrcIndex = null;

            function handleNewDragStart(e) {
                newDragSrcIndex = parseInt(this.dataset.index);
                this.style.opacity = '0.4';
                e.dataTransfer.effectAllowed = 'move';
            }
            function handleNewDragOver(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.querySelector('img').style.borderColor = '#10b981';
            }
            function handleNewDrop(e) {
                e.preventDefault();
                const dropIndex = parseInt(this.dataset.index);
                if (newDragSrcIndex !== null && newDragSrcIndex !== dropIndex) {
                    const [moved] = newFileList.splice(newDragSrcIndex, 1);
                    newFileList.splice(dropIndex, 0, moved);
                    rebuildNewFileInput();
                    renderNewPreviews();
                }
                this.querySelector('img').style.borderColor = '#4F46E5';
            }
            function handleNewDragEnd(e) {
                this.style.opacity = '1';
                document.querySelectorAll('.gallery-new-img img').forEach(img => {
                    img.style.borderColor = '#4F46E5';
                });
            }

            // Remove individual new upload
            if (newPreviewsContainer) {
                newPreviewsContainer.addEventListener('click', function(e) {
                    const removeBtn = e.target.closest('.remove-new-img');
                    if (removeBtn) {
                        const idx = parseInt(removeBtn.dataset.idx);
                        newFileList.splice(idx, 1);
                        rebuildNewFileInput();
                        renderNewPreviews();
                    }
                });
            }

            function rebuildNewFileInput() {
                const dt = new DataTransfer();
                newFileList.forEach(f => dt.items.add(f));
                galleryImagesInput.files = dt.files;
            }

            // Gallery Image Deletion (existing saved images)
            const deleteButtons = document.querySelectorAll('.delete-gallery-img');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this image?')) {
                        const imgId = this.getAttribute('data-id');
                        const wrapper = document.getElementById('img-' + imgId);

                        fetch(`/admin/products/gallery-image/${imgId}`, {
                                method: 'DELETE',
                                headers: {
                                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                                    'Accept': 'application/json'
                                }
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    wrapper.remove();
                                    updateOrder();
                                } else {
                                    alert('Failed to delete image.');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Error deleting image.');
                            });
                    }
                });
            });

            // Check for total POST/file size before form submission to prevent PostTooLargeException
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    let totalSize = 0;
                    
                    // Featured image size
                    const featuredInput = document.getElementById('featured_image');
                    if (featuredInput && featuredInput.files && featuredInput.files.length > 0) {
                        totalSize += featuredInput.files[0].size;
                    }
                    
                    // Gallery images size
                    if (typeof newFileList !== 'undefined' && newFileList.length > 0) {
                        newFileList.forEach(file => {
                            totalSize += file.size;
                        });
                    } else if (galleryImagesInput && galleryImagesInput.files) {
                        for (let i = 0; i < galleryImagesInput.files.length; i++) {
                            totalSize += galleryImagesInput.files[i].size;
                        }
                    }
                    
                    const totalMB = totalSize / (1024 * 1024);
                    // Safe upload limit of 8MB matching php.ini defaults
                    if (totalMB > 8) {
                        e.preventDefault();
                        alert(`Error: The total size of selected images (${totalMB.toFixed(2)} MB) exceeds the server upload limit (8 MB). Please compress your images or upload fewer files.`);
                        const saveBtn = document.getElementById('save-btn');
                        if (saveBtn) {
                            saveBtn.removeAttribute('disabled');
                            saveBtn.innerHTML = '<i class="bi bi-save me-1"></i> Save Changes';
                        }
                        return false;
                    }
                });
            }
        });
    </script>
@endsection

