import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
    EmptyState,
    FieldError,
    FormInput,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PaginationLinks,
    SearchFilterPanel,
    StatusBadge,
} from "@admin/Components/AdminPrimitives";
import type { Paginated } from "@admin/types";

type MediaItem = {
    id: number;
    originalFilename: string;
    mimeType: string;
    bytes: number;
    width: number | null;
    height: number | null;
    status: string;
    altText: string | null;
    caption: string | null;
    url: string | null;
    variantCount: number;
    referenceCount: number;
};

type MediaIndexProps = {
    media: Paginated<MediaItem>;
    filters: {
        search: string | null;
        status: string | null;
    };
    limits: {
        maxUploadKb: number;
        allowedMimeTypes: string[];
    };
};

export default function MediaIndex({
    media,
    filters,
    limits,
}: MediaIndexProps) {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const form = useForm<{
        file: File | null;
        alt_text: string;
        caption: string;
    }>({
        file: null,
        alt_text: "",
        caption: "",
    });

    return (
        <>
            <Head title="Media" />
            <AdminShell
                title="Media"
                description="Upload catalogue imagery, track processing status, and manage reusable media metadata."
            >
                <form
                    className="rounded-3xl border border-zinc-950/8 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/90"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post("/admin/media", { forceFormData: true });
                    }}
                >
                    <div className="grid gap-5 md:grid-cols-3">
                        <Field>
                            <Label>Image file</Label>
                            <input
                                type="file"
                                accept={limits.allowedMimeTypes.join(",")}
                                className="block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                                onChange={(event) =>
                                    form.setData(
                                        "file",
                                        event.currentTarget.files?.[0] ?? null,
                                    )
                                }
                            />
                            <FieldError message={form.errors.file} />
                        </Field>
                        <Field>
                            <Label>Alt text</Label>
                            <FormInput
                                value={form.data.alt_text}
                                onChange={(event) =>
                                    form.setData("alt_text", event.target.value)
                                }
                            />
                            <FieldError message={form.errors.alt_text} />
                        </Field>
                        <Field>
                            <Label>Caption</Label>
                            <FormInput
                                value={form.data.caption}
                                onChange={(event) =>
                                    form.setData("caption", event.target.value)
                                }
                            />
                            <FieldError message={form.errors.caption} />
                        </Field>
                    </div>
                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Text>
                            JPG, PNG, and WebP up to {limits.maxUploadKb} KB.
                            SVG is rejected by policy.
                        </Text>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing
                                ? `Uploading ${form.progress?.percentage ?? 0}%`
                                : "Upload"}
                        </Button>
                    </div>
                </form>

                <ListTablePanel
                    className="mt-8"
                    toolbar={
                        <SearchFilterPanel
                            action="/admin/media"
                            clearHref="/admin/media"
                            variant="toolbar"
                            searchValue={filters.search}
                            searchPlaceholder="Search media"
                            hasActiveFilters={Boolean(filters.search)}
                        />
                    }
                    footer={
                        <PaginationLinks
                            meta={media.meta}
                            baseUrl="/admin/media"
                        />
                    }
                >
                    {media.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No media yet"
                                description="Upload approved product or CMS imagery to begin."
                            />
                        </div>
                    ) : (
                        <>
                            <MobileTableList>
                                {media.data.map((item, index) => (
                                    <MobileTableRow
                                        key={item.id}
                                        number={(media.meta.from ?? 1) + index}
                                        title={item.originalFilename}
                                        subtitle={item.mimeType}
                                        media={
                                            <span className="block aspect-square w-12 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                                {item.url ? (
                                                    <img
                                                        src={item.url}
                                                        alt={item.altText ?? ""}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : null}
                                            </span>
                                        }
                                        badge={
                                            <StatusBadge
                                                tone={
                                                    item.status === "processed"
                                                        ? "green"
                                                        : item.status ===
                                                            "failed"
                                                          ? "red"
                                                          : "amber"
                                                }
                                            >
                                                {item.status}
                                            </StatusBadge>
                                        }
                                        onOpen={() => setSelectedMedia(item)}
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col className="w-[112px]" />
                                        <col />
                                        <col className="w-[220px]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Preview
                                            </th>
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                File
                                            </th>
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Caption
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                        {media.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="align-middle"
                                            >
                                                <td className="px-4 py-2.5">
                                                    <div className="mx-auto aspect-square w-20 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                                        {item.url ? (
                                                            <img
                                                                src={item.url}
                                                                alt={
                                                                    item.altText ??
                                                                    ""
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <p className="font-medium text-zinc-950 dark:text-white">
                                                        {item.originalFilename}
                                                    </p>
                                                    <Text>
                                                        {item.mimeType} /{" "}
                                                        {item.width ?? "-"} x{" "}
                                                        {item.height ?? "-"} /{" "}
                                                        {Math.round(
                                                            item.bytes / 1024,
                                                        )}{" "}
                                                        KB
                                                    </Text>
                                                    <Text>
                                                        {item.variantCount}{" "}
                                                        variants /{" "}
                                                        {item.referenceCount}{" "}
                                                        references
                                                    </Text>
                                                    <div className="mt-2 flex justify-center">
                                                        <StatusBadge
                                                            tone={
                                                                item.status ===
                                                                "processed"
                                                                    ? "green"
                                                                    : item.status ===
                                                                        "failed"
                                                                      ? "red"
                                                                      : "amber"
                                                            }
                                                        >
                                                            {item.status}
                                                        </StatusBadge>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <Text>
                                                        {item.caption ??
                                                            "No caption"}
                                                    </Text>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </ListTablePanel>

                {selectedMedia ? (
                    <DetailModal
                        title={selectedMedia.originalFilename}
                        subtitle={selectedMedia.mimeType}
                        badge={
                            <StatusBadge
                                tone={
                                    selectedMedia.status === "processed"
                                        ? "green"
                                        : selectedMedia.status === "failed"
                                          ? "red"
                                          : "amber"
                                }
                            >
                                {selectedMedia.status}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedMedia(null)}
                        titleId="media-detail-title"
                    >
                        <div className="space-y-4">
                            <DetailSection title="Preview">
                                <div className="grid min-h-48 place-items-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                                    {selectedMedia.url ? (
                                        <img
                                            src={selectedMedia.url}
                                            alt={selectedMedia.altText ?? ""}
                                            className="max-h-72 max-w-full object-contain"
                                        />
                                    ) : (
                                        <Text>No preview available</Text>
                                    )}
                                </div>
                            </DetailSection>

                            <DetailSection title="Media Details">
                                <DetailGrid>
                                    <DetailItem label="No.">
                                        {media.data.findIndex(
                                            (item) =>
                                                item.id === selectedMedia.id,
                                        ) + (media.meta.from ?? 1)}
                                    </DetailItem>
                                    <DetailItem label="Size">
                                        {Math.round(selectedMedia.bytes / 1024)}{" "}
                                        KB
                                    </DetailItem>
                                    <DetailItem label="Dimensions">
                                        {selectedMedia.width ?? "-"} x{" "}
                                        {selectedMedia.height ?? "-"}
                                    </DetailItem>
                                    <DetailItem label="Variants">
                                        {selectedMedia.variantCount}
                                    </DetailItem>
                                    <DetailItem label="References">
                                        {selectedMedia.referenceCount}
                                    </DetailItem>
                                    <DetailItem label="Status">
                                        {selectedMedia.status}
                                    </DetailItem>
                                    <DetailItem label="Alt Text" full>
                                        {selectedMedia.altText}
                                    </DetailItem>
                                    <DetailItem label="Caption" full>
                                        {selectedMedia.caption}
                                    </DetailItem>
                                </DetailGrid>
                            </DetailSection>
                        </div>
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}
