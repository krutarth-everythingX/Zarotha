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
    public function index(): Response
    {
        $this->authorize('viewAny', Product::class);

        $section = HomepageSection::query()
            ->with(['backgroundMedia.variants', 'testimonials.imageMedia.variants'])
            ->where('section_key', 'testimonials')
            ->firstOrFail();

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => [
                'title' => $section->section_title ?? '',
                'subtitle' => $section->section_intro ?? '',
                'background_media_id' => $section->background_media_id,
                'background_color' => $section->background_color ?? '#ffffff',
                'is_visible' => (bool) $section->is_visible,
                'previewUrl' => $section->backgroundMedia?->responsiveImage('25vw')['src'],
                'items' => $section->testimonials->map(fn (HomepageTestimonial $t) => [
                    'id' => $t->id,
                    'client_name' => $t->client_name,
                    'quote' => $t->quote,
                    'rating' => $t->rating,
                    'image_media_id' => $t->image_media_id,
                    'previewUrl' => $t->imageMedia?->responsiveImage('100px')['src'],
                    'sort_order' => $t->sort_order,
                    'is_active' => $t->is_active,
                ]),
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

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string',
            'background_media_id' => 'nullable|exists:media_assets,id',
            'background_color' => 'nullable|string|max:7',
            'is_visible' => 'boolean',
            'items' => 'array',
            'items.*.id' => 'nullable|integer',
            'items.*.client_name' => 'required|string|max:255',
            'items.*.quote' => 'required|string',
            'items.*.rating' => 'required|integer|min:1|max:5',
            'items.*.image_media_id' => 'nullable|exists:media_assets,id',
            'items.*.sort_order' => 'required|integer',
            'items.*.is_active' => 'boolean',
        ]);

        $userId = $request->user()->id;

        DB::transaction(function () use ($validated, $userId) {
            $section = HomepageSection::query()->where('section_key', 'testimonials')->firstOrFail();
            
            $section->update([
                'section_title' => $validated['title'] ?? null,
                'section_intro' => $validated['subtitle'] ?? null,
                'background_media_id' => $validated['background_media_id'] ?? null,
                'background_color' => $validated['background_color'] ?? null,
                'is_visible' => $validated['is_visible'] ?? true,
                'updated_by_user_id' => $userId,
            ]);

            $existingIds = collect($validated['items'] ?? [])->pluck('id')->filter()->toArray();
            HomepageTestimonial::query()->whereNotIn('id', $existingIds)->delete();

            foreach ($validated['items'] ?? [] as $item) {
                if (!empty($item['id'])) {
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
        });

        return redirect()->back()->with('status', 'Testimonials updated.');
    }
}
