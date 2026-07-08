<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Client\UpsertClientRequest;
use App\Models\Client;
use App\Models\MediaAsset;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $search = trim((string) $request->string('search'));
        $active = $request->query('is_active');

        $clients = Client::query()
            ->with('logoMedia.variants')
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('website_url', 'like', "%{$search}%");
            }))
            ->when($active !== null && $active !== '', fn ($query) => $query->where('is_active', filter_var($active, FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Clients/Index', [
            'filters' => [
                'search' => $search === '' ? null : $search,
                'is_active' => $active,
            ],
            'stats' => [
                'total' => Client::query()->count(),
                'active' => Client::query()->where('is_active', true)->count(),
                'inactive' => Client::query()->where('is_active', false)->count(),
            ],
            'clients' => [
                'data' => $clients->getCollection()->map(fn (Client $client): array => $this->clientPayload($client)),
                'meta' => [
                    'currentPage' => $clients->currentPage(),
                    'perPage' => $clients->perPage(),
                    'total' => $clients->total(),
                    'lastPage' => $clients->lastPage(),
                    'from' => $clients->firstItem(),
                    'to' => $clients->lastItem(),
                ],
            ],
            'mediaOptions' => MediaAsset::query()
                ->with('variants')
                ->orderByDesc('created_at')
                ->limit(250)
                ->get()
                ->map(fn (MediaAsset $media): array => $this->mediaPayload($media)),
        ]);
    }

    public function store(UpsertClientRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Client::query()->create([
            ...$validated,
            'sort_order' => $validated['sort_order'] ?? ((int) Client::query()->max('sort_order') + 1),
            'created_by_user_id' => $request->user()->id,
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.clients.index')
            ->with('status', 'Client saved.');
    }

    public function update(UpsertClientRequest $request, Client $client): RedirectResponse
    {
        $client->update([
            ...$request->validated(),
            'updated_by_user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.clients.index')
            ->with('status', 'Client updated.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        $this->authorize('viewAny', Product::class);

        $client->delete();

        return redirect()
            ->route('admin.clients.index')
            ->with('status', 'Client removed.');
    }

    /**
     * @return array<string, mixed>
     */
    private function clientPayload(Client $client): array
    {
        return [
            'id' => $client->id,
            'name' => $client->name,
            'websiteUrl' => $client->website_url,
            'logoMediaId' => $client->logo_media_id,
            'externalLogoUrl' => $client->logo_media_id === null ? $this->websiteLogoUrl($client->website_url) : null,
            'sortOrder' => $client->sort_order,
            'isActive' => $client->is_active,
            'logoMedia' => $client->logoMedia ? $this->mediaPayload($client->logoMedia) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaPayload(MediaAsset $media): array
    {
        $image = $media->responsiveImage('220px');

        return [
            'id' => $media->id,
            'label' => $media->original_filename,
            'altText' => $media->alt_text,
            'url' => $image['src'] ?? null,
            'status' => $media->status,
            'width' => $image['width'] ?? $media->width,
            'height' => $image['height'] ?? $media->height,
        ];
    }

    private function websiteLogoUrl(?string $websiteUrl): ?string
    {
        if ($websiteUrl === null || trim($websiteUrl) === '') {
            return null;
        }

        $host = parse_url($websiteUrl, PHP_URL_HOST);

        if (! is_string($host) || $host === '') {
            return null;
        }

        return 'https://www.google.com/s2/favicons?domain='.urlencode(Str::lower($host)).'&sz=128';
    }
}
