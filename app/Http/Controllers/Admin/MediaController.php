<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Media\ReplaceMediaRequest;
use App\Http\Requests\Admin\Media\StoreMediaRequest;
use App\Http\Requests\Admin\Media\UpdateMediaRequest;
use App\Models\MediaAsset;
use App\Services\Media\MediaLibrary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class MediaController extends Controller
{
    public function index(Request $request, MediaLibrary $mediaLibrary): Response
    {
        $this->authorize('viewAny', MediaAsset::class);

        $search = trim((string) $request->string('search'));
        $status = $request->query('status');

        $media = MediaAsset::query()
            ->with('variants')
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search): void {
                $builder->where('original_filename', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('caption', 'like', "%{$search}%");
            }))
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'filters' => [
                'search' => $search === '' ? null : $search,
                'status' => $status,
            ],
            'media' => [
                'data' => $media->getCollection()->map(fn (MediaAsset $asset) => $this->mediaItem($asset, $mediaLibrary)),
                'meta' => [
                    'currentPage' => $media->currentPage(),
                    'perPage' => $media->perPage(),
                    'total' => $media->total(),
                    'lastPage' => $media->lastPage(),
                    'from' => $media->firstItem(),
                    'to' => $media->lastItem(),
                ],
            ],
            'limits' => [
                'maxUploadKb' => config('media.max_upload_kb'),
                'allowedMimeTypes' => config('media.allowed_mime_types'),
            ],
        ]);
    }

    public function store(StoreMediaRequest $request, MediaLibrary $mediaLibrary): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        try {
            $media = $mediaLibrary->storeUpload($request->file('file'), $request->user()->id, $request->safe()->except('file'));
        } catch (RuntimeException $exception) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $exception->getMessage(),
                    'errors' => [
                        'file' => [$exception->getMessage()],
                    ],
                ], 422);
            }

            return redirect()
                ->route('admin.media.index')
                ->withErrors(['file' => $exception->getMessage()]);
        }

        if ($request->expectsJson()) {
            return response()->json($this->mediaOption($media->refresh()), 201);
        }

        return redirect()
            ->route('admin.media.index')
            ->with('status', 'Media uploaded. Processing variants has been queued.');
    }

    public function update(UpdateMediaRequest $request, MediaAsset $media): RedirectResponse
    {
        $media->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.media.index')
            ->with('status', 'Media metadata updated.');
    }

    public function replace(ReplaceMediaRequest $request, MediaAsset $media, MediaLibrary $mediaLibrary): RedirectResponse
    {
        try {
            $mediaLibrary->replaceUpload($media, $request->file('file'), $request->user()->id);
        } catch (RuntimeException $exception) {
            return redirect()
                ->route('admin.media.index')
                ->withErrors(['file' => $exception->getMessage()]);
        }

        return redirect()
            ->route('admin.media.index')
            ->with('status', 'Media replaced. Processing variants has been queued.');
    }

    public function destroy(MediaAsset $media, MediaLibrary $mediaLibrary): RedirectResponse
    {
        $this->authorize('delete', $media);

        try {
            $mediaLibrary->deleteWhenUnreferenced($media);
        } catch (RuntimeException $exception) {
            return redirect()
                ->route('admin.media.index')
                ->withErrors(['media' => $exception->getMessage()]);
        }

        return redirect()
            ->route('admin.media.index')
            ->with('status', 'Media deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaItem(MediaAsset $asset, MediaLibrary $mediaLibrary): array
    {
        return [
            'id' => $asset->id,
            'originalFilename' => $asset->original_filename,
            'mimeType' => $asset->mime_type,
            'bytes' => $asset->bytes,
            'width' => $asset->width,
            'height' => $asset->height,
            'status' => $asset->status,
            'altText' => $asset->alt_text,
            'caption' => $asset->caption,
            'url' => $asset->status === 'processed' ? $asset->responsiveImage()['src'] : null,
            'variantCount' => $asset->variants->count(),
            'referenceCount' => $mediaLibrary->referenceCount($asset),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaOption(MediaAsset $asset): array
    {
        $image = $asset->responsiveImage('25vw');

        return [
            'id' => $asset->id,
            'label' => $asset->original_filename,
            'originalFilename' => $asset->original_filename,
            'altText' => $asset->alt_text,
            'url' => $image['src'] ?? $asset->url(),
            'status' => $asset->status,
            'width' => $asset->width,
            'height' => $asset->height,
        ];
    }
}
