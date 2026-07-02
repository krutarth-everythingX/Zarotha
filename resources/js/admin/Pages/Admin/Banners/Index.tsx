import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FieldError, FormInput, FormSelect, FormTextarea, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { SelectOption } from '@admin/types';

type Banner = {
    id: number;
    eyebrow: string | null;
    headline: string;
    bodyText: string | null;
    primaryCtaLabel: string | null;
    primaryCtaUrl: string | null;
    desktopMediaId: number;
    previewUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    startsAt: string | null;
    endsAt: string | null;
};

type BannersIndexProps = {
    banners: Banner[];
    mediaOptions: SelectOption[];
};

export default function BannersIndex({ banners, mediaOptions }: BannersIndexProps) {
    const form = useForm({
        eyebrow: '',
        headline: '',
        body_text: '',
        primary_cta_label: '',
        primary_cta_url: '',
        desktop_media_id: '',
        mobile_media_id: '',
        sort_order: 0,
        is_active: true,
        starts_at: '',
        ends_at: '',
    });

    return (
        <>
            <Head title="Banners" />
            <AdminShell title="Banners" description="Manage homepage hero banners using approved media records.">
                <PagePanel>
                    <form
                        className="grid gap-5 lg:grid-cols-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/admin/banners', { preserveScroll: true });
                        }}
                    >
                        <Field>
                            <Label>Headline</Label>
                            <FormInput value={form.data.headline} onChange={(event) => form.setData('headline', event.target.value)} />
                            <FieldError message={form.errors.headline} />
                        </Field>
                        <Field>
                            <Label>Desktop media</Label>
                            <FormSelect
                                value={form.data.desktop_media_id}
                                onChange={(event) => form.setData('desktop_media_id', event.target.value)}
                            >
                                <option value="">Choose processed media</option>
                                {mediaOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormSelect>
                            <FieldError message={form.errors.desktop_media_id} />
                        </Field>
                        <Field>
                            <Label>Eyebrow</Label>
                            <FormInput value={form.data.eyebrow} onChange={(event) => form.setData('eyebrow', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>CTA URL</Label>
                            <FormInput value={form.data.primary_cta_url} onChange={(event) => form.setData('primary_cta_url', event.target.value)} />
                        </Field>
                        <Field className="lg:col-span-2">
                            <Label>Body text</Label>
                            <FormTextarea rows={3} value={form.data.body_text} onChange={(event) => form.setData('body_text', event.target.value)} />
                        </Field>
                        <div className="lg:col-span-2">
                            <Button type="submit" disabled={form.processing}>
                                Add banner
                            </Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {banners.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No banners yet" description="Add a banner after uploading approved hero media." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {banners.map((banner) => (
                                <article key={banner.id} className="grid gap-4 p-5 lg:grid-cols-[120px_1fr_120px_auto] lg:items-center">
                                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                        {banner.previewUrl ? <img src={banner.previewUrl} alt="" className="h-full w-full object-cover" /> : null}
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{banner.headline}</p>
                                        <Text>{banner.bodyText ?? 'No supporting text supplied.'}</Text>
                                    </div>
                                    <StatusBadge tone={banner.isActive ? 'green' : 'amber'}>{banner.isActive ? 'Active' : 'Inactive'}</StatusBadge>
                                    <Button
                                        color="light"
                                        onClick={() => {
                                            if (window.confirm(`Delete banner "${banner.headline}"?`)) {
                                                router.delete(`/admin/banners/${banner.id}`, { preserveScroll: true });
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </AdminShell>
        </>
    );
}
