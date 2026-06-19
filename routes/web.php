<?php

use App\Http\Controllers\BuilderController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\DealerLocatorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SavedDesignController;
use App\Http\Controllers\StoreAuthController;
use App\Http\Controllers\SubscriberController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront Public Pages (Inertia)
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'getBannersForFrontend'])->name('home');
Route::get('/about', fn() => inertia('About'))->name('about');
Route::get('/faq', fn() => inertia('FAQ'))->name('faq');
Route::get('/privacy-policy', fn() => inertia('PrivacyPolicy'))->name('privacy-policy');
Route::get('/terms-of-service', fn() => inertia('TermsOfService'))->name('terms-of-service');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');
Route::get('/auth', fn() => inertia('Auth'))->name('auth');
Route::get('/banner', [HomeController::class, 'GetBanner'])->name('banner');

/*
|--------------------------------------------------------------------------
| Products & Builder
|--------------------------------------------------------------------------
*/
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/product-details/{id}', [ProductController::class, 'show'])->name('product-details');
Route::get('/builder/{id?}', [BuilderController::class, 'index'])->where('id', '.*')->name('builder');
Route::get('/dealer-locator', [DealerLocatorController::class, 'index'])->name('dealer-locator');

/*
|--------------------------------------------------------------------------
| Checkout & Orders
|--------------------------------------------------------------------------
*/
Route::get('/checkout', function () {
    if (!Illuminate\Support\Facades\Auth::check()) {
        return redirect()->route('auth')->with('error', 'Please login to checkout.');
    }
    return inertia('Checkout');
})->name('checkout');

Route::get('/checkout/success/{type}/{id}', [OrderController::class, 'successPage'])->name('checkout.success');

/*
|--------------------------------------------------------------------------
| Storefront JSON API Routes
|--------------------------------------------------------------------------
*/
// Products Search (public)
Route::get('/api/products/search', [ProductController::class, 'search'])->name('api.products.search');

// Authentication — rate-limited to 6 attempts per minute to prevent brute-force
Route::middleware(['throttle:6,1'])->group(function () {
    Route::post('/api/auth/register', [StoreAuthController::class, 'register'])->name('api.auth.register');
    Route::post('/api/auth/login',    [StoreAuthController::class, 'login'])->name('api.auth.login');
});

Route::post('/api/auth/logout',  [StoreAuthController::class, 'logout'])->name('api.auth.logout');
Route::get('/api/auth/me',       [StoreAuthController::class, 'me'])->name('api.auth.me');
Route::post('/api/auth/profile', [StoreAuthController::class, 'updateProfile'])->name('api.auth.profile');
Route::post('/api/auth/profile-image', [StoreAuthController::class, 'updateProfileImage'])->name('api.auth.profile-image');
Route::post('/api/auth/settings', [StoreAuthController::class, 'updateSettings'])->name('api.auth.settings');

// Orders
Route::post('/api/orders/checkout', [OrderController::class, 'store'])->name('api.orders.checkout');
Route::get('/api/orders',  [OrderController::class, 'index'])->name('api.orders.index');

// Coupons
Route::post('/api/apply-coupon',  [CouponController::class, 'apply'])->name('api.apply-coupon');
Route::get('/api/auto-coupons',   [CouponController::class, 'autoCoupons'])->name('api.auto-coupons');

// Saved Designs
Route::get('/api/saved-designs',      [SavedDesignController::class, 'index'])->name('api.saved-designs.index');
Route::post('/api/saved-designs',     [SavedDesignController::class, 'store'])->name('api.saved-designs.store');
Route::get('/api/saved-designs/{id}', [SavedDesignController::class, 'show'])->name('api.saved-designs.show');
Route::delete('/api/saved-designs/{id}', [SavedDesignController::class, 'destroy'])->name('api.saved-designs.destroy');

// Newsletter
Route::post('/api/subscribe', [SubscriberController::class, 'store'])->name('api.subscribe');

/*
|--------------------------------------------------------------------------
| Admin Panel Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/admin.php';

/*
|--------------------------------------------------------------------------
| Dealer Portal Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/dealer.php';
