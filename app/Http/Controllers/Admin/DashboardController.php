<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\ContactInformation;
use App\Models\HomepageSection;
use App\Models\HomepageTestimonial;
use App\Models\Inquiry;
use App\Models\Page;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $inquiryStats = [
            'total' => Inquiry::query()->count(),
            'unread' => Inquiry::query()->where('status', 'unread')->count(),
            'read' => Inquiry::query()->where('status', 'read')->count(),
            'replied' => Inquiry::query()->where('status', 'replied')->count(),
            'archived' => Inquiry::query()->where('status', 'archived')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                [
                    'label' => 'Products',
                    'value' => Product::query()->count(),
                    'href' => route('admin.products.index'),
                    'detail' => Product::query()->where('status', 'published')->count().' active / '.Product::query()->where('status', '!=', 'published')->count().' inactive',
                ],
                [
                    'label' => 'Homepage',
                    'value' => HomepageSection::query()->whereIn('section_key', [
                        'hero',
                        'turnkey_solutions',
                        'about_preview',
                        'industry_stats',
                        'latest_products',
                        'quick_inquiry',
                    ])->count(),
                    'href' => route('admin.homepage.edit'),
                    'detail' => HomepageSection::query()->where('is_visible', true)->count().' visible sections',
                ],
                [
                    'label' => 'About Page',
                    'value' => Page::query()->where('page_key', 'about_us')->count(),
                    'href' => route('admin.pages.edit', 'about-us'),
                    'detail' => Page::query()->where('page_key', 'about_us')->where('status', 'published')->count().' published',
                ],
                [
                    'label' => 'Contact Page',
                    'value' => ContactInformation::query()->count(),
                    'href' => route('admin.pages.contact.edit'),
                    'detail' => ContactInformation::query()->whereNotNull('email_primary')->count().' with email',
                ],
                [
                    'label' => 'Socials',
                    'value' => SocialLink::query()->count(),
                    'href' => route('admin.social-links.index'),
                    'detail' => SocialLink::query()->where('is_active', true)->count().' active',
                ],
                [
                    'label' => 'Testimonials',
                    'value' => HomepageTestimonial::query()->count(),
                    'href' => route('admin.testimonials.index'),
                    'detail' => HomepageTestimonial::query()->where('is_visible', true)->where('status', 'published')->count().' active',
                ],
                [
                    'label' => 'Clients',
                    'value' => Client::query()->count(),
                    'href' => route('admin.clients.index'),
                    'detail' => Client::query()->where('is_active', true)->count().' active',
                ],
                [
                    'label' => 'Settings',
                    'value' => SiteSetting::query()->count(),
                    'href' => route('admin.settings.edit'),
                    'detail' => SiteSetting::query()->whereNotNull('site_name')->count().' configured',
                ],
                [
                    'label' => 'Inquiries',
                    'value' => $inquiryStats['total'],
                    'href' => route('admin.inquiries.index'),
                    'detail' => $inquiryStats['unread'].' unread / '.$inquiryStats['replied'].' replied',
                ],
            ],
            'inquiryStats' => $inquiryStats,
        ]);
    }
}
