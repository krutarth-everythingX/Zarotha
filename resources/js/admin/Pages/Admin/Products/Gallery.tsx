import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FormInput, FormSelect, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { SelectOption } from '@admin/types';

type GalleryProps = {
    product: {
        id: number;
        name: string;
        featuredMediaId: number | null;
        gallery: Array<{
            id: number;
            originalFilename: string;
            altText: string | null;
            sortOrder: number;
            isVisible: boolean;
            url: string | null;
        }>;
    };
    mediaOptions: Array<SelectOption & { altText?: string | null }>;
};

export default function ProductsGallery({ product, mediaOptions }: GalleryProps) {
    const attachForm = useForm({
        media_asset_id: '',
        alt_text_override: '',
    });

    return (
        <>
            <Head title={`Gallery for ${product.name}`} />
            <AdminShell title="Product Gallery" description={`Manage gallery attachments and featured image for ${product.name}.`}>
                <PagePanel>
                    <form
                        className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
                        onSubmit={(event) => {
                            event.preventDefault();
                            attachForm.post(`/admin/products/${product.id}/gallery`);
                        }}
                    >
                        <Field>
                            <Label>Media asset</Label>
                            <FormSelect value={attachForm.data.media_asset_id} onChange={(event) => attachForm.setData('media_asset_id', event.target.value)}>
                                <option value="">Choose processed media</option>
                                {mediaOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </Field>
                        <Field>
                            <Label>Alt text override</Label>
                            <FormInput value={attachForm.data.alt_text_override} onChange={(event) => attachForm.setData('alt_text_override', event.target.value)} />
                        </Field>
                        <div className="flex items-end">
                            <Button type="submit">Attach media</Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {product.gallery.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No gallery media yet" description="Attach processed media to build the product gallery." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {product.gallery.map((item) => (
                                <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[100px_1fr_140px_auto] lg:items-center">
                                    <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                        {item.url ? <img src={item.url} alt={item.altText ?? ''} className="h-full w-full object-cover" /> : null}
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{item.originalFilename}</p>
                                        <Text>{item.altText ?? 'No alt override'} / sort {item.sortOrder}</Text>
                                    </div>
                                    {product.featuredMediaId === item.id ? <StatusBadge tone="green">Featured</StatusBadge> : <StatusBadge>Gallery</StatusBadge>}
                                    <div className="flex flex-wrap gap-2">
                                        {product.featuredMediaId !== item.id ? (
                                            <Button
                                                color="light"
                                                onClick={() => router.post(`/admin/products/${product.id}/gallery/featured`, { media_asset_id: item.id }, { preserveScroll: true })}
                                            >
                                                Set featured
                                            </Button>
                                        ) : null}
                                        <Button
                                            color="light"
                                            onClick={() => router.delete(`/admin/products/${product.id}/gallery/${item.id}`, { preserveScroll: true })}
                                        >
                                            Detach
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
