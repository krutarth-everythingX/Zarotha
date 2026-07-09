<?php

namespace App\Http\Controllers\Public;

use App\Enums\InquiryActivityType;
use App\Enums\PublishStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\Concerns\BuildsPublicViewData;
use App\Http\Requests\Public\SubmitInquiryRequest;
use App\Models\Inquiry;
use App\Models\InquiryActivity;
use App\Models\Client;
use App\Models\ContactInformation;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class ContactController extends Controller
{
    use BuildsPublicViewData;

    public function show(): View
    {
        return view('pages.contact', [
            ...$this->sharedPublicData(),
            'clients' => Client::query()
                ->with('logoMedia.variants')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(),
            'product' => null,
        ]);
    }

    public function submit(SubmitInquiryRequest $request, ?string $productSlug = null): RedirectResponse
    {
        $product = $productSlug === null
            ? null
            : Product::query()
                ->where('slug', $productSlug)
                ->where('status', PublishStatus::Published->value)
                ->whereNotNull('published_at')
                ->firstOrFail();

        DB::transaction(function () use ($request, $product): void {
            /** @var Inquiry $inquiry */
            $inquiry = Inquiry::query()->create([
                ...$request->safe()->except('website', 'consent_confirmed'),
                'consent_confirmed' => $request->boolean('consent_confirmed'),
                'product_id' => $product?->id,
                'source_page_key' => $product === null ? 'contact' : 'product',
                'source_url' => $request->headers->get('referer'),
                'referrer_url' => $request->headers->get('referer'),
                'ip_hash' => hash('sha256', (string) $request->ip().config('app.key')),
                'user_agent' => str($request->userAgent() ?? '')->limit(255)->toString(),
            ]);

            InquiryActivity::query()->create([
                'inquiry_id' => $inquiry->id,
                'activity_type' => InquiryActivityType::Created,
                'created_at' => now(),
            ]);
        });

        return redirect()
            ->back()
            ->with('status', ContactInformation::query()->first()?->success_message ?: 'Your inquiry has been received.');
    }
}
