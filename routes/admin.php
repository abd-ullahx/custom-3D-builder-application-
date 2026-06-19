<?php

use App\Http\Controllers\Admin\AdminAreaController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDealerController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Middleware\RedirectAdminIfAuthenticated;
use App\Http\Middleware\RedirectAdminIfNotAuthenticated;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Panel Routes
| Prefix: /admin  |  Name prefix: admin.
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {

    // Guest-only admin routes (redirect if already logged in)
    Route::middleware(RedirectAdminIfAuthenticated::class)->group(function () {
        Route::get('/login',  [AdminAuthController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    });

    // Authenticated admin routes
    Route::middleware(RedirectAdminIfNotAuthenticated::class)->group(function () {

        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

        // Profile & Password
        Route::get('/profile',  [AdminAuthController::class, 'showProfileForm'])->name('profile');
        Route::put('/profile',  [AdminAuthController::class, 'updateProfile'])->name('profile.update');
        Route::put('/profile/password', [AdminAuthController::class, 'updatePassword'])->name('profile.password');

        // Banners, Showcase Videos, Home Categories
        Route::resource('/banners',          HomeController::class);
        Route::resource('/showcase-videos',  \App\Http\Controllers\Admin\AdminShowcaseVideoController::class);
        Route::resource('/home-categories',  \App\Http\Controllers\Admin\AdminHomeCategoryController::class);

        // Areas & Dealers
        Route::resource('/areas',   AdminAreaController::class);
        Route::resource('/dealers', AdminDealerController::class);

        // Categories (with slug check helper)
        Route::get('/categories/check-slug', [AdminCategoryController::class, 'checkSlug'])->name('categories.check-slug');
        Route::resource('/categories', AdminCategoryController::class);

        // Products (with slug check & gallery image delete helpers)
        Route::get('/products/check-slug', [\App\Http\Controllers\Admin\AdminProductController::class, 'checkSlug'])->name('products.check-slug');
        Route::delete('/products/gallery-image/{id}', [\App\Http\Controllers\Admin\AdminProductController::class, 'deleteGalleryImage'])->name('products.delete-gallery-image');
        Route::resource('/products', \App\Http\Controllers\Admin\AdminProductController::class);

        // Builder Models
        Route::resource('/builder-models', \App\Http\Controllers\Admin\AdminBuilderModelController::class);

        // Contact Queries (read-only + delete)
        Route::resource('/contact-queries', \App\Http\Controllers\Admin\AdminContactController::class)->only(['index', 'show', 'destroy']);

        // Coupons
        Route::get('/coupons/{coupon}/toggle', [\App\Http\Controllers\Admin\AdminCouponController::class, 'toggleStatus'])->name('coupons.toggle');
        Route::resource('/coupons', \App\Http\Controllers\Admin\AdminCouponController::class);

        // Order Statuses
        Route::resource('/order-statuses', \App\Http\Controllers\Admin\AdminOrderStatusController::class);

        // Customer Orders
        Route::get('/orders',          [\App\Http\Controllers\Admin\AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{id}',     [\App\Http\Controllers\Admin\AdminOrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{id}/status', [\App\Http\Controllers\Admin\AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');

        // Dealer Applications
        Route::get('/dealer-applications',             [\App\Http\Controllers\Admin\DealerApplicationAdminController::class, 'index'])->name('dealer-applications.index');
        Route::get('/dealer-applications/{id}',        [\App\Http\Controllers\Admin\DealerApplicationAdminController::class, 'show'])->name('dealer-applications.show');
        Route::post('/dealer-applications/{id}/approve', [\App\Http\Controllers\Admin\DealerApplicationAdminController::class, 'approve'])->name('dealer-applications.approve');
        Route::post('/dealer-applications/{id}/reject',  [\App\Http\Controllers\Admin\DealerApplicationAdminController::class, 'reject'])->name('dealer-applications.reject');

        // Dealer Orders (admin view)
        Route::get('/dealer-orders',           [\App\Http\Controllers\Admin\DealerOrderAdminController::class, 'index'])->name('dealer-orders.index');
        Route::get('/dealer-orders/{id}',      [\App\Http\Controllers\Admin\DealerOrderAdminController::class, 'show'])->name('dealer-orders.show');
        Route::post('/dealer-orders/{id}/status', [\App\Http\Controllers\Admin\DealerOrderAdminController::class, 'updateStatus'])->name('dealer-orders.updateStatus');
    });
});
