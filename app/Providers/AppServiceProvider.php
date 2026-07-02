<?php

namespace App\Providers;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\ContactInformation;
use App\Models\Inquiry;
use App\Models\MediaAsset;
use App\Models\Product;
use App\Models\Redirect;
use App\Models\SiteSetting;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\ContactInformationPolicy;
use App\Policies\InquiryPolicy;
use App\Policies\MediaAssetPolicy;
use App\Policies\ProductPolicy;
use App\Policies\RedirectPolicy;
use App\Policies\SiteSettingPolicy;
use App\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('admin-login', fn (Request $request) => [
            Limit::perMinute(5)->by($request->ip()),
        ]);

        RateLimiter::for('password-reset', fn (Request $request) => [
            Limit::perMinute(5)->by((string) $request->input('email').$request->ip()),
        ]);

        RateLimiter::for('media-upload', fn (Request $request) => [
            Limit::perMinute(20)->by((string) $request->user()?->id.'|'.$request->ip()),
        ]);

        RateLimiter::for('public-inquiry', fn (Request $request) => [
            Limit::perMinute(3)->by($request->ip()),
        ]);

        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(ContactInformation::class, ContactInformationPolicy::class);
        Gate::policy(Inquiry::class, InquiryPolicy::class);
        Gate::policy(MediaAsset::class, MediaAssetPolicy::class);
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Redirect::class, RedirectPolicy::class);
        Gate::policy(SiteSetting::class, SiteSettingPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        Gate::define('access-admin', fn (User $user): bool => $user->canAccessCms());
        Gate::define('manage-content', fn (User $user): bool => $user->canManageContent());
        Gate::define('manage-inquiries', fn (User $user): bool => $user->canManageInquiries());
        Gate::define('manage-users', fn (User $user): bool => $user->roleEnum() === UserRole::SuperAdministrator);
        Gate::define('manage-seo', fn (User $user): bool => $user->canManageSeo());
        Gate::define('manage-redirects', fn (User $user): bool => $user->canManageRedirects());
    }
}
