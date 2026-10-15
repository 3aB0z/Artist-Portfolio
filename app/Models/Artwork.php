<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Category;

class Artwork extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'category_id',
        'image',
        'description',
        'artwork_date',
        'started_at',
        'completed_at',
        'duration',
        'price',
    ];

    protected $casts = [
        'artwork_date' => 'date',
        'started_at' => 'date',
        'completed_at' => 'date',
        'price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ArtworkMedia::class)
            ->orderBy('sort_order');
    }
}
