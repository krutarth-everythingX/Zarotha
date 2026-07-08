import { Head, useForm } from "@inertiajs/react";
import { Edit3, Eye, Plus, Power, Star, Trash2, X } from "lucide-react";
import React from "react";
import {
    MediaDropSelect,
    type MediaOption as UploadMediaOption,
} from "@admin/Components/MediaDropSelect";
import {
    EmptyState,
    FieldError,
    FormColorInput,
    FormInput,
    FormSelect,
    FormTextarea,
    ListTableFooter,
    ListTablePanel,
    MobileSettingsBreadcrumbs,
    MobileTableList,
    MobileTableRow,
    PagePanel,
    SearchFilterPanel,
    SettingsSectionLayout,
    StatusBadge,
    StatsStrip,
} from "@admin/Components/AdminPrimitives";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";

const MAX_REVIEW_LENGTH = 450;

type TestimonialItem = {
    id?: number;
    customer_name: string;
    location_or_role: string;
    body_text: string;
    rating: number;
    image_media_id: number | "";
    status: "draft" | "published";
    sort_order: number;
    is_visible: boolean;
    previewUrl?: string | null;
};

type TestimonialStatus = TestimonialItem["status"];
type TestimonialField = keyof TestimonialItem;

type TestimonialsForm = {
    items: TestimonialItem[];
};

type SectionForm = {
    section_title: string;
    section_intro: string;
    background_color: string;
};

type MediaOption = {
    id: number;
    label: string;
    altText?: string | null;
    url?: string | null;
    previewUrl?: string | null;
    status?: string;
    width?: number | null;
    height?: number | null;
};

interface Props {
    pageMode?: "manager" | "settings";
    section: {
        title: string | null;
        intro: string | null;
        backgroundColor: string | null;
    };
    testimonials?: TestimonialsForm;
    stats?: {
        total: number;
        active: number;
        inactive: number;
    };
    mediaOptions?: MediaOption[];
}

function emptyTestimonial(sortOrder: number): TestimonialItem {
    return {
        customer_name: "",
        location_or_role: "",
        body_text: "",
        rating: 5,
        image_media_id: "",
        status: "published",
        sort_order: sortOrder,
        is_visible: true,
    };
}

function activeStatus(item: TestimonialItem) {
    return item.status === "published" && item.is_visible;
}

function initialsFor(name: string) {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "T"
    );
}

function clampRating(value: number) {
    return Math.min(5, Math.max(1, Number.isFinite(value) ? value : 5));
}

function nestedError(
    errors: Record<string, string | undefined>,
    index: number,
    field: TestimonialField,
) {
    return errors[`items.${index}.${field}`];
}

function RatingStars({
    rating,
    onChange,
}: {
    rating: number;
    onChange?: (rating: number) => void;
}) {
    const value = clampRating(rating);

    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${value} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const selected = star <= value;
                const classes = selected
                    ? "text-amber-500"
                    : "text-zinc-300 dark:text-zinc-600";

                if (!onChange) {
                    return (
                        <Star
                            key={star}
                            className={`h-4 w-4 ${classes}`}
                            fill={selected ? "currentColor" : "none"}
                            aria-hidden="true"
                        />
                    );
                }

                return (
                    <button
                        key={star}
                        type="button"
                        className={`grid h-9 w-9 place-items-center rounded-lg border border-zinc-950/10 transition hover:bg-zinc-950/5 dark:border-white/10 dark:hover:bg-white/10 ${classes}`}
                        aria-label={`${star} star${star === 1 ? "" : "s"}`}
                        aria-pressed={selected}
                        onClick={() => onChange(star)}
                    >
                        <Star
                            className="h-5 w-5"
                            fill={selected ? "currentColor" : "none"}
                            aria-hidden="true"
                        />
                    </button>
                );
            })}
        </div>
    );
}

