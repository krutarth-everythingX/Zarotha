<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'admin.app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'appName' => config('app.name'),
            'auth' => [
                'user' => fn () => $request->user()
                    ? array_merge(
                        $request->user()->loadMissing('role')->only([
                            'id',
                            'name',
                            'email',
                            'is_active',
                            'avatar_path',
                            'admin_theme',
                        ]),
                        [
                            'role' => $request->user()->role?->slug,
                            'roleName' => $request->user()->role?->name,
                            'avatarUrl' => $request->user()->avatar_path
                                ? Storage::disk('public')->url($request->user()->avatar_path)
                                : null,
                        ],
                    )
                    : null,
            ],
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
            ],
        ];
    }
}
