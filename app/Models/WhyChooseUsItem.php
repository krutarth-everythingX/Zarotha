<?php

namespace App\Models;

use Database\Factories\WhyChooseUsItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhyChooseUsItem extends Model
{
    /** @use HasFactory<WhyChooseUsItemFactory> */
    use HasFactory;

    protected $fillable = [
        'homepage_section_id',
        'heading',
        'body_text',
        'icon_media_id',
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
     * @return BelongsTo<HomepageSection, $this>
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(HomepageSection::class, 'homepage_section_id');
    }
}
