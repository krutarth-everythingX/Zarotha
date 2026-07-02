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

        $this->authorize('update', $siteSetting);

        return Inertia::render('Admin/Settings/General', [
            'settings' => [
                'siteName' => $siteSetting->site_name,
                'lightLogoMediaId' => $siteSetting->light_logo_media_id,
                'darkLogoMediaId' => $siteSetting->dark_logo_media_id,
            ],
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->orderByDesc('created_at')
                ->limit(250)
                ->get()
                ->map(fn (MediaAsset $media) => [
                    'id' => $media->id,
                    'label' => $media->original_filename,
                    'previewUrl' => $media->responsiveImage('100px')['src'] ?? null,
                ]),
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

        $contactInformation->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.pages.contact.edit')
            ->with('status', 'Contact information updated.');
    }
}
