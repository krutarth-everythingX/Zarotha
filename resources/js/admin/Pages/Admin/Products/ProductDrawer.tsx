import { useForm } from "@inertiajs/react";
import { Plus, Save, Trash2, X } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import {
    FieldError,
    FormInput,
    FormSelect,
    FormTextarea,
} from "@admin/Components/AdminPrimitives";
import { useLockedAdminScroll } from "@admin/hooks/useLockedAdminScroll";
import type { PublishStatus, SelectOption } from "@admin/types";
import ImageUploadArea, {
    sortProductImagesPrimaryFirst,
    type ProductImage,
} from "./ImageUploadArea";

type AdditionalDetail = {
    id: string;
    title: string;
    value: string;
};

export type ProductPayload = {
    id: number;
    categoryId: number | string;
    name: string;
    slug: string;
    sku?: string | null;
    productType?: string | null;
    woodType?: string | null;
    style?: string | null;
    regularPrice?: string | number | null;
    salePrice?: string | number | null;
    isTrackInventory?: boolean;
    stockQuantity?: string | number | null;
    availability?: string | null;
    shortDescription?: string | null;
    fullDescription?: string | null;
    details?: unknown;
    galleryImages?: ProductImage[];
    status: PublishStatus;
    isFeatured: boolean;
    isBestSelling: boolean;
    isLatest: boolean;
    robotsIndex: boolean;
    robotsFollow: boolean;
    isAvailableForInquiry?: boolean;
    showPrice?: boolean;
};

type ProductFormData = {
    category_id: number | string;
    name: string;
    slug: string;
    regular_price: string | number;
    sale_price: string | number;
    short_description: string;
    full_description: string;
    details: AdditionalDetail[];
    gallery_images_state: ProductImage[];
    status: PublishStatus;
    is_featured: boolean;
    is_best_selling: boolean;
    is_latest: boolean;
    robots_index: boolean;
    robots_follow: boolean;
    show_price: boolean;
    sku: string;
    product_type: string;
    wood_type: string;
    style: string;
    is_track_inventory: boolean;
    stock_quantity: string | number;
    availability: string;
};

export type ProductDrawerProps = {
    mode: "create" | "edit";
    product: ProductPayload | null;
    categories: SelectOption[];
    onClose: () => void;
    onSaved?: (intent: SaveIntent) => void;
};

type SaveIntent = "close" | "add-more";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeDetails(details: unknown): AdditionalDetail[] {
    if (Array.isArray(details)) {
        const rows = details
            .map((detail, index) => {
                if (typeof detail !== "object" || detail === null) {
                    return null;
                }

                const record = detail as Record<string, unknown>;
                const title =
                    typeof record.title === "string"
                        ? record.title
                        : typeof record.key === "string"
                          ? record.key
                          : "";
                const value =
                    typeof record.value === "string" ||
                    typeof record.value === "number"
                        ? String(record.value)
                        : "";

                return {
                    id:
                        typeof record.id === "string"
                            ? record.id
                            : `detail-${Date.now()}-${index}`,
                    title,
                    value,
                };
            })
            .filter((detail): detail is AdditionalDetail => detail !== null);

        return rows.length > 0
            ? rows
            : [{ id: `detail-${Date.now()}`, title: "", value: "" }];
    }

    if (typeof details === "object" && details !== null) {
        const record = details as Record<string, unknown>;
        const dynamicSpecs = Array.isArray(record.dynamic_specs)
            ? record.dynamic_specs
            : [];
        const rows = dynamicSpecs
            .map((detail, index) => {
                if (typeof detail !== "object" || detail === null) {
                    return null;
                }

                const spec = detail as Record<string, unknown>;

                return {
                    id:
                        typeof spec.id === "string"
                            ? spec.id
                            : `detail-${Date.now()}-${index}`,
                    title: typeof spec.key === "string" ? spec.key : "",
                    value:
                        typeof spec.value === "string" ||
                        typeof spec.value === "number"
                            ? String(spec.value)
                            : "",
                };
            })
            .filter((detail): detail is AdditionalDetail => detail !== null);

        return rows.length > 0
            ? rows
            : [{ id: `detail-${Date.now()}`, title: "", value: "" }];
    }

    return [{ id: `detail-${Date.now()}`, title: "", value: "" }];
}

function normalizeStatus(status?: PublishStatus) {
    return status === "draft" || status === "archived" ? "draft" : "published";
}

function emptyDetail(): AdditionalDetail {
    return { id: `detail-${Date.now()}`, title: "", value: "" };
}

