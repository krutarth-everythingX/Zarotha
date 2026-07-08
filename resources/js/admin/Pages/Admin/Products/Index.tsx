import { Head, router } from "@inertiajs/react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@admin/Components/ui/button";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
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
                                                        className="align-middle"
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
                                                            <div className="flex items-center justify-end gap-2">
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
                                                                    <Power data-slot="icon" />
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
                        onSaved={() => setEditingProduct(null)}
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
                                    <Power data-slot="icon" />
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
                        <div className="space-y-4">
                            <DetailSection title="Product Details">
                                <DetailGrid>
                                    <DetailItem label="No.">
                                        {products.data.findIndex(
                                            (product) =>
                                                product.id ===
                                                selectedProduct.id,
                                        ) + firstProductNumber}
                                    </DetailItem>
                                    <DetailItem label="Category">
                                        {selectedProduct.category.name}
                                    </DetailItem>
                                    <DetailItem label="Slug">
                                        /products/{selectedProduct.slug}
                                    </DetailItem>
                                    <DetailItem label="SKU">
                                        {selectedProduct.sku}
                                    </DetailItem>
                                    <DetailItem label="Product Type">
                                        {selectedProduct.productType}
                                    </DetailItem>
                                    <DetailItem label="Wood Type">
                                        {selectedProduct.woodType}
                                    </DetailItem>
                                    <DetailItem label="Style">
                                        {selectedProduct.style}
                                    </DetailItem>
                                    <DetailItem label="Sort Order">
                                        {selectedProduct.sortOrder}
                                    </DetailItem>
                                </DetailGrid>
                            </DetailSection>

                            <DetailSection title="Commerce">
                                <DetailGrid>
                                    <DetailItem label="Regular Price">
                                        {formatProductPrice(
                                            selectedProduct.regularPrice,
                                        )}
                                    </DetailItem>
                                    <DetailItem label="Sale Price">
                                        {formatProductPrice(
                                            selectedProduct.salePrice,
                                        )}
                                    </DetailItem>
                                    <DetailItem label="Availability">
                                        {selectedProduct.availability}
                                    </DetailItem>
                                    <DetailItem label="Stock">
                                        {selectedProduct.isTrackInventory
                                            ? (selectedProduct.stockQuantity ??
                                              "0")
                                            : "Not tracked"}
                                    </DetailItem>
                                </DetailGrid>
                            </DetailSection>

                            <DetailSection title="Visibility">
                                <DetailGrid>
                                    <DetailItem label="Featured">
                                        {selectedProduct.isFeatured
                                            ? "Yes"
                                            : "No"}
                                    </DetailItem>
                                    <DetailItem label="Best Selling">
                                        {selectedProduct.isBestSelling
                                            ? "Yes"
                                            : "No"}
                                    </DetailItem>
                                    <DetailItem label="Latest">
                                        {selectedProduct.isLatest
                                            ? "Yes"
                                            : "No"}
                                    </DetailItem>
                                    <DetailItem label="Updated">
                                        {formatProductDate(
                                            selectedProduct.updatedAt,
                                        )}
                                    </DetailItem>
                                </DetailGrid>
                            </DetailSection>

                            <DetailSection title="Description">
                                <DetailItem label="Short Description" full>
                                    {selectedProduct.shortDescription}
                                </DetailItem>
                            </DetailSection>
                        </div>
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}
