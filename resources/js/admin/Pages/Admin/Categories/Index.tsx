import { Head, router, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Pencil, Plus, Power, PowerOff, Save, Trash2, X } from "lucide-react";
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
    FormTextarea,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PaginationLinks,
    SearchFilterPanel,
    StatusBadge,
    StatsStrip,
} from "@admin/Components/AdminPrimitives";
import type { Paginated } from "@admin/types";

type CategoryItem = {
    id: number;
    name: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    productCount: number;
};

type CategoriesIndexProps = {
    categories: Paginated<CategoryItem>;
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
    filters: {
        search: string | null;
        is_active: string | null;
    };
    errors?: Record<string, string>;
};

type CategoryFormData = {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
    is_active: boolean;
};

const emptyCategoryForm: CategoryFormData = {
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_active: true,
};

type CategorySubmitIntent = "save" | "addMore";

function categoryFormsMatch(
    current: CategoryFormData,
    initial: CategoryFormData,
) {
    return (
        current.name === initial.name &&
        current.slug === initial.slug &&
        current.description === initial.description &&
        current.sort_order === initial.sort_order &&
        current.is_active === initial.is_active
    );
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function CategoryStatusToggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            type="button"
            className="inline-flex w-fit items-center gap-3 rounded-lg py-1 pr-2 text-left transition focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:focus:outline-white"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
        >
            <span
                className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
                    checked
                        ? "bg-emerald-500"
                        : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                aria-hidden="true"
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </span>
            <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                {checked ? "Active" : "Inactive"}
            </span>
        </button>
    );
}

