import { Head, router } from "@inertiajs/react";
import { Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@admin/Components/ui/button";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    DetailModal,
    EmptyState,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PaginationLinks,
    SearchFilterPanel,
    StatusBadge,
    StatsStrip,
} from "@admin/Components/AdminPrimitives";
import type { Paginated, PublishStatus, SelectOption } from "@admin/types";
import ProductDrawer, { type ProductPayload } from "./ProductDrawer";

type ProductListItem = ProductPayload & {
    category: { id: number; name: string; slug: string };
    status: PublishStatus;
    publishedAt: string | null;
    sortOrder: number;
    isFeatured: boolean;
    isBestSelling: boolean;
    isLatest: boolean;
    updatedAt: string | null;
};

type ProductsIndexProps = {
    products: Paginated<ProductListItem>;
    categories: SelectOption[];
    stats: {
        total: number;
        active: number;
        inactive: number;
        archived: number;
    };
    filters: {
        search: string | null;
        status: string | null;
        categoryId: string | number | null;
    };
};

function statusTone(status: PublishStatus) {
    return status === "published"
        ? "green"
        : status === "archived"
          ? "red"
          : "amber";
}

function formatProductDate(value: string | null) {
    if (!value) {
        return "Not available";
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatProductPrice(value?: string | number | null) {
    if (value === null || value === undefined || value === "") {
        return "Not set";
    }

    return String(value);
}

type ProductPreviewItem = {
    label: string;
    value: string | number;
    className?: string;
};

function hasProductValue(value: unknown) {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return true;
}

function productDetailItems(product: ProductListItem, firstProductNumber: number) {
    return [
        {
            label: "No.",
            value: firstProductNumber,
            className: "sm:col-span-1",
        },
        {
            label: "Category",
            value: product.category.name,
            className: "sm:col-span-2",
        },
        {
            label: "Slug",
            value: `/products/${product.slug}`,
            className: "sm:col-span-3",
        },
        {
            label: "SKU",
            value: product.sku,
        },
        {
            label: "Product Type",
            value: product.productType,
        },
        {
            label: "Wood Type",
            value: product.woodType,
        },
        {
            label: "Style",
            value: product.style,
        },
        {
            label: "Sort Order",
            value: product.sortOrder,
        },
    ].filter((item): item is ProductPreviewItem => hasProductValue(item.value));
}

function productCommerceItems(product: ProductListItem) {
    const items: ProductPreviewItem[] = [];

    if (hasProductValue(product.regularPrice)) {
        items.push({
            label: "Regular Price",
            value: formatProductPrice(product.regularPrice),
        });
    }

    if (hasProductValue(product.salePrice)) {
        items.push({
            label: "Sale Price",
            value: formatProductPrice(product.salePrice),
        });
    }

    if (hasProductValue(product.availability)) {
        items.push({
            label: "Availability",
            value: product.availability,
        });
    }

    if (product.isTrackInventory && hasProductValue(product.stockQuantity)) {
        items.push({
            label: "Stock",
            value: String(product.stockQuantity),
        });
    }

    return items;
}

function productHighlightItems(product: ProductListItem) {
    return [
        product.isFeatured ? "Featured" : null,
        product.isBestSelling ? "Best Selling" : null,
        product.isLatest ? "Latest" : null,
        product.updatedAt ? `Updated ${formatProductDate(product.updatedAt)}` : null,
    ].filter((item): item is string => Boolean(item));
}

function normalizedProductDetails(details: unknown) {
    if (Array.isArray(details)) {
        return details
            .map((detail) => {
                if (typeof detail !== "object" || detail === null) {
                    return null;
                }

                const record = detail as Record<string, unknown>;
                const title =
                    typeof record.title === "string"
                        ? record.title.trim()
                        : typeof record.key === "string"
                          ? record.key.trim()
                          : "";
                const value =
                    typeof record.value === "string" ||
                    typeof record.value === "number"
                        ? String(record.value).trim()
                        : "";

                return title && value ? { title, value } : null;
            })
            .filter(
                (detail): detail is { title: string; value: string } =>
                    detail !== null,
            );
    }

    if (typeof details === "object" && details !== null) {
        const record = details as Record<string, unknown>;
        const rows = Array.isArray(record.dynamic_specs)
            ? record.dynamic_specs
            : [];

        return rows
            .map((detail) => {
                if (typeof detail !== "object" || detail === null) {
                    return null;
                }

                const spec = detail as Record<string, unknown>;
                const title =
                    typeof spec.title === "string"
                        ? spec.title.trim()
                        : typeof spec.key === "string"
                          ? spec.key.trim()
                          : "";
                const value =
                    typeof spec.value === "string" ||
                    typeof spec.value === "number"
                        ? String(spec.value).trim()
                        : "";

                return title && value ? { title, value } : null;
            })
            .filter(
                (detail): detail is { title: string; value: string } =>
                    detail !== null,
            );
    }

    return [];
}

function ProductBentoCard({
    label,
    value,
    className = "",
    valueClassName = "",
}: {
    label: string;
    value: ReactNode;
    className?: string;
    valueClassName?: string;
}) {
    return (
        <div
            className={`self-start rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm ${className}`}
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            <div
                className={`mt-1.5 break-words text-sm font-semibold leading-6 text-zinc-950 dark:text-white ${valueClassName}`}
            >
                {value}
            </div>
        </div>
    );
}

export default function ProductsIndex({
    products,
    categories,
    stats,
    filters,
}: ProductsIndexProps) {
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState<ProductListItem | null>(null);
    const [selectedProduct, setSelectedProduct] =
        useState<ProductListItem | null>(null);
    const firstProductNumber = products.meta.from ?? 1;
    const productFilterFields = useMemo(
        () => [
            {
                name: "status",
                label: "Status",
                value: filters.status,
                allLabel: "All",
                options: [
                    { value: "published", label: "Active" },
                    { value: "draft", label: "Inactive" },
                    { value: "archived", label: "Archived" },
                ],
            },
            {
                name: "category_id",
                label: "Category",
                value: filters.categoryId,
                allLabel: "All categories",
                options: categories.map((category) => ({
                    value: category.id,
                    label: category.label,
                })),
            },
        ],
        [categories, filters.categoryId, filters.status],
    );

    const toggleProduct = (product: ProductListItem) => {
        router.post(
            `/admin/products/${product.id}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const removeProduct = (product: ProductListItem) => {
        if (!window.confirm(`Remove ${product.name}?`)) {
            return;
        }

        router.delete(`/admin/products/${product.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedProduct?.id === product.id) {
                    setSelectedProduct(null);
                }
            },
        });
    };

    return (
        <>
            <Head title="Products" />
            <AdminShell
                title="Products"
                description="List, add, edit, remove, and switch product pages active or inactive."
                actions={
                    <Button
                        type="button"
                        onClick={() => setShowCreateDrawer(true)}
                    >
                        <Plus data-slot="icon" />
                        Add product
                    </Button>
                }
            >
                <section className="flex min-h-[100dvh] flex-col">
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
                            {
                                label: "Archived",
                                value: stats.archived,
                                tone: "red",
                            },
                        ]}
                    />

                    <ListTablePanel
                        minHeightClass="min-h-0 flex-1"
                        toolbar={
                            <SearchFilterPanel
                                action="/admin/products"
                                clearHref="/admin/products"
                                variant="toolbar"
                                searchValue={filters.search}
                                searchPlaceholder="Search products"
                                hasActiveFilters={Boolean(
                                    filters.search ||
                                    filters.status ||
                                    filters.categoryId,
                                )}
                                filterFields={productFilterFields}
                            />
                        }
                        footer={
                            <PaginationLinks
                                meta={products.meta}
                                baseUrl="/admin/products"
                            />
                        }
                    >
                        {products.data.length === 0 ? (
                            <div className="grid min-h-full place-items-center p-4 sm:p-6">
                                <EmptyState
                                    title="No products found"
                                    description="Add products or adjust filters to continue."
                                />
                            </div>
                        ) : (
                            <>
                                <MobileTableList>
                                    {products.data.map((product, index) => (
                                        <MobileTableRow
                                            key={product.id}
                                            number={firstProductNumber + index}
                                            title={product.name}
                                            subtitle={product.category.name}
                                            badge={
                                                <StatusBadge
                                                    tone={statusTone(
                                                        product.status,
                                                    )}
                                                >
                                                    {product.status ===
                                                    "published"
                                                        ? "active"
                                                        : "inactive"}
                                                </StatusBadge>
                                            }
                                            onOpen={() =>
                                                setSelectedProduct(product)
                                            }
                                        />
                                    ))}
                                </MobileTableList>
                                <div className="hidden min-h-full overflow-x-auto md:block">
                                    <table className="min-w-[46rem] table-fixed border-collapse lg:min-w-full">
                                        <colgroup>
                                            <col className="w-[4rem]" />
                                            <col />
                                            <col className="w-[8rem] lg:w-[10rem]" />
                                            <col className="w-[5rem] lg:w-[7rem]" />
                                            <col className="w-[10rem] lg:w-[14rem]" />
                                        </colgroup>
                                        <thead>
                                            <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                                <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                    No.
                                                </th>
                                                <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                    Product
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
                                            {products.data.map(
                                                (product, index) => (
                                                    <tr
                                                        key={product.id}
                                                        className="cursor-pointer align-middle"
                                                        onClick={() =>
                                                            setSelectedProduct(
                                                                product,
                                                            )
                                                        }
                                                    >
                                                        <td className="px-4 py-2.5">
                                                            <Text>
                                                                {firstProductNumber +
                                                                    index}
                                                            </Text>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">
                                                                {product.name}
                                                            </p>
                                                            <Text className="truncate">
                                                                /products/
                                                                {
                                                                    product.slug
                                                                } /{" "}
                                                                {
                                                                    product
                                                                        .category
                                                                        .name
                                                                }
                                                            </Text>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <StatusBadge
                                                                tone={statusTone(
                                                                    product.status,
                                                                )}
                                                            >
                                                                {product.status ===
                                                                "published"
                                                                    ? "active"
                                                                    : "inactive"}
                                                            </StatusBadge>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right">
                                                            <Text>
                                                                {
                                                                    product.sortOrder
                                                                }
                                                            </Text>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <div
                                                                className="flex items-center justify-end gap-2"
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    event.stopPropagation()
                                                                }
                                                            >
                                                                <Button
                                                                    type="button"
                                                                    color="light"
                                                                    className="h-9 w-9 px-0"
                                                                    aria-label={`Edit ${product.name}`}
                                                                    title={`Edit ${product.name}`}
                                                                    onClick={() =>
                                                                        setEditingProduct(
                                                                            product,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil data-slot="icon" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    color="light"
                                                                    className="h-9 w-9 px-0"
                                                                    aria-label={`${product.status === "published" ? "Deactivate" : "Activate"} ${product.name}`}
                                                                    title={`${product.status === "published" ? "Deactivate" : "Activate"} ${product.name}`}
                                                                    onClick={() =>
                                                                        toggleProduct(
                                                                            product,
                                                                        )
                                                                    }
                                                                >
                                                                    {product.status ===
                                                                    "published" ? (
                                                                        <PowerOff data-slot="icon" />
                                                                    ) : (
                                                                        <Power data-slot="icon" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    plain
                                                                    className="h-9 w-9 px-0"
                                                                    aria-label={`Remove ${product.name}`}
                                                                    title={`Remove ${product.name}`}
                                                                    onClick={() =>
                                                                        removeProduct(
                                                                            product,
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
                </section>

                {showCreateDrawer ? (
                    <ProductDrawer
                        mode="create"
                        product={null}
                        categories={categories}
                        onClose={() => setShowCreateDrawer(false)}
                        onSaved={() => setShowCreateDrawer(false)}
                    />
                ) : null}

                {editingProduct ? (
                    <ProductDrawer
                        mode="edit"
                        product={editingProduct}
                        categories={categories}
                        onClose={() => setEditingProduct(null)}
                        onSaved={(intent) => {
                            setEditingProduct(null);

                            if (intent === "add-more") {
                                setShowCreateDrawer(true);
                            }
                        }}
                    />
                ) : null}

                {selectedProduct ? (
                    <DetailModal
                        title={selectedProduct.name}
                        subtitle={`/products/${selectedProduct.slug}`}
                        badge={
                            <StatusBadge
                                tone={statusTone(selectedProduct.status)}
                            >
                                {selectedProduct.status === "published"
                                    ? "active"
                                    : "inactive"}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedProduct(null)}
                        titleId="product-detail-title"
                        maxWidthClass="max-w-4xl"
                        bodyClassName="admin-hidden-scrollbar"
                        actions={
                            <>
                                <Button
                                    type="button"
                                    className="justify-center"
                                    onClick={() => {
                                        setEditingProduct(selectedProduct);
                                        setSelectedProduct(null);
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
                                        toggleProduct(selectedProduct)
                                    }
                                >
                                    {selectedProduct.status === "published" ? (
                                        <PowerOff data-slot="icon" />
                                    ) : (
                                        <Power data-slot="icon" />
                                    )}
                                    {selectedProduct.status === "published"
                                        ? "Deactivate"
                                        : "Activate"}
                                </Button>
                                <Button
                                    type="button"
                                    plain
                                    className="justify-center"
                                    onClick={() =>
                                        removeProduct(selectedProduct)
                                    }
                                >
                                    <Trash2 data-slot="icon" />
                                    Remove
                                </Button>
                            </>
                        }
                    >
                        <ProductPreviewContent
                            product={selectedProduct}
                            index={
                                products.data.findIndex(
                                    (product) =>
                                        product.id === selectedProduct.id,
                                ) + firstProductNumber
                            }
                        />
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}

function ProductPreviewContent({
    product,
    index,
}: {
    product: ProductListItem;
    index: number;
}) {
    const overviewItems = productDetailItems(product, index);
    const commerceItems = productCommerceItems(product);
    const highlightItems = productHighlightItems(product);
    const additionalSpecs = normalizedProductDetails(product.details);
    const hasGallery = (product.galleryImages?.length ?? 0) > 0;
    const primaryImage = product.galleryImages?.[0] ?? null;
    const thumbnailImages = product.galleryImages?.slice(1, 5) ?? [];
    const topMetaItems = overviewItems.filter(
        (item) => item.label === "No." || item.label === "Category",
    );
    const slugItem =
        overviewItems.find((item) => item.label === "Slug") ?? null;
    const quickInfoItems = overviewItems.filter(
        (item) => item.label === "SKU" || item.label === "Sort Order",
    );
    const detailItems = overviewItems.filter(
        (item) =>
            item.label !== "No." &&
            item.label !== "Category" &&
            item.label !== "Slug" &&
            item.label !== "SKU" &&
            item.label !== "Sort Order",
    );
    const descriptionCards = [
        hasProductValue(product.shortDescription)
            ? {
                  label: "Short Description",
                  value: product.shortDescription as string,
                  className: "xl:col-span-6",
              }
            : null,
        hasProductValue(product.fullDescription)
            ? {
                  label: "Full Description",
                  value: product.fullDescription as string,
                  className: "xl:col-span-6",
              }
            : null,
    ].filter(
        (
            item,
        ): item is { label: string; value: string; className: string } =>
            item !== null,
    );
    const summaryItems = [
        ...quickInfoItems,
        ...highlightItems.map((item) => ({
            label: "Highlight",
            value: item,
        })),
    ];
    const thumbnailGridClass =
        thumbnailImages.length >= 4
            ? "grid-cols-4"
            : thumbnailImages.length === 3
              ? "grid-cols-3"
              : thumbnailImages.length === 2
                ? "grid-cols-2"
                : "grid-cols-1";

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.9fr)]">
                {hasGallery ? (
                    <section className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="aspect-[4/3] overflow-hidden bg-zinc-100/5">
                            <img
                                src={primaryImage?.url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {thumbnailImages.length > 0 ? (
                            <div className="p-3">
                                <div
                                    className={`inline-grid gap-2 ${thumbnailGridClass}`}
                                >
                                    {thumbnailImages.map((image, imageIndex) => (
                                        <div
                                        key={`${image.id ?? imageIndex}`}
                                        className="aspect-square w-24 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                                    >
                                            <img
                                                src={image.url}
                                                alt={
                                                    image.altText ??
                                                    `${product.name} ${imageIndex + 2}`
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </section>
                ) : null}

                <div className="grid content-start gap-4">
                    {topMetaItems.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {topMetaItems.map((item) => (
                                <ProductBentoCard
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </div>
                    ) : null}

                    {slugItem ? (
                        <ProductBentoCard
                            label={slugItem.label}
                            value={slugItem.value}
                            valueClassName="leading-8"
                        />
                    ) : null}

                    {summaryItems.length > 0 ? (
                        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                                Snapshot
                            </p>
                            <div className="mt-3 grid gap-3">
                                {quickInfoItems.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {quickInfoItems.map((item) => (
                                            <div
                                                key={item.label}
                                                className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5"
                                            >
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                                                    {item.label}
                                                </p>
                                                <p className="mt-1.5 text-base font-semibold text-white">
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                                {highlightItems.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {highlightItems.map((item) => (
                                            <span
                                                key={item}
                                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-zinc-200"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6 xl:grid-flow-dense">
                {commerceItems.map((item) => (
                    <ProductBentoCard
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        className="xl:col-span-2"
                    />
                ))}

                {detailItems.map((item) => (
                    <ProductBentoCard
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        className="xl:col-span-2"
                    />
                ))}

                {additionalSpecs.map((detail) => (
                    <ProductBentoCard
                        key={`${detail.title}-${detail.value}`}
                        label={detail.title}
                        value={detail.value}
                        className="xl:col-span-2"
                    />
                ))}

                {descriptionCards.map((item) => (
                    <ProductBentoCard
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        className={item.className}
                        valueClassName="whitespace-pre-line font-medium leading-7 text-zinc-600 dark:text-zinc-300"
                    />
                ))}
            </div>
        </div>
    );
}
