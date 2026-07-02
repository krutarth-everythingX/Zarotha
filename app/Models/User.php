<?php

namespace App\Models;

use App\Enums\UserRole;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $role_id
 * @property string $name
 * @property string $email
 * @property bool $is_active
 * @property Carbon|null $last_login_at
 * @property-read Role $role
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @return BelongsTo<Role, $this>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function roleEnum(): UserRole
    {
        return UserRole::from($this->role->slug);
    }

    public function canAccessCms(): bool
    {
        return $this->is_active && in_array($this->roleEnum(), UserRole::cases(), true);
    }

    public function canManageContent(): bool
    {
        return $this->is_active && in_array($this->roleEnum(), [
            UserRole::SuperAdministrator,
            UserRole::ContentEditor,
        ], true);
    }

    public function canManageInquiries(): bool
    {
        return $this->is_active && in_array($this->roleEnum(), [
            UserRole::SuperAdministrator,
            UserRole::InquiryManager,
        ], true);
    }

    public function canManageSeo(): bool
    {
        return $this->canManageContent();
    }

    public function canManageRedirects(): bool
    {
        return $this->canManageContent();
    }
}
