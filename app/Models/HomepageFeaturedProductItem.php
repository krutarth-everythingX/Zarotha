<?php

namespace App\Models;

use Database\Factories\HomepageFeaturedProductItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomepageFeaturedProductItem extends Model
{
    /** @use HasFactory<HomepageFeaturedProductItemFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'homepage_section_id',
        'product_id',
        'sort_order',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
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
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
