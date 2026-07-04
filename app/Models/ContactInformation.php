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
        'page_title',
        'page_intro',
        'form_title',
        'submit_label',
        'inquiry_type_options',
        'location_kicker',
        'location_title',
        'location_body',
        'address_label',
        'map_embed_url',
        'map_link_url',
        'contact_social_links',
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
            'inquiry_type_options' => 'array',
            'contact_social_links' => 'array',
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
