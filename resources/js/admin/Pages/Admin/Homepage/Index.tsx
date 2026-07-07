import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormInput, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import { HeroSection } from './Components/HeroSection';
import { LatestProducts } from './Components/LatestProducts';
import { QuickInquiry } from './Components/QuickInquiry';
import { MediaDropSelect, type MediaOption as UploadMediaOption } from '@admin/Components/MediaDropSelect';

type MediaOption = UploadMediaOption;

type MediaReference = MediaOption | null;

type HeroPayload = {
    heading: string;
    subtext: string | null;
    desktopMediaId: number | null;
    mobileMediaId: number | null;
    primaryButtonLabel: string | null;
    primaryButtonUrl: string | null;
    secondaryButtonLabel: string | null;
    secondaryButtonUrl: string | null;
    overlayOpacity: number;
    textTheme: 'light' | 'dark';
    isVisible: boolean;
    items: BannerPayload[];
};

type BannerPayload = {
    id: number;
    imageMediaId: number | null;
    sortOrder: number;
    isVisible: boolean;
    imageMedia: MediaReference;
};

type SectionPayload = {
    eyebrow: string | null;
    title: string | null;
    subtitle: string | null;
    body: string | null;
    viewAllLabel: string | null;
    viewAllUrl: string | null;
    primaryButtonLabel: string | null;
    primaryButtonUrl: string | null;
    secondaryButtonLabel: string | null;
    secondaryButtonUrl: string | null;
    buttonLabel: string | null;
    buttonUrl: string | null;
    maxItems: number;
    backgroundMediaId: number | null;
    backgroundMedia: MediaReference;
    backgroundColor: string | null;
    isVisible: boolean;
};

type ContentItemPayload = {
    id: number;
    heading: string;
    bodyText: string | null;
    sortOrder: number;
    isActive: boolean;
};

type ContentSectionPayload = SectionPayload & {
    items: ContentItemPayload[];
};

type HomepagePayload = {
    hero: HeroPayload;
    turnkey: ContentSectionPayload;
    aboutPreview: ContentSectionPayload;
    industryStats: ContentSectionPayload;
    latest: SectionPayload;
    quickInquiry: SectionPayload & {
        banners: BannerPayload[];
    };
};

type SettingsPayload = {
    whatsapp_text: string;
    whatsapp_number: string;
};

type HomepageIndexProps = {
    homepage: HomepagePayload;
    settings: SettingsPayload;
    mediaOptions: MediaOption[];
};

type ContentItemForm = {
    id?: number;
    heading: string;
    body_text: string;
    sort_order: number;
    is_active: boolean;
};

type HomepageForm = {
    hero: {
        heading: string;
        subtext: string;
        desktop_media_id: number | '';
        mobile_media_id: number | '';
        primary_button_label: string;
        primary_button_url: string;
        secondary_button_label: string;
        secondary_button_url: string;
        overlay_opacity: number;
        text_theme: 'light' | 'dark';
        is_visible: boolean;
        items: Array<{
            id?: number;
            imageMediaId: number | '';
            sortOrder: number;
            isVisible: boolean;
        }>;
    };
    settings: SettingsPayload;
    turnkey: {
        eyebrow: string;
        title: string;
        subtitle: string;
        button_url: string;
        is_visible: boolean;
        items: ContentItemForm[];
    };
    aboutPreview: {
        eyebrow: string;
        title: string;
        subtitle: string;
        body: string;
        primary_button_label: string;
        primary_button_url: string;
        secondary_button_label: string;
        secondary_button_url: string;
        background_media_id: number | '';
        is_visible: boolean;
        points: ContentItemForm[];
    };
    industryStats: {
        title: string;
        highlight: string;
        subtitle: string;
        body: string;
        contact_label: string;
        contact_url: string;
        more_label: string;
        more_url: string;
        is_visible: boolean;
        items: ContentItemForm[];
    };
    latest: {
        title: string;
        subtitle: string;
        max_items: number;
        view_all_label: string;
        view_all_url: string;
        is_visible: boolean;
    };
    quickInquiry: {
        title: string;
        subtitle: string;
        button_label: string;
        button_url: string;
        background_media_id: number | '';
        background_color: string;
        is_visible: boolean;
        items: Array<{
            id?: number;
            imageMediaId: number | '';
            sortOrder: number;
            isVisible: boolean;
        }>;
    };
};

