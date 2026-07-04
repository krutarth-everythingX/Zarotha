<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Banner\StoreBannerRequest;
use App\Http\Requests\Admin\Banner\UpdateBannerRequest;
use App\Models\HeroBanner;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Product::class);

        $banners = HeroBanner::query()
            ->with('desktopMedia')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Admin/Banners/Index', [
            'banners' => $banners->map(fn (HeroBanner $banner) => [
                'id' => $banner->id,
                'eyebrow' => $banner->eyebrow,
                'headline' => $banner->headline,
                'bodyText' => $banner->body_text,
                'primaryCtaLabel' => $banner->primary_cta_label,
                'primaryCtaUrl' => $banner->primary_cta_url,
                'desktopMediaId' => $banner->desktop_media_id,
                'previewUrl' => $banner->desktopMedia?->responsiveImage('25vw')['src'],
                'sortOrder' => $banner->sort_order,
                'isActive' => $banner->is_active,
                'startsAt' => $banner->starts_at?->toDateTimeString(),
                'endsAt' => $banner->ends_at?->toDateTimeString(),
            ]),
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->where('status', 'processed')
                ->latest()
                ->limit(50)
                ->get()
                ->map(fn (MediaAsset $media) => [
                    'id' => $media->id,
                    'label' => $media->original_filename,
                    'altText' => $media->alt_text,
                    'url' => $media->responsiveImage('25vw')['src'] ?? null,
                    'status' => $media->status,
                ]),
        ]);
    }

    public function store(StoreBannerRequest $request): RedirectResponse
    {
        HeroBanner::query()->create([
            ...$request->validated(),
            'created_by_user_id' => $request->user()->id,
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()->route('admin.banners.index')->with('status', 'Banner created.');
    }

    public function update(UpdateBannerRequest $request, HeroBanner $banner): RedirectResponse
    {
        $banner->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()->route('admin.banners.index')->with('status', 'Banner updated.');
    }

    public function destroy(HeroBanner $banner): RedirectResponse
    {
        abort_unless((bool) request()->user()?->canManageContent(), 403);
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('status', 'Banner deleted.');
    }
}
