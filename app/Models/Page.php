<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\PageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $page_key
 * @property string $slug
 * @property string|null $navigation_label
 * @property string $title
 * @property string|null $intro_title
 * @property string|null $intro_body
 * @property string|null $body_html
 * @property int|null $hero_media_id
 * @property string|null $cta_label
 * @property string|null $cta_url
 * @property Carbon|null $effective_date
 * @property PublishStatus $status
 * @property Carbon|null $published_at
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property string|null $og_title
 * @property string|null $og_description
 * @property int|null $og_image_media_id
 * @property string|null $canonical_url
 * @property bool $robots_index
 * @property bool $robots_follow
 */
class Page extends Model
{
    /** @use HasFactory<PageFactory> */
    use HasFactory;

    protected $fillable = [
        'page_key',
        'slug',
        'navigation_label',
        'title',
        'intro_title',
        'intro_body',
        'body_html',
        'hero_media_id',
        'cta_label',
        'cta_url',
        'effective_date',
        'status',
        'published_at',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image_media_id',
        'canonical_url',
        'robots_index',
        'robots_follow',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'effective_date' => 'date',
            'published_at' => 'datetime',
            'status' => PublishStatus::class,
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
        ];
    }

    /**
     * @return HasMany<CraftsmanshipStep, $this>
     */
    public function craftsmanshipSteps(): HasMany
    {
        return $this->hasMany(CraftsmanshipStep::class)->orderBy('sort_order');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }
}
