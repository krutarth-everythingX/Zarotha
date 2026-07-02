import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel, StatusBadge } from '@admin/Components/AdminPrimitives';
import { HeroSection } from './Components/HeroSection';
import { LatestProducts } from './Components/LatestProducts';
import { QuickInquiry } from './Components/QuickInquiry';

type MediaOption = {
    id: number;
    label: string;
    altText: string | null;
    url: string | null;
    status: string;
};

type ProductOption = {
    id: number;
    label: string;
    status: string;
};

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
    desktopMedia: MediaReference;
    mobileMedia: MediaReference;
    items: Array<{
        id: number;
        imageMediaId: number | null;
        sortOrder: number;
        isVisible: boolean;
        imageMedia: MediaReference;
    }>;
};

type FloatingProductPayload = {
    id: number;
    productId: number | null;
    imageMediaId: number | null;
    altText: string | null;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    tiltPreset: 'soft' | 'medium' | 'full';
    tapLabel: string | null;
    isVisible: boolean;
    productName: string | null;
    imageMedia: MediaReference;
};

type SectionPayload = {
    title: string | null;
    subtitle: string | null;
    viewAllLabel: string | null;
    viewAllUrl: string | null;
    buttonLabel: string | null;
    buttonUrl: string | null;
    maxItems: number;
    backgroundMediaId: number | null;
    backgroundColor: string | null;
    isVisible: boolean;
    products: Array<{
        productId: number;
        productName: string | null;
    }>;
};

type SettingsPayload = {
    whatsapp_text: string;
    whatsapp_number: string;
    show_social_links_on_hero: boolean;
};

type HomepagePayload = {
    hero: HeroPayload;
    floatingProducts: FloatingProductPayload[];
    featured: SectionPayload;
    latest: SectionPayload;
    quickInquiry: SectionPayload & {
        banners: Array<{
            id: number;
            imageMediaId: number | null;
            sortOrder: number;
            isVisible: boolean;
            imageMedia: MediaReference;
        }>;
    };
};

type HomepageIndexProps = {
    homepage: HomepagePayload;
    settings: SettingsPayload;
    productOptions: ProductOption[];
    mediaOptions: MediaOption[];
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
    floating_products: Array<{
        product_id: number | '';
        image_media_id: number | '';
        alt_text: string;
        position: FloatingProductPayload['position'];
        tilt_preset: FloatingProductPayload['tiltPreset'];
        tap_label: string;
        is_visible: boolean;
    }>;
    featured: {
        title: string;
        subtitle: string;
        view_all_label: string;
        view_all_url: string;
        is_visible: boolean;
        products: Array<{ product_id: number | '' }>;
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
    settings: {
        whatsapp_text: string;
        whatsapp_number: string;
        show_social_links_on_hero: boolean;
    };
};

const positions: FloatingProductPayload['position'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

function emptyToId(value: number | null): number | '' {
    return value ?? '';
}

function imageFor(mediaOptions: MediaOption[], id: number | '') {
    return id === '' ? null : mediaOptions.find((media) => media.id === id) ?? null;
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{children}</p>;
}

function MediaPreview({ media }: { media: MediaReference }) {
    if (!media) {
        return <div className="mt-3 grid aspect-video place-items-center rounded-xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800">No media selected</div>;
    }

    return (
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-950/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800">
            {media.url ? <img src={media.url} alt={media.altText ?? ''} className="aspect-video w-full object-cover" /> : null}
            <div className="p-3">
                <p className="truncate text-xs font-medium text-zinc-950 dark:text-white">{media.label}</p>
                <Text>{media.status}</Text>
            </div>
        </div>
    );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <label className="inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
            {label}
        </label>
    );
}

function OptionList({
    mediaOptions,
    productOptions,
    children,
}: {
    mediaOptions: MediaOption[];
    productOptions: ProductOption[];
    children: (helpers: {
        productSelect: (value: number | '', onChange: (value: number | '') => void) => React.ReactNode;
        mediaSelect: (value: number | '', onChange: (value: number | '') => void) => React.ReactNode;
    }) => React.ReactNode;
}) {
    const productSelect = (value: number | '', onChange: (value: number | '') => void) => (
        <FormSelect value={value} onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}>
            <option value="">Choose product</option>
            {productOptions.map((product) => (
                <option key={product.id} value={product.id}>
                    {product.label} ({product.status})
                </option>
            ))}
        </FormSelect>
    );

    const mediaSelect = (value: number | '', onChange: (value: number | '') => void) => (
        <FormSelect value={value} onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}>
            <option value="">Choose media</option>
            {mediaOptions.map((media) => (
                <option key={media.id} value={media.id}>
                    {media.label} ({media.status})
                </option>
            ))}
        </FormSelect>
    );

    return <>{children({ productSelect, mediaSelect })}</>;
}

