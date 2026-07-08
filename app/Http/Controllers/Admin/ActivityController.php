<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(): Response
    {
        abort_unless($this->requestUserCanViewActivity(), 403);

        $activities = ActivityLog::query()
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Activity/Index', [
            'activities' => [
                'data' => $activities->getCollection()->map(fn (ActivityLog $activity) => [
                    'id' => $activity->id,
                    'subjectType' => $activity->subject_type,
                    'subjectId' => $activity->subject_id,
                    'action' => $activity->action,
                    'summary' => $activity->summary,
                    'createdAt' => $activity->created_at?->toAtomString(),
                ]),
                'meta' => [
                    'currentPage' => $activities->currentPage(),
                    'perPage' => $activities->perPage(),
                    'total' => $activities->total(),
                    'lastPage' => $activities->lastPage(),
                    'from' => $activities->firstItem(),
                    'to' => $activities->lastItem(),
                ],
            ],
        ]);
    }

    private function requestUserCanViewActivity(): bool
    {
        /** @var User|null $user */
        $user = request()->user();

        return $user !== null && ($user->roleEnum()->value === 'super_administrator' || $user->canManageContent() || $user->canManageInquiries());
    }
}
