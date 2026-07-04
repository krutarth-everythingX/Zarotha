import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Check, Eye, Share2, Trash2, X } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FormInput, FormSelect, PagePanel, PaginationLinks, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { InquiryStatus, Paginated, SelectOption } from '@admin/types';

type InquiryListItem = {
    id: number;
    status: InquiryStatus;
    name: string;
    email: string;
    phone: string;
    companyName: string | null;
    subject: string | null;
    message: string;
    product: { id: number; name: string; slug: string } | null;
    assignedUser: { id: number; name: string } | null;
    sourcePageKey: string | null;
    sourceUrl: string | null;
    whatsappNumber: string | null;
    referrerUrl: string | null;
    consentConfirmed: boolean;
    createdAt: string | null;
};

type InquiriesIndexProps = {
    inquiries: Paginated<InquiryListItem>;
    assignableUsers: SelectOption[];
    stats: {
        total: number;
        unread: number;
        read: number;
        replied: number;
        archived: number;
    };
    filters: {
        search: string | null;
        status: string | null;
        assignedUserId: string | number | null;
        sourcePageKey: string | null;
    };
};

function toneForStatus(status: InquiryStatus) {
    if (status === 'replied') {
        return 'green';
    }

    if (status === 'archived') {
        return 'red';
    }

    return status === 'read' ? 'neutral' : 'amber';
}

