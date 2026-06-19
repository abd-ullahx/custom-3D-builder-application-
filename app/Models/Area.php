<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['zip_code', 'latitude', 'longitude'])]

class Area extends Model
{
    use HasFactory, SoftDeletes;
}
