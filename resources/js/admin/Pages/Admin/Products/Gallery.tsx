import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FormInput, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';
import { MediaDropSelect, type MediaOption as UploadMediaOption } from '@admin/Components/MediaDropSelect';
import { X } from 'lucide-react';

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
    mediaOptions: UploadMediaOption[];
};

export default function ProductsGallery({ product, mediaOptions }: GalleryProps) {
    const [mediaChoices, setMediaChoices] = useState<UploadMediaOption[]>(mediaOptions);
    const [previewImage, setPreviewImage] = useState<{ url: string; altText: string | null; label: string } | null>(null);
    const attachForm = useForm<{
        media_asset_id: number | '';
        alt_text_override: string;
    }>({
        media_asset_id: '',
        alt_text_override: '',
    });
    const rememberUploadedMedia = (media: UploadMediaOption) => {
        setMediaChoices((current) => [
            media,
            ...current.filter((item) => item.id !== media.id),
        ]);
    };
    const selectedMedia = attachForm.data.media_asset_id === ''
        ? null
        : mediaChoices.find((option) => option.id === attachForm.data.media_asset_id) ?? null;

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
                            <MediaDropSelect
                                value={attachForm.data.media_asset_id}
                                options={mediaChoices}
                                preview={selectedMedia}
                                label="Gallery image"
                                onUploaded={rememberUploadedMedia}
                                onChange={(media_asset_id) => attachForm.setData('media_asset_id', media_asset_id)}
                            />
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
                                        {item.url ? (
                                            <button
                                                type="button"
                                                className="block h-full w-full cursor-zoom-in"
                                                onClick={() => setPreviewImage({
                                                    url: item.url as string,
                                                    altText: item.altText,
                                                    label: item.originalFilename,
                                                })}
                                                aria-label={`Preview ${item.originalFilename}`}
                                            >
                                                <img src={item.url} alt={item.altText ?? ''} className="h-full w-full object-cover" />
                                            </button>
                                        ) : null}
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
                {previewImage ? (
                    <div
                        className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Image preview for ${previewImage.label}`}
                        onClick={() => setPreviewImage(null)}
                    >
                        <div className="relative max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
                            <button
                                type="button"
                                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm hover:bg-white"
                                onClick={() => setPreviewImage(null)}
                                aria-label="Close image preview"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <img
                                src={previewImage.url}
                                alt={previewImage.altText ?? ''}
                                className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
                            />
                        </div>
                    </div>
                ) : null}
            </AdminShell>
        </>
    );
}
