<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $search = trim((string) $request->string('search'));

        $users = User::query()
            ->with('role')
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => [
                'data' => $users->getCollection()->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roleSlug' => $user->role->slug,
                    'isActive' => $user->is_active,
                    'lastLoginAt' => $user->last_login_at?->toAtomString(),
                ]),
                'meta' => [
                    'currentPage' => $users->currentPage(),
                    'perPage' => $users->perPage(),
                    'total' => $users->total(),
                    'lastPage' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
            ],
            'roleOptions' => Role::query()->orderBy('name')->get(['id', 'name'])->map(fn (Role $role) => [
                'id' => $role->id,
                'label' => $role->name,
            ]),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::query()->create([
            ...$request->safe()->except('password'),
            'password' => Hash::make($request->validated('password')),
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User created.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->safe()->except('password');

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->validated('password'));
        }

        $user->update($validated);

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User updated.');
    }

    public function deactivate(User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $user->update(['is_active' => false]);

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User deactivated.');
    }
}
