import { Head, router } from "@inertiajs/react";
import { useMemo, useState, type ReactNode } from "react";
import {
    Check,
    CheckCheck,
    Eye,
    Trash2,
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
    email: string | null;
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

function detailValue(value?: string | null, fallback = "Not provided") {
    const normalized = value?.trim();

    return normalized && normalized.length > 0 ? normalized : fallback;
}

function emailValue(value?: string | null) {
    return detailValue(value, "No email provided");
}

function DetailCell({
    label,
    value,
    className = "",
    labelClassName = "",
    valueClassName = "",
    compact = false,
}: {
    label: string;
    value: ReactNode;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
    compact?: boolean;
}) {
    const hasPlainValue =
        typeof value === "string" || typeof value === "number";

    return (
        <div
            className={`min-w-0 rounded-xl border border-zinc-950/8 bg-white ${compact ? "p-3" : "p-4"} dark:border-white/10 dark:bg-white/5 ${className}`}
        >
            <p
                className={`text-xs font-semibold text-zinc-500 dark:text-zinc-400 ${labelClassName}`}
            >
                {label}
            </p>
            {hasPlainValue ? (
                <p
                    className={`${compact ? "mt-1.5 text-sm leading-5" : "mt-2 text-base leading-6"} break-words font-semibold text-zinc-950 dark:text-white ${valueClassName}`}
                >
                    {value}
                </p>
            ) : (
                <div className={compact ? "mt-1.5" : "mt-2"}>{value}</div>
            )}
        </div>
    );
}

export default function InquiriesIndex({
    inquiries,
    stats,
    filters,
}: InquiriesIndexProps) {
    const [selectedInquiry, setSelectedInquiry] =
        useState<InquiryListItem | null>(null);
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
                }
            },
        });
    };

    const closeInquiryModal = () => {
        setSelectedInquiry(null);
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
                                        subtitle={`${emailValue(inquiry.email)} | ${formatDate(
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
                                                    className="cursor-pointer align-middle"
                                                    onClick={() =>
                                                        setSelectedInquiry(
                                                            inquiry,
                                                        )
                                                    }
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
                                                            {emailValue(
                                                                inquiry.email,
                                                            )}
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
                                                        <div
                                                            className="ml-auto flex w-fit items-center gap-2"
                                                            onClick={(event) =>
                                                                event.stopPropagation()
                                                            }
                                                        >
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
                                                                {inquiry.status ===
                                                                "read" ? (
                                                                    <CheckCheck data-slot="icon" />
                                                                ) : (
                                                                    <Check data-slot="icon" />
                                                                )}
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
                    <InquiryDetailModal
                        inquiry={selectedInquiry}
                        onClose={closeInquiryModal}
                        onMarkRead={markRead}
                        onRemove={removeInquiry}
                    />
                ) : null}
            </AdminShell>
        </>
    );
}

function InquiryDetailModal({
    inquiry,
    onClose,
    onMarkRead,
    onRemove,
}: {
    inquiry: InquiryListItem;
    onClose: () => void;
    onMarkRead: (inquiry: InquiryListItem) => void;
    onRemove: (inquiry: InquiryListItem) => void;
}) {
    const hasEmail = Boolean(inquiry.email?.trim());
    const modalCardClasses = "border-white/10 bg-white/6 backdrop-blur-sm";
    const modalLabelClasses = "text-zinc-400";
    const modalValueClasses = "text-white";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/72 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            onClick={onClose}
        >
            <div
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_32%),linear-gradient(180deg,_rgba(24,24,27,0.98)_0%,_rgba(9,9,11,0.98)_100%)] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300/80">
                            Inquiry Overview
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <h2
                                id="inquiry-modal-title"
                                className="text-2xl font-semibold text-white"
                            >
                                Inquiry #{inquiry.id}
                            </h2>
                            <StatusBadge tone={toneForStatus(inquiry.status)}>
                                {inquiry.status}
                            </StatusBadge>
                        </div>
                        <p className="mt-2 text-sm text-zinc-400">
                            Received {formatDate(inquiry.createdAt)}
                        </p>
                    </div>
                    <Button type="button" plain onClick={onClose}>
                        <X data-slot="icon" />
                        Close
                    </Button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
                        <DetailCell
                            label="Name"
                            value={inquiry.name}
                            className={`${modalCardClasses} lg:col-span-3`}
                            labelClassName={modalLabelClasses}
                            valueClassName={modalValueClasses}
                            compact
                        />
                        <DetailCell
                            label="Phone Number"
                            value={inquiry.phone}
                            className={`${modalCardClasses} lg:col-span-3`}
                            labelClassName={modalLabelClasses}
                            valueClassName={modalValueClasses}
                            compact
                        />
                        {hasEmail ? (
                            <DetailCell
                                label="Email"
                                value={inquiry.email?.trim() ?? ""}
                                className={`${modalCardClasses} lg:col-span-2`}
                                labelClassName={modalLabelClasses}
                                valueClassName={modalValueClasses}
                            />
                        ) : null}
                        <DetailCell
                            label="Inquiry Type"
                            value={detailValue(inquiry.subject)}
                            className={`${modalCardClasses} ${hasEmail ? "lg:col-span-4" : "lg:col-span-3"}`}
                            labelClassName={modalLabelClasses}
                            valueClassName={modalValueClasses}
                        />
                        <DetailCell
                            label="Message"
                            value={
                                <p className="whitespace-pre-line break-words text-base leading-7 text-zinc-100">
                                    {detailValue(inquiry.message)}
                                </p>
                            }
                            className={`${modalCardClasses} lg:col-span-6 lg:min-h-64`}
                            labelClassName={modalLabelClasses}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-white/10 px-4 py-3 sm:flex sm:flex-row-reverse sm:flex-wrap sm:px-6 sm:py-4">
                    <Button
                        type="button"
                        color="light"
                        className="justify-center"
                        onClick={() => onMarkRead(inquiry)}
                    >
                        {inquiry.status === "read" ? (
                            <CheckCheck data-slot="icon" />
                        ) : (
                            <Check data-slot="icon" />
                        )}
                        Mark read
                    </Button>
                    <Button
                        type="button"
                        plain
                        className="justify-center"
                        onClick={() => onRemove(inquiry)}
                    >
                        <Trash2 data-slot="icon" />
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}
