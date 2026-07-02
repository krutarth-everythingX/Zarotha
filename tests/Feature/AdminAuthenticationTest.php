<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AdminAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_is_available(): void
    {
        $response = $this->get('/admin/login');

        $response->assertOk();
    }

    public function test_authorized_admin_user_can_sign_in(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
        ]);

        $token = 'test-token';

        $response = $this->withSession(['_token' => $token])->post('/admin/login', [
            '_token' => $token,
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticatedAs($user);
    }

    public function test_inactive_user_is_blocked_from_signing_in(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::idFor(UserRole::SuperAdministrator),
            'is_active' => false,
        ]);

        $token = 'test-token';

        $response = $this->from('/admin/login')->withSession(['_token' => $token])->post('/admin/login', [
            '_token' => $token,
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin/login');
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_guest_is_redirected_away_from_admin_dashboard(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/admin/login');
    }

    public function test_password_reset_request_does_not_disclose_unknown_accounts(): void
    {
        $token = 'test-token';

        $response = $this->from('/admin/forgot-password')->withSession(['_token' => $token])->post('/admin/forgot-password', [
            '_token' => $token,
            'email' => 'missing@example.test',
        ]);

        $response->assertRedirect('/admin/forgot-password');
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('status', trans(Password::RESET_LINK_SENT));
    }
}
