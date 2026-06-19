<header class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
    <div class="d-flex align-items-center">
        <button class="btn btn-link d-md-none me-3" id="sidebarToggle" style="color: #333;">
            <i class="bi bi-list fs-4"></i>
        </button>
        <h4 class="m-0 fw-bold">@yield('header', 'Dashboard')</h4>
    </div>

    <div class="d-flex align-items-center gap-3">
        <div class="dropdown">
            <button class="btn d-flex align-items-center gap-2 border-0 bg-transparent p-0 text-dark dropdown-toggle"
                    type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="bg-light rounded-circle p-2 fw-bold text-secondary">AD</div>
                <div class="d-none d-sm-block text-end" style="line-height: 1.2;">
                    <small class="d-block fw-bold">{{ Auth::guard('admin')->user()->name ?? 'Admin User' }}</small>
                    <small class="text-muted" style="font-size: 0.75rem;">Administrator</small>
                </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow" aria-labelledby="profileDropdown">
                <li><a class="dropdown-item" href="{{ route('admin.profile') }}"><i class="bi bi-person me-2"></i> Profile Update</a></li>
                <li><a class="dropdown-item" href="{{ route('admin.profile') }}"><i class="bi bi-key me-2"></i> Password Update</a></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li>
                    <form action="{{ route('admin.logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="dropdown-item text-danger w-100 text-start border-0 bg-transparent">
                            <i class="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    </div>
</header>