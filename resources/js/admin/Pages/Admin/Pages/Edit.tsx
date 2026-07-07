import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { MediaDropSelect, type MediaOption as UploadMediaOption } from '@admin/Components/MediaDropSelect';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import type { PublishStatus } from '@admin/types';

type MediaOption = {
    id: number;
    label: string;
    altText: string | null;
    url: string | null;
    status: string;
    width?: number | null;
    height?: number | null;
};

type AboutStat = {
    value: string;
    label: string;
};

type AboutSkill = {
    label: string;
    percent: number;
};

type AboutDetails = {
    hero_kicker: string;
    hero_note: string;
    video_url: string;
    video_title: string;
    who_we_are_kicker: string;
    who_we_are_title: string;
    who_we_are_body: string;
    why_title: string;
    why_items: string[];
    catalog_title: string;
    catalog_body: string;
    catalog_media_id: number | '';
    gallery_media_ids: Array<number | ''>;
    vision_title: string;
    vision_body: string;
    mission_title: string;
    mission_body: string;
    certificate_media_id: number | '';
    aim_title: string;
    aim_body: string;
    stats: AboutStat[];
    strength_kicker: string;
    strength_title: string;
    strength_body: string;
    strength_media_id: number | '';
    skills: AboutSkill[];
    client_title: string;
};

