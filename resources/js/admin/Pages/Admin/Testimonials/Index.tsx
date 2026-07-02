import { useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@admin/Components/ui/button';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';

interface Props {
    testimonials: any;
    mediaOptions: any[];
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <label className="inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
            {label}
        </label>
    );
}

export default function TestimonialsIndex({ testimonials, mediaOptions }: Props) {
    const { data, setData, put, processing, isDirty, errors } = useForm({
        ...testimonials,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/testimonials');
    };

    const mediaSelect = (value: number | '', onChange: (value: number | '') => void) => (
        <FormSelect value={value} onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}>
            <option value="">Choose media</option>
            {mediaOptions?.map((media) => (
                <option key={media.id} value={media.id}>
                    {media.label} ({media.status})
                </option>
            ))}
        </FormSelect>
    );

    const addTestimonial = () => {
        const items = Array.isArray(data.items) ? data.items : [];
        setData('items', [
            ...items,
            {
                customer_name: '',
                location_or_role: '',
                body_text: '',
                image_media_id: '',
                status: 'draft',
                sort_order: items.length,
                is_visible: true,
            },
        ]);
    };

    const removeTestimonial = (index: number) => {
        if (!Array.isArray(data.items)) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const setTestimonial = (index: number, updatedItem: any) => {
        if (!Array.isArray(data.items)) return;
        const newItems = [...data.items];
        newItems[index] = updatedItem;
        setData('items', newItems);
    };

    return (
        <AdminShell title="Testimonials" description="Manage customer testimonials and reviews.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-end">
                    <Button type="submit" disabled={!isDirty || processing}>
                        Save Changes
                    </Button>
                </div>

                <PagePanel>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Testimonials</h2>
                            <Text>Published visible testimonials render two per view on desktop and one on mobile.</Text>
                        </div>
                        <ToggleField
                            label="Visible"
                            checked={data.is_visible}
                            onChange={(checked: boolean) => setData('is_visible', checked)}
                        />
                    </div>
                    <div className="grid gap-5 lg:grid-cols-2">
                        <Field>
                            <Label>Section title</Label>
                            <FormInput value={data.title} onChange={(event: any) => setData('title', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Section subtitle</Label>
                            <FormInput value={data.subtitle} onChange={(event: any) => setData('subtitle', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Background image</Label>
                            {mediaSelect(data.background_media_id, (background_media_id: any) => setData('background_media_id', background_media_id))}
                        </Field>
                        <Field>
                            <Label>Background color</Label>
                            <FormInput placeholder="#d7d4cf" value={data.background_color} onChange={(event: any) => setData('background_color', event.target.value)} />
                            <FieldError message={errors.background_color} />
                        </Field>
                    </div>
                    <div className="mt-6 space-y-5">
                        {Array.isArray(data.items) && data.items.map((item: any, index: number) => (
                            <div key={item.id ?? `new-${index}`} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">Testimonial {index + 1}</p>
                                    <Button type="button" color="light" onClick={() => removeTestimonial(index)}>
                                        Remove
                                    </Button>
                                </div>
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <Field>
                                        <Label>Customer name</Label>
                                        <FormInput value={item.customer_name} onChange={(event: any) => setTestimonial(index, { ...item, customer_name: event.target.value })} />
                                        <FieldError message={errors[`items.${index}.customer_name`]} />
                                    </Field>
                                    <Field>
                                        <Label>Location or role</Label>
                                        <FormInput value={item.location_or_role} onChange={(event: any) => setTestimonial(index, { ...item, location_or_role: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Testimonial text</Label>
                                        <FormTextarea rows={4} value={item.body_text} onChange={(event: any) => setTestimonial(index, { ...item, body_text: event.target.value })} />
                                        <FieldError message={errors[`items.${index}.body_text`]} />
                                    </Field>
                                    <Field>
                                        <Label>Optional image</Label>
                                        {mediaSelect(item.image_media_id, (image_media_id: any) => setTestimonial(index, { ...item, image_media_id }))}
                                    </Field>
                                    <Field>
                                        <Label>Status</Label>
                                        <FormSelect value={item.status} onChange={(event: any) => setTestimonial(index, { ...item, status: event.target.value as 'draft' | 'published' })}>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </FormSelect>
                                    </Field>
                                    <Field>
                                        <Label>Sort order</Label>
                                        <FormInput type="number" min={0} value={item.sort_order} onChange={(event: any) => setTestimonial(index, { ...item, sort_order: Number(event.target.value) })} />
                                    </Field>
                                    <Field>
                                        <Label>Visibility</Label>
                                        <ToggleField label="Visible" checked={item.is_visible} onChange={(checked: boolean) => setTestimonial(index, { ...item, is_visible: checked })} />
                                    </Field>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5">
                        <Button type="button" color="light" onClick={addTestimonial}>
                            Add testimonial
                        </Button>
                    </div>
                </PagePanel>
            </form>
        </AdminShell>
    );
}
