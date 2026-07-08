<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InquiryStatus;
use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Category;
use App\Models\HomepageTestimonial;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = Carbon::today();
        $trendStart = $today->copy()->subDays(6)->startOfDay();

        $productStats = [
            'total' => Product::query()->count(),
            'published' => Product::query()->where('status', PublishStatus::Published->value)->count(),
            'draft' => Product::query()->where('status', PublishStatus::Draft->value)->count(),
            'archived' => Product::query()->where('status', PublishStatus::Archived->value)->count(),
            'featured' => Product::query()->where('is_featured', true)->count(),
        ];

        $inquiryStats = [
            'total' => Inquiry::query()->count(),
            'unread' => Inquiry::query()->where('status', InquiryStatus::Unread->value)->count(),
            'read' => Inquiry::query()->where('status', InquiryStatus::Read->value)->count(),
            'replied' => Inquiry::query()->where('status', InquiryStatus::Replied->value)->count(),
            'archived' => Inquiry::query()->where('status', InquiryStatus::Archived->value)->count(),
        ];

        $inquiryTrendCounts = Inquiry::query()
            ->where('created_at', '>=', $trendStart)
            ->get(['created_at'])
            ->groupBy(fn (Inquiry $inquiry): string => $inquiry->created_at?->toDateString() ?? '')
            ->map(fn ($inquiries): int => $inquiries->count());

        $inquiryTrend = collect(range(0, 6))->map(function (int $dayOffset) use ($today, $inquiryTrendCounts): array {
            $date = $today->copy()->subDays(6 - $dayOffset);

            return [
                'label' => $date->format('D'),
                'date' => $date->toDateString(),
                'value' => $inquiryTrendCounts->get($date->toDateString(), 0),
            ];
        })->values();

        $categoryMix = Category::query()
            ->withCount('products')
            ->orderByDesc('products_count')
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name', 'is_active'])
            ->map(fn (Category $category): array => [
                'label' => $category->name,
                'value' => $category->products_count,
                'active' => $category->is_active,
            ])
            ->values();

        $recentInquiries = Inquiry::query()
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'subject', 'status', 'created_at'])
            ->map(fn (Inquiry $inquiry): array => [
                'id' => $inquiry->id,
                'name' => $inquiry->name,
                'subject' => $inquiry->subject ?: 'General inquiry',
                'status' => $inquiry->status->value,
                'createdAt' => $inquiry->created_at?->diffForHumans(),
                'href' => route('admin.inquiries.show', $inquiry),
            ]);

        $responseRate = $inquiryStats['total'] > 0
            ? (int) round(($inquiryStats['replied'] / $inquiryStats['total']) * 100)
            : 0;

        $publishedShare = $productStats['total'] > 0
            ? (int) round(($productStats['published'] / $productStats['total']) * 100)
            : 0;

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                [
                    'label' => 'Products',
                    'value' => $productStats['total'],
                    'href' => route('admin.products.index'),
                    'detail' => $productStats['published'].' active / '.($productStats['draft'] + $productStats['archived']).' inactive',
                ],
                [
                    'label' => 'Category',
                    'value' => Category::query()->count(),
                    'href' => route('admin.categories.index'),
                    'detail' => Category::query()->where('is_active', true)->count().' active / '.Category::query()->where('is_active', false)->count().' inactive',
                ],
                [
                    'label' => 'Testimonials',
                    'value' => HomepageTestimonial::query()->count(),
                    'href' => route('admin.testimonials.index'),
                    'detail' => HomepageTestimonial::query()->where('is_visible', true)->where('status', 'published')->count().' active',
                ],
                [
                    'label' => 'Inquiries',
                    'value' => $inquiryStats['total'],
                    'href' => route('admin.inquiries.index'),
                    'detail' => $inquiryStats['unread'].' unread / '.$inquiryStats['replied'].' replied',
                ],
                [
                    'label' => 'Our Clients',
                    'value' => Client::query()->count(),
                    'href' => route('admin.clients.index'),
                    'detail' => Client::query()->where('is_active', true)->count().' active',
                ],
                [
                    'label' => 'Settings',
                    'value' => SiteSetting::query()->count(),
                    'href' => route('admin.settings.edit'),
                    'detail' => 'Public pages, socials, and site identity',
                ],
            ],
            'inquiryStats' => $inquiryStats,
            'highlights' => [
                [
                    'label' => 'Open inquiries',
                    'value' => $inquiryStats['unread'] + $inquiryStats['read'],
                    'detail' => $inquiryStats['unread'].' unread need attention',
                    'href' => route('admin.inquiries.index'),
                    'tone' => $inquiryStats['unread'] > 0 ? 'amber' : 'green',
                ],
                [
                    'label' => 'Published catalog',
                    'value' => $publishedShare.'%',
                    'detail' => $productStats['published'].' of '.$productStats['total'].' products live',
                    'href' => route('admin.products.index'),
                    'tone' => 'green',
                ],
                [
                    'label' => 'Featured products',
                    'value' => $productStats['featured'],
                    'detail' => $productStats['published'].' products currently published',
                    'href' => route('admin.products.index'),
                    'tone' => 'blue',
                ],
                [
                    'label' => 'Response rate',
                    'value' => $responseRate.'%',
                    'detail' => $inquiryStats['replied'].' replied from '.$inquiryStats['total'].' total',
                    'href' => route('admin.inquiries.index'),
                    'tone' => $responseRate >= 60 ? 'green' : 'amber',
                ],
            ],
            'charts' => [
                'inquiryTrend' => $inquiryTrend,
                'inquiryStatus' => [
                    ['label' => 'Unread', 'value' => $inquiryStats['unread']],
                    ['label' => 'Read', 'value' => $inquiryStats['read']],
                    ['label' => 'Replied', 'value' => $inquiryStats['replied']],
                    ['label' => 'Archived', 'value' => $inquiryStats['archived']],
                ],
                'productStatus' => [
                    ['label' => 'Published', 'value' => $productStats['published']],
                    ['label' => 'Draft', 'value' => $productStats['draft']],
                    ['label' => 'Archived', 'value' => $productStats['archived']],
                ],
                'categoryMix' => $categoryMix,
            ],
            'recentInquiries' => $recentInquiries,
        ]);
    }
}
