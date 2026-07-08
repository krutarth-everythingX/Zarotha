<?php

namespace App\Services\Media;

use App\Jobs\GenerateMediaVariants;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class MediaLibrary
{
    /**
     * @param  array{alt_text?:string|null,caption?:string|null}  $metadata
     */
    public function storeUpload(UploadedFile $file, int $userId, array $metadata = []): MediaAsset
    {
        $this->assertAllowedImage($file);

        $imageSize = getimagesize($file->getRealPath());

        if ($imageSize === false) {
            throw new RuntimeException('Uploaded image could not be read.');
        }

        $mimeType = $file->getMimeType();
        $extension = $this->extensionForMimeType($mimeType);
        $filename = Str::uuid()->toString().'.'.$extension;
        $directory = trim((string) config('media.original_directory'), '/');
        $disk = (string) config('media.disk');
        $path = $directory.'/'.$filename;
        $contents = file_get_contents($file->getRealPath());

        if ($contents === false) {
            throw new RuntimeException('Uploaded image could not be stored.');
        }

        $sha256 = hash('sha256', $contents);

        if ($existing = $this->reuseExistingUpload($sha256, $contents, $file, $imageSize, $mimeType, $userId, $metadata)) {
            return $existing;
        }

        try {
            return DB::transaction(function () use ($contents, $directory, $disk, $extension, $filename, $file, $imageSize, $mimeType, $path, $sha256, $userId, $metadata): MediaAsset {
                Storage::disk($disk)->put($path, $contents);

                /** @var MediaAsset $mediaAsset */
                $mediaAsset = MediaAsset::query()->create([
                    'disk' => $disk,
                    'directory' => $directory,
                    'filename' => $filename,
                    'original_filename' => $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'extension' => $extension,
                    'bytes' => $file->getSize(),
                    'width' => $imageSize[0],
                    'height' => $imageSize[1],
                    'alt_text' => $metadata['alt_text'] ?? null,
                    'caption' => $metadata['caption'] ?? null,
                    'sha256' => $sha256,
                    'status' => 'uploaded',
                    'visibility' => 'public',
                    'created_by_user_id' => $userId,
                    'updated_by_user_id' => $userId,
                ]);

                GenerateMediaVariants::dispatch($mediaAsset->id);

                return $mediaAsset;
            });
        } catch (QueryException $exception) {
            if (! $this->isDuplicateShaException($exception)) {
                throw $exception;
            }

            Storage::disk($disk)->delete($path);

            if ($existing = $this->reuseExistingUpload($sha256, $contents, $file, $imageSize, $mimeType, $userId, $metadata)) {
                return $existing;
            }

            throw $exception;
        }
    }

    public function replaceUpload(MediaAsset $mediaAsset, UploadedFile $file, int $userId): MediaAsset
    {
        $this->assertAllowedImage($file);

        $imageSize = getimagesize($file->getRealPath());

        if ($imageSize === false) {
            throw new RuntimeException('Replacement image could not be read.');
        }

        $mimeType = $file->getMimeType();
        $extension = $this->extensionForMimeType($mimeType);
        $filename = Str::uuid()->toString().'.'.$extension;
        $directory = trim((string) config('media.original_directory'), '/');
        $disk = (string) config('media.disk');
        $path = $directory.'/'.$filename;
        $contents = file_get_contents($file->getRealPath());

        if ($contents === false) {
            throw new RuntimeException('Replacement image could not be stored.');
        }

        DB::transaction(function () use ($contents, $directory, $disk, $filename, $file, $imageSize, $mediaAsset, $mimeType, $path, $userId): void {
            $oldOriginalPath = $mediaAsset->path();
            $oldVariantDirectory = trim((string) config('media.variant_directory'), '/').'/'.$mediaAsset->id;

            Storage::disk($disk)->put($path, $contents);
            $mediaAsset->variants()->delete();

            Storage::disk($mediaAsset->disk)->deleteDirectory($oldVariantDirectory);
            Storage::disk($mediaAsset->disk)->delete($oldOriginalPath);

            $mediaAsset->update([
                'disk' => $disk,
                'directory' => $directory,
                'filename' => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'mime_type' => $mimeType,
                'extension' => $this->extensionForMimeType($mimeType),
                'bytes' => $file->getSize(),
                'width' => $imageSize[0],
                'height' => $imageSize[1],
                'sha256' => hash('sha256', $contents),
                'status' => 'uploaded',
                'updated_by_user_id' => $userId,
            ]);

            GenerateMediaVariants::dispatch($mediaAsset->id);
        });

        return $mediaAsset->refresh();
    }

    public function deleteWhenUnreferenced(MediaAsset $mediaAsset): void
    {
        if ($this->referenceCount($mediaAsset) > 0) {
            throw new RuntimeException('This media asset cannot be deleted while content still references it.');
        }

        $mediaAsset->delete();
    }

    public function referenceCount(MediaAsset $mediaAsset): int
    {
        return Product::query()->where('featured_media_id', $mediaAsset->id)->count()
            + Product::query()->where('og_image_media_id', $mediaAsset->id)->count()
            + DB::table('product_media')
                ->where('media_asset_id', $mediaAsset->id)
                ->count()
            + DB::table('pages')
                ->where(function ($query) use ($mediaAsset): void {
                    $query->where('hero_media_id', $mediaAsset->id)
                        ->orWhere('og_image_media_id', $mediaAsset->id);
                })
                ->count()
            + DB::table('hero_banners')
                ->where(function ($query) use ($mediaAsset): void {
                    $query->where('desktop_media_id', $mediaAsset->id)
                        ->orWhere('mobile_media_id', $mediaAsset->id);
                })
                ->count()
            + DB::table('homepage_sections')
                ->where(function ($query) use ($mediaAsset): void {
                    $query->where('background_media_id', $mediaAsset->id)
                        ->orWhere('mobile_media_id', $mediaAsset->id);
                })
                ->count()
            + DB::table('homepage_section_banners')->where('media_asset_id', $mediaAsset->id)->count()
            + DB::table('homepage_floating_product_items')->where('image_media_id', $mediaAsset->id)->count()
            + DB::table('homepage_testimonials')->where('image_media_id', $mediaAsset->id)->count()
            + DB::table('clients')->where('logo_media_id', $mediaAsset->id)->count()
            + DB::table('why_choose_us_items')->where('icon_media_id', $mediaAsset->id)->count()
            + DB::table('site_settings')
                ->where(function ($query) use ($mediaAsset): void {
                    $query->where('default_og_image_media_id', $mediaAsset->id)
                        ->orWhere('light_logo_media_id', $mediaAsset->id)
                        ->orWhere('dark_logo_media_id', $mediaAsset->id);
                })
                ->count();
    }

    public function pruneOrphanUploads(int $olderThanHours = 24): int
    {
        $cutoff = now()->subHours($olderThanHours);
        $deleted = 0;

        MediaAsset::query()
            ->where('created_at', '<', $cutoff)
            ->whereDoesntHave('variants')
            ->where('status', 'failed')
            ->chunkById(50, function ($assets) use (&$deleted): void {
                foreach ($assets as $asset) {
                    /** @var MediaAsset $asset */
                    if ($this->referenceCount($asset) === 0) {
                        Storage::disk($asset->disk)->delete($asset->path());
                        $asset->forceDelete();
                        $deleted++;
                    }
                }
            });

        return $deleted;
    }

    private function assertAllowedImage(UploadedFile $file): void
    {
        $mimeType = $file->getMimeType();
        $allowed = config('media.allowed_mime_types');

        if (! in_array($mimeType, $allowed, true)) {
            throw new RuntimeException('Only JPG, PNG, and WebP images are allowed.');
        }
    }

    private function extensionForMimeType(?string $mimeType): string
    {
        $extensions = config('media.extensions');

        if (! is_string($mimeType) || ! isset($extensions[$mimeType])) {
            throw new RuntimeException('Unsupported image MIME type.');
        }

        return $extensions[$mimeType];
    }

    /**
     * @param  array{0:int,1:int}  $imageSize
     * @param  array{alt_text?:string|null,caption?:string|null}  $metadata
     */
    private function reuseExistingUpload(string $sha256, string $contents, UploadedFile $file, array $imageSize, ?string $mimeType, int $userId, array $metadata): ?MediaAsset
    {
        /** @var MediaAsset|null $mediaAsset */
        $mediaAsset = MediaAsset::withTrashed()
            ->where('sha256', $sha256)
            ->first();

        if (! $mediaAsset) {
            return null;
        }

        $shouldGenerateVariants = false;

        DB::transaction(function () use ($contents, $file, $imageSize, $mediaAsset, $metadata, $mimeType, &$shouldGenerateVariants, $userId): void {
            if ($mediaAsset->trashed()) {
                $mediaAsset->restore();
            }

            $updates = [
                'updated_by_user_id' => $userId,
            ];

            if (($metadata['alt_text'] ?? null) && trim((string) $mediaAsset->alt_text) === '') {
                $updates['alt_text'] = $metadata['alt_text'];
            }

            if (($metadata['caption'] ?? null) && trim((string) $mediaAsset->caption) === '') {
                $updates['caption'] = $metadata['caption'];
            }

            $originalMissing = ! Storage::disk($mediaAsset->disk)->exists($mediaAsset->path());

            if ($originalMissing) {
                Storage::disk($mediaAsset->disk)->put($mediaAsset->path(), $contents);
                $updates = [
                    ...$updates,
                    'original_filename' => $mediaAsset->original_filename ?: $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'extension' => $this->extensionForMimeType($mimeType),
                    'bytes' => $file->getSize(),
                    'width' => $imageSize[0],
                    'height' => $imageSize[1],
                    'status' => 'uploaded',
                ];
                $shouldGenerateVariants = true;
            }

            if ($mediaAsset->status !== 'processed' || ! $mediaAsset->variants()->exists()) {
                $updates['status'] = 'uploaded';
                $shouldGenerateVariants = true;
            }

            $mediaAsset->update($updates);
        });

        if ($shouldGenerateVariants) {
            GenerateMediaVariants::dispatch($mediaAsset->id);
        }

        return $mediaAsset->refresh();
    }

    private function isDuplicateShaException(QueryException $exception): bool
    {
        return ($exception->errorInfo[1] ?? null) === 1062
            || str_contains((string) $exception->getMessage(), 'media_assets_sha256_unique');
    }
}
