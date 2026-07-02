<?php

namespace App\Jobs;

use App\Models\MediaAsset;
use App\Services\Media\MediaVariantPlan;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Symfony\Component\Process\Process;
use Throwable;

class GenerateMediaVariants implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $mediaAssetId) {}

    public function handle(MediaVariantPlan $variantPlan): void
    {
        $mediaAsset = MediaAsset::query()->findOrFail($this->mediaAssetId);
        $disk = Storage::disk($mediaAsset->disk);
        $sourcePath = $disk->path($mediaAsset->path());
        $outputDirectory = trim((string) config('media.variant_directory'), '/').'/'.$mediaAsset->id.'/'.pathinfo($mediaAsset->filename, PATHINFO_FILENAME);

        $disk->makeDirectory($outputDirectory);

        $manifestPath = storage_path('app/media-variant-manifest-'.$mediaAsset->id.'-'.uniqid().'.json');
        file_put_contents($manifestPath, json_encode([
            'source' => $sourcePath,
            'outputDirectory' => $disk->path($outputDirectory),
            'quality' => (int) config('media.webp_quality'),
            'variants' => $variantPlan->variants(),
        ], JSON_THROW_ON_ERROR));

        $command = array_filter(explode(' ', (string) config('media.processor_command')));
        $process = new Process([...$command, $manifestPath], base_path(), timeout: 120);

        try {
            $process->mustRun();
            $result = json_decode($process->getOutput(), true, flags: JSON_THROW_ON_ERROR);

            $mediaAsset->variants()->delete();

            foreach ($result['variants'] ?? [] as $variant) {
                $mediaAsset->variants()->create([
                    'variant_key' => $variant['key'],
                    'format' => 'webp',
                    'path' => $outputDirectory.'/'.$variant['filename'],
                    'width' => $variant['width'],
                    'height' => $variant['height'],
                    'bytes' => $variant['bytes'],
                    'is_primary' => $variant['key'] === 'product_detail',
                ]);
            }

            $mediaAsset->update(['status' => 'processed']);
        } catch (Throwable $exception) {
            $mediaAsset->update(['status' => 'failed']);

            Log::warning('Media variant generation failed.', [
                'media_asset_id' => $mediaAsset->id,
                'error' => $exception->getMessage(),
                'processor_output' => $process->getErrorOutput(),
            ]);

            throw $exception instanceof RuntimeException ? $exception : new RuntimeException($exception->getMessage(), previous: $exception);
        } finally {
            if (is_file($manifestPath)) {
                unlink($manifestPath);
            }
        }
    }
}