function emptyToId(value: number | null): number | '' {
    return value ?? '';
}

function imageFor(mediaOptions: MediaOption[], id: number | '') {
    return id === '' ? null : mediaOptions.find((media) => media.id === id) ?? null;
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <label className="inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
            {label}
        </label>
    );
}

function FieldHint({ children }: { children: ReactNode }) {
    return <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{children}</p>;
}

function contentItems(items: ContentItemPayload[], defaults: ContentItemForm[]): ContentItemForm[] {
    if (items.length === 0) {
        return defaults;
    }

    return items.map((item) => ({
        id: item.id,
        heading: item.heading,
        body_text: item.bodyText ?? '',
        sort_order: item.sortOrder,
        is_active: item.isActive,
    }));
}

const sections = [
    { id: 'hero-section', label: 'Hero Section' },
    { id: 'whatsapp-section', label: 'WhatsApp' },
    { id: 'turnkey-section', label: 'Turnkey Solutions' },
    { id: 'about-preview-section', label: 'About Zarokha' },
    { id: 'stats-section', label: 'Stats of Zarokha' },
    { id: 'latest-products-section', label: 'Latest Products' },
    { id: 'quick-inquiry-section', label: 'Quick Inquiry' },
] as const;

type SectionId = (typeof sections)[number]['id'];

