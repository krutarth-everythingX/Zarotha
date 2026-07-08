<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use App\Models\HomepageTestimonial;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);
        $this->ensureSection();

        $isSettingsPage = $request->routeIs('admin.settings.testimonials.edit');
        $section = HomepageSection::query()
            ->when(! $isSettingsPage, fn ($query) => $query->with(['testimonials.imageMedia.variants']))
            ->where('section_key', 'testimonials')
            ->firstOrFail();
        $props = [
            'pageMode' => $isSettingsPage ? 'settings' : 'manager',
            'section' => [
                'title' => $section->section_title,
                'intro' => $section->section_intro,
                'backgroundColor' => $section->background_color ?? '#ffffff',
            ],
        ];

        if ($isSettingsPage) {
            return Inertia::render('Admin/Testimonials/Index', $props);
        }

        return Inertia::render('Admin/Testimonials/Index', [
            ...$props,
            'testimonials' => [
                'items' => $section->testimonials->map(fn (HomepageTestimonial $t) => [
                    'id' => $t->id,
                    'customer_name' => $t->customer_name,
                    'location_or_role' => $t->location_or_role,
                    'body_text' => $t->body_text,
                    'rating' => $t->rating,
                    'image_media_id' => $t->image_media_id,
                    'status' => $t->status,
                    'previewUrl' => $t->imageMedia?->responsiveImage('100px')['src'],
                    'sort_order' => $t->sort_order,
                    'is_visible' => $t->is_visible,
                ]),
            ],
            'stats' => [
                'total' => HomepageTestimonial::query()->count(),
                'active' => HomepageTestimonial::query()
                    ->where('status', 'published')
                    ->where('is_visible', true)
                    ->count(),
                'inactive' => HomepageTestimonial::query()
                    ->where(function ($query): void {
                        $query->where('status', '!=', 'published')
                            ->orWhere('is_visible', false);
                    })
                    ->count(),
            ],
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->orderByDesc('created_at')
                ->limit(250)
                ->get()
                ->map(fn (MediaAsset $media) => [
                    'id' => $media->id,
                    'label' => $media->original_filename,
                    'altText' => $media->alt_text,
                    'url' => $media->responsiveImage('100px')['src'] ?? null,
                    'previewUrl' => $media->responsiveImage('100px')['src'] ?? null,
                    'status' => $media->status,
                ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->ensureSection();

        $validated = $request->validate([
            'section_title' => 'sometimes|nullable|string|max:255',
            'section_intro' => 'sometimes|nullable|string|max:1000',
            'background_color' => 'sometimes|nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'items' => 'sometimes|array',
            'items.*.id' => 'nullable|integer',
            'items.*.customer_name' => 'required|string|max:150',
            'items.*.location_or_role' => 'nullable|string|max:150',
            'items.*.body_text' => 'required|string|max:450',
            'items.*.rating' => 'required|integer|min:1|max:5',
            'items.*.image_media_id' => 'nullable|exists:media_assets,id',
            'items.*.status' => 'required|in:draft,published',
            'items.*.sort_order' => 'required|integer',
            'items.*.is_visible' => 'boolean',
        ]);

        $userId = $request->user()->id;

        DB::transaction(function () use ($validated, $userId) {
            $section = HomepageSection::query()->where('section_key', 'testimonials')->firstOrFail();

            $sectionData = [];

            if (array_key_exists('section_title', $validated)) {
                $sectionData['section_title'] = $validated['section_title'];
            }

            if (array_key_exists('section_intro', $validated)) {
                $sectionData['section_intro'] = $validated['section_intro'];
            }

            if (array_key_exists('background_color', $validated)) {
                $sectionData['background_color'] = $validated['background_color'];
            }

            if ($sectionData !== []) {
                $section->update([
                    ...$sectionData,
                    'updated_by_user_id' => $userId,
                ]);
            }

            if (array_key_exists('items', $validated)) {
                $existingIds = collect($validated['items'] ?? [])->pluck('id')->filter()->toArray();
                HomepageTestimonial::query()
                    ->where('homepage_section_id', $section->id)
                    ->when($existingIds !== [], fn ($query) => $query->whereNotIn('id', $existingIds))
                    ->delete();

                foreach ($validated['items'] ?? [] as $item) {
                    if (! empty($item['id'])) {
                        HomepageTestimonial::query()->where('id', $item['id'])->update([
                            ...$item,
                            'updated_by_user_id' => $userId,
                        ]);
                    } else {
                        HomepageTestimonial::query()->create([
                            ...$item,
                            'homepage_section_id' => $section->id,
                            'created_by_user_id' => $userId,
                            'updated_by_user_id' => $userId,
                        ]);
                    }
                }
            }

            $section->update(['updated_by_user_id' => $userId]);
        });

        return redirect()->back()->with('status', 'Testimonials updated.');
    }

    private function ensureSection(): void
    {
        HomepageSection::query()->firstOrCreate(
            ['section_key' => 'testimonials'],
            [
                'section_title' => 'Testimonials',
                'section_intro' => 'What customers are saying.',
                'source_mode' => 'manual',
                'sort_order' => 60,
                'is_visible' => true,
                'background_color' => '#ffffff',
            ],
        );
    }
}
