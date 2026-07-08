<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $category_id
 * @property string $name
 * @property string $slug
 * @property string|null $short_description
 * @property string|null $full_description
 * @property string|null $dimensions
 * @property string|null $material
 * @property string|null $finish
 * @property int|null $featured_media_id
 * @property PublishStatus $status
 * @property Carbon|null $published_at
 * @property int $sort_order
 * @property bool $is_featured
 * @property bool $is_best_selling
 * @property bool $is_latest
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property string|null $og_title
 * @property string|null $og_description
 * @property int|null $og_image_media_id
 * @property string|null $canonical_url
 * @property bool $robots_index
 * @property bool $robots_follow
 * @property bool $is_available_for_inquiry
 * @property bool $show_price
 */
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'short_description',
        'full_description',
        'dimensions',
        'material',
        'finish',
        'featured_media_id',
        'status',
        'published_at',
        'sort_order',
        'is_featured',
        'is_best_selling',
        'is_latest',
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
        'sku',
        'product_type',
        'wood_type',
        'style',
        'regular_price',
        'sale_price',
        'is_track_inventory',
        'stock_quantity',
        'availability',
        'is_available_for_inquiry',
        'show_price',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'status' => PublishStatus::class,
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'is_best_selling' => 'boolean',
            'is_latest' => 'boolean',
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
            'regular_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'is_track_inventory' => 'boolean',
            'is_available_for_inquiry' => 'boolean',
            'show_price' => 'boolean',
            'stock_quantity' => 'integer',
            'details' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsToMany<MediaAsset, $this>
     */
    public function media(): BelongsToMany
    {
        return $this->belongsToMany(MediaAsset::class, 'product_media')
            ->withPivot(['sort_order', 'alt_text_override', 'is_gallery_visible'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function featuredMedia(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'featured_media_id');
    }

    /**
     * @return HasMany<Inquiry, $this>
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeWherePublished(Builder $query): Builder
    {
        return $query
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at');
    }
}