function emptyProductFormData(): ProductFormData {
    return {
        category_id: "",
        name: "",
        slug: "",
        regular_price: "",
        sale_price: "",
        short_description: "",
        full_description: "",
        details: [emptyDetail()],
        gallery_images_state: [],
        status: "published",
        is_featured: false,
        is_best_selling: false,
        is_latest: false,
        robots_index: true,
        robots_follow: true,
        show_price: false,
        sku: "",
        product_type: "",
        wood_type: "",
        style: "",
        is_track_inventory: false,
        stock_quantity: "",
        availability: "",
    };
}

function productFormData(
    product: ProductPayload | null,
    details: AdditionalDetail[],
): ProductFormData {
    if (!product) {
        return emptyProductFormData();
    }

    return {
        category_id: product.categoryId ?? "",
        name: product.name ?? "",
        slug: product.slug ?? "",
        regular_price: product.regularPrice ?? "",
        sale_price: product.salePrice ?? "",
        short_description: product.shortDescription ?? "",
        full_description: product.fullDescription ?? "",
        details,
        gallery_images_state: sortProductImagesPrimaryFirst(
            product.galleryImages ?? [],
        ),
        status: normalizeStatus(product.status),
        is_featured: product.isFeatured ?? false,
        is_best_selling: product.isBestSelling ?? false,
        is_latest: product.isLatest ?? false,
        robots_index: product.robotsIndex ?? true,
        robots_follow: product.robotsFollow ?? true,
        show_price: product.showPrice ?? false,
        sku: product.sku ?? "",
        product_type: product.productType ?? "",
        wood_type: product.woodType ?? "",
        style: product.style ?? "",
        is_track_inventory: product.isTrackInventory ?? false,
        stock_quantity: product.stockQuantity ?? "",
        availability: product.availability ?? "",
    };
}

function ToggleField({
    checked,
    onChange,
    label,
    description,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
}) {
    return (
        <button
            type="button"
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-950/10 bg-white p-3 text-left shadow-sm dark:border-white/10 dark:bg-white/5"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
        >
            <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-950 dark:text-white">
                    {label}
                </span>
                <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
                    {description}
                </span>
            </span>
            <span
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                    checked
                        ? "bg-zinc-950 dark:bg-white"
                        : "bg-zinc-300 dark:bg-zinc-700"
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform dark:bg-zinc-950 ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </span>
        </button>
    );
}