function UnsavedCategoryDialog({
    processing,
    onCancel,
    onDiscard,
    onSave,
}: {
    processing: boolean;
    onCancel: () => void;
    onDiscard: () => void;
    onSave: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="category-unsaved-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-zinc-950/60"
                aria-label="Keep editing category"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-zinc-950/10 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-zinc-950">
                <h3
                    id="category-unsaved-title"
                    className="text-base font-semibold text-zinc-950 dark:text-white"
                >
                    Save category before closing?
                </h3>
                <Text className="mt-2">
                    This category has unsaved changes. Save them now or discard
                    the draft.
                </Text>
                <div className="mt-5 grid gap-2 sm:flex sm:flex-row-reverse">
                    <Button
                        type="button"
                        className="justify-center"
                        onClick={onSave}
                        disabled={processing}
                    >
                        <Save data-slot="icon" />
                        Save
                    </Button>
                    <Button
                        type="button"
                        color="light"
                        className="justify-center"
                        onClick={onDiscard}
                        disabled={processing}
                    >
                        Discard
                    </Button>
                    <Button
                        type="button"
                        plain
                        className="justify-center"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        Keep editing
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CategoryModal({
    title,
    open,
    processing,
    data,
    errors,
    initialData,
    addMoreLabel,
    submitLabel,
    onClose,
    onSubmit,
    onChange,
}: {
    title: string;
    open: boolean;
    processing: boolean;
    data: CategoryFormData;
    errors: Partial<Record<keyof CategoryFormData, string>>;
    initialData: CategoryFormData;
    addMoreLabel?: string;
    submitLabel: string;
    onClose: () => void;
    onSubmit: (intent: CategorySubmitIntent) => void;
    onChange: <K extends keyof CategoryFormData>(
        key: K,
        value: CategoryFormData[K],
    ) => void;
}) {
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const hasUnsavedChanges = !categoryFormsMatch(data, initialData);

    if (!open) {
        return null;
    }

    const requestClose = () => {
        if (processing) {
            return;
        }

        if (hasUnsavedChanges) {
            setShowUnsavedDialog(true);
            return;
        }

        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="category-modal-title"
                onClick={requestClose}
            >
                <div
                    className="w-full rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-zinc-950"
                    style={{ width: "min(38rem, calc(100vw - 2rem))" }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-950/8 px-5 py-4 dark:border-white/10">
                        <h2
                            id="category-modal-title"
                            className="text-lg font-semibold text-zinc-950 dark:text-white"
                        >
                            {title}
                        </h2>
                        <Button
                            type="button"
                            plain
                            className="h-10 w-10 shrink-0 px-0"
                            aria-label="Close category modal"
                            onClick={requestClose}
                        >
                            <X data-slot="icon" />
                        </Button>
                    </div>

                    <form
                        className="p-5"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onSubmit("save");
                        }}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <Label>Name</Label>
                                <FormInput
                                    value={data.name}
                                    onChange={(event) =>
                                        onChange("name", event.target.value)
                                    }
                                />
                                <FieldError message={errors.name} />
                            </Field>

                            <Field>
                                <Label>Slug</Label>
                                <FormInput
                                    value={data.slug}
                                    onChange={(event) =>
                                        onChange("slug", event.target.value)
                                    }
                                />
                                <FieldError message={errors.slug} />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field>
                                <Label>Description</Label>
                                <FormTextarea
                                    value={data.description}
                                    onChange={(event) =>
                                        onChange(
                                            "description",
                                            event.target.value,
                                        )
                                    }
                                    rows={4}
                                />
                                <FieldError message={errors.description} />
                            </Field>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 border-t border-zinc-950/8 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                            <CategoryStatusToggle
                                checked={data.is_active}
                                onChange={(checked) =>
                                    onChange("is_active", checked)
                                }
                            />
                            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                                <Button
                                    type="submit"
                                    className="justify-center"
                                    disabled={processing}
                                >
                                    <Save data-slot="icon" />
                                    {submitLabel}
                                </Button>
                                {addMoreLabel ? (
                                    <Button
                                        type="button"
                                        color="light"
                                        className="justify-center"
                                        onClick={() => onSubmit("addMore")}
                                        disabled={processing}
                                    >
                                        <Plus data-slot="icon" />
                                        {addMoreLabel}
                                    </Button>
                                ) : null}
                            </div>
                            <FieldError message={errors.is_active} />
                        </div>
                    </form>
                </div>
            </div>

            {showUnsavedDialog ? (
                <UnsavedCategoryDialog
                    processing={processing}
                    onCancel={() => setShowUnsavedDialog(false)}
                    onDiscard={() => {
                        setShowUnsavedDialog(false);
                        onClose();
                    }}
                    onSave={() => {
                        setShowUnsavedDialog(false);
                        onSubmit("save");
                    }}
                />
            ) : null}
        </>
    );
}

export default function CategoriesIndex({
    categories,
    stats,
    filters,
    errors = {},
}: CategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
        null,
    );
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryItem | null>(null);

    const createForm = useForm<CategoryFormData>(emptyCategoryForm);
    const editForm = useForm<CategoryFormData>(emptyCategoryForm);
    const firstCategoryNumber = categories.meta.from ?? 1;
    const categoryFilterFields = useMemo(
        () => [
            {
                name: "is_active",
                label: "Status",
                value: filters.is_active,
                allLabel: "All",
                options: [
                    { value: "1", label: "Active" },
                    { value: "0", label: "Inactive" },
                ],
            },
        ],
        [filters.is_active],
    );

    const openEditCategory = (category: CategoryItem) => {
        setEditingCategory(category);
        editForm.setData({
            name: category.name,
            slug: category.slug,
            description: "",
            sort_order: category.sortOrder,
            is_active: category.isActive,
        });
        editForm.clearErrors();
    };

    const toggleCategory = (category: CategoryItem) => {
        router.patch(
            `/admin/categories/${category.id}`,
            {
                name: category.name,
                slug: category.slug,
                description: "",
                sort_order: category.sortOrder,
                is_active: !category.isActive,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const removeCategory = (category: CategoryItem) => {
        if (!window.confirm(`Delete ${category.name}?`)) {
            return;
        }

        router.delete(`/admin/categories/${category.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedCategory?.id === category.id) {
                    setSelectedCategory(null);
                }
            },
        });
    };

    const closeCreateCategory = () => {
        setIsCreateOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const closeEditCategory = () => {
        setEditingCategory(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitCreateCategory = (intent: CategorySubmitIntent) => {
        createForm.post("/admin/categories", {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                createForm.clearErrors();

                if (intent === "save") {
                    setIsCreateOpen(false);
                }
            },
        });
    };

    const submitEditCategory = () => {
        if (!editingCategory) {
            return;
        }

        editForm.patch(`/admin/categories/${editingCategory.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategory(null);
                editForm.reset();
                editForm.clearErrors();
            },
        });
    };

    return (
        <>
            <Head title="Categories" />
            <AdminShell
                title="Categories"
                description="Create, update, activate, and remove product categories used for catalogue organization."
                actions={
                    <Button type="button" onClick={() => setIsCreateOpen(true)}>
                        <Plus data-slot="icon" />
                        Add category
                    </Button>
                }
            >
                <StatsStrip
                    items={[
                        { label: "Total", value: stats.total, tone: "blue" },
                        { label: "Active", value: stats.active, tone: "green" },
                        {
                            label: "Inactive",
                            value: stats.inactive,
                            tone: "amber",
                        },
                    ]}
                />

                <FieldError message={errors.category} />

                <ListTablePanel
                    toolbar={
                        <SearchFilterPanel
                            action="/admin/categories"
                            clearHref="/admin/categories"
                            variant="toolbar"
                            searchValue={filters.search}
                            searchPlaceholder="Search categories"
                            hasActiveFilters={Boolean(
                                filters.search || filters.is_active,
                            )}
                            filterFields={categoryFilterFields}
                        />
                    }
                    footer={
                        <PaginationLinks
                            meta={categories.meta}
                            baseUrl="/admin/categories"
                        />
                    }
                >
                    {categories.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No categories found"
                                description="Add a category to start organizing products."
                            />
                        </div>
                    ) : (
                        <>
                            <MobileTableList>
                                {categories.data.map((category, index) => (
                                    <MobileTableRow
                                        key={category.id}
                                        number={firstCategoryNumber + index}
                                        title={category.name}
                                        subtitle={`/${category.slug}`}
                                        badge={
                                            <StatusBadge
                                                tone={
                                                    category.isActive
                                                        ? "green"
                                                        : "amber"
                                                }
                                            >
                                                {category.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        }
                                        onOpen={() =>
                                            setSelectedCategory(category)
                                        }
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col className="w-[4rem]" />
                                        <col />
                                        <col className="w-[144px]" />
                                        <col className="w-[220px]" />
                                        <col className="w-[96px]" />
                                        <col className="w-[96px]" />
                                        <col className="w-[148px]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                No.
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Name
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Status
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Slug
                                            </th>
                                            <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Order
                                            </th>
                                            <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Items
                                            </th>
                                            <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                        {categories.data.map(
                                            (category, index) => (
                                                <tr
                                                    key={category.id}
                                                    className="cursor-pointer align-middle"
                                                    onClick={() =>
                                                        setSelectedCategory(
                                                            category,
                                                        )
                                                    }
                                                >
                                                    <td className="px-4 py-2.5">
                                                        <Text>
                                                            {firstCategoryNumber +
                                                                index}
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">
                                                            {category.name}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <StatusBadge
                                                            tone={
                                                                category.isActive
                                                                    ? "green"
                                                                    : "amber"
                                                            }
                                                        >
                                                            {category.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </StatusBadge>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <Text className="truncate">
                                                            /{category.slug}
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right">
                                                        <Text>
                                                            #
                                                            {category.sortOrder}
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right">
                                                        <Text>
                                                            {
                                                                category.productCount
                                                            }
                                                        </Text>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <div
                                                            className="flex items-center justify-end gap-2"
                                                            onClick={(event) =>
                                                                event.stopPropagation()
                                                            }
                                                        >
                                                            <Button
                                                                type="button"
                                                                color="light"
                                                                className="h-9 w-9 px-0"
                                                                aria-label={`Edit ${category.name}`}
                                                                title={`Edit ${category.name}`}
                                                                onClick={() =>
                                                                    openEditCategory(
                                                                        category,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil data-slot="icon" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                color="light"
                                                                className="h-9 w-9 px-0"
                                                                aria-label={`${category.isActive ? "Deactivate" : "Activate"} ${category.name}`}
                                                                title={`${category.isActive ? "Deactivate" : "Activate"} ${category.name}`}
                                                                onClick={() =>
                                                                    toggleCategory(
                                                                        category,
                                                                    )
                                                                }
                                                            >
                                                                {category.isActive ? (
                                                                    <PowerOff data-slot="icon" />
                                                                ) : (
                                                                    <Power data-slot="icon" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                plain
                                                                className="h-9 w-9 px-0"
                                                                aria-label={`Remove ${category.name}`}
                                                                title={`Remove ${category.name}`}
                                                                onClick={() =>
                                                                    removeCategory(
                                                                        category,
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

                <CategoryModal
                    title="Add category"
                    open={isCreateOpen}
                    processing={createForm.processing}
                    data={createForm.data}
                    errors={createForm.errors}
                    initialData={emptyCategoryForm}
                    submitLabel="Save"
                    addMoreLabel="Add more"
                    onClose={closeCreateCategory}
                    onSubmit={submitCreateCategory}
                    onChange={(key, value) => {
                        if (key === "name") {
                            const name = value as string;

                            createForm.setData({
                                ...createForm.data,
                                name,
                                slug:
                                    createForm.data.slug === ""
                                        ? slugify(name)
                                        : createForm.data.slug,
                            });
                        } else if (key === "slug") {
                            createForm.setData("slug", value as string);
                        } else if (key === "description") {
                            createForm.setData("description", value as string);
                        } else if (key === "sort_order") {
                            createForm.setData("sort_order", value as number);
                        } else if (key === "is_active") {
                            createForm.setData("is_active", value as boolean);
                        }
                    }}
                />

                <CategoryModal
                    title={
                        editingCategory
                            ? `Edit ${editingCategory.name}`
                            : "Edit category"
                    }
                    open={editingCategory !== null}
                    processing={editForm.processing}
                    data={editForm.data}
                    errors={editForm.errors}
                    initialData={
                        editingCategory
                            ? {
                                  name: editingCategory.name,
                                  slug: editingCategory.slug,
                                  description: "",
                                  sort_order: editingCategory.sortOrder,
                                  is_active: editingCategory.isActive,
                              }
                            : emptyCategoryForm
                    }
                    submitLabel="Save"
                    onClose={closeEditCategory}
                    onSubmit={submitEditCategory}
                    onChange={(key, value) => {
                        if (key === "name") {
                            const name = value as string;

                            editForm.setData({
                                ...editForm.data,
                                name,
                                slug:
                                    editForm.data.slug === ""
                                        ? slugify(name)
                                        : editForm.data.slug,
                            });
                        } else if (key === "slug") {
                            editForm.setData("slug", value as string);
                        } else if (key === "description") {
                            editForm.setData("description", value as string);
                        } else if (key === "sort_order") {
                            editForm.setData("sort_order", value as number);
                        } else if (key === "is_active") {
                            editForm.setData("is_active", value as boolean);
                        }
                    }}
                />

                {selectedCategory ? (
                    <DetailModal
                        title={selectedCategory.name}
                        subtitle={`/${selectedCategory.slug}`}
                        badge={
                            <StatusBadge
                                tone={
                                    selectedCategory.isActive
                                        ? "green"
                                        : "amber"
                                }
                            >
                                {selectedCategory.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedCategory(null)}
                        titleId="category-detail-title"
                        actions={
                            <>
                                <Button
                                    type="button"
                                    className="justify-center"
                                    onClick={() => {
                                        openEditCategory(selectedCategory);
                                        setSelectedCategory(null);
                                    }}
                                >
                                    <Pencil data-slot="icon" />
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    color="light"
                                    className="justify-center"
                                    onClick={() =>
                                        toggleCategory(selectedCategory)
                                    }
                                >
                                    {selectedCategory.isActive ? (
                                        <PowerOff data-slot="icon" />
                                    ) : (
                                        <Power data-slot="icon" />
                                    )}
                                    {selectedCategory.isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                </Button>
                                <Button
                                    type="button"
                                    plain
                                    className="justify-center"
                                    onClick={() =>
                                        removeCategory(selectedCategory)
                                    }
                                >
                                    <Trash2 data-slot="icon" />
                                    Remove
                                </Button>
                            </>
                        }
                    >
                        <DetailSection title="Category Details">
                            <DetailGrid>
                                <DetailItem label="No.">
                                    {categories.data.findIndex(
                                        (category) =>
                                            category.id === selectedCategory.id,
                                    ) + firstCategoryNumber}
                                </DetailItem>
                                <DetailItem label="Name">
                                    {selectedCategory.name}
                                </DetailItem>
                                <DetailItem label="Slug">
                                    /{selectedCategory.slug}
                                </DetailItem>
                                <DetailItem label="Sort Order">
                                    {selectedCategory.sortOrder}
                                </DetailItem>
                                <DetailItem label="Product Items">
                                    {selectedCategory.productCount}
                                </DetailItem>
                                <DetailItem label="Status">
                                    {selectedCategory.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </DetailItem>
                            </DetailGrid>
                        </DetailSection>
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}
