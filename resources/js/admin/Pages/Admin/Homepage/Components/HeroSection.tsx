import type React from 'react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { FieldError, FormInput, FormSelect, PagePanel } from '@admin/Components/AdminPrimitives';
import { MediaDropSelect, type MediaOption } from '@admin/Components/MediaDropSelect';

type HeroBannerForm = {
    id?: number;
    imageMediaId: number | '';
    sortOrder: number;
    isVisible: boolean;
};

type HeroForm = {
    is_visible: boolean;
    text_theme: 'light' | 'dark';
    overlay_opacity: number;
    items: HeroBannerForm[];
};

type HeroSectionProps = {
    form: {
        data: { hero: HeroForm };
        errors: Record<string, string | undefined>;
        setData: (key: 'hero', value: HeroForm) => void;
    };
    mediaOptions: MediaOption[];
    imageFor: (mediaOptions: MediaOption[], id: number | '') => MediaOption | null;
    ToggleField: (props: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => JSX.Element;
    FieldHint: (props: { children: React.ReactNode }) => JSX.Element;
    addBanner: () => void;
    setBanner: (index: number, item: HeroBannerForm) => void;
    removeBanner: (index: number) => void;
    onMediaUploaded: (media: MediaOption) => void;
};

export function HeroSection({
    form,
    mediaOptions,
    imageFor,
    ToggleField,
    FieldHint,
    addBanner,
    setBanner,
    removeBanner,
    onMediaUploaded,
}: HeroSectionProps) {
    return (
        <PagePanel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Hero Section Banners</h2>
                    <Text>Manage the homepage hero slider images.</Text>
                </div>
                <ToggleField
                    label="Visible"
                    checked={form.data.hero.is_visible}
                    onChange={(checked: boolean) => form.setData('hero', { ...form.data.hero, is_visible: checked })}
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Field>
                    <Label>Text theme</Label>
                    <FormSelect value={form.data.hero.text_theme} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => form.setData('hero', { ...form.data.hero, text_theme: event.target.value as 'light' | 'dark' })}>
                        <option value="light">Light text</option>
                        <option value="dark">Dark text</option>
                    </FormSelect>
                </Field>
                <Field>
                    <Label>Overlay opacity</Label>
                    <FormInput
                        type="number"
                        min={0}
                        max={80}
                        value={form.data.hero.overlay_opacity}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => form.setData('hero', { ...form.data.hero, overlay_opacity: Number(event.target.value) })}
                    />
                    <FieldHint>0 to 80.</FieldHint>
                </Field>
            </div>

            <div className="mt-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Slider images</h3>
                    <Button type="button" color="light" onClick={addBanner}>
                        Add image
                    </Button>
                </div>

                {form.data.hero.items.map((banner, index) => (
                    <div key={banner.id ?? `hero-banner-${index}`} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-zinc-950 dark:text-white">Banner {index + 1}</p>
                            <Button type="button" color="light" onClick={() => removeBanner(index)}>
                                Remove
                            </Button>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field className="lg:col-span-2">
                                <Label>Banner image</Label>
                                <MediaDropSelect
                                    value={banner.imageMediaId}
                                    options={mediaOptions}
                                    preview={imageFor(mediaOptions, banner.imageMediaId)}
                                    label={`Hero banner ${index + 1}`}
                                    onUploaded={onMediaUploaded}
                                    onChange={(imageMediaId) => setBanner(index, { ...banner, imageMediaId })}
                                />
                                <FieldError message={form.errors[`hero.items.${index}.imageMediaId`]} />
                            </Field>
                            <Field>
                                <Label>Sort order</Label>
                                <FormInput type="number" min={0} value={banner.sortOrder} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBanner(index, { ...banner, sortOrder: Number(event.target.value) })} />
                            </Field>
                            <Field>
                                <Label>Visibility</Label>
                                <ToggleField label="Visible" checked={banner.isVisible} onChange={(checked: boolean) => setBanner(index, { ...banner, isVisible: checked })} />
                            </Field>
                        </div>
                    </div>
                ))}

                {form.data.hero.items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">No CMS hero banners yet</p>
                        <Text className="mt-2">The public homepage will show default wooden art banners until you upload hero images.</Text>
                    </div>
                ) : null}
            </div>
        </PagePanel>
    );
}
