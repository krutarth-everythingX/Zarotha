import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Check, ExternalLink, Eye, Image as ImageIcon, Paperclip, Share2, Trash2, Video, X } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FormInput, FormSelect, PagePanel, PaginationLinks, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { InquiryStatus, Paginated } from '@admin/types';

type InquiryUploadedImage = {
    name: string;
    url: string;
    path?: string;
    mime_type?: string | null;
    size?: number | null;
};

type InquiryListItem = {
    id: number;
    status: InquiryStatus;
    name: string;
    email: string;
    phone: string;
    companyName: string | null;
    subject: string | null;
    projectLocation: string | null;
    projectState: string | null;
    projectCountry: string | null;
    budgetRange: string | null;
    expectedProjectStart: string | null;
    uploadedImages: InquiryUploadedImage[];
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
        inquiry.product ? `Product: ${inquiry.product.name}` : null,
        inquiry.subject ? `Inquiry Type: ${inquiry.subject}` : null,
        inquiry.projectLocation ? `Project Location: ${inquiry.projectLocation}` : null,
        inquiry.projectState ? `State: ${inquiry.projectState}` : null,
        inquiry.projectCountry ? `Country: ${inquiry.projectCountry}` : null,
        inquiry.budgetRange ? `Budget Range: ${inquiry.budgetRange}` : null,
        inquiry.expectedProjectStart ? `Expected Start: ${inquiry.expectedProjectStart}` : null,
        inquiry.uploadedImages.length > 0 ? `Uploaded Images: ${inquiry.uploadedImages.map((image) => image.name || image.url).join(', ')}` : null,
        `Message: ${inquiry.message}`,
    ]
        .filter(Boolean)
        .join('\n');
}

function fileNameFor(upload: InquiryUploadedImage, index: number) {
    return upload.name || `Upload ${index + 1}`;
}

function uploadSignature(upload: InquiryUploadedImage) {
    return `${upload.mime_type ?? ''} ${upload.url} ${upload.name}`.toLowerCase();
}

function isImageUpload(upload: InquiryUploadedImage) {
    const signature = uploadSignature(upload);

    return upload.mime_type?.toLowerCase().startsWith('image/') || /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/.test(signature);
}

function isVideoUpload(upload: InquiryUploadedImage) {
    const signature = uploadSignature(upload);

    return upload.mime_type?.toLowerCase().startsWith('video/') || /\.(mp4|mov|webm|m4v)(\?|#|$)/.test(signature);
}

function formatFileSize(size?: number | null) {
    if (size === null || size === undefined) {
        return null;
    }

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-b border-zinc-950/8 pb-2.5 last:border-b-0 last:pb-0 dark:border-white/10">
            <Text className="text-xs">{label}</Text>
            <p className="mt-1 break-words text-sm font-medium text-zinc-950 dark:text-white">{value}</p>
        </div>
    );
}

