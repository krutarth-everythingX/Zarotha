<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomepageSectionBanner extends Model
{
    use HasFactory;

    protected $fillable = [
        'homepage_section_id',
        'media_asset_id',
        'sort_order',
        'is_visible',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ];
    }

    public function homepageSection(): BelongsTo
    {
        return $this->belongsTo(HomepageSection::class);
    }

    public function imageMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'media_asset_id');
    }
}
