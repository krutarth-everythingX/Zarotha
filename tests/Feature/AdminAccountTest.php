<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_admin_can_update_own_profile(): void
    {
        $user = $this->adminUser();

        $this->actingAs($user)
            ->get(route('admin.account.edit'))
            ->assertOk();

        $this->actingAs($user)->patch(route('admin.account.profile.update'), [
            'name' => 'Updated Admin',
            'email' => $user->email,
        ])->assertRedirect(route('admin.account.edit'));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Admin',
            'email' => $user->email,
        ]);
    }

    public function test_admin_is_logged_out_after_changing_email(): void
    {
        $user = $this->adminUser();

        $response = $this->actingAs($user)->patch(route('admin.account.profile.update'), [
            'name' => 'Updated Admin',
            'email' => 'updated@example.test',
        ]);

        $response
            ->assertRedirect(route('admin.auth.login.show'))
            ->assertSessionHas('status', 'Email updated. Please sign in again using your new email. Your password stays the same unless you changed it.');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'updated@example.test',
        ]);
        $this->assertGuest();
    }

    public function test_admin_can_change_own_password(): void
    {
        $user = $this->adminUser();

        $this->actingAs($user)->patch(route('admin.account.password.update'), [
            'current_password' => 'password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])->assertRedirect(route('admin.account.edit'));

        $this->assertTrue(Hash::check('new-secure-password', $user->refresh()->password));
    }

    public function test_admin_can_save_theme_preference(): void
    {
        $user = $this->adminUser();

        $this->actingAs($user)->patch(route('admin.account.theme.update'), [
            'theme' => 'light',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'admin_theme' => 'light',
        ]);
    }

    public function test_delete_account_deactivates_user_and_signs_out(): void
    {
        $user = $this->adminUser();

        $this->actingAs($user)->delete(route('admin.account.destroy'), [
            'password' => 'password',
        ])->assertRedirect(route('public.home'));

        $this->assertFalse($user->refresh()->is_active);
        $this->assertGuest();
    }

    private function adminUser(): User
    {
        return User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);
    }
}
