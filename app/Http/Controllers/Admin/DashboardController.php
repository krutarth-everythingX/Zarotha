<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Inquiry;
use App\Models\MediaAsset;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'products' => Product::query()->count(),
                'publishedProducts' => Product::query()->where('status', 'published')->count(),
                'categories' => Category::query()->count(),
                'mediaAssets' => MediaAsset::query()->count(),
                'unreadInquiries' => Inquiry::query()->where('status', 'unread')->count(),
            ],
            'recentActivity' => ActivityLog::query()
                ->latest('created_at')
                ->limit(5)
                ->get()
                ->map(fn (ActivityLog $activity) => [
                    'id' => $activity->id,
                    'action' => $activity->action,
                    'summary' => $activity->summary,
                    'createdAt' => $activity->created_at?->toAtomString(),
                ]),
        ]);
    }
}
