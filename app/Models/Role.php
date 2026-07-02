<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    /** @use HasFactory<RoleFactory> */
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'is_system',
    ];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
        ];
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public static function idFor(UserRole $role): int
    {
        $names = [
            UserRole::SuperAdministrator->value => 'Super Administrator',
            UserRole::ContentEditor->value => 'Content Editor',
            UserRole::InquiryManager->value => 'Inquiry Manager',
        ];

        return (int) static::query()->firstOrCreate(
            ['slug' => $role->value],
            ['name' => $names[$role->value], 'is_system' => true],
        )->getKey();
    }
}
