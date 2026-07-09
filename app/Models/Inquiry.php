<?php

namespace App\Models;

use App\Enums\InquiryStatus;
use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $product_id
 * @property int|null $assigned_user_id
 * @property InquiryStatus $status
 * @property string|null $source_page_key
 * @property string|null $source_url
 * @property string $name
 * @property string|null $email
 * @property string $phone
 * @property string|null $company_name
 * @property string|null $whatsapp_number
 * @property string|null $subject
 * @property string|null $project_location
 * @property string|null $project_state
 * @property string|null $project_country
 * @property string|null $budget_range
 * @property Carbon|null $expected_project_start
 * @property string $message
 * @property array<int, array<string, mixed>>|null $uploaded_images
 * @property bool $consent_confirmed
 * @property string|null $referrer_url
 * @property string|null $utm_source
 * @property string|null $utm_medium
 * @property string|null $utm_campaign
 * @property string|null $utm_term
 * @property string|null $utm_content
 * @property Carbon|null $created_at
 * @property Carbon|null $last_replied_at
 * @property Carbon|null $archived_at
 */
class Inquiry extends Model
{
    /** @use HasFactory<InquiryFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'assigned_user_id',
        'status',
        'source_page_key',
        'source_url',
        'name',
        'email',
        'phone',
        'company_name',
        'whatsapp_number',
        'subject',
        'project_location',
        'project_state',
        'project_country',
        'budget_range',
        'expected_project_start',
        'message',
        'uploaded_images',
        'consent_confirmed',
        'referrer_url',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'ip_hash',
        'user_agent',
        'last_replied_at',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => InquiryStatus::class,
            'consent_confirmed' => 'boolean',
            'expected_project_start' => 'date',
            'uploaded_images' => 'array',
            'last_replied_at' => 'datetime',
            'archived_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * @return HasMany<InquiryActivity, $this>
     */
    public function activities(): HasMany
    {
        return $this->hasMany(InquiryActivity::class)->orderByDesc('created_at');
    }
}