export default function InquiriesIndex({ inquiries, stats, filters }: InquiriesIndexProps) {
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryListItem | null>(null);
    const [previewUpload, setPreviewUpload] = useState<InquiryUploadedImage | null>(null);

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
                    setPreviewUpload(null);
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

    const closeInquiryModal = () => {
        setSelectedInquiry(null);
        setPreviewUpload(null);
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
                    <form className="grid gap-4 lg:grid-cols-[1fr_180px_auto]" method="get" action="/admin/inquiries">
                        <Field>
                            <Label>Search</Label>
                            <FormInput name="search" defaultValue={filters.search ?? ''} placeholder="Name, email, phone, inquiry type, location, state, or country" />
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col />
                                    <col className="w-[180px]" />
                                    <col className="w-[180px]" />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Inquiry</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Created</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-950/8 dark:divide-white/10">
                                    {inquiries.data.map((inquiry) => (
                                        <tr key={inquiry.id} className="align-middle">
                                            <td className="px-4 py-2.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">{inquiry.name}</p>
                                                    <StatusBadge tone={toneForStatus(inquiry.status)}>{inquiry.status}</StatusBadge>
                                                </div>
                                                <Text>{inquiry.email}</Text>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <Text>{formatDate(inquiry.createdAt)}</Text>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="grid grid-cols-2 justify-center gap-2">
                                                    <Button type="button" color="light" className="h-9 w-9 px-0" aria-label="View inquiry" title="View inquiry" onClick={() => setSelectedInquiry(inquiry)}>
                                                        <Eye data-slot="icon" />
                                                    </Button>
                                                    <Button type="button" color="light" className="h-9 w-9 px-0" aria-label="Mark inquiry as read" title="Mark inquiry as read" onClick={() => markRead(inquiry)}>
                                                        <Check data-slot="icon" />
                                                    </Button>
                                                    <Button type="button" color="light" className="h-9 w-9 px-0" aria-label="Share inquiry" title="Share inquiry" onClick={() => void shareInquiry(inquiry)}>
                                                        <Share2 data-slot="icon" />
                                                    </Button>
                                                    <Button type="button" color="light" className="h-9 w-9 px-0" aria-label="Remove inquiry" title="Remove inquiry" onClick={() => removeInquiry(inquiry)}>
                                                        <Trash2 data-slot="icon" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <PaginationLinks meta={inquiries.meta} baseUrl="/admin/inquiries" />
                </div>

                {selectedInquiry ? (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-3 sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="inquiry-modal-title"
                        onClick={closeInquiryModal}
                    >
                        <div
                            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-950/8 px-5 py-4 dark:border-white/10">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 id="inquiry-modal-title" className="text-xl font-semibold text-zinc-950 dark:text-white">
                                            Inquiry #{selectedInquiry.id}
                                        </h2>
                                        <StatusBadge tone={toneForStatus(selectedInquiry.status)}>{selectedInquiry.status}</StatusBadge>
                                    </div>
                                    <Text className="mt-1">{formatDate(selectedInquiry.createdAt)}</Text>
                                </div>
                                <Button type="button" plain onClick={closeInquiryModal}>
                                    <X data-slot="icon" />
                                    Close
                                </Button>
                            </div>

                            <div className="overflow-y-auto p-5">
                                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                                    <div className="space-y-5">
                                        {selectedInquiry.uploadedImages.length > 0 ? (
                                            <section className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Paperclip className="size-4 text-zinc-400" aria-hidden="true" />
                                                        <Text>Uploads</Text>
                                                    </div>
                                                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                                                        {selectedInquiry.uploadedImages.length}
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-3">
                                                    {selectedInquiry.uploadedImages.map((image, index) => {
                                                        const label = fileNameFor(image, index);
                                                        const isImage = isImageUpload(image);
                                                        const isVideo = isVideoUpload(image);
                                                        const fileSize = formatFileSize(image.size);

                                                        return (
                                                            <button
                                                                key={`${image.url}-${index}`}
                                                                type="button"
                                                                className="group w-24 rounded-xl border border-zinc-950/10 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-950/20 hover:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20 dark:focus:outline-white"
                                                                aria-label={`Open ${label}`}
                                                                onClick={() => setPreviewUpload(image)}
                                                            >
                                                                <span className="relative block h-16 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                                                    {isImage ? (
                                                                        <img src={image.url} alt={label} className="h-full w-full object-cover" loading="lazy" />
                                                                    ) : isVideo ? (
                                                                        <video src={image.url} className="h-full w-full object-cover" muted preload="metadata" />
                                                                    ) : (
                                                                        <span className="grid h-full place-items-center">
                                                                            <Paperclip className="size-5 text-zinc-400" aria-hidden="true" />
                                                                        </span>
                                                                    )}
                                                                    <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                                                                        <Eye className="size-4 text-white" aria-hidden="true" />
                                                                    </span>
                                                                    {isVideo ? (
                                                                        <span className="absolute right-1 bottom-1 rounded-full bg-black/70 p-1">
                                                                            <Video className="size-3 text-white" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </span>
                                                                <span className="mt-2 block truncate text-xs font-medium text-zinc-950 dark:text-white">{label}</span>
                                                                {fileSize ? <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">{fileSize}</span> : null}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        ) : null}

                                        <section className="rounded-2xl border border-zinc-950/8 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <Text>Message / Project Details</Text>
                                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-800 dark:text-zinc-200">{selectedInquiry.message}</p>
                                        </section>
                                    </div>

                                    <aside className="space-y-4">
                                        <section className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Contact</h3>
                                            <div className="mt-3 grid gap-3">
                                                {[
                                                    ['Name', selectedInquiry.name],
                                                    ['Email', selectedInquiry.email],
                                                    ['Phone', selectedInquiry.phone],
                                                ].map(([label, value]) => (
                                                    <DetailRow key={label} label={label} value={value} />
                                                ))}
                                            </div>
                                        </section>

                                        <section className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Project</h3>
                                            <div className="mt-3 grid gap-3">
                                                {[
                                                    ['Product', selectedInquiry.product?.name ?? 'General inquiry'],
                                                    ['Inquiry Type', selectedInquiry.subject ?? 'Not provided'],
                                                    ['Project Location', selectedInquiry.projectLocation ?? 'Not provided'],
                                                    ['State', selectedInquiry.projectState ?? 'Not provided'],
                                                    ['Country', selectedInquiry.projectCountry ?? 'Not provided'],
                                                    ['Budget Range', selectedInquiry.budgetRange ?? 'Not provided'],
                                                    ['Expected Project Start', selectedInquiry.expectedProjectStart ?? 'Not provided'],
                                                ].map(([label, value]) => (
                                                    <DetailRow key={label} label={label} value={value} />
                                                ))}
                                            </div>
                                        </section>
                                    </aside>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 border-t border-zinc-950/8 px-5 py-4 dark:border-white/10">
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

                        {previewUpload ? (
                            <div
                                className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/85 p-4"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="upload-preview-title"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setPreviewUpload(null);
                                }}
                            >
                                <div
                                    className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-950/8 px-4 py-3 dark:border-white/10">
                                        <div className="min-w-0">
                                            <h3 id="upload-preview-title" className="truncate text-base font-semibold text-zinc-950 dark:text-white">
                                                {fileNameFor(previewUpload, 0)}
                                            </h3>
                                            <Text className="mt-0.5">
                                                {isVideoUpload(previewUpload) ? 'Video upload' : isImageUpload(previewUpload) ? 'Image upload' : 'Uploaded file'}
                                                {formatFileSize(previewUpload.size) ? ` - ${formatFileSize(previewUpload.size)}` : ''}
                                            </Text>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <a
                                                href={previewUpload.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-zinc-950/10 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
                                            >
                                                <ExternalLink className="size-4" aria-hidden="true" />
                                                Open
                                            </a>
                                            <Button type="button" plain onClick={() => setPreviewUpload(null)}>
                                                <X data-slot="icon" />
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid min-h-64 flex-1 place-items-center overflow-auto bg-zinc-100 p-4 dark:bg-black/40">
                                        {isVideoUpload(previewUpload) ? (
                                            <video src={previewUpload.url} className="max-h-[72vh] w-full max-w-full rounded-xl bg-black" controls autoPlay />
                                        ) : isImageUpload(previewUpload) ? (
                                            <img src={previewUpload.url} alt={fileNameFor(previewUpload, 0)} className="max-h-[72vh] max-w-full rounded-xl object-contain" />
                                        ) : (
                                            <div className="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-900">
                                                <ImageIcon className="mx-auto size-8 text-zinc-400" aria-hidden="true" />
                                                <p className="mt-3 text-sm font-medium text-zinc-950 dark:text-white">Preview unavailable</p>
                                                <Text className="mt-1">Open the uploaded file in a new tab to view it.</Text>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </AdminShell>
        </>
    );
}
