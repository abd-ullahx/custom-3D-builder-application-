<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAdminIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (auth('admin')->check()) {
            return to_route('admin.dashboard');
        }

        return $next($request);
    }
}
