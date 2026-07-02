import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import type { PublishStatus, SelectOption } from '@admin/types';

type ProductFormPayload = {
    id?: number;
    name: string;
    slug: string;
    categoryId: number | '';
    shortDescription: string | null;
    fullDescription: string | null;
    dimensions: string | null;
    material: string | null;
    finish: string | null;
    featuredMediaId: number | null;
    status: PublishStatus;
    publishedAt: string | null;
    sortOrder: number;
    isFeatured: boolean;
    isBestSelling: boolean;
    isLatest: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageMediaId: number | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
};

type ProductsFormProps = {
    mode: 'create' | 'edit';
    product: ProductFormPayload | null;
    categories: SelectOption[];
};

export default function ProductsForm({ mode, product, categories }: ProductsFormProps) {
    const form = useForm({
        category_id: product?.categoryId ?? '',
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        short_description: product?.shortDescription ?? '',
        full_description: product?.fullDescription ?? '',
        dimensions: product?.dimensions ?? '',
        material: product?.material ?? '',
        finish: product?.finish ?? '',
        featured_media_id: product?.featuredMediaId ?? '',
        status: product?.status ?? 'draft',
        published_at: product?.publishedAt ?? '',
        sort_order: product?.sortOrder ?? 0,
        is_featured: product?.isFeatured ?? false,
        is_best_selling: product?.isBestSelling ?? false,
        is_latest: product?.isLatest ?? false,
        meta_title: product?.metaTitle ?? '',
        meta_description: product?.metaDescription ?? '',
        og_title: product?.ogTitle ?? '',
        og_description: product?.ogDescription ?? '',
        og_image_media_id: product?.ogImageMediaId ?? '',
        canonical_url: product?.canonicalUrl ?? '',
        robots_index: product?.robotsIndex ?? true,
        robots_follow: product?.robotsFollow ?? true,
    });

    const submit = () => {
        if (mode === 'edit' && product?.id) {
            form.patch(`/admin/products/${product.id}`);
            return;
        }

        form.post('/admin/products');
    };

    return (
        <>
            <Head title={mode === 'edit' ? `Edit ${product?.name ?? 'Product'}` : 'Create Product'} />
            <AdminShell
                title={mode === 'edit' ? 'Edit Product' : 'Create Product'}
                description="Products remain inquiry catalogue records with required category organization."
            >
                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <PagePanel>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>Name</Label>
                                <FormInput value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
                                <FieldError message={form.errors.name} />
                            </Field>
                            <Field>
                                <Label>Slug</Label>
                                <FormInput value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} />
                                <FieldError message={form.errors.slug} />
                            </Field>
                            <Field>
                                <Label>Category</Label>
                                <FormSelect
                                    value={form.data.category_id}
                                    onChange={(event) => form.setData('category_id', event.target.value === '' ? '' : Number(event.target.value))}
                                >
                                    <option value="">Choose category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.label}
                                        </option>
                                    ))}
                                </FormSelect>
                                <FieldError message={form.errors.category_id} />
                            </Field>
                            <Field>
                                <Label>Status</Label>
                                <FormSelect value={form.data.status} onChange={(event) => form.setData('status', event.target.value as PublishStatus)}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </FormSelect>
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Short description</Label>
                                <FormTextarea rows={3} value={form.data.short_description} onChange={(event) => form.setData('short_description', event.target.value)} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Full description</Label>
                                <FormTextarea rows={6} value={form.data.full_description} onChange={(event) => form.setData('full_description', event.target.value)} />
                            </Field>
                        </div>
                    </PagePanel>

                    <PagePanel>
                        <div className="grid gap-5 lg:grid-cols-3">
                            <Field>
                                <Label>Dimensions</Label>
                                <FormInput value={form.data.dimensions} onChange={(event) => form.setData('dimensions', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Material</Label>
                                <FormInput value={form.data.material} onChange={(event) => form.setData('material', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Finish</Label>
                                <FormInput value={form.data.finish} onChange={(event) => form.setData('finish', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Featured media ID</Label>
                                <FormInput
                                    type="number"
                                    value={form.data.featured_media_id}
                                    onChange={(event) => form.setData('featured_media_id', event.target.value === '' ? '' : Number(event.target.value))}
                                />
                                <FieldError message={form.errors.featured_media_id} />
                            </Field>
                            <Field>
                                <Label>Sort order</Label>
                                <FormInput type="number" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} />
                            </Field>
                            <Field>
                                <Label>Homepage flags</Label>
                                <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                                    {(['is_featured', 'is_best_selling', 'is_latest'] as const).map((field) => (
                                        <label key={field} className="flex items-center gap-2">
                                            <input type="checkbox" checked={form.data[field]} onChange={(event) => form.setData(field, event.target.checked)} />
                                            {field.replace('is_', '').replace('_', ' ')}
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>
                    </PagePanel>

                    <PagePanel>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>Meta title</Label>
                                <FormInput value={form.data.meta_title} onChange={(event) => form.setData('meta_title', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Meta description</Label>
                                <FormInput value={form.data.meta_description} onChange={(event) => form.setData('meta_description', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Canonical URL</Label>
                                <FormInput value={form.data.canonical_url} onChange={(event) => form.setData('canonical_url', event.target.value)} />
                            </Field>
                            <Text>Publishing is blocked server-side until required product media is present.</Text>
                        </div>
                    </PagePanel>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={form.processing}>
                            Save product
                        </Button>
                        <Button href="/admin/products" color="light">
                            Back to products
                        </Button>
                    </div>
                </form>
            </AdminShell>
        </>
    );
}