function formatDate(value: string | null) {
    if (!value) {
        return 'No date';
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function shareText(inquiry: InquiryListItem) {
    return [
        `Inquiry #${inquiry.id}`,
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Phone: ${inquiry.phone}`,
        inquiry.companyName ? `Company: ${inquiry.companyName}` : null,
        inquiry.product ? `Product: ${inquiry.product.name}` : null,
        inquiry.subject ? `Subject: ${inquiry.subject}` : null,
        `Message: ${inquiry.message}`,
    ]
        .filter(Boolean)
        .join('\n');
}

export default function InquiriesIndex({ inquiries, assignableUsers, stats, filters }: InquiriesIndexProps) {
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryListItem | null>(null);

    const statCards = useMemo(
        () => [
            ['Total', stats.total],
            ['Unread', stats.unread],
            ['Read', stats.read],
            ['Replied', stats.replied],
            ['Archived', stats.archived],
        ],
        [stats],
    );

    const markRead = (inquiry: InquiryListItem) => {
        router.post(`/admin/inquiries/${inquiry.id}/mark-read`, {}, { preserveScroll: true });
    };

    const removeInquiry = (inquiry: InquiryListItem) => {
        if (!window.confirm(`Remove inquiry from ${inquiry.name}?`)) {
            return;
        }

        router.delete(`/admin/inquiries/${inquiry.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedInquiry?.id === inquiry.id) {
                    setSelectedInquiry(null);
                }
            },
        });
    };

    const shareInquiry = async (inquiry: InquiryListItem) => {
        const text = shareText(inquiry);

        if (navigator.share) {
            await navigator.share({
                title: `Inquiry #${inquiry.id}`,
                text,
            });
            return;
        }

        await navigator.clipboard.writeText(text);
        window.alert('Inquiry details copied to clipboard.');
    };

    return (
        <>
            <Head title="Inquiries" />
            <AdminShell title="Inquiries" description="Store public inquiries, review stats, and manage each inquiry from the list.">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {statCards.map(([label, value]) => (
                        <PagePanel key={label} className="p-4">
                            <Text>{label}</Text>
                            <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">{value}</p>
                        </PagePanel>
                    ))}
                </section>

                <PagePanel className="mt-6">
                    <form className="grid gap-4 lg:grid-cols-[1fr_180px_220px_180px_auto]" method="get" action="/admin/inquiries">
                        <Field>
                            <Label>Search</Label>
                            <FormInput name="search" defaultValue={filters.search ?? ''} placeholder="Name, email, or subject" />
                        </Field>
                        <Field>
                            <Label>Status</Label>
                            <FormSelect name="status" defaultValue={filters.status ?? ''}>
                                <option value="">All</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="archived">Archived</option>
                            </FormSelect>
                        </Field>
                        <Field>
                            <Label>Assigned user</Label>
                            <FormSelect name="assigned_user_id" defaultValue={filters.assignedUserId ?? ''}>
                                <option value="">Anyone</option>
                                {assignableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </Field>
                        <Field>
                            <Label>Source page</Label>
                            <FormSelect name="source_page_key" defaultValue={filters.sourcePageKey ?? ''}>
                                <option value="">All sources</option>
                                <option value="contact">Contact</option>
                                <option value="product">Product</option>
                            </FormSelect>
                        </Field>
                        <div className="flex items-end gap-2">
                            <Button type="submit" color="light">
                                Filter
                            </Button>
                            <Button href="/admin/inquiries" plain>
                                Clear
                            </Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {inquiries.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No inquiries found" description="Adjust the filters or wait for new inquiry submissions." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {inquiries.data.map((inquiry) => (
                                <article key={inquiry.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_140px_160px_auto] xl:items-center">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate font-medium text-zinc-950 dark:text-white">{inquiry.name}</p>
                                            <StatusBadge tone={toneForStatus(inquiry.status)}>{inquiry.status}</StatusBadge>
                                        </div>
                                        <Text>
                                            {inquiry.email} / {inquiry.phone}
                                        </Text>
                                        <Text>{inquiry.subject ?? inquiry.product?.name ?? 'General inquiry'}</Text>
                                    </div>
                                    <Text>{formatDate(inquiry.createdAt)}</Text>
                                    <Text>{inquiry.assignedUser?.name ?? 'Unassigned'}</Text>
                                    <div className="flex flex-wrap gap-2 xl:justify-end">
                                        <Button type="button" color="light" onClick={() => setSelectedInquiry(inquiry)}>
                                            <Eye data-slot="icon" />
                                            View
                                        </Button>
                                        <Button type="button" color="light" onClick={() => markRead(inquiry)}>
                                            <Check data-slot="icon" />
                                            Mark read
                                        </Button>
                                        <Button type="button" color="light" onClick={() => void shareInquiry(inquiry)}>
                                            <Share2 data-slot="icon" />
                                            Share
                                        </Button>
                                        <Button type="button" plain onClick={() => removeInquiry(inquiry)}>
                                            <Trash2 data-slot="icon" />
                                            Remove
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <PaginationLinks meta={inquiries.meta} baseUrl="/admin/inquiries" />
                </div>

                {selectedInquiry ? (
                    <div
                        className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="inquiry-modal-title"
                        onClick={() => setSelectedInquiry(null)}
                    >
                        <div
                            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 id="inquiry-modal-title" className="text-xl font-semibold text-zinc-950 dark:text-white">
                                        Inquiry #{selectedInquiry.id}
                                    </h2>
                                    <Text className="mt-1">{formatDate(selectedInquiry.createdAt)}</Text>
                                </div>
                                <Button type="button" plain onClick={() => setSelectedInquiry(null)}>
                                    <X data-slot="icon" />
                                    Close
                                </Button>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                {[
                                    ['Name', selectedInquiry.name],
                                    ['Email', selectedInquiry.email],
                                    ['Phone', selectedInquiry.phone],
                                    ['WhatsApp', selectedInquiry.whatsappNumber ?? 'Not provided'],
                                    ['Company', selectedInquiry.companyName ?? 'Not provided'],
                                    ['Product', selectedInquiry.product?.name ?? 'General inquiry'],
                                    ['Source', selectedInquiry.sourcePageKey ?? 'Unknown'],
                                    ['Consent', selectedInquiry.consentConfirmed ? 'Confirmed' : 'Not confirmed'],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                        <Text>{label}</Text>
                                        <p className="mt-1 break-words text-sm font-medium text-zinc-950 dark:text-white">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                <Text>Subject</Text>
                                <p className="mt-1 text-sm font-medium text-zinc-950 dark:text-white">{selectedInquiry.subject ?? 'No subject'}</p>
                            </div>

                            <div className="mt-5 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                <Text>Message</Text>
                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-800 dark:text-zinc-200">{selectedInquiry.message}</p>
                            </div>

                            {(selectedInquiry.sourceUrl || selectedInquiry.referrerUrl) && (
                                <div className="mt-5 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                    <Text>Source URLs</Text>
                                    {selectedInquiry.sourceUrl ? <p className="mt-1 break-words text-sm text-zinc-700 dark:text-zinc-300">{selectedInquiry.sourceUrl}</p> : null}
                                    {selectedInquiry.referrerUrl ? <p className="mt-1 break-words text-sm text-zinc-700 dark:text-zinc-300">{selectedInquiry.referrerUrl}</p> : null}
                                </div>
                            )}

                            <div className="mt-6 flex flex-wrap gap-2">
                                <Button type="button" color="light" onClick={() => markRead(selectedInquiry)}>
                                    <Check data-slot="icon" />
                                    Mark read
                                </Button>
                                <Button type="button" color="light" onClick={() => void shareInquiry(selectedInquiry)}>
                                    <Share2 data-slot="icon" />
                                    Share
                                </Button>
                                <Button type="button" plain onClick={() => removeInquiry(selectedInquiry)}>
                                    <Trash2 data-slot="icon" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </AdminShell>
        </>
    );
}
