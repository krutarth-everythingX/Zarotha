<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocialLinkController extends Controller
{
    public function index(): Response
    {
        $links = SocialLink::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (SocialLink $link) => [
                'id' => $link->id,
                'platform_key' => $link->platform_key,
                'label' => $link->label,
                'url' => $link->url,
                'sort_order' => $link->sort_order,
                'is_active' => $link->is_active,
            ]);

        return Inertia::render('Admin/SocialLinks/Index', [
            'links' => $links,
            'settings' => [
                'showSocialLinksOnHero' => (bool) SiteSetting::query()->first()?->show_social_links_on_hero,
            ],
        ]);
    }

    public function settings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'show_social_links_on_hero' => ['required', 'boolean'],
        ]);

        $siteSetting = SiteSetting::query()->firstOrCreate(['id' => 1], [
            'site_name' => config('app.name', 'Zarokha'),
            'default_robots_index' => true,
            'default_robots_follow' => true,
        ]);

        $siteSetting->update([
            'show_social_links_on_hero' => $validated['show_social_links_on_hero'],
        ]);

        return redirect()->back()->with('status', 'Social display settings updated.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'platform_key' => 'required|string|max:50|unique:social_links,platform_key',
            'label' => 'nullable|string|max:100',
            'url' => 'required|string|max:2048',
            'sort_order' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        SocialLink::create($validated);

        return redirect()->back()->with('status', 'Social link created.');
    }

    public function update(Request $request, SocialLink $socialLink): RedirectResponse
    {
        $validated = $request->validate([
            'platform_key' => 'required|string|max:50|unique:social_links,platform_key,' . $socialLink->id,
            'label' => 'nullable|string|max:100',
            'url' => 'required|string|max:2048',
            'sort_order' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        $socialLink->update($validated);

        return redirect()->back()->with('status', 'Social link updated.');
    }

    public function destroy(SocialLink $socialLink): RedirectResponse
    {
        $socialLink->delete();
        return redirect()->back()->with('status', 'Social link deleted.');
    }
}
