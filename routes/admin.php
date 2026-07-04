<?php

use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\ContactSocialController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomepageController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductGalleryController;
use App\Http\Controllers\Admin\RedirectController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SocialLinkController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin.user', 'response.noindex'])
    ->group(function (): void {
        Route::get('/', DashboardController::class)->name('dashboard.index');

        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::post('/categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}', [ProductController::class, 'edit'])->name('products.edit');
        Route::match(['put', 'patch'], '/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::post('/products/{product}/publish', [ProductController::class, 'publish'])->name('products.publish');
        Route::post('/products/{product}/archive', [ProductController::class, 'archive'])->name('products.archive');
        Route::post('/products/{product}/toggle', [ProductController::class, 'toggle'])->name('products.toggle');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::get('/products/{product}/gallery', [ProductGalleryController::class, 'index'])->name('products.gallery.index');
        Route::post('/products/{product}/gallery', [ProductGalleryController::class, 'attach'])->name('products.gallery.attach');
        Route::post('/products/{product}/gallery/reorder', [ProductGalleryController::class, 'reorder'])->name('products.gallery.reorder');
        Route::post('/products/{product}/gallery/featured', [ProductGalleryController::class, 'setFeatured'])->name('products.gallery.featured');
        Route::delete('/products/{product}/gallery/{media}', [ProductGalleryController::class, 'detach'])->name('products.gallery.detach');

        Route::get('/media', [MediaController::class, 'index'])->name('media.index');
        Route::post('/media', [MediaController::class, 'store'])->middleware('throttle:media-upload')->name('media.store');
        Route::match(['put', 'patch'], '/media/{media}', [MediaController::class, 'update'])->name('media.update');
        Route::post('/media/{media}/replace', [MediaController::class, 'replace'])->middleware('throttle:media-upload')->name('media.replace');
        Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

        Route::get('/homepage', [HomepageController::class, 'edit'])->name('homepage.edit');
        Route::match(['put', 'patch'], '/homepage', [HomepageController::class, 'save'])->name('homepage.update');
        Route::match(['put', 'patch'], '/homepage/sections/{section}', [HomepageController::class, 'update'])->name('homepage.sections.update');

        Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
        Route::match(['put', 'patch'], '/testimonials', [TestimonialController::class, 'update'])->name('testimonials.update');

        Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
        Route::match(['put', 'patch'], '/clients/{client}', [ClientController::class, 'update'])->name('clients.update');
        Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

        Route::patch('/social-links/settings', [SocialLinkController::class, 'settings'])->name('social-links.settings');
        Route::resource('social-links', SocialLinkController::class)->except(['create', 'show', 'edit']);
        Route::get('/contact-socials', [ContactSocialController::class, 'edit'])->name('contact-socials.edit');
        Route::match(['put', 'patch'], '/contact-socials/contact', [ContactSocialController::class, 'updateContact'])->name('contact-socials.contact.update');

        Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');
        Route::post('/banners', [BannerController::class, 'store'])->name('banners.store');
        Route::match(['put', 'patch'], '/banners/{banner}', [BannerController::class, 'update'])->name('banners.update');
        Route::delete('/banners/{banner}', [BannerController::class, 'destroy'])->name('banners.destroy');

        Route::get('/inquiries', [InquiryController::class, 'index'])->name('inquiries.index');
        Route::get('/inquiries/{inquiry}', [InquiryController::class, 'show'])->name('inquiries.show');
        Route::post('/inquiries/{inquiry}/mark-read', [InquiryController::class, 'markRead'])->name('inquiries.mark-read');
        Route::post('/inquiries/{inquiry}/status', [InquiryController::class, 'updateStatus'])->name('inquiries.update-status');
        Route::post('/inquiries/{inquiry}/notes', [InquiryController::class, 'addNote'])->name('inquiries.add-note');
        Route::post('/inquiries/{inquiry}/assign', [InquiryController::class, 'assign'])->name('inquiries.assign');
        Route::post('/inquiries/export', [InquiryController::class, 'export'])->name('inquiries.export');
        Route::delete('/inquiries/{inquiry}', [InquiryController::class, 'destroy'])->name('inquiries.destroy');

        Route::get('/redirects', [RedirectController::class, 'index'])->name('redirects.index');
        Route::post('/redirects', [RedirectController::class, 'store'])->name('redirects.store');
        Route::match(['put', 'patch'], '/redirects/{redirect}', [RedirectController::class, 'update'])->name('redirects.update');
        Route::delete('/redirects/{redirect}', [RedirectController::class, 'destroy'])->name('redirects.destroy');

        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::match(['put', 'patch'], '/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::post('/users/{user}/deactivate', [UserController::class, 'deactivate'])->name('users.deactivate');

        Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::match(['put', 'patch'], '/settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::get('/seo', [SettingsController::class, 'seoEdit'])->name('seo.settings.edit');
        Route::match(['put', 'patch'], '/seo', [SettingsController::class, 'seoUpdate'])->name('seo.settings.update');
        Route::get('/pages/contact', [SettingsController::class, 'contactEdit'])->name('pages.contact.edit');
        Route::match(['put', 'patch'], '/pages/contact', [SettingsController::class, 'contactUpdate'])->name('pages.contact.update');
        Route::get('/pages/{pageSlug}', [PageController::class, 'edit'])->name('pages.edit');
        Route::match(['put', 'patch'], '/pages/{pageSlug}', [PageController::class, 'update'])->name('pages.update');

        Route::get('/activity', [ActivityController::class, 'index'])->name('activity.index');
    });