type PageRecord = {
    id: number;
    pageKey: string;
    slug: string;
    navigationLabel: string | null;
    title: string;
    introTitle: string | null;
    introBody: string | null;
    bodyHtml: string | null;
    aboutDetails: Partial<AboutDetails> | null;
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

type PageForm = {
    title: string;
    navigation_label: string;
    intro_title: string;
    intro_body: string;
    body_html: string;
    about_details: AboutDetails;
    hero_media_id: number | '';
    cta_label: string;
    cta_url: string;
    effective_date: string;
    status: PublishStatus;
    published_at: string;
    meta_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    og_image_media_id: number | '';
    canonical_url: string;
    robots_index: boolean;
    robots_follow: boolean;
};

type PageEditProps = {
    page: PageRecord;
    mediaOptions: MediaOption[];
    pageOptions: string[];
};

const emptyStat: AboutStat = { value: '', label: '' };
const emptySkill: AboutSkill = { label: '', percent: 0 };

function emptyToId(value: number | null | undefined): number | '' {
    return value ?? '';
}

function imageFor(mediaOptions: MediaOption[], id: number | '') {
    return id === '' ? null : mediaOptions.find((media) => media.id === id) ?? null;
}

function stringItems(items: unknown, fallbackCount: number): string[] {
    const values = Array.isArray(items) ? items.map((item) => String(item ?? '')) : [];

    return values.length > 0 ? values : Array.from({ length: fallbackCount }, () => '');
}

function idItems(items: unknown, fallbackCount: number): Array<number | ''> {
    const values = Array.isArray(items)
        ? items.map((item) => (typeof item === 'number' ? item : item === '' || item === null ? '' : Number(item))).map((item) => (Number.isFinite(item) ? item : ''))
        : [];

    return values.length > 0 ? values : Array.from({ length: fallbackCount }, () => '');
}

function statItems(items: unknown): AboutStat[] {
    const values = Array.isArray(items)
        ? items.map((item) => ({
              value: String((item as Partial<AboutStat>)?.value ?? ''),
              label: String((item as Partial<AboutStat>)?.label ?? ''),
          }))
        : [];

    return values.length > 0 ? values : [{ ...emptyStat }, { ...emptyStat }, { ...emptyStat }];
}

function skillItems(items: unknown): AboutSkill[] {
    const values = Array.isArray(items)
        ? items.map((item) => ({
              label: String((item as Partial<AboutSkill>)?.label ?? ''),
              percent: Number((item as Partial<AboutSkill>)?.percent ?? 0),
          }))
        : [];

    return values.length > 0 ? values : [{ ...emptySkill }, { ...emptySkill }];
}

function aboutDetailsWithDefaults(details: Partial<AboutDetails> | null): AboutDetails {
    return {
        hero_kicker: details?.hero_kicker ?? '',
        hero_note: details?.hero_note ?? '',
        video_url: details?.video_url ?? '',
        video_title: details?.video_title ?? '',
        who_we_are_kicker: details?.who_we_are_kicker ?? '',
        who_we_are_title: details?.who_we_are_title ?? '',
        who_we_are_body: details?.who_we_are_body ?? '',
        why_title: details?.why_title ?? '',
        why_items: stringItems(details?.why_items, 6),
        catalog_title: details?.catalog_title ?? '',
        catalog_body: details?.catalog_body ?? '',
        catalog_media_id: emptyToId(details?.catalog_media_id as number | null | undefined),
        gallery_media_ids: idItems(details?.gallery_media_ids, 3),
        vision_title: details?.vision_title ?? '',
        vision_body: details?.vision_body ?? '',
        mission_title: details?.mission_title ?? '',
        mission_body: details?.mission_body ?? '',
        certificate_media_id: emptyToId(details?.certificate_media_id as number | null | undefined),
        aim_title: details?.aim_title ?? '',
        aim_body: details?.aim_body ?? '',
        stats: statItems(details?.stats),
        strength_kicker: details?.strength_kicker ?? '',
        strength_title: details?.strength_title ?? '',
        strength_body: details?.strength_body ?? '',
        strength_media_id: emptyToId(details?.strength_media_id as number | null | undefined),
        skills: skillItems(details?.skills),
        client_title: details?.client_title ?? '',
    };
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{children}</p>;
}

export default function PageEdit({ page, mediaOptions, pageOptions }: PageEditProps) {
    const [mediaChoices, setMediaChoices] = useState<MediaOption[]>(mediaOptions);
    const isAboutPage = page.pageKey === 'about_us';

    const form = useForm<PageForm>({
        title: page.title,
        navigation_label: page.navigationLabel ?? '',
        intro_title: page.introTitle ?? '',
        intro_body: page.introBody ?? '',
        body_html: page.bodyHtml ?? '',
        about_details: aboutDetailsWithDefaults(page.aboutDetails),
        hero_media_id: emptyToId(page.heroMediaId),
        cta_label: page.ctaLabel ?? '',
        cta_url: page.ctaUrl ?? '',
        effective_date: page.effectiveDate ?? '',
        status: page.status,
        published_at: page.publishedAt ?? '',
        meta_title: page.metaTitle ?? '',
        meta_description: page.metaDescription ?? '',
        og_title: page.ogTitle ?? '',
        og_description: page.ogDescription ?? '',
        og_image_media_id: emptyToId(page.ogImageMediaId),
        canonical_url: page.canonicalUrl ?? '',
        robots_index: page.robotsIndex,
        robots_follow: page.robotsFollow,
    });

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        const option: MediaOption = {
            id: media.id,
            label: media.label,
            altText: media.altText ?? null,
            url: media.url ?? null,
            status: media.status ?? 'uploaded',
            width: media.width ?? null,
            height: media.height ?? null,
        };

        setMediaChoices((current) => [option, ...current.filter((item) => item.id !== option.id)]);
    };

    const setAboutDetails = (updates: Partial<AboutDetails>) => {
        form.setData('about_details', { ...form.data.about_details, ...updates });
    };

    const setWhyItem = (index: number, value: string) => {
        setAboutDetails({
            why_items: form.data.about_details.why_items.map((item, currentIndex) => (currentIndex === index ? value : item)),
        });
    };

    const setGalleryMedia = (index: number, value: number | '') => {
        setAboutDetails({
            gallery_media_ids: form.data.about_details.gallery_media_ids.map((item, currentIndex) => (currentIndex === index ? value : item)),
        });
    };

    const setStat = (index: number, stat: AboutStat) => {
        setAboutDetails({
            stats: form.data.about_details.stats.map((item, currentIndex) => (currentIndex === index ? stat : item)),
        });
    };

    const setSkill = (index: number, skill: AboutSkill) => {
        setAboutDetails({
            skills: form.data.about_details.skills.map((item, currentIndex) => (currentIndex === index ? skill : item)),
        });
    };

    const submit = () => {
        form.transform((data) => ({
            ...data,
            about_details: {
                ...data.about_details,
                why_items: data.about_details.why_items.map((item) => item.trim()).filter(Boolean),
                gallery_media_ids: data.about_details.gallery_media_ids.filter((item) => item !== ''),
                stats: data.about_details.stats.filter((item) => item.value.trim() !== '' || item.label.trim() !== ''),
                skills: data.about_details.skills.filter((item) => item.label.trim() !== ''),
            },
        }));
        form.patch(`/admin/pages/${page.slug}`);
    };

    return (
        <>
            <Head title={`Edit ${page.title}`} />
            <AdminShell
                title={`Edit ${page.title}`}
                description="Manage fixed public page content. Missing client facts should remain empty until approved."
                actions={
                    <div className="flex flex-wrap gap-3">
                        {pageOptions
                            .filter((option) => option !== page.slug)
                            .map((option) => (
                                <Button key={option} href={`/admin/pages/${option}`} color="light">
                                    {option.replaceAll('-', ' ')}
                                </Button>
                            ))}
                        <Button type="button" onClick={submit} disabled={form.processing}>
                            Save page
                        </Button>
                    </div>
                }
            >
                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <PagePanel>
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Page content</h2>
                            <Text>Hero copy, publishing, image, and primary call to action.</Text>
                        </div>
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
                                <Label>CTA label</Label>
                                <FormInput value={form.data.cta_label} onChange={(event) => form.setData('cta_label', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>CTA URL</Label>
                                <FormInput value={form.data.cta_url} onChange={(event) => form.setData('cta_url', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Published at</Label>
                                <FormInput value={form.data.published_at} onChange={(event) => form.setData('published_at', event.target.value)} placeholder="YYYY-MM-DD HH:MM:SS" />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Intro body</Label>
                                <FormTextarea rows={3} value={form.data.intro_body} onChange={(event) => form.setData('intro_body', event.target.value)} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Hero image</Label>
                                <MediaDropSelect
                                    value={form.data.hero_media_id}
                                    options={mediaChoices}
                                    preview={imageFor(mediaChoices, form.data.hero_media_id)}
                                    label="Hero image"
                                    onUploaded={rememberUploadedMedia}
                                    onChange={(value) => form.setData('hero_media_id', value)}
                                />
                                <FieldError message={form.errors.hero_media_id} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Body HTML</Label>
                                <FormTextarea rows={8} value={form.data.body_html} onChange={(event) => form.setData('body_html', event.target.value)} />
                                <FieldHint>Used by standard static pages. The About page uses the structured fields below.</FieldHint>
                            </Field>
                        </div>
                    </PagePanel>

                    {isAboutPage ? (
                        <>
                            <PagePanel>
                                <div className="mb-5">
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">About page details</h2>
                                    <Text>Manage the public About layout sections without editing Blade templates.</Text>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>YouTube video URL</Label>
                                        <FormInput value={form.data.about_details.video_url} onChange={(event) => setAboutDetails({ video_url: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                                        <FieldError message={form.errors['about_details.video_url']} />
                                    </Field>
                                    <Field>
                                        <Label>Video title</Label>
                                        <FormInput value={form.data.about_details.video_title} onChange={(event) => setAboutDetails({ video_title: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Who we are kicker</Label>
                                        <FormInput value={form.data.about_details.who_we_are_kicker} onChange={(event) => setAboutDetails({ who_we_are_kicker: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Who we are title</Label>
                                        <FormInput value={form.data.about_details.who_we_are_title} onChange={(event) => setAboutDetails({ who_we_are_title: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Who we are body</Label>
                                        <FormTextarea rows={4} value={form.data.about_details.who_we_are_body} onChange={(event) => setAboutDetails({ who_we_are_body: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Hero note</Label>
                                        <FormTextarea rows={2} value={form.data.about_details.hero_note} onChange={(event) => setAboutDetails({ hero_note: event.target.value })} />
                                    </Field>
                                </div>
                            </PagePanel>

                            <PagePanel>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Why choose us</h2>
                                        <Text>Bullet points, small catalogue callout, and the supporting image collage.</Text>
                                    </div>
                                    <Button type="button" color="light" onClick={() => setAboutDetails({ why_items: [...form.data.about_details.why_items, ''] })}>
                                        Add point
                                    </Button>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field className="lg:col-span-2">
                                        <Label>Section title</Label>
                                        <FormInput value={form.data.about_details.why_title} onChange={(event) => setAboutDetails({ why_title: event.target.value })} />
                                    </Field>
                                    <div className="space-y-3 lg:col-span-2">
                                        {form.data.about_details.why_items.map((item, index) => (
                                            <div key={`why-${index}`} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                                <FormInput value={item} onChange={(event) => setWhyItem(index, event.target.value)} placeholder={`Point ${index + 1}`} />
                                                <Button type="button" color="light" onClick={() => setAboutDetails({ why_items: form.data.about_details.why_items.filter((_, currentIndex) => currentIndex !== index) })}>
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Field>
                                        <Label>Catalogue title</Label>
                                        <FormInput value={form.data.about_details.catalog_title} onChange={(event) => setAboutDetails({ catalog_title: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Catalogue body</Label>
                                        <FormInput value={form.data.about_details.catalog_body} onChange={(event) => setAboutDetails({ catalog_body: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Catalogue image</Label>
                                        <MediaDropSelect
                                            value={form.data.about_details.catalog_media_id}
                                            options={mediaChoices}
                                            preview={imageFor(mediaChoices, form.data.about_details.catalog_media_id)}
                                            label="Catalogue image"
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(value) => setAboutDetails({ catalog_media_id: value })}
                                        />
                                    </Field>
                                    {form.data.about_details.gallery_media_ids.map((mediaId, index) => (
                                        <Field key={`gallery-${index}`}>
                                            <Label>Gallery image {index + 1}</Label>
                                            <MediaDropSelect
                                                value={mediaId}
                                                options={mediaChoices}
                                                preview={imageFor(mediaChoices, mediaId)}
                                                label={`Gallery image ${index + 1}`}
                                                onUploaded={rememberUploadedMedia}
                                                onChange={(value) => setGalleryMedia(index, value)}
                                            />
                                        </Field>
                                    ))}
                                    <div className="lg:col-span-2">
                                        <Button type="button" color="light" onClick={() => setAboutDetails({ gallery_media_ids: [...form.data.about_details.gallery_media_ids, ''] })}>
                                            Add gallery image
                                        </Button>
                                    </div>
                                </div>
                            </PagePanel>

                            <PagePanel>
                                <div className="mb-5">
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Vision and mission</h2>
                                    <Text>These fields power the dedicated Vision & Mission section on the About page.</Text>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Vision title</Label>
                                        <FormInput value={form.data.about_details.vision_title} onChange={(event) => setAboutDetails({ vision_title: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Mission title</Label>
                                        <FormInput value={form.data.about_details.mission_title} onChange={(event) => setAboutDetails({ mission_title: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Vision body</Label>
                                        <FormTextarea rows={4} value={form.data.about_details.vision_body} onChange={(event) => setAboutDetails({ vision_body: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Mission body</Label>
                                        <FormTextarea rows={4} value={form.data.about_details.mission_body} onChange={(event) => setAboutDetails({ mission_body: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Certificate image</Label>
                                        <MediaDropSelect
                                            value={form.data.about_details.certificate_media_id}
                                            options={mediaChoices}
                                            preview={imageFor(mediaChoices, form.data.about_details.certificate_media_id)}
                                            label="Certificate image"
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(value) => setAboutDetails({ certificate_media_id: value })}
                                        />
                                    </Field>
                                </div>
                            </PagePanel>

                            <PagePanel>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Aim and stats</h2>
                                        <Text>Manage the compact aim card and numeric highlights.</Text>
                                    </div>
                                    <Button type="button" color="light" onClick={() => setAboutDetails({ stats: [...form.data.about_details.stats, { ...emptyStat }] })}>
                                        Add stat
                                    </Button>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Aim title</Label>
                                        <FormInput value={form.data.about_details.aim_title} onChange={(event) => setAboutDetails({ aim_title: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Client section title</Label>
                                        <FormInput value={form.data.about_details.client_title} onChange={(event) => setAboutDetails({ client_title: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Aim body</Label>
                                        <FormTextarea rows={3} value={form.data.about_details.aim_body} onChange={(event) => setAboutDetails({ aim_body: event.target.value })} />
                                    </Field>
                                    <div className="space-y-4 lg:col-span-2">
                                        {form.data.about_details.stats.map((stat, index) => (
                                            <div key={`stat-${index}`} className="grid gap-3 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10 md:grid-cols-[10rem_1fr_auto]">
                                                <Field>
                                                    <Label>Value</Label>
                                                    <FormInput value={stat.value} onChange={(event) => setStat(index, { ...stat, value: event.target.value })} />
                                                </Field>
                                                <Field>
                                                    <Label>Label</Label>
                                                    <FormInput value={stat.label} onChange={(event) => setStat(index, { ...stat, label: event.target.value })} />
                                                </Field>
                                                <div className="self-end">
                                                    <Button type="button" color="light" onClick={() => setAboutDetails({ stats: form.data.about_details.stats.filter((_, currentIndex) => currentIndex !== index) })}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PagePanel>

                            <PagePanel>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Strength</h2>
                                        <Text>Manage the dark strength band, production image, and skill bars.</Text>
                                    </div>
                                    <Button type="button" color="light" onClick={() => setAboutDetails({ skills: [...form.data.about_details.skills, { ...emptySkill }] })}>
                                        Add skill
                                    </Button>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Kicker</Label>
                                        <FormInput value={form.data.about_details.strength_kicker} onChange={(event) => setAboutDetails({ strength_kicker: event.target.value })} />
                                    </Field>
                                    <Field>
                                        <Label>Title</Label>
                                        <FormInput value={form.data.about_details.strength_title} onChange={(event) => setAboutDetails({ strength_title: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Body</Label>
                                        <FormTextarea rows={4} value={form.data.about_details.strength_body} onChange={(event) => setAboutDetails({ strength_body: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Strength image</Label>
                                        <MediaDropSelect
                                            value={form.data.about_details.strength_media_id}
                                            options={mediaChoices}
                                            preview={imageFor(mediaChoices, form.data.about_details.strength_media_id)}
                                            label="Strength image"
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(value) => setAboutDetails({ strength_media_id: value })}
                                        />
                                    </Field>
                                    <div className="space-y-4 lg:col-span-2">
                                        {form.data.about_details.skills.map((skill, index) => (
                                            <div key={`skill-${index}`} className="grid gap-3 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10 md:grid-cols-[1fr_8rem_auto]">
                                                <Field>
                                                    <Label>Label</Label>
                                                    <FormInput value={skill.label} onChange={(event) => setSkill(index, { ...skill, label: event.target.value })} />
                                                </Field>
                                                <Field>
                                                    <Label>Percent</Label>
                                                    <FormInput type="number" min={0} max={100} value={skill.percent} onChange={(event) => setSkill(index, { ...skill, percent: Number(event.target.value) })} />
                                                </Field>
                                                <div className="self-end">
                                                    <Button type="button" color="light" onClick={() => setAboutDetails({ skills: form.data.about_details.skills.filter((_, currentIndex) => currentIndex !== index) })}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PagePanel>
                        </>
                    ) : null}

                    <PagePanel>
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">SEO</h2>
                            <Text>Search metadata and canonical controls.</Text>
                        </div>
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
                            <Field>
                                <Label>Open Graph title</Label>
                                <FormInput value={form.data.og_title} onChange={(event) => form.setData('og_title', event.target.value)} />
                            </Field>
                            <Field>
                                <Label>Open Graph description</Label>
                                <FormInput value={form.data.og_description} onChange={(event) => form.setData('og_description', event.target.value)} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Open Graph image</Label>
                                <MediaDropSelect
                                    value={form.data.og_image_media_id}
                                    options={mediaChoices}
                                    preview={imageFor(mediaChoices, form.data.og_image_media_id)}
                                    label="Open Graph image"
                                    onUploaded={rememberUploadedMedia}
                                    onChange={(value) => form.setData('og_image_media_id', value)}
                                />
                            </Field>
                        </div>
                    </PagePanel>

                    <div className="flex flex-wrap gap-3">
                        <Button href="/admin" color="light">
                            Back to dashboard
                        </Button>
                    </div>
                </form>
            </AdminShell>
        </>
    );
}
