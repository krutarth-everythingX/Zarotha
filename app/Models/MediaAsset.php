<?php

namespace App\Models;

use Database\Factories\MediaAssetFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $disk
 * @property string|null $directory
 * @property string $filename
 * @property string $original_filename
 * @property string $mime_type
 * @property string $extension
 * @property int $bytes
 * @property int|null $width
 * @property int|null $height
 * @property string|null $alt_text
 * @property string|null $caption
 * @property string|null $credit
 * @property string|null $sha256
 * @property string $status
 * @property string $visibility
 */
class MediaAsset extends Model
{
    /** @use HasFactory<MediaAssetFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'disk',
        'directory',
        'filename',
        'original_filename',
        'mime_type',
        'extension',
        'bytes',
        'width',
        'height',
        'alt_text',
        'caption',
        'credit',
        'sha256',
        'status',
        'visibility',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'bytes' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
        ];
    }

    /**
     * @return HasMany<MediaVariant, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(MediaVariant::class);
    }

    /**
     * @return BelongsToMany<Product, $this>
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_media')
            ->withPivot(['sort_order', 'alt_text_override', 'is_gallery_visible'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
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

    public function path(): string
    {
        return trim((string) $this->directory, '/').'/'.$this->filename;
    }

    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path());
    }

    /**
     * @return array{src:string|null,srcset:string,sizes:string,width:int|null,height:int|null,alt:string}
     */
    public function responsiveImage(string $sizes = '100vw'): array
    {
        $variants = $this->variants()
            ->where('format', 'webp')
            ->orderBy('width')
            ->get();

        // Fall back to the original file when no webp variants have been generated
        if ($variants->isEmpty()) {
            return [
                'src' => $this->url(),
                'srcset' => $this->url() . ($this->width ? ' ' . $this->width . 'w' : ''),
                'sizes' => $sizes,
                'width' => $this->width,
                'height' => $this->height,
                'alt' => $this->alt_text ?? '',
            ];
        }

        return [
            'src' => $variants->last()?->url(),
            'srcset' => $variants->map(fn (MediaVariant $variant): string => $variant->url().' '.$variant->width.'w')->implode(', '),
            'sizes' => $sizes,
            'width' => $variants->last()?->width,
            'height' => $variants->last()?->height,
            'alt' => $this->alt_text ?? '',
        ];
    }
}
