import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FormSelect, FormTextarea, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { InquiryStatus, SelectOption } from '@admin/types';

type InquiryDetailProps = {
    inquiry: {
        id: number;
        status: InquiryStatus;
        name: string;
        email: string;
        phone: string;
        subject: string | null;
        message: string;
        product: { id: number; name: string; slug: string } | null;
        assignedUser: { id: number; name: string } | null;
        sourcePageKey: string | null;
        createdAt: string | null;
        whatsappNumber: string | null;
        referrerUrl: string | null;
        consentConfirmed: boolean;
        activities: Array<{
            id: number;
            type: string;
            noteBody: string | null;
            oldStatus: string | null;
            newStatus: string | null;
            createdAt: string | null;
        }>;
    };
    assignableUsers: SelectOption[];
};

export default function InquiriesShow({ inquiry, assignableUsers }: InquiryDetailProps) {
    const statusForm = useForm({ status: inquiry.status });
    const assignForm = useForm({ assigned_user_id: inquiry.assignedUser?.id ?? '' });
    const noteForm = useForm({ note_body: '' });

    return (
        <>
            <Head title={`Inquiry #${inquiry.id}`} />
            <AdminShell title={`Inquiry #${inquiry.id}`} description="Review inquiry details, update status, add notes, and assign ownership.">
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <PagePanel>
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-xl font-semibold text-zinc-950 dark:text-white">{inquiry.name}</p>
                            <StatusBadge tone={inquiry.status === 'replied' ? 'green' : inquiry.status === 'archived' ? 'red' : 'amber'}>
                                {inquiry.status}
                            </StatusBadge>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                            <Text>{inquiry.email}</Text>
                            <Text>{inquiry.phone}</Text>
                            {inquiry.whatsappNumber ? <Text>{inquiry.whatsappNumber}</Text> : null}
                            <Text>{inquiry.product?.name ?? 'General inquiry'}</Text>
                            <Text>{inquiry.subject ?? 'No subject'}</Text>
                        </div>
                        <div className="mt-6 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                            <Text>{inquiry.message}</Text>
                        </div>
                    </PagePanel>

                    <div className="space-y-6">
                        <PagePanel>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    statusForm.post(`/admin/inquiries/${inquiry.id}/status`);
                                }}
                            >
                                <Field>
                                    <Label>Status</Label>
                                    <FormSelect value={statusForm.data.status} onChange={(event) => statusForm.setData('status', event.target.value as InquiryStatus)}>
                                        <option value="unread">Unread</option>
                                        <option value="read">Read</option>
                                        <option value="replied">Replied</option>
                                        <option value="archived">Archived</option>
                                    </FormSelect>
                                </Field>
                                <Button type="submit">Update status</Button>
                            </form>
                        </PagePanel>

                        <PagePanel>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    assignForm.post(`/admin/inquiries/${inquiry.id}/assign`);
                                }}
                            >
                                <Field>
                                    <Label>Assign user</Label>
                                    <FormSelect value={assignForm.data.assigned_user_id} onChange={(event) => assignForm.setData('assigned_user_id', Number(event.target.value))}>
                                        <option value="">Choose assignee</option>
                                        {assignableUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.label}
                                            </option>
                                        ))}
                                    </FormSelect>
                                </Field>
                                <Button type="submit" color="light">Assign</Button>
                            </form>
                        </PagePanel>

                        <PagePanel>
                            <form
                                className="space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    noteForm.post(`/admin/inquiries/${inquiry.id}/notes`);
                                }}
                            >
                                <Field>
                                    <Label>Internal note</Label>
                                    <FormTextarea rows={4} value={noteForm.data.note_body} onChange={(event) => noteForm.setData('note_body', event.target.value)} />
                                </Field>
                                <Button type="submit" color="light">Add note</Button>
                            </form>
                        </PagePanel>
                    </div>
                </div>

                <PagePanel className="mt-6">
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Activity history</h2>
                    <div className="mt-4 divide-y divide-zinc-950/8 dark:divide-white/10">
                        {inquiry.activities.map((activity) => (
                            <article key={activity.id} className="py-3">
                                <p className="font-medium text-zinc-950 dark:text-white">{activity.type}</p>
                                <Text>{activity.noteBody ?? `${activity.oldStatus ?? '-'} -> ${activity.newStatus ?? '-'}`}</Text>
                            </article>
                        ))}
                    </div>
                </PagePanel>
            </AdminShell>
        </>
    );
}
