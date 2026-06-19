<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DealerAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'dealer') {
            return redirect()->route('auth')->with('error', 'Please login to access dealer portal.');
        }

        return $next($request);
    }
}