export default function HomepageIndex({ homepage, settings, productOptions, mediaOptions }: HomepageIndexProps) {
    const initialFloatingProducts = useMemo(
        () =>
            positions.map((position, index) => {
                const item = homepage.floatingProducts[index];

                return {
                    product_id: emptyToId(item?.productId ?? null),
                    image_media_id: emptyToId(item?.imageMediaId ?? null),
                    alt_text: item?.altText ?? '',
                    position: item?.position ?? position,
                    tilt_preset: item?.tiltPreset ?? 'full',
                    tap_label: item?.tapLabel ?? 'Tap to View',
                    is_visible: item?.isVisible ?? true,
                };
            }),
        [homepage.floatingProducts],
    );

    const form = useForm<HomepageForm>({
        hero: {
            heading: homepage.hero.heading,
            subtext: homepage.hero.subtext ?? '',
            desktop_media_id: emptyToId(homepage.hero.desktopMediaId),
            mobile_media_id: emptyToId(homepage.hero.mobileMediaId),
            primary_button_label: homepage.hero.primaryButtonLabel ?? 'View Products',
            primary_button_url: homepage.hero.primaryButtonUrl ?? '/products',
            secondary_button_label: homepage.hero.secondaryButtonLabel ?? 'Contact',
            secondary_button_url: homepage.hero.secondaryButtonUrl ?? '/contact',
            overlay_opacity: homepage.hero.overlayOpacity,
            text_theme: homepage.hero.textTheme,
            is_visible: homepage.hero.isVisible,
            items: homepage.hero.items?.map((b) => ({
                id: b.id,
                imageMediaId: emptyToId(b.imageMediaId),
                sortOrder: b.sortOrder,
                isVisible: b.isVisible,
            })) || [],
        },
        floating_products: initialFloatingProducts,
        featured: {
            title: homepage.featured.title ?? 'Featured Products',
            subtitle: homepage.featured.subtitle ?? '',
            view_all_label: homepage.featured.viewAllLabel ?? 'View All Products',
            view_all_url: homepage.featured.viewAllUrl ?? '/products',
            is_visible: homepage.featured.isVisible,
            products: homepage.featured.products.length > 0 ? homepage.featured.products.map((item) => ({ product_id: item.productId })) : [{ product_id: '' }],
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
            title: homepage.quickInquiry.title ?? '',
            subtitle: homepage.quickInquiry.subtitle ?? '',
            button_label: homepage.quickInquiry.buttonLabel ?? '',
            button_url: homepage.quickInquiry.buttonUrl ?? '',
            background_media_id: emptyToId(homepage.quickInquiry.backgroundMediaId),
            background_color: homepage.quickInquiry.backgroundColor ?? '',
            is_visible: homepage.quickInquiry.isVisible,
            items: homepage.quickInquiry.banners.map((b) => ({
                id: b.id,
                imageMediaId: emptyToId(b.imageMediaId),
                sortOrder: b.sortOrder,
                isVisible: b.isVisible,
            })),
        },
        settings: {
            whatsapp_text: settings.whatsapp_text ?? '',
            whatsapp_number: settings.whatsapp_number ?? '',
            show_social_links_on_hero: settings.show_social_links_on_hero ?? false,
        },
    });

    const setFloatingItem = (index: number, item: HomepageForm['floating_products'][number]) => {
        form.setData(
            'floating_products',
            form.data.floating_products.map((current, currentIndex) => (currentIndex === index ? item : current)),
        );
    };

    const setFeaturedProduct = (index: number, product_id: number | '') => {
        form.setData('featured', {
            ...form.data.featured,
            products: form.data.featured.products.map((current, currentIndex) => (currentIndex === index ? { product_id } : current)),
        });
    };

    const addFeaturedProduct = () => {
        if (form.data.featured.products.length >= 10) {
            return;
        }

        form.setData('featured', {
            ...form.data.featured,
            products: [...form.data.featured.products, { product_id: '' }],
        });
    };

    const removeFeaturedProduct = (index: number) => {
        form.setData('featured', {
            ...form.data.featured,
            products: form.data.featured.products.filter((_, currentIndex) => currentIndex !== index),
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

    const addHeroBanner = () => {
        form.setData('hero', {
            ...form.data.hero,
            items: [
                ...(form.data.hero.items || []),
                {
                    imageMediaId: '',
                    sortOrder: (form.data.hero.items || []).length,
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

    const submit = () => {
        form.transform((data) => ({
            ...data,
            featured: {
                ...data.featured,
                products: data.featured.products.filter((item) => item.product_id !== ''),
            },
        }));
        form.patch('/admin/homepage', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Homepage" />
            <AdminShell
                title="Homepage"
                description="Manage the public homepage hero, product sliders, testimonials, and quick inquiry callout."
            >
                <form
                    className="space-y-8"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <OptionList mediaOptions={mediaOptions} productOptions={productOptions}>
                        {({ productSelect, mediaSelect }) => (
                            <>
                                <HeroSection
                                    form={form}
                                    mediaSelect={mediaSelect}
                                    mediaOptions={mediaOptions}
                                    MediaPreview={MediaPreview}
                                    imageFor={imageFor}
                                    ToggleField={ToggleField}
                                    FieldHint={FieldHint}
                                    addBanner={addHeroBanner}
                                />
                                <LatestProducts
                                    form={form}
                                    ToggleField={ToggleField}
                                />
                                
                                <PagePanel>
                                    <div className="mb-5">
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact & Social Settings</h2>
                                        <Text>Manage WhatsApp inquiry and hero social links.</Text>
                                    </div>
                                    <div className="space-y-6">
                                        <Field>
                                            <Label>WhatsApp Number</Label>
                                            <FormInput
                                                type="text"
                                                value={form.data.settings.whatsapp_number}
                                                onChange={(e) => form.setData('settings', { ...form.data.settings, whatsapp_number: e.target.value })}
                                                placeholder="e.g. +1234567890"
                                            />
                                        </Field>
                                        <Field>
                                            <Label>WhatsApp Text</Label>
                                            <FormInput
                                                type="text"
                                                value={form.data.settings.whatsapp_text}
                                                onChange={(e) => form.setData('settings', { ...form.data.settings, whatsapp_text: e.target.value })}
                                                placeholder="e.g. Hello, I have an inquiry..."
                                            />
                                        </Field>
                                        <ToggleField
                                            label="Show social links on hero section"
                                            checked={form.data.settings.show_social_links_on_hero}
                                            onChange={(val) => form.setData('settings', { ...form.data.settings, show_social_links_on_hero: val })}
                                        />
                                    </div>
                                </PagePanel>

                                <QuickInquiry
                                    form={form}
                                    mediaSelect={mediaSelect}
                                    ToggleField={ToggleField}
                                    addBanner={addBanner}
                                    removeBanner={removeBanner}
                                    setBanner={setBanner}
                                />
                            </>
                        )}
                    </OptionList>

                    <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-950/10 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/95">
                        <Text>Save writes all homepage CMS sections together.</Text>
                        <div className="flex gap-3">
                            <Button href="/" color="light">
                                View homepage
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Saving' : 'Save homepage'}
                            </Button>
                        </div>
                    </div>
                </form>
            </AdminShell>
        </>
    );
}
