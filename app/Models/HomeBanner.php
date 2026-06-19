<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeBanner extends Model
{
    protected $table = 'banners';

    protected $fillable = [
        'image',
        'status',
        'order',
    ];
}
