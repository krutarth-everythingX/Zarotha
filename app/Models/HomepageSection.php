<?php

namespace App\Models;

use Database\Factories\HomepageSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HomepageSection extends Model
{
    /** @use HasFactory<HomepageSectionFactory> */
    use HasFactory;

    protected $fillable = [
        'section_key',
        'section_title',
        'section_intro',
        'cta_label',
        'cta_url',
        'source_mode',
        'background_media_id',
        'background_color',
        'mobile_media_id',
        'max_items',
        'sort_order',
        'is_visible',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'max_items' => 'integer',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function backgroundMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'background_media_id');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function mobileMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'mobile_media_id');
    }

    /**
     * @return HasMany<HomepageFeaturedProductItem, $this>
     */
    public function featuredProducts(): HasMany
    {
        return $this->hasMany(HomepageFeaturedProductItem::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<HomepageFloatingProductItem, $this>
     */
    public function floatingProducts(): HasMany
    {
        return $this->hasMany(HomepageFloatingProductItem::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<HomepageTestimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(HomepageTestimonial::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<WhyChooseUsItem, $this>
     */
    public function whyChooseUsItems(): HasMany
    {
        return $this->hasMany(WhyChooseUsItem::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<HomepageSectionBanner, $this>
     */
    public function banners(): HasMany
    {
        return $this->hasMany(HomepageSectionBanner::class)->orderBy('sort_order');
    }
}
