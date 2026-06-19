<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'categories' => \App\Models\Category::whereNull('parent_id')
                ->where('status', true)
                ->with(['subcategories' => function($q) {
                    $q->where('status', true);
                }])
                ->get(),
            'auth' => [
                'user' => $request->user() ? [
                    'id'                  => $request->user()->id,
                    'name'                => $request->user()->name,
                    'last_name'           => $request->user()->last_name,
                    'email'               => $request->user()->email,
                    'phone'               => $request->user()->phone,
                    'profile_image'       => $request->user()->profile_image,
                    'email_notifications' => (bool) $request->user()->email_notifications,
                    'newsletter'          => (bool) $request->user()->newsletter,
                    'two_factor_auth'     => (bool) $request->user()->two_factor_auth,
                    'role'                => $request->user()->role,
                ] : null,
                'dealer' => ($request->user() && $request->user()->role === 'dealer') ? [
                    'id'    => $request->user()->id,
                    'name'  => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
            ],
        ];
    }
}
