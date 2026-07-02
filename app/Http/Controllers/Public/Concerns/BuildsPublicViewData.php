<?php

namespace App\Http\Controllers\Public\Concerns;

use App\Models\Category;
use App\Models\ContactInformation;
use App\Models\SiteSetting;
use App\Models\SocialLink;

trait BuildsPublicViewData
{
    /**
     * @return array<string, mixed>
     */
    protected function sharedPublicData(): array
    {
        return [
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
    }
}
