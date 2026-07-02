<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InquiryActivityType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Inquiry\AddInquiryNoteRequest;
use App\Http\Requests\Admin\Inquiry\AssignInquiryRequest;
use App\Http\Requests\Admin\Inquiry\ExportInquiriesRequest;
use App\Http\Requests\Admin\Inquiry\UpdateInquiryStatusRequest;
use App\Models\Inquiry;
use App\Models\InquiryActivity;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Inquiry::class);

        $search = trim((string) $request->string('search'));
        $status = $request->query('status');
        $assignedUserId = $request->query('assigned_user_id');
        $sourcePageKey = $request->query('source_page_key');

        $inquiries = Inquiry::query()
            ->with(['product', 'assignedUser'])
            ->when($search !== '', fn ($query) => $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            }))
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', $status))
            ->when($assignedUserId !== null && $assignedUserId !== '', fn ($query) => $query->where('assigned_user_id', (int) $assignedUserId))
            ->when($sourcePageKey !== null && $sourcePageKey !== '', fn ($query) => $query->where('source_page_key', $sourcePageKey))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Inquiries/Index', [
            'filters' => [
                'search' => $search === '' ? null : $search,
                'status' => $status,
                'assignedUserId' => $assignedUserId,
                'sourcePageKey' => $sourcePageKey,
            ],
            'assignableUsers' => $this->assignableUsers(),
            'inquiries' => [
                'data' => $inquiries->getCollection()->map(fn (Inquiry $inquiry) => $this->inquiryListItem($inquiry)),
                'meta' => [
                    'currentPage' => $inquiries->currentPage(),
                    'perPage' => $inquiries->perPage(),
                    'total' => $inquiries->total(),
                    'lastPage' => $inquiries->lastPage(),
                    'from' => $inquiries->firstItem(),
                    'to' => $inquiries->lastItem(),
                ],
            ],
        ]);
    }

    public function show(Inquiry $inquiry): Response
    {
        $this->authorize('view', $inquiry);

        $inquiry->load(['product', 'assignedUser', 'activities']);

        return Inertia::render('Admin/Inquiries/Show', [
            'assignableUsers' => $this->assignableUsers(),
            'inquiry' => [
                ...$this->inquiryListItem($inquiry),
                'message' => $inquiry->message,
                'whatsappNumber' => $inquiry->whatsapp_number,
                'referrerUrl' => $inquiry->referrer_url,
                'utm' => [
                    'source' => $inquiry->utm_source,
                    'medium' => $inquiry->utm_medium,
                    'campaign' => $inquiry->utm_campaign,
                    'term' => $inquiry->utm_term,
                    'content' => $inquiry->utm_content,
                ],
                'consentConfirmed' => $inquiry->consent_confirmed,
                'activities' => $inquiry->activities->map(fn (InquiryActivity $activity) => [
                    'id' => $activity->id,
                    'type' => $activity->activity_type->value,
                    'noteBody' => $activity->note_body,
                    'oldStatus' => $activity->old_status,
                    'newStatus' => $activity->new_status,
                    'createdAt' => $activity->created_at?->toAtomString(),
                ]),
            ],
        ]);
    }

    public function updateStatus(UpdateInquiryStatusRequest $request, Inquiry $inquiry): RedirectResponse
    {
        DB::transaction(function () use ($request, $inquiry): void {
            $oldStatus = $inquiry->status->value;
            $newStatus = $request->validated('status');

            $inquiry->update([
                'status' => $newStatus,
                'archived_at' => $newStatus === 'archived' ? now() : null,
            ]);

            InquiryActivity::query()->create([
                'inquiry_id' => $inquiry->id,
                'actor_user_id' => $request->user()->id,
                'activity_type' => InquiryActivityType::StatusChanged,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'created_at' => now(),
            ]);
        });

        return redirect()
            ->route('admin.inquiries.show', $inquiry)
            ->with('status', 'Inquiry status updated.');
    }

    public function addNote(AddInquiryNoteRequest $request, Inquiry $inquiry): RedirectResponse
    {
        InquiryActivity::query()->create([
            'inquiry_id' => $inquiry->id,
            'actor_user_id' => $request->user()->id,
            'activity_type' => InquiryActivityType::NoteAdded,
            'note_body' => $request->validated('note_body'),
            'created_at' => now(),
        ]);

        return redirect()
            ->route('admin.inquiries.show', $inquiry)
            ->with('status', 'Inquiry note added.');
    }

    public function assign(AssignInquiryRequest $request, Inquiry $inquiry): RedirectResponse
    {
        DB::transaction(function () use ($request, $inquiry): void {
            $oldAssignedUserId = $inquiry->assigned_user_id;
            $newAssignedUserId = (int) $request->validated('assigned_user_id');

            $inquiry->update([
                'assigned_user_id' => $newAssignedUserId,
            ]);

            InquiryActivity::query()->create([
                'inquiry_id' => $inquiry->id,
                'actor_user_id' => $request->user()->id,
                'activity_type' => InquiryActivityType::Assigned,
                'old_assigned_user_id' => $oldAssignedUserId,
                'new_assigned_user_id' => $newAssignedUserId,
                'created_at' => now(),
            ]);
        });

        return redirect()
            ->route('admin.inquiries.show', $inquiry)
            ->with('status', 'Inquiry assignment updated.');
    }

    public function export(ExportInquiriesRequest $request): StreamedResponse
    {
        $validated = $request->validated();

        $inquiries = Inquiry::query()
            ->when(($validated['status'] ?? null) !== null, fn ($query) => $query->where('status', $validated['status']))
            ->when(($validated['assigned_user_id'] ?? null) !== null, fn ($query) => $query->where('assigned_user_id', $validated['assigned_user_id']))
            ->when(($validated['source_page_key'] ?? null) !== null, fn ($query) => $query->where('source_page_key', $validated['source_page_key']))
            ->when(($validated['from_date'] ?? null) !== null, fn ($query) => $query->whereDate('created_at', '>=', $validated['from_date']))
            ->when(($validated['to_date'] ?? null) !== null, fn ($query) => $query->whereDate('created_at', '<=', $validated['to_date']))
            ->when(($validated['search'] ?? null) !== null, fn ($query) => $query->where(function ($builder) use ($validated): void {
                $builder->where('name', 'like', '%'.$validated['search'].'%')
                    ->orWhere('email', 'like', '%'.$validated['search'].'%');
            }))
            ->with(['product', 'assignedUser'])
            ->orderByDesc('created_at')
            ->get();

        if ($inquiries->isNotEmpty()) {
            InquiryActivity::query()->create([
                'inquiry_id' => $inquiries->first()->id,
                'actor_user_id' => $request->user()->id,
                'activity_type' => InquiryActivityType::Exported,
                'created_at' => now(),
            ]);
        }

        return response()->streamDownload(function () use ($inquiries): void {
            $handle = fopen('php://output', 'wb');

            if ($handle === false) {
                return;
            }

            fputcsv($handle, [
                'Inquiry ID',
                'Created At',
                'Status',
                'Assigned User',
                'Name',
                'Email',
                'Phone',
                'WhatsApp Number',
                'Subject',
                'Message',
                'Product Reference',
                'Source Page Key',
                'Source URL',
                'Consent Confirmed',
                'Referrer URL',
                'UTM Source',
                'UTM Medium',
                'UTM Campaign',
                'UTM Term',
                'UTM Content',
                'Last Replied At',
                'Archived At',
            ]);

            foreach ($inquiries as $inquiry) {
                fputcsv($handle, [
                    $inquiry->id,
                    $inquiry->created_at?->toDateTimeString(),
                    $inquiry->status->value,
                    $this->safeCsv($inquiry->assignedUser?->name),
                    $this->safeCsv($inquiry->name),
                    $this->safeCsv($inquiry->email),
                    $this->safeCsv($inquiry->phone),
                    $this->safeCsv($inquiry->whatsapp_number),
                    $this->safeCsv($inquiry->subject),
                    $this->safeCsv($inquiry->message),
                    $this->safeCsv($inquiry->product?->name),
                    $this->safeCsv($inquiry->source_page_key),
                    $this->safeCsv($inquiry->source_url),
                    $inquiry->consent_confirmed ? '1' : '0',
                    $this->safeCsv($inquiry->referrer_url),
                    $this->safeCsv($inquiry->utm_source),
                    $this->safeCsv($inquiry->utm_medium),
                    $this->safeCsv($inquiry->utm_campaign),
                    $this->safeCsv($inquiry->utm_term),
                    $this->safeCsv($inquiry->utm_content),
                    $inquiry->last_replied_at?->toDateTimeString(),
                    $inquiry->archived_at?->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, 'inquiries.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * @return Collection<int, array{id:int,label:string}>
     */
    private function assignableUsers(): Collection
    {
        return User::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'label' => $user->name,
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function inquiryListItem(Inquiry $inquiry): array
    {
        return [
            'id' => $inquiry->id,
            'status' => $inquiry->status->value,
            'name' => $inquiry->name,
            'email' => $inquiry->email,
            'phone' => $inquiry->phone,
            'subject' => $inquiry->subject,
            'product' => $inquiry->product === null ? null : [
                'id' => $inquiry->product->id,
                'name' => $inquiry->product->name,
                'slug' => $inquiry->product->slug,
            ],
            'assignedUser' => $inquiry->assignedUser === null ? null : [
                'id' => $inquiry->assignedUser->id,
                'name' => $inquiry->assignedUser->name,
            ],
            'sourcePageKey' => $inquiry->source_page_key,
            'createdAt' => $inquiry->created_at?->toAtomString(),
        ];
    }

    private function safeCsv(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return $value;
        }

        return preg_match('/^[=+\-@]/', $value) === 1 ? "'".$value : $value;
    }
}
