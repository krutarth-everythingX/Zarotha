import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FieldError, FormInput, FormTextarea, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';
import { MediaDropSelect, type MediaOption as UploadMediaOption } from '@admin/Components/MediaDropSelect';
import { useState } from 'react';

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
    mediaOptions: UploadMediaOption[];
};

type BannerForm = {
    eyebrow: string;
    headline: string;
    body_text: string;
    primary_cta_label: string;
    primary_cta_url: string;
    desktop_media_id: number | '';
    mobile_media_id: number | '';
    sort_order: number;
    is_active: boolean;
    starts_at: string;
    ends_at: string;
};

export default function BannersIndex({ banners, mediaOptions }: BannersIndexProps) {
    const [mediaChoices, setMediaChoices] = useState<UploadMediaOption[]>(mediaOptions);
    const form = useForm<BannerForm>({
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
    const rememberUploadedMedia = (media: UploadMediaOption) => {
        setMediaChoices((current) => [
            media,
            ...current.filter((item) => item.id !== media.id),
        ]);
    };
    const selectedMedia = form.data.desktop_media_id === ''
        ? null
        : mediaChoices.find((option) => option.id === form.data.desktop_media_id) ?? null;

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
                            <MediaDropSelect
                                value={form.data.desktop_media_id}
                                options={mediaChoices}
                                preview={selectedMedia}
                                label="Banner image"
                                onUploaded={rememberUploadedMedia}
                                onChange={(desktop_media_id) => form.setData('desktop_media_id', desktop_media_id)}
                            />
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col className="w-[140px]" />
                                    <col />
                                    <col className="w-[140px]" />
                                    <col className="w-[140px]" />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Preview</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Banner</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Status</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-950/8 dark:divide-white/10">
                                    {banners.map((banner) => (
                                        <tr key={banner.id} className="align-middle">
                                            <td className="px-4 py-2.5">
                                                <div className="mx-auto aspect-[4/3] w-24 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                                    {banner.previewUrl ? <img src={banner.previewUrl} alt="" className="h-full w-full object-cover" /> : null}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <p className="font-medium text-zinc-950 dark:text-white">{banner.headline}</p>
                                                <Text>{banner.bodyText ?? 'No supporting text supplied.'}</Text>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <div className="flex justify-center">
                                                    <StatusBadge tone={banner.isActive ? 'green' : 'amber'}>{banner.isActive ? 'Active' : 'Inactive'}</StatusBadge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </AdminShell>
        </>
    );
}
