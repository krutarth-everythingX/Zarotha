<?php

namespace App\Models;

use Database\Factories\CraftsmanshipStepFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CraftsmanshipStep extends Model
{
    /** @use HasFactory<CraftsmanshipStepFactory> */
    use HasFactory;

    protected $fillable = [
        'page_id',
        'title',
        'body_text',
        'media_asset_id',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Page, $this>
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
