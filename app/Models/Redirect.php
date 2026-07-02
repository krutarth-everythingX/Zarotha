<?php

namespace App\Models;

use App\Enums\RedirectType;
use Database\Factories\RedirectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $source_path
 * @property string $target_path
 * @property RedirectType $redirect_type
 * @property string|null $source_entity_type
 * @property int|null $source_entity_id
 * @property int $http_status
 * @property bool $is_active
 */
class Redirect extends Model
{
    /** @use HasFactory<RedirectFactory> */
    use HasFactory;

    protected $fillable = [
        'source_path',
        'target_path',
        'redirect_type',
        'source_entity_type',
        'source_entity_id',
        'http_status',
        'is_active',
        'created_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'redirect_type' => RedirectType::class,
            'http_status' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
