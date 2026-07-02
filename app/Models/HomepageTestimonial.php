<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomepageTestimonial extends Model
{
    protected $fillable = [
        'homepage_section_id',
        'customer_name',
        'location_or_role',
        'body_text',
        'image_media_id',
        'status',
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

    /**
     * @return BelongsTo<HomepageSection, $this>
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(HomepageSection::class, 'homepage_section_id');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function imageMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'image_media_id');
    }
}
