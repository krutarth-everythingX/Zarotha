<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\UpdateContactInformationRequest;
use App\Models\ContactInformation;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactSocialController extends Controller
{
    public function edit(): Response
    {
        $contactInformation = ContactInformation::query()->firstOrCreate(['id' => 1]);

        $this->authorize('update', $contactInformation);

        return Inertia::render('Admin/Settings/ContactSocials', [
            'contact' => $this->contactPayload($contactInformation),
            'links' => SocialLink::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (SocialLink $link): array => [
                    'id' => $link->id,
                    'platform_key' => $link->platform_key,
                    'label' => $link->label,
                    'url' => $link->url,
                    'sort_order' => $link->sort_order,
                    'is_active' => $link->is_active,
                ]),
            'settings' => [
                'showSocialLinksOnHero' => (bool) SiteSetting::query()->first()?->show_social_links_on_hero,
            ],
        ]);
    }

    public function updateContact(UpdateContactInformationRequest $request): RedirectResponse
    {
        /** @var ContactInformation $contactInformation */
        $contactInformation = ContactInformation::query()->firstOrCreate(['id' => 1]);
        $validated = $request->validated();
        $validated['inquiry_type_options'] = collect($validated['inquiry_type_options'] ?? [])
            ->map(fn (?string $option): string => trim((string) $option))
            ->filter()
            ->values()
            ->all();
        $validated['contact_social_links'] = collect($validated['contact_social_links'] ?? [])
            ->map(fn (array $link): array => [
                'label' => trim((string) ($link['label'] ?? '')),
                'url' => trim((string) ($link['url'] ?? '')),
            ])
            ->filter(fn (array $link): bool => $link['label'] !== '' && $link['url'] !== '')
            ->values()
            ->all();

        $contactInformation->update([
            ...$validated,
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.contact-socials.edit')
            ->with('status', 'Contact information updated.');
    }

    /**
     * @return array<string, mixed>
     */
    private function contactPayload(ContactInformation $contactInformation): array
    {
        return [
            'businessName' => $contactInformation->business_name,
            'phonePrimary' => $contactInformation->phone_primary,
            'phoneSecondary' => $contactInformation->phone_secondary,
            'emailPrimary' => $contactInformation->email_primary,
            'emailSecondary' => $contactInformation->email_secondary,
            'whatsappNumber' => $contactInformation->whatsapp_number,
            'whatsappText' => $contactInformation->whatsapp_text,
            'pageTitle' => $contactInformation->page_title,
            'pageIntro' => $contactInformation->page_intro,
            'formTitle' => $contactInformation->form_title,
            'submitLabel' => $contactInformation->submit_label,
            'inquiryTypeOptions' => $contactInformation->inquiry_type_options ?? [],
            'locationKicker' => $contactInformation->location_kicker,
            'locationTitle' => $contactInformation->location_title,
            'locationBody' => $contactInformation->location_body,
            'addressLabel' => $contactInformation->address_label,
            'mapEmbedUrl' => $contactInformation->map_embed_url,
            'mapLinkUrl' => $contactInformation->map_link_url,
            'contactSocialLinks' => $contactInformation->contact_social_links ?? [],
            'addressLine1' => $contactInformation->address_line_1,
            'addressLine2' => $contactInformation->address_line_2,
            'city' => $contactInformation->city,
            'state' => $contactInformation->state,
            'postalCode' => $contactInformation->postal_code,
            'country' => $contactInformation->country,
            'showPhone' => $contactInformation->show_phone,
            'showEmail' => $contactInformation->show_email,
            'showWhatsapp' => $contactInformation->show_whatsapp,
            'showAddress' => $contactInformation->show_address,
            'contactIntro' => $contactInformation->contact_intro,
            'formHelperText' => $contactInformation->form_helper_text,
            'successMessage' => $contactInformation->success_message,
            'consentText' => $contactInformation->consent_text,
        ];
    }
}
