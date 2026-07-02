import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { FieldError, FormInput, PagePanel } from '@admin/Components/AdminPrimitives';

export function QuickInquiry({ form, mediaSelect, ToggleField, addBanner, removeBanner, setBanner }: any) {
    return (
        <PagePanel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Quick Inquiry</h2>
                    <Text>Final homepage callout linking to the contact or inquiry page.</Text>
                </div>
                <ToggleField
                    label="Visible"
                    checked={form.data.quickInquiry.is_visible}
                    onChange={(checked: boolean) => form.setData('quickInquiry', { ...form.data.quickInquiry, is_visible: checked })}
                />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
                <Field>
                    <Label>Heading</Label>
                    <FormInput value={form.data.quickInquiry.title} onChange={(event: any) => form.setData('quickInquiry', { ...form.data.quickInquiry, title: event.target.value })} />
                </Field>
                <Field>
                    <Label>Subtext</Label>
                    <FormInput value={form.data.quickInquiry.subtitle} onChange={(event: any) => form.setData('quickInquiry', { ...form.data.quickInquiry, subtitle: event.target.value })} />
                </Field>
                <Field>
                    <Label>Button label</Label>
                    <FormInput value={form.data.quickInquiry.button_label} onChange={(event: any) => form.setData('quickInquiry', { ...form.data.quickInquiry, button_label: event.target.value })} />
                </Field>
                <Field>
                    <Label>Button URL</Label>
                    <FormInput value={form.data.quickInquiry.button_url} onChange={(event: any) => form.setData('quickInquiry', { ...form.data.quickInquiry, button_url: event.target.value })} />
                    <FieldError message={form.errors['quickInquiry.button_url']} />
                </Field>
                <Field>
                    <Label>Background image</Label>
                    {mediaSelect(form.data.quickInquiry.background_media_id, (background_media_id: any) => form.setData('quickInquiry', { ...form.data.quickInquiry, background_media_id }))}
                </Field>
                <Field>
                    <Label>Background color</Label>
                    <FormInput placeholder="#ffffff" value={form.data.quickInquiry.background_color} onChange={(event: any) => form.setData('quickInquiry', { ...form.data.quickInquiry, background_color: event.target.value })} />
                    <FieldError message={form.errors['quickInquiry.background_color']} />
                </Field>
            </div>
            <div className="mt-6 space-y-5">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Rotating Banners</h3>
                <Text>Add multiple banners to rotate in the background.</Text>
                {form.data.quickInquiry.items.map((item: any, index: number) => (
                    <div key={item.id ?? `new-banner-${index}`} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-zinc-950 dark:text-white">Banner {index + 1}</p>
                            <Button type="button" color="light" onClick={() => removeBanner(index)}>
                                Remove
                            </Button>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field>
                                <Label>Banner Image</Label>
                                {mediaSelect(item.imageMediaId, (imageMediaId: any) => setBanner(index, { ...item, imageMediaId }))}
                            </Field>
                            <Field>
                                <Label>Sort order</Label>
                                <FormInput type="number" min={0} value={item.sortOrder} onChange={(event: any) => setBanner(index, { ...item, sortOrder: Number(event.target.value) })} />
                            </Field>
                            <Field>
                                <Label>Visibility</Label>
                                <ToggleField label="Visible" checked={item.isVisible} onChange={(checked: boolean) => setBanner(index, { ...item, isVisible: checked })} />
                            </Field>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-5">
                <Button type="button" color="light" onClick={addBanner}>
                    Add banner
                </Button>
            </div>
        </PagePanel>
    );
}
