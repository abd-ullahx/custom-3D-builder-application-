<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useBootstrapFive();

        if (class_exists(\Illuminate\Foundation\Console\ServeCommand::class)) {
            \Illuminate\Foundation\Console\ServeCommand::$passthroughVariables[] = 'SystemRoot';
            \Illuminate\Foundation\Console\ServeCommand::$passthroughVariables[] = 'SystemDrive';
            \Illuminate\Foundation\Console\ServeCommand::$passthroughVariables[] = 'windir';
        }
    }
}
