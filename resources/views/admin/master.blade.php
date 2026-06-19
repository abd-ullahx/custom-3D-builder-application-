<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - {{ config('app.name', 'Wash House') }}</title>

    <link rel="icon" type="image/jpeg" href="{{ asset('assets/img/favicon.jpg') }}">

    <meta name="robots" content="noindex, nofollow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="{{ asset('assets/css/custom.css') }}" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
        }
        .sidebar {
            width: 280px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            background-color: #111827;
            color: #fff;
            overflow-y: auto;
            transition: all 0.3s;
        }
        .main-content {
            margin-left: 280px;
            padding: 20px;
            transition: all 0.3s;
        }
        .sidebar-brand {
            padding: 20px;
            font-size: 22px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .sidebar-brand-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .sidebar-brand .logo-icon {
            background-color: #0d6efd;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        .nav-link {
            color: #9ca3af;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 400;
        }

        .nav-link:hover, .nav-link.active {
            color: #fff;
            background-color: #1f2937;
            border-left: 4px solid #0d6efd;
        }

        .nav-link i {
            font-size: 1.2rem;
        }

        .nav-link.active {
            background-color: #0d6efd;
            border-left: none;
            border-radius: 6px;
            margin: 5px 10px;
            color: white;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }

        /* Dashboard specific */
        .order-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 1.2rem;
            margin: 0 auto 10px;
        }

        @media (max-width: 768px) {
            .sidebar {
                margin-left: -280px;
                box-shadow: 2px 0 5px rgba(0,0,0,0.5);
            }
            .sidebar.active {
                margin-left: 0;
            }
            .sidebar-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
            }
            .sidebar-overlay.active {
                display: block;
            }
            .main-content {
                margin-left: 0;
            }
            .header-search {
                display: none;
            }
        }

        .vscomp-wrapper.focused .vscomp-toggle-button, .vscomp-wrapper:focus .vscomp-toggle-button {
            box-shadow: none !important;
        }
    </style>
    @yield('styles')
    @stack('styles')
</head>
<body>

<div class="sidebar-overlay" id="sidebarOverlay"></div>

@include('admin.layouts.partials.sidebar')

<div class="main-content">
    @include('admin.layouts.partials.header')

    {{-- Toast Notification Container --}}
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
        @if(session('message'))
            @php
                $type    = session('alert-type', 'info');
                $icons   = ['success' => 'bi-check-circle-fill', 'danger' => 'bi-x-circle-fill', 'warning' => 'bi-exclamation-triangle-fill', 'info' => 'bi-info-circle-fill'];
                $colors  = ['success' => '#198754', 'danger' => '#dc3545', 'warning' => '#ffc107', 'info' => '#0dcaf0'];
                $icon    = $icons[$type]  ?? 'bi-info-circle-fill';
                $color   = $colors[$type] ?? '#0dcaf0';
                $labels  = ['success' => 'Success', 'danger' => 'Error', 'warning' => 'Warning', 'info' => 'Info'];
                $label   = $labels[$type] ?? 'Notice';
            @endphp
            <div id="adminToast" class="toast align-items-center border-0 shadow-lg" role="alert"
                 aria-live="assertive" aria-atomic="true"
                 style="min-width:320px; border-left: 5px solid {{ $color }} !important; border-radius: 10px;">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-start gap-3 py-3 px-3">
                        <i class="bi {{ $icon }} fs-5 mt-0" style="color:{{ $color }};flex-shrink:0;"></i>
                        <div>
                            <div class="fw-semibold" style="color:{{ $color }}; font-size:0.85rem;">{{ $label }}</div>
                            <div class="text-dark" style="font-size:0.82rem; margin-top:2px;">{{ session('message') }}</div>
                        </div>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                {{-- Progress bar --}}
                <div style="height:3px; background:{{ $color }}; border-radius:0 0 10px 10px;"
                     id="toastProgress"></div>
            </div>
        @endif

        @if($errors->any())
            <div id="adminErrorToast" class="toast align-items-center border-0 shadow-lg mt-2" role="alert"
                 aria-live="assertive" aria-atomic="true"
                 style="min-width:320px; border-left: 5px solid #dc3545 !important; border-radius: 10px;">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-start gap-3 py-3 px-3">
                        <i class="bi bi-x-circle-fill fs-5 mt-0" style="color:#dc3545;flex-shrink:0;"></i>
                        <div>
                            <div class="fw-semibold" style="color:#dc3545; font-size:0.85rem;">Validation Error</div>
                            <ul class="mb-0 ps-3 mt-1" style="font-size:0.82rem;">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div style="height:3px; background:#dc3545; border-radius:0 0 10px 10px;"></div>
            </div>
        @endif
    </div>

    @yield('content')
</div>

<script>
    // Auto-show toasts on page load
    document.addEventListener('DOMContentLoaded', function () {
        const toastEls = document.querySelectorAll('.toast');
        toastEls.forEach(function (toastEl) {
            const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();

            // Animate progress bar
            const bar = toastEl.querySelector('#toastProgress');
            if (bar) {
                bar.style.transition = 'width 5s linear';
                bar.style.width = '100%';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = '0%';
                    });
                });
            }
        });
    });
</script>


<script>
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }

    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    sidebarOverlay.addEventListener('click', function() {
        toggleSidebar();
    });

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            toggleSidebar();
        });
    }
</script>

{{-- SweetAlert2 CDN & Global Confirm Interceptor --}}
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    // Strip inline confirm onsubmit attributes on page load to prevent native popups
    document.addEventListener('DOMContentLoaded', function () {
        const forms = document.querySelectorAll('form[onsubmit*="confirm("]');
        forms.forEach(form => {
            const onsubmitAttr = form.getAttribute('onsubmit');
            if (onsubmitAttr) {
                const match = onsubmitAttr.match(/confirm\(['"]([^'"]+)['"]\)/);
                if (match) {
                    form.setAttribute('data-confirm-message', match[1]);
                    form.removeAttribute('onsubmit');
                }
            }
        });
    });

    document.addEventListener('submit', function (e) {
        const form = e.target;
        const confirmMessage = form.getAttribute('data-confirm-message');
        
        if (confirmMessage) {
            e.preventDefault();
            e.stopPropagation();
            
            Swal.fire({
                title: 'Confirmation Required',
                text: confirmMessage,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Delete',
                cancelButtonText: 'Cancel',
                background: '#ffffff',
                color: '#1e293b',
                customClass: {
                    popup: 'rounded-4 shadow-lg border-0',
                    confirmButton: 'btn btn-danger px-4 py-2 rounded-3 fw-bold me-2',
                    cancelButton: 'btn btn-secondary px-4 py-2 rounded-3 fw-bold'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    form.removeAttribute('data-confirm-message');
                    form.submit();
                }
            });
        }
    });
</script>

@yield('scripts')
@stack('scripts')

</body>
</html>