export default function HomepageIndex({ homepage, settings, mediaOptions }: HomepageIndexProps) {
    const [mediaChoices, setMediaChoices] = useState<MediaOption[]>(mediaOptions);
    const [activeSection, setActiveSection] = useState<SectionId>(sections[0].id);

    const form = useForm<HomepageForm>({
        hero: {
            heading: homepage.hero.heading ?? 'Zarokha Wooden Arts',
            subtext: homepage.hero.subtext ?? 'Custom wooden furniture and carved pieces for homes, workspaces, and hospitality interiors.',
            desktop_media_id: emptyToId(homepage.hero.desktopMediaId),
            mobile_media_id: emptyToId(homepage.hero.mobileMediaId),
            primary_button_label: homepage.hero.primaryButtonLabel ?? 'View Products',
            primary_button_url: homepage.hero.primaryButtonUrl ?? '/products',
            secondary_button_label: homepage.hero.secondaryButtonLabel ?? 'Contact',
            secondary_button_url: homepage.hero.secondaryButtonUrl ?? '/contact',
            overlay_opacity: homepage.hero.overlayOpacity ?? 35,
            text_theme: homepage.hero.textTheme ?? 'light',
            is_visible: homepage.hero.isVisible,
            items: homepage.hero.items.map((banner) => ({
                id: banner.id,
                imageMediaId: emptyToId(banner.imageMediaId),
                sortOrder: banner.sortOrder,
                isVisible: banner.isVisible,
            })),
        },
        settings: {
            whatsapp_text: settings.whatsapp_text ?? '',
            whatsapp_number: settings.whatsapp_number ?? '',
        },
        turnkey: {
            eyebrow: homepage.turnkey.eyebrow ?? 'A complete custom',
            title: homepage.turnkey.title ?? 'furniture solution',
            subtitle: homepage.turnkey.subtitle ?? 'Crafted for homes, workspaces, and hospitality interiors with careful material choices.',
            button_url: homepage.turnkey.buttonUrl && homepage.turnkey.buttonUrl.includes('youtu') ? homepage.turnkey.buttonUrl : '',
            is_visible: homepage.turnkey.isVisible,
            items: contentItems(homepage.turnkey.items, [
                { heading: 'Home Furniture', body_text: 'Wardrobes, consoles, tables, and storage pieces tailored to the way your rooms are used.', sort_order: 0, is_active: true },
                { heading: 'Office Furniture', body_text: 'Desks, meeting tables, shelves, and focused storage for calm, efficient workspaces.', sort_order: 1, is_active: true },
                { heading: 'Hospitality Pieces', body_text: 'Reception counters, room furniture, and display units designed for durable daily use.', sort_order: 2, is_active: true },
                { heading: 'Institutional Work', body_text: 'Furniture and fixtures for studios, learning spaces, clinics, and public-facing interiors.', sort_order: 3, is_active: true },
            ]),
        },
        aboutPreview: {
            eyebrow: homepage.aboutPreview.eyebrow ?? 'About Zarokha',
            title: homepage.aboutPreview.title ?? 'The leading furniture brand for thoughtful custom spaces.',
            subtitle: homepage.aboutPreview.subtitle ?? 'Zarokha brings together measured design, material knowledge, and workshop discipline to create furniture that fits the room, the routine, and the people who use it every day.',
            body: homepage.aboutPreview.body ?? 'From homes and workspaces to hospitality interiors, every project is shaped with practical details, careful finishing, and a clear conversation from idea to installation.',
            primary_button_label: homepage.aboutPreview.primaryButtonLabel ?? 'View more',
            primary_button_url: homepage.aboutPreview.primaryButtonUrl ?? '/about-us',
            secondary_button_label: homepage.aboutPreview.secondaryButtonLabel ?? 'Contact us',
            secondary_button_url: homepage.aboutPreview.secondaryButtonUrl ?? '/contact',
            background_media_id: emptyToId(homepage.aboutPreview.backgroundMediaId),
            is_visible: homepage.aboutPreview.isVisible,
            points: contentItems(homepage.aboutPreview.items, [
                { heading: 'Direct factory manufacturing', body_text: '', sort_order: 0, is_active: true },
                { heading: 'Strict quality control', body_text: '', sort_order: 1, is_active: true },
                { heading: 'Timely production', body_text: '', sort_order: 2, is_active: true },
                { heading: 'Experienced team', body_text: '', sort_order: 3, is_active: true },
            ]),
        },
        industryStats: {
            title: homepage.industryStats.title ?? 'Furniture made at scale, finished with care.',
            highlight: homepage.industryStats.eyebrow ?? 'finished with care',
            subtitle: homepage.industryStats.subtitle ?? '',
            body: homepage.industryStats.body ?? "Don't hesitate, :contact for better help and products. :more",
            contact_label: homepage.industryStats.primaryButtonLabel ?? 'contact us',
            contact_url: homepage.industryStats.primaryButtonUrl ?? '/contact',
            more_label: homepage.industryStats.secondaryButtonLabel ?? 'View More',
            more_url: homepage.industryStats.secondaryButtonUrl ?? '/products',
            is_visible: homepage.industryStats.isVisible,
            items: contentItems(homepage.industryStats.items, [
                { heading: '6000', body_text: 'Residential Projects', sort_order: 0, is_active: true },
                { heading: '4100', body_text: 'Commercial Projects', sort_order: 1, is_active: true },
                { heading: '25000', body_text: 'Satisfied Customers', sort_order: 2, is_active: true },
                { heading: '18', body_text: 'Years of Experience', sort_order: 3, is_active: true },
            ]),
        },
        latest: {
            title: homepage.latest.title ?? 'Latest Products',
            subtitle: homepage.latest.subtitle ?? '',
            max_items: Math.min(homepage.latest.maxItems || 10, 10),
            view_all_label: homepage.latest.viewAllLabel ?? 'View All Products',
            view_all_url: homepage.latest.viewAllUrl ?? '/products',
            is_visible: homepage.latest.isVisible,
        },
        quickInquiry: {
            title: homepage.quickInquiry.title ?? 'Custom Commissions',
            subtitle: homepage.quickInquiry.subtitle ?? 'Have a vision for a specific space? We collaborate with architects, designers, and homeowners to bring unique wooden dreams to life. Your heritage, our hands.',
            button_label: homepage.quickInquiry.buttonLabel ?? 'Start a Conversation',
            button_url: homepage.quickInquiry.buttonUrl ?? '/contact',
            background_media_id: emptyToId(homepage.quickInquiry.backgroundMediaId),
            background_color: homepage.quickInquiry.backgroundColor ?? '',
            is_visible: homepage.quickInquiry.isVisible,
            items: homepage.quickInquiry.banners.map((banner) => ({
                id: banner.id,
                imageMediaId: emptyToId(banner.imageMediaId),
                sortOrder: banner.sortOrder,
                isVisible: banner.isVisible,
            })),
        },
    });

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        const option: MediaOption = {
            id: media.id,
            label: media.label,
            altText: media.altText ?? null,
            url: media.url ?? null,
            status: media.status ?? 'uploaded',
        };

        setMediaChoices((current) => [option, ...current.filter((item) => item.id !== option.id)]);
    };

    const addHeroBanner = () => {
        form.setData('hero', {
            ...form.data.hero,
            items: [
                ...form.data.hero.items,
                {
                    imageMediaId: '',
                    sortOrder: form.data.hero.items.length,
                    isVisible: true,
                },
            ],
        });
    };

    const setHeroBanner = (index: number, item: HomepageForm['hero']['items'][number]) => {
        form.setData('hero', {
            ...form.data.hero,
            items: form.data.hero.items.map((current, currentIndex) => (currentIndex === index ? item : current)),
        });
    };

    const removeHeroBanner = (index: number) => {
        form.setData('hero', {
            ...form.data.hero,
            items: form.data.hero.items.filter((_, currentIndex) => currentIndex !== index),
        });
    };

    const addBanner = () => {
        form.setData('quickInquiry', {
            ...form.data.quickInquiry,
            items: [
                ...form.data.quickInquiry.items,
                {
                    imageMediaId: '',
                    sortOrder: form.data.quickInquiry.items.length,
                    isVisible: true,
                },
            ],
        });
    };

    const setBanner = (index: number, item: HomepageForm['quickInquiry']['items'][number]) => {
        form.setData('quickInquiry', {
            ...form.data.quickInquiry,
            items: form.data.quickInquiry.items.map((current, currentIndex) => (currentIndex === index ? item : current)),
        });
    };

    const removeBanner = (index: number) => {
        form.setData('quickInquiry', {
            ...form.data.quickInquiry,
            items: form.data.quickInquiry.items.filter((_, currentIndex) => currentIndex !== index),
        });
    };

    const setTurnkeyItem = (index: number, item: ContentItemForm) => {
        form.setData('turnkey', {
            ...form.data.turnkey,
            items: form.data.turnkey.items.map((current, currentIndex) => (currentIndex === index ? item : current)),
        });
    };

    const addTurnkeyItem = () => {
        form.setData('turnkey', {
            ...form.data.turnkey,
            items: [...form.data.turnkey.items, { heading: '', body_text: '', sort_order: form.data.turnkey.items.length, is_active: true }],
        });
    };

    const removeTurnkeyItem = (index: number) => {
        form.setData('turnkey', {
            ...form.data.turnkey,
            items: form.data.turnkey.items.filter((_, currentIndex) => currentIndex !== index),
        });
    };

    const setAboutPoint = (index: number, item: ContentItemForm) => {
        form.setData('aboutPreview', {
            ...form.data.aboutPreview,
            points: form.data.aboutPreview.points.map((current, currentIndex) => (currentIndex === index ? item : current)),
        });
    };

    const addAboutPoint = () => {
        form.setData('aboutPreview', {
            ...form.data.aboutPreview,
            points: [...form.data.aboutPreview.points, { heading: '', body_text: '', sort_order: form.data.aboutPreview.points.length, is_active: true }],
        });
    };

    const removeAboutPoint = (index: number) => {
        form.setData('aboutPreview', {
            ...form.data.aboutPreview,
            points: form.data.aboutPreview.points.filter((_, currentIndex) => currentIndex !== index),
        });
    };

    const setIndustryStat = (index: number, item: ContentItemForm) => {
        form.setData('industryStats', {
            ...form.data.industryStats,
            items: form.data.industryStats.items.map((current, currentIndex) => (currentIndex === index ? item : current)),
        });
    };

    const addIndustryStat = () => {
        form.setData('industryStats', {
            ...form.data.industryStats,
            items: [...form.data.industryStats.items, { heading: '', body_text: '', sort_order: form.data.industryStats.items.length, is_active: true }],
        });
    };

    const removeIndustryStat = (index: number) => {
        form.setData('industryStats', {
            ...form.data.industryStats,
            items: form.data.industryStats.items.filter((_, currentIndex) => currentIndex !== index),
        });
    };

    const submit = () => {
        form.transform((data) => ({
            ...data,
            hero: {
                ...data.hero,
                items: data.hero.items.filter((item) => item.imageMediaId !== ''),
            },
            quickInquiry: {
                ...data.quickInquiry,
                items: data.quickInquiry.items.filter((item) => item.imageMediaId !== ''),
            },
        }));
        form.patch('/admin/homepage', { preserveScroll: true });
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i -= 1) {
                const sectionId = sections[i].id;
                const element = document.getElementById(sectionId);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(sectionId);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: SectionId) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="Homepage" />
            <AdminShell
                title="Homepage"
                description="Manage only the homepage sections shown on the public homepage."
                actions={
                    <div className="flex flex-wrap gap-3">
                        <Button href="/" color="light">View homepage</Button>
                        <Button type="button" onClick={submit} disabled={form.processing}>
                            {form.processing ? 'Saving' : 'Save homepage'}
                        </Button>
                    </div>
                }
            >
                <form
                    className="grid grid-cols-1 gap-8 xl:grid-cols-[250px_1fr] xl:items-start"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <div className="xl:hidden">
                        <PagePanel className="p-3">
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => scrollToSection(section.id)}
                                        className={`shrink-0 rounded-md px-3 py-2 text-sm transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-zinc-950 font-medium text-white dark:bg-white dark:text-zinc-950'
                                                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                                        }`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        </PagePanel>
                    </div>

                    <div className="hidden xl:block xl:sticky xl:top-24">
                        <PagePanel className="p-4">
                            <p className="mb-4 px-2 font-semibold text-zinc-950 dark:text-white">Sections</p>
                            <nav className="flex flex-col space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => scrollToSection(section.id)}
                                        className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-zinc-950 font-medium text-white dark:bg-white dark:text-zinc-950'
                                                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white'
                                        }`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </nav>
                        </PagePanel>
                    </div>

                    <div className="space-y-8 min-w-0">
                    <div id="hero-section">
                        <HeroSection
                            form={form}
                            mediaOptions={mediaChoices}
                            imageFor={imageFor}
                            ToggleField={ToggleField}
                            FieldHint={FieldHint}
                            addBanner={addHeroBanner}
                            setBanner={setHeroBanner}
                            removeBanner={removeHeroBanner}
                            onMediaUploaded={rememberUploadedMedia}
                        />
                    </div>

                    <div id="whatsapp-section">
                    <PagePanel>
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Left Side WhatsApp</h2>
                            <Text>Controls the floating WhatsApp inquiry widget on the homepage hero.</Text>
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>WhatsApp Number</Label>
                                <FormInput
                                    type="text"
                                    value={form.data.settings.whatsapp_number}
                                    onChange={(event) => form.setData('settings', { ...form.data.settings, whatsapp_number: event.target.value })}
                                    placeholder="e.g. +919876543210"
                                />
                            </Field>
                            <Field>
                                <Label>WhatsApp Text</Label>
                                <FormInput
                                    type="text"
                                    value={form.data.settings.whatsapp_text}
                                    onChange={(event) => form.setData('settings', { ...form.data.settings, whatsapp_text: event.target.value })}
                                    placeholder="Hi Zarokha, I want to discuss a custom project."
                                />
                            </Field>
                        </div>
                    </PagePanel>
                    </div>

                    <div id="turnkey-section">
                    <PagePanel>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Turnkey Solutions</h2>
                                <Text>Manage the complete custom furniture section, YouTube video, and service cards.</Text>
                            </div>
                            <ToggleField
                                label="Visible"
                                checked={form.data.turnkey.is_visible}
                                onChange={(checked) => form.setData('turnkey', { ...form.data.turnkey, is_visible: checked })}
                            />
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>Eyebrow</Label>
                                <FormInput value={form.data.turnkey.eyebrow} onChange={(event) => form.setData('turnkey', { ...form.data.turnkey, eyebrow: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Heading</Label>
                                <FormInput value={form.data.turnkey.title} onChange={(event) => form.setData('turnkey', { ...form.data.turnkey, title: event.target.value })} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Caption</Label>
                                <FormInput value={form.data.turnkey.subtitle} onChange={(event) => form.setData('turnkey', { ...form.data.turnkey, subtitle: event.target.value })} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>YouTube video link</Label>
                                <FormInput value={form.data.turnkey.button_url} onChange={(event) => form.setData('turnkey', { ...form.data.turnkey, button_url: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                                <FieldError message={form.errors['turnkey.button_url']} />
                                <FieldHint>Leave blank to show the default wooden-art media in this section.</FieldHint>
                            </Field>
                        </div>
                        <div className="mt-6 space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Service cards</h3>
                                <Button type="button" color="light" onClick={addTurnkeyItem}>Add service</Button>
                            </div>
                            {form.data.turnkey.items.map((item, index) => (
                                <div key={item.id ?? `turnkey-${index}`} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">Service {index + 1}</p>
                                        <Button type="button" color="light" onClick={() => removeTurnkeyItem(index)}>Remove</Button>
                                    </div>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <Field>
                                            <Label>Title</Label>
                                            <FormInput value={item.heading} onChange={(event) => setTurnkeyItem(index, { ...item, heading: event.target.value })} />
                                            <FieldError message={form.errors[`turnkey.items.${index}.heading`]} />
                                        </Field>
                                        <Field>
                                            <Label>Sort order</Label>
                                            <FormInput type="number" min={0} value={item.sort_order} onChange={(event) => setTurnkeyItem(index, { ...item, sort_order: Number(event.target.value) })} />
                                        </Field>
                                        <Field className="lg:col-span-2">
                                            <Label>Text</Label>
                                            <FormTextarea rows={3} value={item.body_text} onChange={(event) => setTurnkeyItem(index, { ...item, body_text: event.target.value })} />
                                        </Field>
                                        <Field>
                                            <Label>Visibility</Label>
                                            <ToggleField label="Active" checked={item.is_active} onChange={(checked) => setTurnkeyItem(index, { ...item, is_active: checked })} />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PagePanel>
                    </div>

                    <div id="about-preview-section">
                    <PagePanel>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">About Zarokha</h2>
                                <Text>Manage the homepage about preview section.</Text>
                            </div>
                            <ToggleField
                                label="Visible"
                                checked={form.data.aboutPreview.is_visible}
                                onChange={(checked) => form.setData('aboutPreview', { ...form.data.aboutPreview, is_visible: checked })}
                            />
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>Eyebrow</Label>
                                <FormInput value={form.data.aboutPreview.eyebrow} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, eyebrow: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Heading</Label>
                                <FormInput value={form.data.aboutPreview.title} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, title: event.target.value })} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Intro</Label>
                                <FormTextarea rows={3} value={form.data.aboutPreview.subtitle} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, subtitle: event.target.value })} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Body</Label>
                                <FormTextarea rows={3} value={form.data.aboutPreview.body} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, body: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Primary button label</Label>
                                <FormInput value={form.data.aboutPreview.primary_button_label} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, primary_button_label: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Primary button URL</Label>
                                <FormInput value={form.data.aboutPreview.primary_button_url} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, primary_button_url: event.target.value })} />
                                <FieldError message={form.errors['aboutPreview.primary_button_url']} />
                            </Field>
                            <Field>
                                <Label>Secondary button label</Label>
                                <FormInput value={form.data.aboutPreview.secondary_button_label} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, secondary_button_label: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Secondary button URL</Label>
                                <FormInput value={form.data.aboutPreview.secondary_button_url} onChange={(event) => form.setData('aboutPreview', { ...form.data.aboutPreview, secondary_button_url: event.target.value })} />
                                <FieldError message={form.errors['aboutPreview.secondary_button_url']} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Section image</Label>
                                <MediaDropSelect
                                    value={form.data.aboutPreview.background_media_id}
                                    options={mediaChoices}
                                    preview={imageFor(mediaChoices, form.data.aboutPreview.background_media_id)}
                                    label="About preview image"
                                    onUploaded={rememberUploadedMedia}
                                    onChange={(background_media_id) => form.setData('aboutPreview', { ...form.data.aboutPreview, background_media_id })}
                                />
                            </Field>
                        </div>
                        <div className="mt-6 space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Strength points</h3>
                                <Button type="button" color="light" onClick={addAboutPoint}>Add point</Button>
                            </div>
                            {form.data.aboutPreview.points.map((point, index) => (
                                <div key={point.id ?? `about-point-${index}`} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">Point {index + 1}</p>
                                        <Button type="button" color="light" onClick={() => removeAboutPoint(index)}>Remove</Button>
                                    </div>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <Field>
                                            <Label>Text</Label>
                                            <FormInput value={point.heading} onChange={(event) => setAboutPoint(index, { ...point, heading: event.target.value })} />
                                            <FieldError message={form.errors[`aboutPreview.points.${index}.heading`]} />
                                        </Field>
                                        <Field>
                                            <Label>Sort order</Label>
                                            <FormInput type="number" min={0} value={point.sort_order} onChange={(event) => setAboutPoint(index, { ...point, sort_order: Number(event.target.value) })} />
                                        </Field>
                                        <Field>
                                            <Label>Visibility</Label>
                                            <ToggleField label="Active" checked={point.is_active} onChange={(checked) => setAboutPoint(index, { ...point, is_active: checked })} />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PagePanel>
                    </div>

                    <div id="stats-section">
                    <PagePanel>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Stats of Zarokha</h2>
                                <Text>Manage the homepage counter section.</Text>
                            </div>
                            <ToggleField
                                label="Visible"
                                checked={form.data.industryStats.is_visible}
                                onChange={(checked) => form.setData('industryStats', { ...form.data.industryStats, is_visible: checked })}
                            />
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <Field>
                                <Label>Title</Label>
                                <FormInput value={form.data.industryStats.title} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, title: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Highlighted word</Label>
                                <FormInput value={form.data.industryStats.highlight} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, highlight: event.target.value })} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Subtitle</Label>
                                <FormInput value={form.data.industryStats.subtitle} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, subtitle: event.target.value })} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Footer text</Label>
                                <FormTextarea rows={3} value={form.data.industryStats.body} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, body: event.target.value })} />
                                <FieldHint>Use :contact and :more where the links should appear.</FieldHint>
                            </Field>
                            <Field>
                                <Label>Contact label</Label>
                                <FormInput value={form.data.industryStats.contact_label} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, contact_label: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>Contact URL</Label>
                                <FormInput value={form.data.industryStats.contact_url} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, contact_url: event.target.value })} />
                                <FieldError message={form.errors['industryStats.contact_url']} />
                            </Field>
                            <Field>
                                <Label>View more label</Label>
                                <FormInput value={form.data.industryStats.more_label} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, more_label: event.target.value })} />
                            </Field>
                            <Field>
                                <Label>View more URL</Label>
                                <FormInput value={form.data.industryStats.more_url} onChange={(event) => form.setData('industryStats', { ...form.data.industryStats, more_url: event.target.value })} />
                                <FieldError message={form.errors['industryStats.more_url']} />
                            </Field>
                        </div>
                        <div className="mt-6 space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Counters</h3>
                                <Button type="button" color="light" onClick={addIndustryStat}>Add counter</Button>
                            </div>
                            {form.data.industryStats.items.map((item, index) => (
                                <div key={item.id ?? `industry-stat-${index}`} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">Counter {index + 1}</p>
                                        <Button type="button" color="light" onClick={() => removeIndustryStat(index)}>Remove</Button>
                                    </div>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <Field>
                                            <Label>Number</Label>
                                            <FormInput value={item.heading} onChange={(event) => setIndustryStat(index, { ...item, heading: event.target.value })} />
                                            <FieldError message={form.errors[`industryStats.items.${index}.heading`]} />
                                        </Field>
                                        <Field>
                                            <Label>Label</Label>
                                            <FormInput value={item.body_text} onChange={(event) => setIndustryStat(index, { ...item, body_text: event.target.value })} />
                                            <FieldError message={form.errors[`industryStats.items.${index}.body_text`]} />
                                        </Field>
                                        <Field>
                                            <Label>Sort order</Label>
                                            <FormInput type="number" min={0} value={item.sort_order} onChange={(event) => setIndustryStat(index, { ...item, sort_order: Number(event.target.value) })} />
                                        </Field>
                                        <Field>
                                            <Label>Visibility</Label>
                                            <ToggleField label="Active" checked={item.is_active} onChange={(checked) => setIndustryStat(index, { ...item, is_active: checked })} />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PagePanel>
                    </div>

                    <div id="latest-products-section">
                        <LatestProducts form={form} ToggleField={ToggleField} />
                    </div>

                    <div id="quick-inquiry-section">
                        <QuickInquiry
                            form={form}
                            ToggleField={ToggleField}
                            addBanner={addBanner}
                            removeBanner={removeBanner}
                            setBanner={setBanner}
                            mediaOptions={mediaChoices}
                            onMediaUploaded={rememberUploadedMedia}
                        />
                    </div>

                    {Object.keys(form.errors).length > 0 ? (
                        <PagePanel className="border-red-500/40">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                Homepage was not saved. Please fix the highlighted fields and save again.
                            </p>
                        </PagePanel>
                    ) : null}
                    </div>
                </form>
            </AdminShell>
        </>
    );
}
