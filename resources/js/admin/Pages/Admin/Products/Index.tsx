import { Head, router } from '@inertiajs/react';
import { Pencil, Power, Trash2 } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FormInput, FormSelect, PagePanel, PaginationLinks, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { Paginated, PublishStatus, SelectOption } from '@admin/types';

type ProductListItem = {
    id: number;
    name: string;
    slug: string;
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
    filters: {
        search: string | null;
        status: string | null;
        categoryId: string | number | null;
    };
};

function statusTone(status: PublishStatus) {
    return status === 'published' ? 'green' : status === 'archived' ? 'red' : 'amber';
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const removeProduct = (product: ProductListItem) => {
        if (!window.confirm(`Remove ${product.name}?`)) {
            return;
        }

        router.delete(`/admin/products/${product.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Products" />
            <AdminShell
                title="Products"
                description="List, add, edit, remove, and switch product pages active or inactive."
                actions={<Button href="/admin/products/create">Add product</Button>}
            >

                <PagePanel>
                    <form className="grid gap-4 lg:grid-cols-[1fr_180px_220px_auto]" method="get" action="/admin/products">
                        <Field>
                            <Label>Search</Label>
                            <FormInput name="search" defaultValue={filters.search ?? ''} />
                        </Field>
                        <Field>
                            <Label>Status</Label>
                            <FormSelect name="status" defaultValue={filters.status ?? ''}>
                                <option value="">All</option>
                                <option value="published">Active</option>
                                <option value="draft">Inactive</option>
                                <option value="archived">Archived</option>
                            </FormSelect>
                        </Field>
                        <Field>
                            <Label>Category</Label>
                            <FormSelect name="category_id" defaultValue={filters.categoryId ?? ''}>
                                <option value="">All categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </Field>
                        <div className="flex items-end gap-2">
                            <Button type="submit" color="light">
                                Filter
                            </Button>
                            <Button href="/admin/products" plain>
                                Clear
                            </Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {products.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No products found" description="Add products or adjust filters to continue." />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col />
                                    <col className="w-[180px]" />
                                    <col className="w-[110px]" />
                                    <col className="w-[220px]" />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Product</th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Status</th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Sort</th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-950/8 dark:divide-white/10">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="align-middle">
                                            <td className="px-4 py-2.5">
                                                <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">{product.name}</p>
                                                <Text className="truncate">/products/{product.slug} / {product.category.name}</Text>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <StatusBadge tone={statusTone(product.status)}>{product.status === 'published' ? 'active' : 'inactive'}</StatusBadge>
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <Text>{product.sortOrder}</Text>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        href={`/admin/products/${product.id}`}
                                                        color="light"
                                                        className="h-9 w-9 px-0"
                                                        aria-label={`Edit ${product.name}`}
                                                        title={`Edit ${product.name}`}
                                                    >
                                                        <Pencil data-slot="icon" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        color="light"
                                                        className="h-9 w-9 px-0"
                                                        aria-label={`${product.status === 'published' ? 'Deactivate' : 'Activate'} ${product.name}`}
                                                        title={`${product.status === 'published' ? 'Deactivate' : 'Activate'} ${product.name}`}
                                                        onClick={() => router.post(`/admin/products/${product.id}/toggle`, {}, { preserveScroll: true })}
                                                    >
                                                        <Power data-slot="icon" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        plain
                                                        className="h-9 w-9 px-0"
                                                        aria-label={`Remove ${product.name}`}
                                                        title={`Remove ${product.name}`}
                                                        onClick={() => removeProduct(product)}
                                                    >
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
                    <PaginationLinks meta={products.meta} baseUrl="/admin/products" />
                </div>
            </AdminShell>
        </>
    );
}
