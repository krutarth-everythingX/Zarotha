<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteSetting extends Model
{
    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    protected $table = 'site_settings';

    protected $fillable = [
        'site_name',
        'default_meta_title',
        'default_meta_description',
        'default_og_image_media_id',
        'default_robots_index',
        'default_robots_follow',
        'light_logo_media_id',
        'dark_logo_media_id',
        'show_social_links_on_hero',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'default_robots_index' => 'boolean',
            'default_robots_follow' => 'boolean',
            'show_social_links_on_hero' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function lightLogo(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'light_logo_media_id');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function darkLogo(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'dark_logo_media_id');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function defaultOgImage(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'default_og_image_media_id');
    }
}
