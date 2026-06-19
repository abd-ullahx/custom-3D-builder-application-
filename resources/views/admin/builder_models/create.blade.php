@extends('admin.master')

@section('title', 'Add Builder Model')

@section('header', 'Add Builder Model')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <form action="{{ route('admin.builder-models.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Category</label>
                    <select name="category_id" class="form-select" required>
                        <option value="">Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}">{{ $category->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">3D Model File (.glb)</label>
                    <input type="file" name="model_file" class="form-control" accept=".glb">
                </div>

                <div class="mb-3 form-check">
                    <input type="checkbox" name="status" value="1" class="form-check-input" id="statusCheck" checked>
                    <label class="form-check-label" for="statusCheck">Active</label>
                </div>

                <button type="submit" class="btn btn-primary">Save Model</button>
                <a href="{{ route('admin.builder-models.index') }}" class="btn btn-secondary">Cancel</a>
            </form>
        </div>
    </div>
@endsection