function ProductStatusToggle({
    checked,
    disabled,
    onChange,
}: {
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <button
                type="button"
                className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 disabled:opacity-50 dark:focus:outline-white ${
                    checked ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                aria-pressed={checked}
                aria-label={
                    checked ? "Make product inactive" : "Make product active"
                }
                onClick={() => onChange(!checked)}
                disabled={disabled}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
            <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-950 dark:text-white">
                    {checked ? "Active" : "Inactive"}
                </span>
            </span>
        </div>
    );
}

function UnsavedChangesModal({
    onDiscard,
    onDismiss,
    onSave,
    processing,
}: {
    onDiscard: () => void;
    onDismiss: () => void;
    onSave: () => void;
    processing: boolean;
}) {
    return (
        <div
            className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsaved-product-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-zinc-950/65"
                aria-label="Close confirmation"
                onClick={onDismiss}
            />
            <div
                className="relative w-full max-w-sm rounded-xl border border-zinc-950/10 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-zinc-950"
                onClick={(event) => event.stopPropagation()}
            >
                <h2
                    id="unsaved-product-title"
                    className="text-base font-semibold text-zinc-950 dark:text-white"
                >
                    Save this product?
                </h2>
                <Text className="mt-1 text-sm">
                    Unsaved changes will be lost if you discard.
                </Text>
                <div className="mt-4 grid grid-cols-2 gap-2">
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
                        className="justify-center"
                        onClick={onSave}
                        disabled={processing}
                    >
                        <Save data-slot="icon" />
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DrawerSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="grid gap-4 border-t border-zinc-950/8 pt-5 dark:border-white/10">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {title}
            </h3>
            {children}
        </section>
    );
}

export default function ProductDrawer({
    mode,
    product,
    categories,
    onClose,
    onSaved,
}: ProductDrawerProps) {
    useLockedAdminScroll();

    const initialDetails = useMemo(
        () => normalizeDetails(product?.details),
        [product?.details],
    );
    const initialFormData = useMemo(
        () => productFormData(product, initialDetails),
        [initialDetails, product],
    );
    const form = useForm<ProductFormData>(initialFormData);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);

    const uploadInProgress = form.data.gallery_images_state.some(
        (image) => image.uploading,
    );
    const isActive = form.data.status === "published";

    const requestClose = () => {
        if (form.isDirty && !form.processing) {
            setShowUnsavedModal(true);
            return;
        }

        onClose();
    };

    const discardAndClose = () => {
        setShowUnsavedModal(false);
        onClose();
    };

    const resetForAnotherProduct = () => {
        const nextData = emptyProductFormData();

        form.setDefaults(nextData);
        form.setData(nextData);
        form.clearErrors();
    };

    const updateDetail = (
        id: string,
        field: "title" | "value",
        value: string,
    ) => {
        form.setData(
            "details",
            form.data.details.map((detail) =>
                detail.id === id ? { ...detail, [field]: value } : detail,
            ),
        );
    };

    const addDetail = () => {
        form.setData("details", [
            ...form.data.details,
            { id: `detail-${Date.now()}`, title: "", value: "" },
        ]);
    };

    const removeDetail = (id: string) => {
        const nextDetails = form.data.details.filter(
            (detail) => detail.id !== id,
        );
        form.setData(
            "details",
            nextDetails.length > 0
                ? nextDetails
                : [{ id: `detail-${Date.now()}`, title: "", value: "" }],
        );
    };

    const submit = (intent: SaveIntent) => {
        if (uploadInProgress) {
            return;
        }

        setShowUnsavedModal(false);

        const galleryImages = sortProductImagesPrimaryFirst(
            form.data.gallery_images_state,
        ).filter((image) => typeof image.id === "number");
        const primaryImage = galleryImages[0] ?? null;
        const cleanDetails = form.data.details
            .map((detail) => ({
                title: detail.title.trim(),
                value: detail.value.trim(),
            }))
            .filter((detail) => detail.title !== "" || detail.value !== "");

        const payload = {
            category_id: form.data.category_id,
            name: form.data.name,
            slug: form.data.slug || slugify(form.data.name),
            short_description: form.data.short_description,
            full_description: form.data.full_description,
            regular_price: form.data.regular_price,
            sale_price: form.data.sale_price,
            status: isActive ? "published" : "draft",
            is_available_for_inquiry: true,
            show_price: form.data.show_price,
            details: cleanDetails,
            gallery_images: galleryImages.map((image) => image.id),
            featured_media_id: primaryImage?.id ?? null,
            is_featured: form.data.is_featured,
            is_best_selling: form.data.is_best_selling,
            is_latest: form.data.is_latest,
            robots_index: form.data.robots_index,
            robots_follow: form.data.robots_follow,
            sku: form.data.sku,
            product_type: form.data.product_type,
            wood_type: form.data.wood_type,
            style: form.data.style,
            is_track_inventory: form.data.is_track_inventory,
            stock_quantity: form.data.stock_quantity,
            availability: form.data.availability,
        };

        form.transform(() => payload);

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (intent === "add-more" && mode === "create") {
                    resetForAnotherProduct();
                    return;
                }

                onSaved?.(intent);
            },
        };

        if (mode === "edit" && product?.id) {
            form.patch(`/admin/products/${product.id}`, options);
            return;
        }

        form.post("/admin/products", options);
    };

    return (
        <>
            <div
                className="fixed inset-0 z-[60] bg-zinc-950/45"
                aria-hidden="true"
                onClick={requestClose}
            />
            <form
                className="fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-white shadow-2xl sm:max-w-xl lg:max-w-2xl dark:bg-zinc-950"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-drawer-title"
                onSubmit={(event) => {
                    event.preventDefault();
                    submit("close");
                }}
            >
                <header className="shrink-0 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                {mode === "edit"
                                    ? "Edit product"
                                    : "New product"}
                            </p>
                            <h1
                                id="product-drawer-title"
                                className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white"
                            >
                                {mode === "edit"
                                    ? product?.name
                                    : "Add product"}
                            </h1>
                        </div>
                        <Button
                            type="button"
                            plain
                            className="h-10 w-10 px-0"
                            aria-label="Close product drawer"
                            onClick={requestClose}
                        >
                            <X data-slot="icon" />
                        </Button>
                    </div>
                </header>

                <div className="admin-hidden-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                    <div className="grid gap-5">
                        <DrawerSection title="Essentials">
                            <div className="grid gap-4">
                                <Field>
                                    <Label>Name</Label>
                                    <FormInput
                                        value={form.data.name}
                                        onChange={(event) =>
                                            form.setData(
                                                "name",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Hand carved wooden panel"
                                    />
                                    <FieldError message={form.errors.name} />
                                </Field>

                                <Field>
                                    <Label>Category</Label>
                                    <FormSelect
                                        value={form.data.category_id}
                                        onChange={(event) =>
                                            form.setData(
                                                "category_id",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.label}
                                            </option>
                                        ))}
                                    </FormSelect>
                                    <FieldError
                                        message={form.errors.category_id}
                                    />
                                </Field>

                                <Field>
                                    <Label>Short description</Label>
                                    <FormTextarea
                                        value={form.data.short_description}
                                        onChange={(event) =>
                                            form.setData(
                                                "short_description",
                                                event.target.value,
                                            )
                                        }
                                        rows={3}
                                        placeholder="One or two lines customers can scan quickly."
                                    />
                                    <FieldError
                                        message={form.errors.short_description}
                                    />
                                </Field>

                                <Field>
                                    <Label>Long description</Label>
                                    <FormTextarea
                                        value={form.data.full_description}
                                        onChange={(event) =>
                                            form.setData(
                                                "full_description",
                                                event.target.value,
                                            )
                                        }
                                        rows={5}
                                        placeholder="Add material story, usage notes, or care information."
                                    />
                                    <FieldError
                                        message={form.errors.full_description}
                                    />
                                </Field>
                            </div>
                        </DrawerSection>

                        <DrawerSection title="Price">
                            <div className="grid grid-cols-2 gap-3">
                                <Field>
                                    <Label>Cost price</Label>
                                    <FormInput
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.regular_price}
                                        onChange={(event) =>
                                            form.setData(
                                                "regular_price",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0"
                                    />
                                    <FieldError
                                        message={form.errors.regular_price}
                                    />
                                </Field>
                                <Field>
                                    <Label>Sell price</Label>
                                    <FormInput
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.sale_price}
                                        onChange={(event) =>
                                            form.setData(
                                                "sale_price",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0"
                                    />
                                    <FieldError
                                        message={form.errors.sale_price}
                                    />
                                </Field>
                            </div>

                            <ToggleField
                                checked={form.data.show_price}
                                onChange={(checked) =>
                                    form.setData("show_price", checked)
                                }
                                label="Show price"
                                description="Show the original and selling price on the product detail page."
                            />
                            <FieldError message={form.errors.show_price} />
                        </DrawerSection>

                        <DrawerSection title="Additional details">
                            <div className="grid gap-3">
                                {form.data.details.map((detail) => (
                                    <div
                                        key={detail.id}
                                        className="grid gap-2 rounded-xl border border-zinc-950/8 p-3 dark:border-white/10"
                                    >
                                        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem] gap-2">
                                            <FormInput
                                                value={detail.title}
                                                onChange={(event) =>
                                                    updateDetail(
                                                        detail.id,
                                                        "title",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Title"
                                                aria-label="Additional detail title"
                                            />
                                            <FormInput
                                                value={detail.value}
                                                onChange={(event) =>
                                                    updateDetail(
                                                        detail.id,
                                                        "value",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Value"
                                                aria-label="Additional detail value"
                                            />
                                            <button
                                                type="button"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                                onClick={() =>
                                                    removeDetail(detail.id)
                                                }
                                                aria-label="Remove detail"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    outline
                                    className="justify-center"
                                    onClick={addDetail}
                                >
                                    <Plus data-slot="icon" />
                                    Add detail
                                </Button>
                            </div>
                        </DrawerSection>

                        <DrawerSection title="Images">
                            <ImageUploadArea
                                images={form.data.gallery_images_state}
                                maxImages={10}
                                onChange={(images) =>
                                    form.setData("gallery_images_state", images)
                                }
                            />
                            <FieldError
                                message={
                                    (form.errors as Record<string, string>)
                                        .gallery_images
                                }
                            />
                            <Text>
                                Use up to 10 images. Select the star to change
                                the primary image.
                            </Text>
                        </DrawerSection>
                    </div>
                </div>

                <footer className="shrink-0 border-t border-zinc-950/8 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950 sm:px-6">
                    <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
                        <ProductStatusToggle
                            checked={isActive}
                            disabled={form.processing}
                            onChange={(checked) =>
                                form.setData(
                                    "status",
                                    checked ? "published" : "draft",
                                )
                            }
                        />
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                            <Button
                                type="button"
                                className="justify-center"
                                onClick={() => submit("close")}
                                disabled={form.processing || uploadInProgress}
                            >
                                <Save data-slot="icon" />
                                Save
                            </Button>
                            <Button
                                type="button"
                                color="light"
                                className="justify-center"
                                onClick={() => submit("add-more")}
                                disabled={form.processing || uploadInProgress}
                            >
                                <Plus data-slot="icon" />
                                Add More
                            </Button>
                        </div>
                    </div>
                </footer>
            </form>
            {showUnsavedModal ? (
                <UnsavedChangesModal
                    onDiscard={discardAndClose}
                    onDismiss={() => setShowUnsavedModal(false)}
                    onSave={() => submit("close")}
                    processing={form.processing || uploadInProgress}
                />
            ) : null}
        </>
    );
}
