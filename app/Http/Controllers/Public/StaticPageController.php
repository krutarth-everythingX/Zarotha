<?php

namespace App\Http\Controllers\Public;

use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\Concerns\BuildsPublicViewData;
use App\Models\Page;
use Illuminate\View\View;

class StaticPageController extends Controller
{
    use BuildsPublicViewData;

    public function show(string $pageKey): View
    {
        $page = Page::query()
            ->with('craftsmanshipSteps')
            ->where('page_key', $pageKey)
            ->where('status', PublishStatus::Published->value)
            ->whereNotNull('published_at')
            ->first();

        return view('pages.static', [
            ...$this->sharedPublicData(),
            'page' => $page,
            'pageKey' => $pageKey,
        ]);
    }
}
