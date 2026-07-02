<?php

namespace App\Models;

use Database\Factories\MediaVariantFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $media_asset_id
 * @property string $variant_key
 * @property string $format
 * @property string $path
 * @property int|null $width
 * @property int|null $height
 * @property int|null $bytes
 * @property bool $is_primary
 */
class MediaVariant extends Model
{
    /** @use HasFactory<MediaVariantFactory> */
    use HasFactory;

    protected $fillable = [
        'media_asset_id',
        'variant_key',
        'format',
        'path',
        'width',
        'height',
        'bytes',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'width' => 'integer',
            'height' => 'integer',
            'bytes' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<MediaAsset, $this>
     */
    public function mediaAsset(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class);
    }

    public function url(): string
    {
        return Storage::disk($this->mediaAsset->disk)->url($this->path);
    }
}
