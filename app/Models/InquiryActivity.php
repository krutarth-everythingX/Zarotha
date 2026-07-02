<?php

namespace App\Models;

use App\Enums\InquiryActivityType;
use Database\Factories\InquiryActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $inquiry_id
 * @property int|null $actor_user_id
 * @property InquiryActivityType $activity_type
 * @property string|null $note_body
 * @property string|null $old_status
 * @property string|null $new_status
 * @property int|null $old_assigned_user_id
 * @property int|null $new_assigned_user_id
 * @property Carbon|null $created_at
 */
class InquiryActivity extends Model
{
    /** @use HasFactory<InquiryActivityFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'inquiry_id',
        'actor_user_id',
        'activity_type',
        'note_body',
        'old_status',
        'new_status',
        'old_assigned_user_id',
        'new_assigned_user_id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'activity_type' => InquiryActivityType::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Inquiry, $this>
     */
    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }
}
