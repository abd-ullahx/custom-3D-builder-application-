<?php

namespace App\Traits;

use Illuminate\Support\Facades\Session;

trait FlashNotifications
{

    protected function notification($message = '', $type = 'info'): void
    {
        Session::flash('alert-type', $type);
        Session::flash('message', $message);
    }

    protected function successNotification($message = 'Success'): void
    {
        $this->notification($message, 'success');
    }

    protected function errorNotification($message = 'Error'): void
    {
        $this->notification($message, 'danger');
    }

    protected function dangerNotification($message = 'Error'): void
    {
        $this->notification($message, 'danger');
    }

    protected function warningNotification($message = 'Warning'): void
    {
        $this->notification($message, 'warning');
    }

}