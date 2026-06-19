@php use Carbon\Carbon; @endphp

@extends('admin.master')

@section('title', 'Products')

@section('header', 'Products Management')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h5 class="card-title mb-0">Products List</h5>
                <div class="d-flex flex-column flex-md-row gap-2">
                    <form action="{{ route('admin.products.index') }}" method="GET"
                        class="d-flex flex-column flex-md-row gap-2">
                        <select name="status" class="form-select" style="min-width: 150px;" onchange="this.form.submit()">
                            <option value="">All Statuses</option>
                            <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Active</option>
                            <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactive
                            </option>
                        </select>
                        <div class="input-group">
                            <input type="text" name="search" class="form-control"
                                placeholder="Search title, SKU..." value="{{ request('search') }}">
                            <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                            @if (request('search') || request('status'))
                                <a href="{{ route('admin.products.index') }}" class="btn btn-outline-danger"
                                    title="Clear Filters">
                                    <i class="bi bi-x-lg"></i>
                                </a>
                            @endif
                        </div>
                    </form>
                    <a href="{{ route('admin.products.create') }}" class="btn btn-primary text-nowrap">
                        <i class="bi bi-plus-circle me-1"></i> Add New
                    </a>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th>Id</th>
                            <th class="ps-4">Title</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($products as $product)
                            <tr>
                                <td>{{ $product->id }}</td>
                                <td class="ps-4 fw-medium text-primary">{{ $product->title }}
                                    @if($product->is_featured)
                                        <span class="badge bg-warning text-dark ms-1"><i class="bi bi-star-fill"></i></span>
                                    @endif
                                </td>
                                <td>{{ $product->sku ?? '-' }}</td>
                                <td>
                                    @if($product->sale_price)
                                        <span class="text-danger fw-bold">${{ number_format($product->sale_price, 2) }}</span>
                                        <small class="text-decoration-line-through text-muted">${{ number_format($product->price, 2) }}</small>
                                    @else
                                        ${{ number_format($product->price, 2) }}
                                    @endif
                                </td>
                                <td>
                                    @if($product->track_stock)
                                        <span class="badge {{ $product->stock > 0 ? 'bg-info' : 'bg-danger' }}">
                                            {{ $product->stock }} in stock
                                        </span>
                                    @else
                                        <span class="badge bg-secondary">Not Tracked</span>
                                    @endif
                                </td>
                                <td>
                                    <span class="badge {{ $product->status ? 'bg-success' : 'bg-secondary' }}">
                                        {{ $product->status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="small">
                                    {{ Carbon::parse($product->created_at)->isoFormat('LLL') }}
                                </td>
                                <td>
                                    <div class="d-flex flex-column flex-md-row justify-content-end gap-2">
                                        <a href="{{ route('admin.products.edit', $product->id) }}"
                                            class="btn btn-sm btn-outline-primary px-3 text-nowrap" title="Edit">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <form action="{{ route('admin.products.destroy', $product->id) }}" method="POST"
                                            class="d-inline"
                                            onsubmit="return confirm('Are you sure you want to delete this product?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                class="btn btn-sm btn-outline-danger px-3 w-100 text-nowrap" title="Delete">
                                                <i class="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">No products found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $products->links() }}
            </div>
        </div>
    </div>
@endsection
