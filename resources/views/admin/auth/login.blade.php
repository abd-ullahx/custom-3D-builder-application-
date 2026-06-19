<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - {{ config('app.name') }}</title>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet">
    <meta name="robots" content="noindex, nofollow">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="{{ asset('assets/css/custom.css') }}" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f3f4f6;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
        }

        .form-control:focus {
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15);
            border-color: #0d6efd;
        }
    </style>
</head>
<body>

<div class="login-card">
    <div class="text-center mb-4">
        <div class="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded px-3 py-2 mb-3"
             style="font-size: 1.5rem; font-weight: bold;">
            M
        </div>
        <h4 class="fw-bold">Admin Login</h4>
        <p class="text-muted">Welcome back! Please enter your details.</p>
    </div>

    @if(Session::has('message'))
        <div class="alert alert-{{ Session::get('alert-type') }} alert-dismissible fade show" role="alert">
            {{ Session::get('message') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.login.submit') }}">
        @csrf

        <div class="mb-3">
            <label for="email" class="form-label fw-medium">Email Address</label>
            <input type="email" class="form-control @error('email') is-invalid @enderror" id="email" name="email"
                   value="{{ old('email') }}" required autofocus placeholder="Enter your email">
            @error('email')
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-4">
            <label for="password" class="form-label fw-medium">Password</label>
            <input type="password" class="form-control @error('password') is-invalid @enderror" id="password"
                   name="password" required placeholder="••••••••">
            @error('password')
            <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">Sign In</button>
    </form>
</div>

</body>
</html>
