import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FieldError, FormInput, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';

type MediaItem = {
    id: number;
    originalFilename: string;
    mimeType: string;
    bytes: number;
    width: number | null;
    height: number | null;
    status: string;
    altText: string | null;
    caption: string | null;
    url: string | null;
    variantCount: number;
    referenceCount: number;
};

type MediaIndexProps = {
    media: {
        data: MediaItem[];
    };
    limits: {
        maxUploadKb: number;
        allowedMimeTypes: string[];
    };
};

export default function MediaIndex({ media, limits }: MediaIndexProps) {
    const form = useForm<{
        file: File | null;
        alt_text: string;
        caption: string;
    }>({
        file: null,
        alt_text: '',
        caption: '',
    });

    return (
        <>
            <Head title="Media" />
            <AdminShell
                title="Media"
                description="Upload catalogue imagery, track processing status, and manage reusable media metadata."
            >
                <form
                    className="rounded-3xl border border-zinc-950/8 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/90"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post('/admin/media', { forceFormData: true });
                    }}
                >
                    <div className="grid gap-5 md:grid-cols-3">
                        <Field>
                            <Label>Image file</Label>
                            <input
                                type="file"
                                accept={limits.allowedMimeTypes.join(',')}
                                className="block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                                onChange={(event) => form.setData('file', event.currentTarget.files?.[0] ?? null)}
                            />
                            <FieldError message={form.errors.file} />
                        </Field>
                        <Field>
                            <Label>Alt text</Label>
                            <FormInput value={form.data.alt_text} onChange={(event) => form.setData('alt_text', event.target.value)} />
                            <FieldError message={form.errors.alt_text} />
                        </Field>
                        <Field>
                            <Label>Caption</Label>
                            <FormInput value={form.data.caption} onChange={(event) => form.setData('caption', event.target.value)} />
                            <FieldError message={form.errors.caption} />
                        </Field>
                    </div>
                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Text>JPG, PNG, and WebP up to {limits.maxUploadKb} KB. SVG is rejected by policy.</Text>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? `Uploading ${form.progress?.percentage ?? 0}%` : 'Upload'}
                        </Button>
                    </div>
                </form>

                <PagePanel className="mt-8">
                    <form className="grid gap-4 sm:grid-cols-[1fr_auto]" method="get" action="/admin/media">
                        <Field>
                            <Label>Search media</Label>
                            <FormInput name="search" placeholder="Filename, alt text, or caption" />
                        </Field>
                        <div className="flex items-end">
                            <Button type="submit" color="light">
                                Search
                            </Button>
                        </div>
                    </form>
                </PagePanel>

                <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {media.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No media yet" description="Upload approved product or CMS imagery to begin." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 divide-y divide-zinc-950/8 dark:divide-white/10">
                            {media.data.map((item) => (
                                <article key={item.id} className="grid gap-4 p-5 md:grid-cols-[96px_1fr_auto]">
                                    <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                        {item.url ? <img src={item.url} alt={item.altText ?? ''} className="h-full w-full object-cover" /> : null}
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{item.originalFilename}</p>
                                        <Text>
                                            {item.mimeType} / {item.width ?? '-'} x {item.height ?? '-'} / {Math.round(item.bytes / 1024)} KB
                                        </Text>
                                        <Text>{item.variantCount} variants / {item.referenceCount} references</Text>
                                        <div className="mt-2">
                                            <StatusBadge tone={item.status === 'processed' ? 'green' : item.status === 'failed' ? 'red' : 'amber'}>
                                                {item.status}
                                            </StatusBadge>
                                        </div>
                                    </div>
                                    <Text>{item.caption ?? 'No caption'}</Text>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </AdminShell>
        </>
    );
}
