<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Dealer Portal Routes
| Prefix: /dealer  |  Name prefix: dealer.
|--------------------------------------------------------------------------
*/
Route::prefix('dealer')->name('dealer.')->group(function () {

    // Public: Dealer Application
    Route::get('/apply',  [\App\Http\Controllers\Dealer\DealerApplicationController::class, 'showForm'])->name('apply');
    Route::post('/apply', [\App\Http\Controllers\Dealer\DealerApplicationController::class, 'submit'])->name('apply.submit');

    // Authentication — rate-limited to prevent brute-force
    Route::middleware(['throttle:6,1'])->group(function () {
        Route::get('/login',   [\App\Http\Controllers\Dealer\DealerAuthController::class, 'showLogin'])->name('login');
        Route::post('/login',  [\App\Http\Controllers\Dealer\DealerAuthController::class, 'login'])->name('login.submit');
    });
    Route::post('/logout', [\App\Http\Controllers\Dealer\DealerAuthController::class, 'logout'])->name('logout');

    // Forgot / Reset Password
    Route::get('/forgot-password',       [\App\Http\Controllers\Dealer\DealerAuthController::class, 'showForgotPassword'])->name('forgot-password');
    Route::post('/forgot-password',      [\App\Http\Controllers\Dealer\DealerAuthController::class, 'sendResetLink'])->name('forgot-password.submit');
    Route::get('/reset-password/{token}', [\App\Http\Controllers\Dealer\DealerAuthController::class, 'showResetForm'])->name('reset-password');
    Route::post('/reset-password',        [\App\Http\Controllers\Dealer\DealerAuthController::class, 'resetPassword'])->name('reset-password.submit');

    // Protected B2B Dealer Routes
    Route::middleware('dealer.auth')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Dealer\DealerDashboardController::class, 'index'])->name('dashboard');

        // Dealer Orders
        Route::get('/orders',        [\App\Http\Controllers\Dealer\DealerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/create', [\App\Http\Controllers\Dealer\DealerOrderController::class, 'create'])->name('orders.create');
        Route::post('/orders',       [\App\Http\Controllers\Dealer\DealerOrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{id}',   [\App\Http\Controllers\Dealer\DealerOrderController::class, 'show'])->name('orders.show');

        // Dealer Profile
        Route::get('/profile',  [\App\Http\Controllers\Dealer\DealerProfileController::class, 'show'])->name('profile');
        Route::put('/profile',  [\App\Http\Controllers\Dealer\DealerProfileController::class, 'update'])->name('profile.update');

        // Dealer Saved Designs
        Route::get('/designs',       [\App\Http\Controllers\Dealer\DealerDesignController::class, 'index'])->name('designs.index');
        Route::delete('/designs/{id}', [\App\Http\Controllers\Dealer\DealerDesignController::class, 'destroy'])->name('designs.destroy');
    });
});
