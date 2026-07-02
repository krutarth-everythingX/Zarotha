<?php

namespace App\Services\Media;

class MediaVariantPlan
{
    /**
     * @return array<string, array{width:int,height?:int}>
     */
    public function variants(): array
    {
        /** @var array<string, array{width:int,height?:int}> $variants */
        $variants = config('media.variants');

        return $variants;
    }
}
