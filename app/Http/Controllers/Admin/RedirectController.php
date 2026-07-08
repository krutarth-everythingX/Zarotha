<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Redirect\StoreRedirectRequest;
use App\Http\Requests\Admin\Redirect\UpdateRedirectRequest;
use App\Models\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RedirectController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Redirect::class);

        $search = trim((string) $request->string('search'));

        $redirects = Redirect::query()
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search): void {
                $builder->where('source_path', 'like', "%{$search}%")
                    ->orWhere('target_path', 'like', "%{$search}%");
            }))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Redirects/Index', [
            'filters' => [
                'search' => $search === '' ? null : $search,
            ],
            'redirects' => [
                'data' => $redirects->getCollection()->map(fn (Redirect $redirect) => [
                    'id' => $redirect->id,
                    'sourcePath' => $redirect->source_path,
                    'targetPath' => $redirect->target_path,
                    'redirectType' => $redirect->redirect_type->value,
                    'httpStatus' => $redirect->http_status,
                    'isActive' => $redirect->is_active,
                ]),
                'meta' => [
                    'currentPage' => $redirects->currentPage(),
                    'perPage' => $redirects->perPage(),
                    'total' => $redirects->total(),
                    'lastPage' => $redirects->lastPage(),
                    'from' => $redirects->firstItem(),
                    'to' => $redirects->lastItem(),
                ],
            ],
        ]);
    }

    public function store(StoreRedirectRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['source_path'] === $validated['target_path']) {
            return redirect()
                ->route('admin.redirects.index')
                ->withErrors(['redirect' => 'Redirect source and target cannot be the same path.']);
        }

        if ($this->wouldCreateLoop($validated['source_path'], $validated['target_path'])) {
            return redirect()
                ->route('admin.redirects.index')
                ->withErrors(['redirect' => 'Redirect target would create a loop.']);
        }

        Redirect::query()->create([
            ...$validated,
            'created_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.redirects.index')
            ->with('status', 'Redirect created.');
    }

    public function update(UpdateRedirectRequest $request, Redirect $redirect): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['source_path'] === $validated['target_path']) {
            return redirect()
                ->route('admin.redirects.index')
                ->withErrors(['redirect' => 'Redirect source and target cannot be the same path.']);
        }

        if ($this->wouldCreateLoop($validated['source_path'], $validated['target_path'], $redirect)) {
            return redirect()
                ->route('admin.redirects.index')
                ->withErrors(['redirect' => 'Redirect target would create a loop.']);
        }

        $redirect->update($validated);

        return redirect()
            ->route('admin.redirects.index')
            ->with('status', 'Redirect updated.');
    }

    public function destroy(Redirect $redirect): RedirectResponse
    {
        $this->authorize('delete', $redirect);

        $redirect->delete();

        return redirect()
            ->route('admin.redirects.index')
            ->with('status', 'Redirect deleted.');
    }

    private function wouldCreateLoop(string $sourcePath, string $targetPath, ?Redirect $currentRedirect = null): bool
    {
        $query = Redirect::query()
            ->where('source_path', $targetPath)
            ->where('target_path', $sourcePath);

        if ($currentRedirect !== null) {
            $query->whereKeyNot($currentRedirect->id);
        }

        return $query->exists();
    }
}
