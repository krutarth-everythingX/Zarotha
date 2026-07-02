<?php

namespace App\Models;

use Database\Factories\HeroBannerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $eyebrow
 * @property string $headline
 * @property string|null $body_text
 * @property string|null $primary_cta_label
 * @property string|null $primary_cta_url
 * @property string|null $secondary_cta_label
 * @property string|null $secondary_cta_url
 * @property int $desktop_media_id
 * @property int|null $mobile_media_id
 * @property int $overlay_opacity
 * @property string $text_theme
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 */
class HeroBanner extends Model
{
    /** @use HasFactory<HeroBannerFactory> */
    use HasFactory;

    protected $fillable = [
        'eyebrow',
        'headline',
        'body_text',
        'primary_cta_label',
        'primary_cta_url',
        'secondary_cta_label',
        'secondary_cta_url',
        'desktop_media_id',
        'mobile_media_id',
        'overlay_opacity',
        'text_theme',
        'sort_order',
        'is_active',
        'starts_at',
        'ends_at',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'overlay_opacity' => 'integer',
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function desktopMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'desktop_media_id');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function mobileMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'mobile_media_id');
    }
}
