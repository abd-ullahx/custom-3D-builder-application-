@php use Carbon\Carbon; @endphp

@extends('admin.master')

@section('title', 'Categories')

@section('header', 'Categories Management')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h5 class="card-title mb-0">Categories List</h5>
                <div class="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-md-end w-100" style="max-width: 650px;">
                    <!-- Search Input -->
                    <div class="input-group shadow-sm border rounded-3 overflow-hidden bg-white" style="max-width: 320px;">
                        <span class="input-group-text bg-white border-0 text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" 
                               id="categorySearch" 
                               class="form-control border-0 ps-0 bg-white" 
                               placeholder="Search categories or slugs..." 
                               onkeyup="filterCategories()">
                    </div>
                    <a href="{{ route('admin.categories.create') }}" class="btn btn-primary text-nowrap">
                        <i class="bi bi-plus-circle me-1"></i> Add New
                    </a>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">Name</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($categories as $category)
                            <tr>
                                <td class="ps-4 fw-bold text-primary">{{ $category->name }}</td>
                                <td>{{ $category->slug }}</td>
                                <td>
                                    <span class="badge {{ $category->status ? 'bg-success' : 'bg-secondary' }}">
                                        {{ $category->status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="small">
                                    {{ Carbon::parse($category->created_at)->isoFormat('LLL') }}
                                </td>
                                <td>
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                        <a href="{{ route('admin.categories.edit', $category->id) }}"
                                            class="btn btn-sm btn-outline-primary px-3 text-nowrap" title="Edit">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.categories.destroy', $category->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this category? All its subcategories will be deleted too.');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger px-3 text-nowrap"
                                                title="Delete">
                                                <i class="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @foreach ($category->subcategories as $child)
                                <tr>
                                    <td class="ps-4 fw-medium"><span class="text-muted">--</span> {{ $child->name }}</td>
                                    <td>{{ $child->slug }}</td>
                                    <td>
                                        <span class="badge {{ $child->status ? 'bg-success' : 'bg-secondary' }}">
                                            {{ $child->status ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td class="small">
                                        {{ Carbon::parse($child->created_at)->isoFormat('LLL') }}
                                    </td>
                                    <td>
                                        <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                            <a href="{{ route('admin.categories.edit', $child->id) }}"
                                                class="btn btn-sm btn-outline-primary px-3 text-nowrap" title="Edit">
                                                <i class="bi bi-pencil-square"></i> Edit
                                            </a>
                                            <form action="{{ route('admin.categories.destroy', $child->id) }}"
                                                method="POST" class="d-inline"
                                                onsubmit="return confirm('Are you sure you want to delete this category? All its subcategories will be deleted too.');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                    class="btn btn-sm btn-outline-danger px-3 text-nowrap" title="Delete">
                                                    <i class="bi bi-trash-fill"></i> Delete
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                                @foreach ($child->subcategories as $subchild)
                                    <tr>
                                        <td class="ps-4 text-muted"><span>----</span> {{ $subchild->name }}</td>
                                        <td>{{ $subchild->slug }}</td>
                                        <td>
                                            <span class="badge {{ $subchild->status ? 'bg-success' : 'bg-secondary' }}">
                                                {{ $subchild->status ? 'Active' : 'Inactive' }}
                                            </span>
                                        </td>
                                        <td class="small">
                                            {{ Carbon::parse($subchild->created_at)->isoFormat('LLL') }}
                                        </td>
                                        <td>
                                            <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                                <a href="{{ route('admin.categories.edit', $subchild->id) }}"
                                                    class="btn btn-sm btn-outline-primary px-3 text-nowrap" title="Edit">
                                                    <i class="bi bi-pencil-square"></i> Edit
                                                </a>
                                                <form action="{{ route('admin.categories.destroy', $subchild->id) }}"
                                                    method="POST" class="d-inline"
                                                    onsubmit="return confirm('Are you sure you want to delete this category?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit"
                                                        class="btn btn-sm btn-outline-danger px-3 text-nowrap"
                                                        title="Delete">
                                                        <i class="bi bi-trash-fill"></i> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            @endforeach
                        @empty
                            <tr>
                                <td colspan="5" class="text-center py-4 text-muted">No categories found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        function filterCategories() {
            const query = document.getElementById('categorySearch').value.toLowerCase().trim();
            const rows = document.querySelectorAll('table tbody tr');
            let visibleRows = 0;
            
            rows.forEach(row => {
                if (row.id === 'no-results-row') {
                    return;
                }
                
                const nameCell = row.cells[0];
                const slugCell = row.cells[1];
                
                if (nameCell && slugCell) {
                    const nameText = nameCell.textContent.toLowerCase();
                    const slugText = slugCell.textContent.toLowerCase();
                    
                    if (nameText.includes(query) || slugText.includes(query)) {
                        row.style.setProperty('display', '', 'important');
                        visibleRows++;
                    } else {
                        row.style.setProperty('display', 'none', 'important');
                    }
                }
            });
            
            let noResultsRow = document.getElementById('no-results-row');
            if (visibleRows === 0 && query !== '') {
                if (!noResultsRow) {
                    noResultsRow = document.createElement('tr');
                    noResultsRow.id = 'no-results-row';
                    noResultsRow.innerHTML = `
                        <td colspan="5" class="text-center py-4 text-muted fw-semibold">
                            <i class="bi bi-info-circle me-1"></i> No matching categories found for "${query}"
                        </td>
                    `;
                    document.querySelector('table tbody').appendChild(noResultsRow);
                } else {
                    noResultsRow.querySelector('td').innerHTML = `<i class="bi bi-info-circle me-1"></i> No matching categories found for "${query}"`;
                    noResultsRow.style.display = '';
                }
            } else if (noResultsRow) {
                noResultsRow.style.display = 'none';
            }
        }
    </script>
@endsection
