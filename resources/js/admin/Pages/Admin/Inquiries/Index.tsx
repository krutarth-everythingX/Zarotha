import { Head } from '@inertiajs/react';
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
    subject: string | null;
    product: { id: number; name: string; slug: string } | null;
    assignedUser: { id: number; name: string } | null;
    sourcePageKey: string | null;
    createdAt: string | null;
};

type InquiriesIndexProps = {
    inquiries: Paginated<InquiryListItem>;
    assignableUsers: SelectOption[];
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

    return 'amber';
}

export default function InquiriesIndex({ inquiries, assignableUsers, filters }: InquiriesIndexProps) {
    return (
        <>
            <Head title="Inquiries" />
            <AdminShell title="Inquiries" description="Search, filter, assign, review, and export inquiry records without exposing unnecessary personal data.">
                <PagePanel>
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

                <div className="mt-6 flex flex-wrap gap-3">
                    <Button href="/admin/inquiries/export" method="post">
                        Export CSV
                    </Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {inquiries.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No inquiries found" description="Adjust the filters or wait for new inquiry submissions." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {inquiries.data.map((inquiry) => (
                                <article key={inquiry.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_160px_160px_auto] xl:items-center">
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{inquiry.name}</p>
                                        <Text>{inquiry.email} / {inquiry.phone}</Text>
                                        <Text>{inquiry.subject ?? 'No subject'} / {inquiry.product?.name ?? 'General inquiry'}</Text>
                                    </div>
                                    <StatusBadge tone={toneForStatus(inquiry.status)}>{inquiry.status}</StatusBadge>
                                    <Text>{inquiry.assignedUser?.name ?? 'Unassigned'}</Text>
                                    <Button href={`/admin/inquiries/${inquiry.id}`} color="light">
                                        Open
                                    </Button>
                                </article>
                            ))}
                        </div>
                    )}
                    <PaginationLinks meta={inquiries.meta} baseUrl="/admin/inquiries" />
                </div>
            </AdminShell>
        </>
    );
}