function TestimonialAvatar({
    item,
    media,
    size = "sm",
}: {
    item: TestimonialItem;
    media: MediaOption | null;
    size?: "sm" | "lg";
}) {
    const previewUrl =
        media?.url ?? media?.previewUrl ?? item.previewUrl ?? null;
    const sizeClasses =
        size === "lg" ? "h-16 w-16 text-base" : "h-10 w-10 text-xs";

    return (
        <div
            className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-zinc-950/10 bg-zinc-100 font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 ${sizeClasses}`}
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt={media?.altText ?? item.customer_name}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span>{initialsFor(item.customer_name)}</span>
            )}
        </div>
    );
}

export default function TestimonialsIndex({
    pageMode = "manager",
    section,
    testimonials = { items: [] },
    stats = { total: 0, active: 0, inactive: 0 },
    mediaOptions = [],
}: Props) {
    const [mediaChoices, setMediaChoices] =
        React.useState<MediaOption[]>(mediaOptions);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [viewingIndex, setViewingIndex] = React.useState<number | null>(null);
    const [draft, setDraft] = React.useState<TestimonialItem | null>(null);
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("");
    const testimonialFilterFields = React.useMemo(
        () => [
            {
                name: "status",
                label: "Status",
                value: statusFilter,
                allLabel: "All",
                options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                ],
            },
        ],
        [statusFilter],
    );
    const showSectionSettings = pageMode === "settings";
    const showTestimonialManager = !showSectionSettings;
    const sectionForm = useForm<SectionForm>({
        section_title: section.title ?? "",
        section_intro: section.intro ?? "",
        background_color: section.backgroundColor ?? "#ffffff",
    });

    const form = useForm<TestimonialsForm>({
        ...testimonials,
        items: testimonials.items.map((item) => ({
            ...item,
            rating: clampRating(item.rating ?? 5),
            image_media_id: item.image_media_id ?? "",
        })),
    });

    const { data, setData, processing, errors } = form;

    React.useEffect(() => {
        if (!drawerOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeDrawer();
            }
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [drawerOpen]);

    React.useEffect(() => {
        if (viewingIndex === null) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeDetailsModal();
            }
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [viewingIndex]);

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        const option: MediaOption = {
            id: media.id,
            label: media.label,
            altText: media.altText ?? null,
            url: media.url ?? null,
            previewUrl: media.previewUrl ?? media.url ?? null,
            status: media.status,
            width: media.width ?? null,
            height: media.height ?? null,
        };

        setMediaChoices((current) => [
            option,
            ...current.filter((item) => item.id !== option.id),
        ]);
    };

    const imageFor = (id: number | "", previewUrl?: string | null) => {
        if (id === "") {
            return null;
        }

        const option = mediaChoices.find((media) => media.id === id);

        if (option) {
            return option;
        }

        return previewUrl
            ? {
                  id,
                  label: "Selected image",
                  url: previewUrl,
                  previewUrl,
              }
            : null;
    };

    const submitPayload = (
        payload: TestimonialsForm,
        onSuccess?: () => void,
    ) => {
        form.transform(() => payload);
        form.put("/admin/testimonials", {
            preserveScroll: true,
            onSuccess: () => {
                setData(payload);
                onSuccess?.();
            },
            onFinish: () => {
                form.transform((current) => current);
            },
        });
    };

    const openAddDrawer = () => {
        form.clearErrors();
        setEditingIndex(null);
        setDraft(emptyTestimonial(data.items.length));
        setDrawerOpen(true);
    };

    const openEditDrawer = (index: number) => {
        form.clearErrors();
        setEditingIndex(index);
        setDraft({
            ...data.items[index],
            rating: clampRating(data.items[index].rating ?? 5),
            image_media_id: data.items[index].image_media_id ?? "",
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingIndex(null);
        setDraft(null);
    };

    const openDetailsModal = (index: number) => {
        setViewingIndex(index);
    };

    const closeDetailsModal = () => {
        setViewingIndex(null);
    };

    const saveDraft = (event: React.FormEvent) => {
        event.preventDefault();

        if (!draft) {
            return;
        }

        const sanitizedDraft: TestimonialItem = {
            ...draft,
            rating: clampRating(draft.rating),
            body_text: draft.body_text.slice(0, MAX_REVIEW_LENGTH),
            sort_order: Number(draft.sort_order) || 0,
        };
        const nextItems =
            editingIndex === null
                ? [...data.items, sanitizedDraft]
                : data.items.map((item, index) =>
                      index === editingIndex ? sanitizedDraft : item,
                  );

        submitPayload(
            {
                ...data,
                items: nextItems,
            },
            closeDrawer,
        );
    };

    const removeTestimonial = (index: number) => {
        const item = data.items[index];

        if (
            !item ||
            !window.confirm(
                `Remove ${item.customer_name || "this testimonial"}?`,
            )
        ) {
            return;
        }

        submitPayload({
            ...data,
            items: data.items.filter((_, itemIndex) => itemIndex !== index),
        });
    };

    const toggleTestimonial = (index: number) => {
        const item = data.items[index];

        if (!item) {
            return;
        }

        const isActive = activeStatus(item);
        const nextItems: TestimonialItem[] = data.items.map(
            (current, itemIndex) => {
                if (itemIndex !== index) {
                    return current;
                }

                const status: TestimonialStatus = isActive
                    ? "draft"
                    : "published";

                return {
                    ...current,
                    status,
                    is_visible: !isActive,
                };
            },
        );

        submitPayload({
            ...data,
            items: nextItems,
        });
    };

    const updateDraft = (updated: Partial<TestimonialItem>) => {
        setDraft((current) =>
            current
                ? {
                      ...current,
                      ...updated,
                  }
                : current,
        );
    };

    const drawerErrorIndex =
        editingIndex === null ? data.items.length : editingIndex;
    const drawerErrors = errors as Record<string, string | undefined>;
    const viewedItem =
        viewingIndex === null ? null : (data.items[viewingIndex] ?? null);
    const normalizedSearch = search.trim().toLowerCase();
    const visibleItems = data.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => {
            const matchesSearch =
                normalizedSearch === "" ||
                [
                    item.customer_name,
                    item.location_or_role,
                    item.body_text,
                    String(item.rating),
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedSearch);
            const status = activeStatus(item) ? "active" : "inactive";

            return (
                matchesSearch &&
                (statusFilter === "" || statusFilter === status)
            );
        });
    const hasListFilters = search.trim() !== "" || statusFilter !== "";
    const pageContent = showSectionSettings ? (
        <SettingsSectionLayout active="testimonials">
            <PagePanel>
                <form
                    id="testimonials-settings-mobile-form"
                    className="grid gap-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sectionForm.patch("/admin/settings/testimonials", {
                            preserveScroll: true,
                        });
                    }}
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                Testimonials
                            </h2>
                            <Text className="mt-2">
                                Edit the homepage testimonial title, short line,
                                and card background color.
                            </Text>
                        </div>
                        <Button
                            type="submit"
                            disabled={sectionForm.processing}
                            className="hidden justify-center md:inline-flex"
                        >
                            Save section
                        </Button>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <Field>
                            <Label>Testimonials section title</Label>
                            <FormInput
                                value={sectionForm.data.section_title}
                                onChange={(event) =>
                                    sectionForm.setData(
                                        "section_title",
                                        event.target.value,
                                    )
                                }
                                placeholder="What our clients say"
                            />
                            <FieldError
                                message={sectionForm.errors.section_title}
                            />
                        </Field>

                        <Field>
                            <Label>Short line</Label>
                            <FormInput
                                value={sectionForm.data.section_intro}
                                onChange={(event) =>
                                    sectionForm.setData(
                                        "section_intro",
                                        event.target.value,
                                    )
                                }
                                placeholder="What customers are saying."
                            />
                            <FieldError
                                message={sectionForm.errors.section_intro}
                            />
                        </Field>

                        <Field>
                            <Label>Testimonial card background color</Label>
                            <FormColorInput
                                value={sectionForm.data.background_color}
                                pickerLabel="Pick testimonial card background color"
                                onChange={(event) =>
                                    sectionForm.setData(
                                        "background_color",
                                        event.target.value,
                                    )
                                }
                                placeholder="#ffffff"
                            />
                            <FieldError
                                message={sectionForm.errors.background_color}
                            />
                        </Field>
                    </div>
                </form>
            </PagePanel>
        </SettingsSectionLayout>
    ) : (
        <>
            <StatsStrip
                items={[
                    {
                        label: "Total",
                        value: stats.total,
                        tone: "blue",
                    },
                    {
                        label: "Active",
                        value: stats.active,
                        tone: "green",
                    },
                    {
                        label: "Inactive",
                        value: stats.inactive,
                        tone: "amber",
                    },
                ]}
            />

            <ListTablePanel
                toolbar={
                    <SearchFilterPanel
                        variant="toolbar"
                        searchValue={search}
                        searchPlaceholder="Search testimonials"
                        hasActiveFilters={hasListFilters}
                        onApply={({ search: nextSearch, filters }) => {
                            setSearch(nextSearch);
                            setStatusFilter(filters.status ?? "");
                        }}
                        onClear={() => {
                            setSearch("");
                            setStatusFilter("");
                        }}
                        filterFields={testimonialFilterFields}
                    />
                }
                footer={
                    <ListTableFooter>
                        <span>
                            {hasListFilters
                                ? `${visibleItems.length} of ${data.items.length} testimonials`
                                : `${data.items.length} testimonials`}
                        </span>
                        <Button
                            type="button"
                            color="light"
                            className="w-full justify-center sm:w-auto"
                            onClick={openAddDrawer}
                        >
                            <Plus data-slot="icon" />
                            Add testimonial
                        </Button>
                    </ListTableFooter>
                }
            >
                {visibleItems.length === 0 ? (
                    <div className="p-6">
                        <EmptyState
                            title="No testimonials found"
                            description={
                                data.items.length === 0
                                    ? "Add testimonials to show customer reviews on the homepage."
                                    : "Adjust the filters to find a matching testimonial."
                            }
                        />
                    </div>
                ) : (
                    <>
                        <MobileTableList className="p-4">
                            {visibleItems.map(
                                ({ item, index }, visibleIndex) => (
                                    <MobileTableRow
                                        key={item.id ?? `new-mobile-${index}`}
                                        number={visibleIndex + 1}
                                        title={
                                            item.customer_name ||
                                            "Untitled testimonial"
                                        }
                                        subtitle={
                                            item.location_or_role ||
                                            `${clampRating(item.rating)} star rating`
                                        }
                                        media={
                                            <TestimonialAvatar
                                                item={item}
                                                media={imageFor(
                                                    item.image_media_id,
                                                    item.previewUrl,
                                                )}
                                            />
                                        }
                                        badge={
                                            <StatusBadge
                                                tone={
                                                    activeStatus(item)
                                                        ? "green"
                                                        : "neutral"
                                                }
                                            >
                                                {activeStatus(item)
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        }
                                        onOpen={() => openDetailsModal(index)}
                                    />
                                ),
                            )}
                        </MobileTableList>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col className="w-[4rem]" />
                                    <col className="w-[110px]" />
                                    <col />
                                    <col className="w-[150px]" />
                                    <col className="w-[130px]" />
                                    <col className="w-[90px]" />
                                    <col className="w-[220px]" />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            No.
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            Profile
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            Name
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            Rating
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            Status
                                        </th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            Sort
                                        </th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                    {visibleItems.map(
                                        ({ item, index }, visibleIndex) => (
                                            <tr
                                                key={item.id ?? `new-${index}`}
                                                className="align-middle"
                                            >
                                                <td className="px-4 py-2.5">
                                                    <Text>
                                                        {visibleIndex + 1}
                                                    </Text>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <TestimonialAvatar
                                                        item={item}
                                                        media={imageFor(
                                                            item.image_media_id,
                                                            item.previewUrl,
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">
                                                        {item.customer_name ||
                                                            "Untitled testimonial"}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <RatingStars
                                                        rating={item.rating}
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <StatusBadge
                                                        tone={
                                                            activeStatus(item)
                                                                ? "green"
                                                                : "neutral"
                                                        }
                                                    >
                                                        {activeStatus(item)
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </StatusBadge>
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <Text>
                                                        {item.sort_order}
                                                    </Text>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            color="light"
                                                            className="h-9 w-9 px-0"
                                                            aria-label={`View ${item.customer_name}`}
                                                            title={`View ${item.customer_name}`}
                                                            onClick={() =>
                                                                openDetailsModal(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Eye data-slot="icon" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            color="light"
                                                            className="h-9 w-9 px-0"
                                                            aria-label={`Edit ${item.customer_name}`}
                                                            title={`Edit ${item.customer_name}`}
                                                            onClick={() =>
                                                                openEditDrawer(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Edit3 data-slot="icon" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            color="light"
                                                            className="h-9 w-9 px-0"
                                                            disabled={
                                                                processing
                                                            }
                                                            aria-label={`${activeStatus(item) ? "Deactivate" : "Activate"} ${item.customer_name}`}
                                                            title={`${activeStatus(item) ? "Deactivate" : "Activate"} ${item.customer_name}`}
                                                            onClick={() =>
                                                                toggleTestimonial(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Power data-slot="icon" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            plain
                                                            className="h-9 w-9 px-0"
                                                            disabled={
                                                                processing
                                                            }
                                                            aria-label={`Remove ${item.customer_name}`}
                                                            title={`Remove ${item.customer_name}`}
                                                            onClick={() =>
                                                                removeTestimonial(
                                                                    index,
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
        </>
    );

    return (
        <>
            <Head title="Testimonials" />
            <AdminShell
                title="Testimonials"
                description={
                    showSectionSettings
                        ? "Edit the homepage testimonial title, short line, and card background color."
                        : "List, add, edit, remove, and switch testimonials active or inactive."
                }
                mobileTitle="Testimonials"
                mobileDescription={
                    showSectionSettings
                        ? "Edit the homepage testimonial section."
                        : "Manage customer testimonials."
                }
                mobileActions={
                    showSectionSettings ? (
                        <Button
                            type="submit"
                            form="testimonials-settings-mobile-form"
                            disabled={sectionForm.processing}
                        >
                            {sectionForm.processing
                                ? "Saving"
                                : "Save Changes"}
                        </Button>
                    ) : null
                }
                mobileBreadcrumbs={
                    showSectionSettings ? (
                        <MobileSettingsBreadcrumbs
                            items={[
                                {
                                    label: "Settings",
                                    onClick: () => window.history.back(),
                                },
                                {
                                    label: "Testimonials",
                                    current: true,
                                },
                            ]}
                        />
                    ) : null
                }
                actions={
                    showTestimonialManager ? (
                        <Button type="button" onClick={openAddDrawer}>
                            <Plus data-slot="icon" />
                            Add testimonial
                        </Button>
                    ) : undefined
                }
            >
                {pageContent}

                {drawerOpen && draft ? (
                    <div
                        className="fixed inset-0 z-[80]"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="testimonial-drawer-title"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 h-full w-full bg-zinc-950/45"
                            aria-label="Close testimonial drawer"
                            onClick={closeDrawer}
                        />
                        <form
                            onSubmit={saveDraft}
                            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-zinc-950 sm:border-l sm:border-zinc-950/10 dark:sm:border-white/10"
                        >
                            <div className="flex items-start justify-between gap-4 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-6">
                                <div>
                                    <h2
                                        id="testimonial-drawer-title"
                                        className="text-lg font-semibold text-zinc-950 dark:text-white"
                                    >
                                        {editingIndex === null
                                            ? "Add testimonial"
                                            : "Edit testimonial"}
                                    </h2>
                                    <Text>
                                        Add customer image, review, and 1 to 5
                                        star rating.
                                    </Text>
                                </div>
                                <Button
                                    type="button"
                                    plain
                                    className="h-10 w-10 px-0"
                                    onClick={closeDrawer}
                                    aria-label="Close drawer"
                                >
                                    <X data-slot="icon" />
                                </Button>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                                <div className="grid gap-5">
                                    <Field>
                                        <Label>Image</Label>
                                        <MediaDropSelect
                                            value={draft.image_media_id ?? ""}
                                            options={mediaChoices}
                                            preview={imageFor(
                                                draft.image_media_id ?? "",
                                                draft.previewUrl,
                                            )}
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(image_media_id) =>
                                                updateDraft({ image_media_id })
                                            }
                                            label="Testimonial image"
                                        />
                                        <Text className="mt-2">
                                            Leave empty to use the default
                                            image.
                                        </Text>
                                        <FieldError
                                            message={nestedError(
                                                drawerErrors,
                                                drawerErrorIndex,
                                                "image_media_id",
                                            )}
                                        />
                                    </Field>

                                    <Field>
                                        <Label>Name</Label>
                                        <FormInput
                                            value={draft.customer_name}
                                            onChange={(event) =>
                                                updateDraft({
                                                    customer_name:
                                                        event.target.value,
                                                })
                                            }
                                            placeholder="Customer name"
                                            autoFocus
                                        />
                                        <FieldError
                                            message={nestedError(
                                                drawerErrors,
                                                drawerErrorIndex,
                                                "customer_name",
                                            )}
                                        />
                                    </Field>

                                    <Field>
                                        <Label>Role or location</Label>
                                        <FormInput
                                            value={draft.location_or_role}
                                            onChange={(event) =>
                                                updateDraft({
                                                    location_or_role:
                                                        event.target.value,
                                                })
                                            }
                                            placeholder="Interior Designer"
                                        />
                                        <FieldError
                                            message={nestedError(
                                                drawerErrors,
                                                drawerErrorIndex,
                                                "location_or_role",
                                            )}
                                        />
                                    </Field>

                                    <Field>
                                        <div className="flex items-center justify-between gap-3">
                                            <Label>Review</Label>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {draft.body_text.length}/
                                                {MAX_REVIEW_LENGTH}
                                            </span>
                                        </div>
                                        <FormTextarea
                                            rows={6}
                                            maxLength={MAX_REVIEW_LENGTH}
                                            value={draft.body_text}
                                            onChange={(event) =>
                                                updateDraft({
                                                    body_text:
                                                        event.target.value,
                                                })
                                            }
                                            placeholder="Write the customer review."
                                        />
                                        <FieldError
                                            message={nestedError(
                                                drawerErrors,
                                                drawerErrorIndex,
                                                "body_text",
                                            )}
                                        />
                                    </Field>

                                    <Field>
                                        <Label>Rating</Label>
                                        <RatingStars
                                            rating={draft.rating}
                                            onChange={(rating) =>
                                                updateDraft({ rating })
                                            }
                                        />
                                        <FieldError
                                            message={nestedError(
                                                drawerErrors,
                                                drawerErrorIndex,
                                                "rating",
                                            )}
                                        />
                                    </Field>

                                    <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
                                        <Field>
                                            <Label>Status</Label>
                                            <FormSelect
                                                value={draft.status}
                                                onChange={(event) =>
                                                    updateDraft({
                                                        status: event.target
                                                            .value as
                                                            | "draft"
                                                            | "published",
                                                        is_visible:
                                                            event.target
                                                                .value ===
                                                            "published",
                                                    })
                                                }
                                            >
                                                <option value="published">
                                                    Active
                                                </option>
                                                <option value="draft">
                                                    Inactive
                                                </option>
                                            </FormSelect>
                                            <FieldError
                                                message={nestedError(
                                                    drawerErrors,
                                                    drawerErrorIndex,
                                                    "status",
                                                )}
                                            />
                                        </Field>
                                        <Field>
                                            <Label>Sort</Label>
                                            <FormInput
                                                type="number"
                                                min={0}
                                                value={draft.sort_order}
                                                onChange={(event) =>
                                                    updateDraft({
                                                        sort_order: Number(
                                                            event.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                            <FieldError
                                                message={nestedError(
                                                    drawerErrors,
                                                    drawerErrorIndex,
                                                    "sort_order",
                                                )}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2 border-t border-zinc-950/8 bg-white px-4 py-4 dark:border-white/10 dark:bg-zinc-950 sm:flex sm:flex-row-reverse sm:px-6">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="justify-center"
                                >
                                    {editingIndex === null ? (
                                        <Plus data-slot="icon" />
                                    ) : (
                                        <Edit3 data-slot="icon" />
                                    )}
                                    {processing ? "Saving" : "Save testimonial"}
                                </Button>
                                <Button
                                    type="button"
                                    color="light"
                                    className="justify-center"
                                    onClick={closeDrawer}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : null}

                {viewedItem ? (
                    <div
                        className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="testimonial-details-title"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 bg-zinc-950/60"
                            aria-label="Close testimonial details"
                            onClick={closeDetailsModal}
                        />
                        <div
                            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-start justify-between gap-4 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-5">
                                <div className="flex min-w-0 items-center gap-3">
                                    <TestimonialAvatar
                                        item={viewedItem}
                                        media={imageFor(
                                            viewedItem.image_media_id,
                                            viewedItem.previewUrl,
                                        )}
                                        size="lg"
                                    />
                                    <div className="min-w-0">
                                        <h2
                                            id="testimonial-details-title"
                                            className="truncate text-base font-semibold text-zinc-950 dark:text-white"
                                        >
                                            {viewedItem.customer_name ||
                                                "Untitled testimonial"}
                                        </h2>
                                        {viewedItem.location_or_role ? (
                                            <Text className="truncate">
                                                {viewedItem.location_or_role}
                                            </Text>
                                        ) : null}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    plain
                                    className="h-10 w-10 px-0"
                                    onClick={closeDetailsModal}
                                    aria-label="Close testimonial details"
                                >
                                    <X data-slot="icon" />
                                </Button>
                            </div>

                            <div className="grid gap-5 px-4 py-5 sm:px-5">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                                            Rating
                                        </p>
                                        <div className="mt-2">
                                            <RatingStars
                                                rating={viewedItem.rating}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                                            Status
                                        </p>
                                        <div className="mt-2">
                                            <StatusBadge
                                                tone={
                                                    activeStatus(viewedItem)
                                                        ? "green"
                                                        : "neutral"
                                                }
                                            >
                                                {activeStatus(viewedItem)
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                                            Sort
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-950 dark:text-white">
                                            {viewedItem.sort_order}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                                        Review
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                                        {viewedItem.body_text}
                                    </p>
                                </div>
                            </div>

                            {viewingIndex !== null ? (
                                <div className="grid gap-2 border-t border-zinc-950/8 bg-zinc-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:flex-wrap sm:px-5 dark:border-white/10 dark:bg-white/5">
                                    <Button
                                        type="button"
                                        className="justify-center"
                                        onClick={() => {
                                            openEditDrawer(viewingIndex);
                                            closeDetailsModal();
                                        }}
                                    >
                                        <Edit3 data-slot="icon" />
                                        Edit
                                    </Button>
                                    <Button
                                        type="button"
                                        color="light"
                                        className="justify-center"
                                        disabled={processing}
                                        onClick={() =>
                                            toggleTestimonial(viewingIndex)
                                        }
                                    >
                                        <Power data-slot="icon" />
                                        {activeStatus(viewedItem)
                                            ? "Deactivate"
                                            : "Activate"}
                                    </Button>
                                    <Button
                                        type="button"
                                        plain
                                        className="justify-center"
                                        disabled={processing}
                                        onClick={() =>
                                            removeTestimonial(viewingIndex)
                                        }
                                    >
                                        <Trash2 data-slot="icon" />
                                        Remove
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </AdminShell>
        </>
    );
}
