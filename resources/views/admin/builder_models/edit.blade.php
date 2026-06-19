@extends('admin.master')

@section('title', 'Edit Builder Model')

@section('header', 'Edit Builder Model')

@section('content')
    <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
            <form action="{{ route('admin.builder-models.update', $builderModel->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" name="name" class="form-control" value="{{ $builderModel->name }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Category</label>
                    <select name="category_id" class="form-select" required>
                        <option value="">Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}" {{ $builderModel->category_id == $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">3D Model File (.glb)</label>
                    <input type="file" name="model_file" class="form-control" accept=".glb">
                    @if($builderModel->model_url)
                        <small class="text-muted d-block mt-1">Current file: {{ basename($builderModel->model_url) }}</small>
                    @endif
                </div>

                <div class="mb-3 form-check">
                    <input type="checkbox" name="status" value="1" class="form-check-input" id="statusCheck" {{ $builderModel->status ? 'checked' : '' }}>
                    <label class="form-check-label" for="statusCheck">Active</label>
                </div>

                <button type="submit" class="btn btn-primary">Update Model</button>
                <a href="{{ route('admin.builder-models.index') }}" class="btn btn-secondary">Cancel</a>
            </form>
        </div>
    </div>
@endsection
