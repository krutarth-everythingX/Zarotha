<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->name('admin.auth.')
    ->middleware(['response.noindex'])
    ->group(function (): void {
        Route::middleware('guest')->group(function (): void {
            Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login.show');
            Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                ->middleware('throttle:admin-login')
                ->name('login.store');

            Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.forgot.show');
            Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('throttle:password-reset')
                ->name('password.email');

            Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset.show');
            Route::post('/reset-password', [NewPasswordController::class, 'store'])
                ->middleware('throttle:password-reset')
                ->name('password.reset.update');
        });

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->middleware('auth')
            ->name('logout');
    });
