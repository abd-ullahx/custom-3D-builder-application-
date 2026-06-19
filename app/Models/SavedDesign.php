<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedDesign extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'model_name',
        'design_data',
        'thumbnail',
    ];

    protected $casts = [
        'design_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
