<?php

namespace App\Models;

use Database\Factories\ContactInformationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactInformation extends Model
{
    /** @use HasFactory<ContactInformationFactory> */
    use HasFactory;

    protected $table = 'contact_information';

    protected $fillable = [
        'business_name',
        'phone_primary',
        'phone_secondary',
        'email_primary',
        'email_secondary',
        'whatsapp_number',
        'whatsapp_text',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'show_address',
        'show_phone',
        'show_email',
        'show_whatsapp',
        'contact_intro',
        'form_helper_text',
        'success_message',
        'consent_text',
        'updated_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'show_address' => 'boolean',
            'show_phone' => 'boolean',
            'show_email' => 'boolean',
            'show_whatsapp' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }
}
