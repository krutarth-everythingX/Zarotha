import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import type { PublishStatus } from '@admin/types';

type PageRecord = {
    id: number;
    pageKey: string;
    slug: string;
    navigationLabel: string | null;
    title: string;
    introTitle: string | null;
    introBody: string | null;
    bodyHtml: string | null;
    heroMediaId: number | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    effectiveDate: string | null;
    status: PublishStatus;
    publishedAt: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageMediaId: number | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
};

type PageEditProps = {
    page: PageRecord;
    pageOptions: string[];
};

export default function PageEdit({ page, pageOptions }: PageEditProps) {
    const form = useForm({
        title: page.title,
        navigation_label: page.navigationLabel ?? '',
        intro_title: page.introTitle ?? '',
        intro_body: page.introBody ?? '',
        body_html: page.bodyHtml ?? '',
        hero_media_id: page.heroMediaId ?? '',
        cta_label: page.ctaLabel ?? '',
        cta_url: page.ctaUrl ?? '',
        effective_date: page.effectiveDate ?? '',
        status: page.status,
        published_at: page.publishedAt ?? '',
        meta_title: page.metaTitle ?? '',
        meta_description: page.metaDescription ?? '',
        og_title: page.ogTitle ?? '',
        og_description: page.ogDescription ?? '',
        og_image_media_id: page.ogImageMediaId ?? '',
        canonical_url: page.canonicalUrl ?? '',
        robots_index: page.robotsIndex,
        robots_follow: page.robotsFollow,
    });

    return (
        <>
            <Head title={`Edit ${page.title}`} />
            <AdminShell title={`Edit ${page.title}`} description="Manage fixed public page content. Missing client facts should remain empty until approved.">
                <div className="mb-6 flex flex-wrap gap-2">
                    {pageOptions.map((option) => (
                        <Button key={option} href={`/admin/pages/${option}`} color={option === page.slug ? undefined : 'light'}>
                            {option.replaceAll('-', ' ')}
                        </Button>
                    ))}
                    <Button href="/admin/pages/contact" color="light">
                        contact
                    </Button>
                </div>
                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.patch(`/admin/pages/${page.slug}`);
                    }}
                >
                    <PagePanel>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>Title</Label>
                                <FormInput value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} />
                                <FieldError message={form.errors.title} />
                            </Field>
                            <Field>
                                <Label>Status</Label>
                                <FormSelect value={form.data.status} onChange={(event) => form.setData('status', event.target.value as PublishStatus)}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </FormSelect>
                            </Field>
                            <Field>
                                <Label>Intro title</Label>
                                <FormInput value={form.data.intro_title} onChange={(event) => form.setData('intro_title', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>CTA URL</Label>
                                <FormInput value={form.data.cta_url} onChange={(event) => form.setData('cta_url', event.target.value)} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Intro body</Label>
                                <FormTextarea rows={3} value={form.data.intro_body} onChange={(event) => form.setData('intro_body', event.target.value)} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Body HTML</Label>
                                <FormTextarea rows={10} value={form.data.body_html} onChange={(event) => form.setData('body_html', event.target.value)} />
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
                            <Field>
                                <Label>Effective date</Label>
                                <FormInput type="date" value={form.data.effective_date} onChange={(event) => form.setData('effective_date', event.target.value)} />
                            </Field>
                        </div>
                    </PagePanel>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={form.processing}>
                            Save page
                        </Button>
                        <Button href="/admin" color="light">
                            Back to dashboard
                        </Button>
                    </div>
                </form>
            </AdminShell>
        </>
    );
}
