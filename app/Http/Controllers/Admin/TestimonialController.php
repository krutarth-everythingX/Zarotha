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
        $this->ensureSection();

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
                    'customer_name' => $t->customer_name,
                    'location_or_role' => $t->location_or_role,
                    'body_text' => $t->body_text,
                    'image_media_id' => $t->image_media_id,
                    'status' => $t->status,
                    'previewUrl' => $t->imageMedia?->responsiveImage('100px')['src'],
                    'sort_order' => $t->sort_order,
                    'is_visible' => $t->is_visible,
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
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string',
            'background_media_id' => 'nullable|exists:media_assets,id',
            'background_color' => 'nullable|string|max:7',
            'is_visible' => 'boolean',
            'items' => 'array',
            'items.*.id' => 'nullable|integer',
            'items.*.customer_name' => 'required|string|max:150',
            'items.*.location_or_role' => 'nullable|string|max:150',
            'items.*.body_text' => 'required|string',
            'items.*.image_media_id' => 'nullable|exists:media_assets,id',
            'items.*.status' => 'required|in:draft,published',
            'items.*.sort_order' => 'required|integer',
            'items.*.is_visible' => 'boolean',
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
            HomepageTestimonial::query()
                ->where('homepage_section_id', $section->id)
                ->when($existingIds !== [], fn ($query) => $query->whereNotIn('id', $existingIds))
                ->delete();

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
            ],
        );
    }
}
