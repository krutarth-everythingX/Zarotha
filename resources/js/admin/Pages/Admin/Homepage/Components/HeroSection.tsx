import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';

export function HeroSection({ form, mediaSelect, mediaOptions, MediaPreview, imageFor, ToggleField, FieldHint, addBanner }: any) {
    return (
        <PagePanel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Hero</h2>
                    <Text>Desktop and mobile banner media, copy, buttons, overlay, and text theme.</Text>
                </div>
                <ToggleField
                    label="Visible"
                    checked={form.data.hero.is_visible}
                    onChange={(checked: boolean) => form.setData('hero', { ...form.data.hero, is_visible: checked })}
                />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
                <Field>
                    <Label>Main heading</Label>
                    <FormInput value={form.data.hero.heading} onChange={(event: any) => form.setData('hero', { ...form.data.hero, heading: event.target.value })} />
                    <FieldError message={form.errors['hero.heading']} />
                </Field>
                <Field>
                    <Label>Text theme</Label>
                    <FormSelect value={form.data.hero.text_theme} onChange={(event: any) => form.setData('hero', { ...form.data.hero, text_theme: event.target.value as 'light' | 'dark' })}>
                        <option value="light">Light text</option>
                        <option value="dark">Dark text</option>
                    </FormSelect>
                </Field>
                <Field className="lg:col-span-2">
                    <Label>Subtext</Label>
                    <FormTextarea rows={3} value={form.data.hero.subtext} onChange={(event: any) => form.setData('hero', { ...form.data.hero, subtext: event.target.value })} />
                    <FieldError message={form.errors['hero.subtext']} />
                </Field>
                <div className="lg:col-span-2 space-y-4 pt-4 border-t border-zinc-950/10 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-zinc-950 dark:text-white">Background Slider Images</h3>
                        <button
                            type="button"
                            onClick={addBanner}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                        >
                            + Add Image
                        </button>
                    </div>
                    {form.data.hero.items?.map((banner: any, index: number) => (
                        <div key={index} className="flex gap-4 items-start p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-950/5 dark:border-white/5">
                            <div className="flex-1">
                                {mediaSelect(banner.imageMediaId, (val: any) => {
                                    const newItems = [...form.data.hero.items];
                                    newItems[index] = { ...banner, imageMediaId: val };
                                    form.setData('hero', { ...form.data.hero, items: newItems });
                                })}
                                <MediaPreview media={imageFor(mediaOptions, banner.imageMediaId)} />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const newItems = form.data.hero.items.filter((_: any, i: number) => i !== index);
                                    form.setData('hero', { ...form.data.hero, items: newItems });
                                }}
                                className="text-zinc-400 hover:text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {(!form.data.hero.items || form.data.hero.items.length === 0) && (
                        <p className="text-sm text-zinc-500 text-center py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                            No background images added. Click "+ Add Image" to create a slider.
                        </p>
                    )}
                </div>
                <Field>
                    <Label>Primary button label</Label>
                    <FormInput value={form.data.hero.primary_button_label} onChange={(event: any) => form.setData('hero', { ...form.data.hero, primary_button_label: event.target.value })} />
                </Field>
                <Field>
                    <Label>Primary button URL</Label>
                    <FormInput value={form.data.hero.primary_button_url} onChange={(event: any) => form.setData('hero', { ...form.data.hero, primary_button_url: event.target.value })} />
                    <FieldError message={form.errors['hero.primary_button_url']} />
                </Field>
                <Field>
                    <Label>Secondary button label</Label>
                    <FormInput value={form.data.hero.secondary_button_label} onChange={(event: any) => form.setData('hero', { ...form.data.hero, secondary_button_label: event.target.value })} />
                </Field>
                <Field>
                    <Label>Secondary button URL</Label>
                    <FormInput value={form.data.hero.secondary_button_url} onChange={(event: any) => form.setData('hero', { ...form.data.hero, secondary_button_url: event.target.value })} />
                    <FieldError message={form.errors['hero.secondary_button_url']} />
                </Field>
                <Field>
                    <Label>Overlay opacity</Label>
                    <FormInput
                        type="number"
                        min={0}
                        max={80}
                        value={form.data.hero.overlay_opacity}
                        onChange={(event: any) => form.setData('hero', { ...form.data.hero, overlay_opacity: Number(event.target.value) })}
                    />
                    <FieldHint>0 to 80.</FieldHint>
                </Field>
            </div>
        </PagePanel>
    );
}
