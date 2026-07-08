import { Head, router } from "@inertiajs/react";
import { useMemo, useState, type ReactNode } from "react";
import {
    Check,
    ExternalLink,
    Eye,
    Image as ImageIcon,
    Paperclip,
    Trash2,
    Video,
    X,
} from "lucide-react";
import { Button } from "@admin/Components/ui/button";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    EmptyState,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PaginationLinks,
    SearchFilterPanel,
    StatusBadge,
    StatsStrip,
} from "@admin/Components/AdminPrimitives";
import type { InquiryStatus, Paginated } from "@admin/types";

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
    };
    filters: {
        search: string | null;
        status: string | null;
    };
};

function toneForStatus(status: InquiryStatus) {
    if (status === "replied") {
        return "green";
    }

    if (status === "archived") {
        return "red";
    }

    return status === "read" ? "neutral" : "amber";
}

function formatDate(value: string | null) {
    if (!value) {
        return "No date";
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function fileNameFor(upload: InquiryUploadedImage, index: number) {
    return upload.name || `Upload ${index + 1}`;
}

function uploadSignature(upload: InquiryUploadedImage) {
    return `${upload.mime_type ?? ""} ${upload.url} ${upload.name}`.toLowerCase();
}

function isImageUpload(upload: InquiryUploadedImage) {
    const signature = uploadSignature(upload);

    return (
        upload.mime_type?.toLowerCase().startsWith("image/") ||
        /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/.test(signature)
    );
}

function isVideoUpload(upload: InquiryUploadedImage) {
    const signature = uploadSignature(upload);

    return (
        upload.mime_type?.toLowerCase().startsWith("video/") ||
        /\.(mp4|mov|webm|m4v)(\?|#|$)/.test(signature)
    );
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

function detailValue(value?: string | null, fallback = "Not provided") {
    const normalized = value?.trim();

    return normalized && normalized.length > 0 ? normalized : fallback;
}

function DetailCell({
    label,
    value,
    className = "",
}: {
    label: string;
    value: ReactNode;
    className?: string;
}) {
    const hasPlainValue =
        typeof value === "string" || typeof value === "number";

    return (
        <div
            className={`min-w-0 rounded-xl border border-zinc-950/8 bg-white p-4 dark:border-white/10 dark:bg-white/5 ${className}`}
        >
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {hasPlainValue ? (
                <p className="mt-2 break-words text-base font-semibold leading-6 text-zinc-950 dark:text-white">
                    {value}
                </p>
            ) : (
                <div className="mt-2">{value}</div>
            )}
        </div>
    );
}

function UploadTile({
    upload,
    index,
    onPreview,
}: {
    upload: InquiryUploadedImage;
    index: number;
    onPreview: (upload: InquiryUploadedImage) => void;
}) {
    const label = fileNameFor(upload, index);
    const isImage = isImageUpload(upload);
    const isVideo = isVideoUpload(upload);
    const fileSize = formatFileSize(upload.size);

    return (
        <button
            type="button"
            className="group min-w-0 rounded-lg border border-zinc-950/10 bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-950/20 hover:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20 dark:focus:outline-white"
            aria-label={`Open ${label}`}
            title={label}
            onClick={() => onPreview(upload)}
        >
            <span className="relative block aspect-[4/3] overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                {isImage ? (
                    <img
                        src={upload.url}
                        alt={label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : isVideo ? (
                    <video
                        src={upload.url}
                        className="h-full w-full object-cover"
                        muted
                        preload="metadata"
                    />
                ) : (
                    <span className="grid h-full place-items-center">
                        <Paperclip
                            className="size-5 text-zinc-400"
                            aria-hidden="true"
                        />
                    </span>
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                    <Eye className="size-4 text-white" aria-hidden="true" />
                </span>
                {isVideo ? (
                    <span className="absolute right-1 bottom-1 rounded-full bg-black/70 p-1">
                        <Video
                            className="size-3 text-white"
                            aria-hidden="true"
                        />
                    </span>
                ) : null}
            </span>
            <span className="mt-2 block truncate text-xs font-semibold text-zinc-950 dark:text-white">
                {label}
            </span>
            {fileSize ? (
                <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                    {fileSize}
                </span>
            ) : null}
        </button>
    );
}

export default function InquiriesIndex({
    inquiries,
    stats,
    filters,
}: InquiriesIndexProps) {
    const [selectedInquiry, setSelectedInquiry] =
        useState<InquiryListItem | null>(null);
    const [previewUpload, setPreviewUpload] =
        useState<InquiryUploadedImage | null>(null);
    const firstInquiryNumber = inquiries.meta.from ?? 1;
    const inquiryFilterFields = useMemo(
        () => [
            {
                name: "status",
                label: "Status",
                value: filters.status,
                allLabel: "All",
                options: [
                    { value: "unread", label: "Unread" },
                    { value: "read", label: "Read" },
                    { value: "replied", label: "Replied" },
                    { value: "archived", label: "Archived" },
                ],
            },
        ],
        [filters.status],
    );

    const markRead = (inquiry: InquiryListItem) => {
        router.post(
            `/admin/inquiries/${inquiry.id}/mark-read`,
            {},
            { preserveScroll: true },
        );
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

    const closeInquiryModal = () => {
        setSelectedInquiry(null);
        setPreviewUpload(null);
    };

    return (
        <>
            <Head title="Inquiries" />
            <AdminShell
                title="Inquiries"
                description="Store public inquiries, review stats, and manage each inquiry from the list."
            >
                <StatsStrip
                    items={[
                        { label: "Total", value: stats.total, tone: "blue" },
                        { label: "Unread", value: stats.unread, tone: "amber" },
                        { label: "Read", value: stats.read, tone: "neutral" },
                        {
                            label: "Replied",
                            value: stats.replied,
                            tone: "green",
                        },
                    ]}
                />

                <ListTablePanel
                    toolbar={
                        <SearchFilterPanel
                            action="/admin/inquiries"
                            clearHref="/admin/inquiries"
                            variant="toolbar"
                            searchValue={filters.search}
                            searchPlaceholder="Search inquiries"
                            hasActiveFilters={Boolean(
                                filters.search || filters.status,
                            )}
                            filterFields={inquiryFilterFields}
                        />
                    }
                    footer={
                        <PaginationLinks
                            meta={inquiries.meta}
                            baseUrl="/admin/inquiries"
                        />
                    }
                >
                    {inquiries.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No inquiries found"
                                description="Adjust the filters or wait for new inquiry submissions."
                            />
                        </div>
                    ) : (
                        <>
                            <MobileTableList>
                                {inquiries.data.map((inquiry, index) => (
                                    <MobileTableRow
                                        key={inquiry.id}
                                        number={firstInquiryNumber + index}
                                        title={inquiry.name}
                                        subtitle={`${inquiry.email} | ${formatDate(
                                            inquiry.createdAt,
                                        )}`}
                                        badge={
                                            <StatusBadge
                                                tone={toneForStatus(
                                                    inquiry.status,
                                                )}
                                            >
                                                {inquiry.status}
                                            </StatusBadge>
                                        }
                                        onOpen={() =>
                                            setSelectedInquiry(inquiry)
                                        }
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col className="w-[4rem]" />
                                        <col />
                                        <col className="w-[180px]" />
                                        <col className="w-[180px]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                No.
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Inquiry
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Created
                                            </th>
                                            <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                        {inquiries.data.map(
                                            (inquiry, index) => (
                                                <tr
                                                    key={inquiry.id}
                                                    className="align-middle"
                                                >
                                                    <td className="px-4 py-2.5">
                                                        <Text>
                                                            {firstInquiryNumber +
                                                                index}
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">
                                                                {inquiry.name}
                                                            </p>
                                                            <StatusBadge
                                                                tone={toneForStatus(
                                                                    inquiry.status,
                                                                )}
                                                            >
                                                                {inquiry.status}
                                                            </StatusBadge>
                                                        </div>
                                                        <Text>
                                                            {inquiry.email}
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <Text>
                                                            {formatDate(
                                                                inquiry.createdAt,
                                                            )}
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <div className="ml-auto flex w-fit items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                color="light"
                                                                className="h-9 w-9 px-0"
                                                                aria-label="View inquiry"
                                                                title="View inquiry"
                                                                onClick={() =>
                                                                    setSelectedInquiry(
                                                                        inquiry,
                                                                    )
                                                                }
                                                            >
                                                                <Eye data-slot="icon" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                color="light"
                                                                className="h-9 w-9 px-0"
                                                                aria-label="Mark inquiry as read"
                                                                title="Mark inquiry as read"
                                                                onClick={() =>
                                                                    markRead(
                                                                        inquiry,
                                                                    )
                                                                }
                                                            >
                                                                <Check data-slot="icon" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                color="light"
                                                                className="h-9 w-9 px-0"
                                                                aria-label="Remove inquiry"
                                                                title="Remove inquiry"
                                                                onClick={() =>
                                                                    removeInquiry(
                                                                        inquiry,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 data-slot="icon" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </ListTablePanel>

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
                                        <h2
                                            id="inquiry-modal-title"
                                            className="text-xl font-semibold text-zinc-950 dark:text-white"
                                        >
                                            Inquiry #{selectedInquiry.id}
                                        </h2>
                                        <StatusBadge
                                            tone={toneForStatus(
                                                selectedInquiry.status,
                                            )}
                                        >
                                            {selectedInquiry.status}
                                        </StatusBadge>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    plain
                                    onClick={closeInquiryModal}
                                >
                                    <X data-slot="icon" />
                                    Close
                                </Button>
                            </div>

                            <div className="overflow-y-auto p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <DetailCell
                                        label="Name"
                                        value={selectedInquiry.name}
                                    />
                                    <DetailCell
                                        label="Email"
                                        value={selectedInquiry.email}
                                    />
                                    <DetailCell
                                        label="Phone"
                                        value={selectedInquiry.phone}
                                    />
                                    <DetailCell
                                        label="Inquiry Type"
                                        value={detailValue(
                                            selectedInquiry.subject,
                                        )}
                                    />
                                    <DetailCell
                                        label="Project Location"
                                        value={detailValue(
                                            selectedInquiry.projectLocation,
                                        )}
                                        className="lg:col-span-2"
                                    />
                                    <DetailCell
                                        label="State"
                                        value={detailValue(
                                            selectedInquiry.projectState,
                                        )}
                                    />
                                    <DetailCell
                                        label="Country"
                                        value={detailValue(
                                            selectedInquiry.projectCountry,
                                        )}
                                    />
                                    <DetailCell
                                        label="Budget Range"
                                        value={detailValue(
                                            selectedInquiry.budgetRange,
                                        )}
                                    />
                                    <DetailCell
                                        label="Start Date"
                                        value={detailValue(
                                            selectedInquiry.expectedProjectStart,
                                        )}
                                    />
                                    <DetailCell
                                        label="Message / Project Details"
                                        value={
                                            <p className="whitespace-pre-line break-words text-base leading-7 text-zinc-800 dark:text-zinc-200">
                                                {detailValue(
                                                    selectedInquiry.message,
                                                )}
                                            </p>
                                        }
                                        className="lg:col-span-2"
                                    />
                                    <DetailCell
                                        label={`Uploads (${selectedInquiry.uploadedImages.length})`}
                                        value={
                                            selectedInquiry.uploadedImages
                                                .length > 0 ? (
                                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                                                    {selectedInquiry.uploadedImages.map(
                                                        (image, index) => (
                                                            <UploadTile
                                                                key={`${image.url}-${index}`}
                                                                upload={image}
                                                                index={index}
                                                                onPreview={
                                                                    setPreviewUpload
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                    No attached images.
                                                </p>
                                            )
                                        }
                                        className="lg:col-span-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 border-t border-zinc-950/8 px-4 py-3 sm:flex sm:flex-row-reverse sm:flex-wrap sm:px-5 sm:py-4 dark:border-white/10">
                                <Button
                                    type="button"
                                    color="light"
                                    className="justify-center"
                                    onClick={() => markRead(selectedInquiry)}
                                >
                                    <Check data-slot="icon" />
                                    Mark read
                                </Button>
                                <Button
                                    type="button"
                                    plain
                                    className="justify-center"
                                    onClick={() =>
                                        removeInquiry(selectedInquiry)
                                    }
                                >
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
                                            <h3
                                                id="upload-preview-title"
                                                className="truncate text-base font-semibold text-zinc-950 dark:text-white"
                                            >
                                                {fileNameFor(previewUpload, 0)}
                                            </h3>
                                            <Text className="mt-0.5">
                                                {isVideoUpload(previewUpload)
                                                    ? "Video upload"
                                                    : isImageUpload(
                                                            previewUpload,
                                                        )
                                                      ? "Image upload"
                                                      : "Uploaded file"}
                                                {formatFileSize(
                                                    previewUpload.size,
                                                )
                                                    ? ` - ${formatFileSize(previewUpload.size)}`
                                                    : ""}
                                            </Text>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <a
                                                href={previewUpload.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-zinc-950/10 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
                                            >
                                                <ExternalLink
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                                Open
                                            </a>
                                            <Button
                                                type="button"
                                                plain
                                                onClick={() =>
                                                    setPreviewUpload(null)
                                                }
                                            >
                                                <X data-slot="icon" />
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid min-h-64 flex-1 place-items-center overflow-auto bg-zinc-100 p-4 dark:bg-black/40">
                                        {isVideoUpload(previewUpload) ? (
                                            <video
                                                src={previewUpload.url}
                                                className="max-h-[72vh] w-full max-w-full rounded-xl bg-black"
                                                controls
                                                autoPlay
                                            />
                                        ) : isImageUpload(previewUpload) ? (
                                            <img
                                                src={previewUpload.url}
                                                alt={fileNameFor(
                                                    previewUpload,
                                                    0,
                                                )}
                                                className="max-h-[72vh] max-w-full rounded-xl object-contain"
                                            />
                                        ) : (
                                            <div className="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-900">
                                                <ImageIcon
                                                    className="mx-auto size-8 text-zinc-400"
                                                    aria-hidden="true"
                                                />
                                                <p className="mt-3 text-sm font-medium text-zinc-950 dark:text-white">
                                                    Preview unavailable
                                                </p>
                                                <Text className="mt-1">
                                                    Open the uploaded file in a
                                                    new tab to view it.
                                                </Text>
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
