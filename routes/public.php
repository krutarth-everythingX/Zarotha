<?php

use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\RobotsController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\StaticPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('public.home');
Route::redirect('/collections', '/products', 301);
Route::redirect('/collections/{collectionSlug}', '/products', 301);

Route::get('/products', [ProductController::class, 'index'])->name('public.products.index');
Route::get('/products/{productSlug}', [ProductController::class, 'show'])->name('public.products.show');
Route::post('/products/{productSlug}/inquiries', [ContactController::class, 'submit'])
    ->middleware('throttle:public-inquiry')
    ->name('public.inquiries.product.submit');

Route::get('/about-us', [StaticPageController::class, 'show'])->defaults('pageKey', 'about_us')->name('public.pages.about');
Route::get('/our-craftsmanship', [StaticPageController::class, 'show'])->defaults('pageKey', 'our_craftsmanship')->name('public.pages.craftsmanship');
Route::get('/privacy-policy', [StaticPageController::class, 'show'])->defaults('pageKey', 'privacy_policy')->name('public.pages.privacy');
Route::get('/terms-and-conditions', [StaticPageController::class, 'show'])->defaults('pageKey', 'terms_and_conditions')->name('public.pages.terms');

Route::get('/contact', [ContactController::class, 'show'])->name('public.contact.show');
Route::post('/contact', [ContactController::class, 'submit'])->middleware('throttle:public-inquiry')->name('public.contact.submit');
Route::get('/sitemap.xml', SitemapController::class)->name('public.sitemap');
Route::get('/robots.txt', RobotsController::class)->name('public.robots');
