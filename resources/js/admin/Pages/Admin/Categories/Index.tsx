import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FieldError, FormInput, FormSelect, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';

type CategoryItem = {
    id: number;
    name: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    productCount: number;
};

type CategoriesIndexProps = {
    categories: CategoryItem[];
    filters: {
        search: string | null;
        is_active: string | null;
    };
    errors?: Record<string, string>;
};

export default function CategoriesIndex({ categories, filters, errors = {} }: CategoriesIndexProps) {
    const createForm = useForm({
        name: '',
        slug: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });

    return (
        <>
            <Head title="Categories" />
            <AdminShell title="Categories" description="Manage catalogue taxonomy used for product organization and public filtering.">
                <PagePanel>
                    <form
                        className="grid gap-4 lg:grid-cols-[1fr_1fr_140px_140px_auto]"
                        onSubmit={(event) => {
                            event.preventDefault();
                            createForm.post('/admin/categories', { preserveScroll: true });
                        }}
                    >
                        <Field>
                            <Label>Name</Label>
                            <FormInput value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} />
                            <FieldError message={createForm.errors.name} />
                        </Field>
                        <Field>
                            <Label>Slug</Label>
                            <FormInput value={createForm.data.slug} onChange={(event) => createForm.setData('slug', event.target.value)} />
                            <FieldError message={createForm.errors.slug} />
                        </Field>
                        <Field>
                            <Label>Sort order</Label>
                            <FormInput
                                type="number"
                                value={createForm.data.sort_order}
                                onChange={(event) => createForm.setData('sort_order', Number(event.target.value))}
                            />
                        </Field>
                        <Field>
                            <Label>Status</Label>
                            <FormSelect
                                value={createForm.data.is_active ? '1' : '0'}
                                onChange={(event) => createForm.setData('is_active', event.target.value === '1')}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </FormSelect>
                        </Field>
                        <div className="flex items-end">
                            <Button type="submit" disabled={createForm.processing}>
                                Add
                            </Button>
                        </div>
                    </form>
                    <FieldError message={errors.category} />
                </PagePanel>

                <PagePanel className="mt-6">
                    <form className="grid gap-4 sm:grid-cols-[1fr_180px_auto]" method="get" action="/admin/categories">
                        <Field>
                            <Label>Search</Label>
                            <FormInput name="search" defaultValue={filters.search ?? ''} />
                        </Field>
                        <Field>
                            <Label>Active state</Label>
                            <FormSelect name="is_active" defaultValue={filters.is_active ?? ''}>
                                <option value="">All</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </FormSelect>
                        </Field>
                        <div className="flex items-end gap-2">
                            <Button type="submit" color="light">
                                Filter
                            </Button>
                            <Button href="/admin/categories" plain>
                                Clear
                            </Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {categories.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No categories found" description="Create categories before publishing products." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {categories.map((category) => (
                                <article key={category.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_120px_120px_auto] lg:items-center">
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{category.name}</p>
                                        <Text>/{category.slug}</Text>
                                    </div>
                                    <StatusBadge tone={category.isActive ? 'green' : 'amber'}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </StatusBadge>
                                    <Text>{category.productCount} products</Text>
                                    <div className="flex gap-2">
                                        <Button
                                            color="light"
                                            onClick={() => {
                                                router.patch(
                                                    `/admin/categories/${category.id}`,
                                                    {
                                                        name: category.name,
                                                        slug: category.slug,
                                                        sort_order: category.sortOrder,
                                                        is_active: !category.isActive,
                                                    },
                                                    { preserveScroll: true },
                                                );
                                            }}
                                        >
                                            Toggle
                                        </Button>
                                        <Button
                                            color="light"
                                            onClick={() => {
                                                if (window.confirm(`Delete ${category.name}?`)) {
                                                    router.delete(`/admin/categories/${category.id}`, { preserveScroll: true });
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </AdminShell>
        </>
    );
}
