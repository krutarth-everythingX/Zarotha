import { Head, router } from '@inertiajs/react';
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
    if (status === 'published') {
        return 'green';
    }

    if (status === 'archived') {
        return 'red';
    }

    return 'amber';
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    return (
        <>
            <Head title="Products" />
            <AdminShell title="Products" description="Review, filter, publish, archive, and manage inquiry catalogue products.">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Text>Categories remain required for product organization and public filtering.</Text>
                    <Button href="/admin/products/create">Create product</Button>
                </div>

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
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
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
                            <EmptyState title="No products found" description="Create products or adjust filters to continue." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {products.data.map((product) => (
                                <article key={product.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_180px_120px_auto] xl:items-center">
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{product.name}</p>
                                        <Text>
                                            /products/{product.slug} Â· {product.category.name}
                                        </Text>
                                    </div>
                                    <StatusBadge tone={statusTone(product.status)}>{product.status}</StatusBadge>
                                    <Text>Sort {product.sortOrder}</Text>
                                    <div className="flex flex-wrap gap-2">
                                        <Button href={`/admin/products/${product.id}`} color="light">
                                            Edit
                                        </Button>
                                        <Button href={`/admin/products/${product.id}/gallery`} color="light">
                                            Gallery
                                        </Button>
                                        <Button
                                            color="light"
                                            onClick={() => {
                                                router.post(`/admin/products/${product.id}/${product.status === 'published' ? 'archive' : 'publish'}`, {}, { preserveScroll: true });
                                            }}
                                        >
                                            {product.status === 'published' ? 'Archive' : 'Publish'}
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <PaginationLinks meta={products.meta} baseUrl="/admin/products" />
                </div>
            </AdminShell>
        </>
    );
}
