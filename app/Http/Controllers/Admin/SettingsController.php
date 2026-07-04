<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\UpdateContactInformationRequest;
use App\Http\Requests\Admin\Settings\UpdateSeoSettingsRequest;
use App\Http\Requests\Admin\Settings\UpdateSiteSettingsRequest;
use App\Models\ContactInformation;
use App\Models\SiteSetting;
use App\Models\MediaAsset;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $siteSetting = SiteSetting::query()->firstOrCreate([
            'id' => 1,
        ], [
            'site_name' => config('app.name'),
        ]);
        $siteSetting->load(['lightLogo.variants', 'darkLogo.variants']);

        $this->authorize('update', $siteSetting);

        return Inertia::render('Admin/Settings/General', [
            'settings' => [
                'siteName' => $siteSetting->site_name,
                'lightLogoMediaId' => $siteSetting->light_logo_media_id,
                'darkLogoMediaId' => $siteSetting->dark_logo_media_id,
                'lightLogo' => $siteSetting->lightLogo ? $this->mediaPayload($siteSetting->lightLogo) : null,
                'darkLogo' => $siteSetting->darkLogo ? $this->mediaPayload($siteSetting->darkLogo) : null,
            ],
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->orderByDesc('created_at')
                ->limit(250)
                ->get()
                ->map(fn (MediaAsset $media): array => $this->mediaPayload($media)),
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        /** @var SiteSetting $siteSetting */
        $siteSetting = SiteSetting::query()->firstOrCreate(['id' => 1], [
            'site_name' => config('app.name'),
        ]);

        $siteSetting->update($request->validated());

        return redirect()
            ->route('admin.settings.edit')
            ->with('status', 'Settings updated.');
    }

    public function seoEdit(): Response
    {
        $siteSetting = SiteSetting::query()->firstOrCreate(['id' => 1], [
            'site_name' => config('app.name'),
        ]);

        $this->authorize('manageSeo', SiteSetting::class);

        return Inertia::render('Admin/Settings/Seo', [
            'settings' => [
                'defaultMetaTitle' => $siteSetting->default_meta_title,
                'defaultMetaDescription' => $siteSetting->default_meta_description,
                'defaultOgImageMediaId' => $siteSetting->default_og_image_media_id,
                'defaultRobotsIndex' => $siteSetting->default_robots_index,
                'defaultRobotsFollow' => $siteSetting->default_robots_follow,
            ],
        ]);
    }

    public function seoUpdate(UpdateSeoSettingsRequest $request): RedirectResponse
    {
        /** @var SiteSetting $siteSetting */
        $siteSetting = SiteSetting::query()->firstOrCreate(['id' => 1], [
            'site_name' => config('app.name'),
        ]);

        $siteSetting->update($request->validated());

        return redirect()
            ->route('admin.seo.settings.edit')
            ->with('status', 'SEO defaults updated.');
    }

    public function contactEdit(): Response
    {
        $contactInformation = ContactInformation::query()->firstOrCreate(['id' => 1]);

        $this->authorize('update', $contactInformation);

        return Inertia::render('Admin/Settings/Contact', [
            'contact' => [
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
            ],
        ]);
    }

    public function contactUpdate(UpdateContactInformationRequest $request): RedirectResponse
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
            ->route('admin.pages.contact.edit')
            ->with('status', 'Contact information updated.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaPayload(MediaAsset $media): array
    {
        $image = $media->responsiveImage('100px');

        return [
            'id' => $media->id,
            'label' => $media->original_filename,
            'altText' => $media->alt_text,
            'url' => $image['src'] ?? null,
            'previewUrl' => $image['src'] ?? null,
            'status' => $media->status,
            'width' => $image['width'] ?? $media->width,
            'height' => $image['height'] ?? $media->height,
        ];
    }
}
