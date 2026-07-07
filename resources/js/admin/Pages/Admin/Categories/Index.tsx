import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Plus, Power, Trash2, X } from 'lucide-react';
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

type CategoryFormData = {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
    is_active: boolean;
};

const emptyCategoryForm: CategoryFormData = {
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
};

function CategoryModal({
    title,
    open,
    processing,
    data,
    errors,
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
    submitLabel: string;
    onClose: () => void;
    onSubmit: () => void;
    onChange: <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) => void;
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4" role="dialog" aria-modal="true" aria-labelledby="category-modal-title" onClick={onClose}>
            <div
                className="w-full rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-zinc-950"
                style={{ width: 'min(42rem, calc(100vw - 2rem))' }}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-zinc-950/8 px-5 py-4 dark:border-white/10">
                    <div>
                        <h2 id="category-modal-title" className="text-lg font-semibold text-zinc-950 dark:text-white">
                            {title}
                        </h2>
                        <Text className="mt-1">Manage product categories used across the CMS and public site.</Text>
                    </div>
                    <Button type="button" plain onClick={onClose}>
                        <X data-slot="icon" />
                    </Button>
                </div>

                <form
                    className="p-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <Label>Name</Label>
                            <FormInput value={data.name} onChange={(event) => onChange('name', event.target.value)} />
                            <FieldError message={errors.name} />
                        </Field>

                        <Field>
                            <Label>Slug</Label>
                            <FormInput value={data.slug} onChange={(event) => onChange('slug', event.target.value)} />
                            <FieldError message={errors.slug} />
                        </Field>

                        <Field>
                            <Label>Sort order</Label>
                            <FormInput type="number" value={data.sort_order} onChange={(event) => onChange('sort_order', Number(event.target.value))} />
                            <FieldError message={errors.sort_order} />
                        </Field>

                        <Field>
                            <Label>Status</Label>
                            <FormSelect value={data.is_active ? '1' : '0'} onChange={(event) => onChange('is_active', event.target.value === '1')}>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </FormSelect>
                            <FieldError message={errors.is_active} />
                        </Field>
                    </div>

                    <div className="mt-4">
                        <Field>
                            <Label>Description</Label>
                            <textarea
                                value={data.description}
                                onChange={(event) => onChange('description', event.target.value)}
                                rows={4}
                                className="block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:outline-white"
                            />
                            <FieldError message={errors.description} />
                        </Field>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-950/8 pt-4 dark:border-white/10">
                        <Button type="button" plain onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {submitLabel}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CategoriesIndex({ categories, filters, errors = {} }: CategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

    const createForm = useForm<CategoryFormData>(emptyCategoryForm);
    const editForm = useForm<CategoryFormData>(emptyCategoryForm);

    const summary = useMemo(
        () => ({
            total: categories.length,
            active: categories.filter((category) => category.isActive).length,
            inactive: categories.filter((category) => !category.isActive).length,
        }),
        [categories],
    );

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
                <section className="grid gap-4 lg:grid-cols-3">
                    {[
                        ['Total', summary.total],
                        ['Active', summary.active],
                        ['Inactive', summary.inactive],
                    ].map(([label, value]) => (
                        <PagePanel key={label} className="p-4">
                            <Text>{label}</Text>
                            <p className="mt-1 text-3xl font-semibold text-zinc-950 dark:text-white">{value}</p>
                        </PagePanel>
                    ))}
                </section>

                <PagePanel className="mt-6">
                    <form className="grid gap-4 sm:grid-cols-[1fr_180px_auto]" method="get" action="/admin/categories">
                        <Field>
                            <Label>Search</Label>
                            <FormInput name="search" defaultValue={filters.search ?? ''} placeholder="Category name or slug" />
                        </Field>
                        <Field>
                            <Label>Status</Label>
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
                    <FieldError message={errors.category} />
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {categories.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No categories found" description="Add a category to start organizing products." />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col />
                                    <col className="w-[144px]" />
                                    <col className="w-[220px]" />
                                    <col className="w-[96px]" />
                                    <col className="w-[96px]" />
                                    <col className="w-[148px]" />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Name</th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Status</th>
                                        <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Slug</th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Order</th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Items</th>
                                        <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-950/8 dark:divide-white/10">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="align-middle">
                                            <td className="px-4 py-2.5">
                                                <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">{category.name}</p>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <StatusBadge tone={category.isActive ? 'green' : 'amber'}>
                                                    {category.isActive ? 'Active' : 'Inactive'}
                                                </StatusBadge>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <Text className="truncate">/{category.slug}</Text>
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <Text>#{category.sortOrder}</Text>
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <Text>{category.productCount}</Text>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        color="light"
                                                        className="h-9 w-9 px-0"
                                                        aria-label={`Edit ${category.name}`}
                                                        title={`Edit ${category.name}`}
                                                        onClick={() => {
                                                            setEditingCategory(category);
                                                            editForm.setData({
                                                                name: category.name,
                                                                slug: category.slug,
                                                                description: '',
                                                                sort_order: category.sortOrder,
                                                                is_active: category.isActive,
                                                            });
                                                            editForm.clearErrors();
                                                        }}
                                                    >
                                                        <Pencil data-slot="icon" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        color="light"
                                                        className="h-9 w-9 px-0"
                                                        aria-label={`${category.isActive ? 'Deactivate' : 'Activate'} ${category.name}`}
                                                        title={`${category.isActive ? 'Deactivate' : 'Activate'} ${category.name}`}
                                                        onClick={() => {
                                                            router.patch(
                                                                `/admin/categories/${category.id}`,
                                                                {
                                                                    name: category.name,
                                                                    slug: category.slug,
                                                                    description: '',
                                                                    sort_order: category.sortOrder,
                                                                    is_active: !category.isActive,
                                                                },
                                                                { preserveScroll: true },
                                                            );
                                                        }}
                                                    >
                                                        <Power data-slot="icon" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        plain
                                                        className="h-9 w-9 px-0"
                                                        aria-label={`Remove ${category.name}`}
                                                        title={`Remove ${category.name}`}
                                                        onClick={() => {
                                                            if (window.confirm(`Delete ${category.name}?`)) {
                                                                router.delete(`/admin/categories/${category.id}`, { preserveScroll: true });
                                                            }
                                                        }}
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
                </div>

                <CategoryModal
                    title="Add category"
                    open={isCreateOpen}
                    processing={createForm.processing}
                    data={createForm.data}
                    errors={createForm.errors}
                    submitLabel="Create category"
                    onClose={() => {
                        setIsCreateOpen(false);
                        createForm.reset();
                        createForm.clearErrors();
                    }}
                    onSubmit={() => {
                        createForm.post('/admin/categories', {
                            preserveScroll: true,
                            onSuccess: () => {
                                setIsCreateOpen(false);
                                createForm.reset();
                            },
                        });
                    }}
                    onChange={(key, value) => {
                        if (key === 'name') {
                            createForm.setData('name', value as string);
                        } else if (key === 'slug') {
                            createForm.setData('slug', value as string);
                        } else if (key === 'description') {
                            createForm.setData('description', value as string);
                        } else if (key === 'sort_order') {
                            createForm.setData('sort_order', value as number);
                        } else if (key === 'is_active') {
                            createForm.setData('is_active', value as boolean);
                        }
                    }}
                />

                <CategoryModal
                    title={editingCategory ? `Edit ${editingCategory.name}` : 'Edit category'}
                    open={editingCategory !== null}
                    processing={editForm.processing}
                    data={editForm.data}
                    errors={editForm.errors}
                    submitLabel="Save changes"
                    onClose={() => {
                        setEditingCategory(null);
                        editForm.reset();
                        editForm.clearErrors();
                    }}
                    onSubmit={() => {
                        if (!editingCategory) {
                            return;
                        }

                        editForm.patch(`/admin/categories/${editingCategory.id}`, {
                            preserveScroll: true,
                            onSuccess: () => {
                                setEditingCategory(null);
                                editForm.reset();
                            },
                        });
                    }}
                    onChange={(key, value) => {
                        if (key === 'name') {
                            editForm.setData('name', value as string);
                        } else if (key === 'slug') {
                            editForm.setData('slug', value as string);
                        } else if (key === 'description') {
                            editForm.setData('description', value as string);
                        } else if (key === 'sort_order') {
                            editForm.setData('sort_order', value as number);
                        } else if (key === 'is_active') {
                            editForm.setData('is_active', value as boolean);
                        }
                    }}
                />
            </AdminShell>
        </>
    );
}
