<?php

namespace App\Http\Controllers\Public\Concerns;

use App\Models\Category;
use App\Models\ContactInformation;
use App\Models\HomepageSection;
use App\Models\SiteSetting;
use App\Models\SocialLink;

trait BuildsPublicViewData
{
    /**
     * @return array<string, mixed>
     */
    protected function sharedPublicData(bool $includeQuickInquirySection = true): array
    {
        $data = [
            'siteSettings' => SiteSetting::query()->first(),
            'contactInformation' => ContactInformation::query()->first(),
            'socialLinks' => SocialLink::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'footerCategories' => Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->limit(8)
                ->get(),
        ];

        if ($includeQuickInquirySection) {
            $data['quickInquirySection'] = HomepageSection::query()
                ->with(['backgroundMedia.variants', 'banners.imageMedia.variants'])
                ->where('section_key', 'quick_inquiry')
                ->first();
        }

        return $data;
    }
}
