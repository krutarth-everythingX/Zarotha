<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Account\DeleteAccountRequest;
use App\Http\Requests\Admin\Account\UpdateAccountAvatarRequest;
use App\Http\Requests\Admin\Account\UpdateAccountPasswordRequest;
use App\Http\Requests\Admin\Account\UpdateAccountProfileRequest;
use App\Http\Requests\Admin\Account\UpdateAccountThemeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Account/Edit', [
            'account' => [
                'name' => $user?->name,
                'email' => $user?->email,
                'roleName' => $user?->role?->name,
                'avatarUrl' => $user?->avatar_path ? Storage::disk('public')->url($user->avatar_path) : null,
            ],
        ]);
    }

    public function updateProfile(UpdateAccountProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $emailChanged = $user !== null
            && array_key_exists('email', $validated)
            && $validated['email'] !== $user->email;

        $user?->update($validated);

        if ($emailChanged) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('admin.auth.login.show')
                ->with('status', 'Email updated. Please sign in again using your new email. Your password stays the same unless you changed it.')
                ->withCookie(Cookie::forget(config('session.cookie'), config('session.path'), config('session.domain')))
                ->withCookie(Cookie::forget('XSRF-TOKEN', config('session.path'), config('session.domain')));
        }

        return redirect()
            ->route('admin.account.edit')
            ->with('status', 'Profile updated.');
    }

    public function updateAvatar(UpdateAccountAvatarRequest $request): RedirectResponse
    {
        $user = $request->user();
        $previousPath = $user?->avatar_path;
        $path = $request->file('avatar')?->store('avatars', 'public');

        if ($user !== null && $path !== false && $path !== null) {
            $user->update(['avatar_path' => $path]);

            if ($previousPath) {
                Storage::disk('public')->delete($previousPath);
            }
        }

        return redirect()
            ->route('admin.account.edit')
            ->with('status', 'Profile picture updated.');
    }

    public function removeAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user?->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return redirect()
            ->route('admin.account.edit')
            ->with('status', 'Profile picture removed.');
    }

    public function updatePassword(UpdateAccountPasswordRequest $request): RedirectResponse
    {
        $request->user()?->update([
            'password' => Hash::make($request->validated('password')),
        ]);

        return redirect()
            ->route('admin.account.edit')
            ->with('status', 'Password changed.');
    }

    public function updateTheme(UpdateAccountThemeRequest $request): RedirectResponse
    {
        $request->user()?->update([
            'admin_theme' => $request->validated('theme'),
        ]);

        return redirect()->back();
    }

    public function destroy(DeleteAccountRequest $request): RedirectResponse
    {
        if ($request->user() !== null) {
            if ($request->user()->avatar_path) {
                Storage::disk('public')->delete($request->user()->avatar_path);
            }

            $request->user()->update([
                'avatar_path' => null,
                'is_active' => false,
            ]);
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(route('public.home'))
            ->withCookie(Cookie::forget(config('session.cookie'), config('session.path'), config('session.domain')))
            ->withCookie(Cookie::forget('XSRF-TOKEN', config('session.path'), config('session.domain')));
    }
}
