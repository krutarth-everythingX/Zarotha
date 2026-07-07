import { useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@admin/Components/ui/button';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import { MediaDropSelect, type MediaOption as UploadMediaOption } from '@admin/Components/MediaDropSelect';

type TestimonialItem = {
    id?: number;
    customer_name: string;
    location_or_role: string;
    body_text: string;
    image_media_id: number | '';
    status: 'draft' | 'published';
    sort_order: number;
    is_visible: boolean;
    previewUrl?: string | null;
};

type TestimonialsForm = {
    title: string;
    subtitle: string;
    background_media_id: number | '';
    background_color: string;
    is_visible: boolean;
    previewUrl?: string | null;
    items: TestimonialItem[];
};

interface Props {
    testimonials: TestimonialsForm;
    mediaOptions: MediaOption[];
}

type MediaOption = {
    id: number;
    label: string;
    altText?: string | null;
    url?: string | null;
    previewUrl?: string | null;
    status?: string;
};

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <label className="inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
            {label}
        </label>
    );
}

export default function TestimonialsIndex({ testimonials, mediaOptions }: Props) {
    const [mediaChoices, setMediaChoices] = React.useState<MediaOption[]>(mediaOptions);
    const { data, setData, put, processing, isDirty, errors } = useForm<TestimonialsForm>({
        ...testimonials,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/testimonials');
    };

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        setMediaChoices((current) => [
            media,
            ...current.filter((item) => item.id !== media.id),
        ]);
    };

    const imageFor = (id: number | '') => (
        id === '' ? null : mediaChoices.find((media) => media.id === id) ?? null
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

    const setTestimonial = (index: number, updatedItem: TestimonialItem) => {
        if (!Array.isArray(data.items)) return;
        const newItems = [...data.items];
        newItems[index] = updatedItem;
        setData('items', newItems);
    };

    return (
        <AdminShell
            title="Testimonial"
            description="Manage testimonial lists, add testimonials, edit, remove, and switch them active or inactive."
            actions={
                <Button type="submit" form="testimonials-form" disabled={!isDirty || processing}>
                    Save testimonials
                </Button>
            }
        >
            <form id="testimonials-form" onSubmit={handleSubmit} className="space-y-6">

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
                            <FormInput value={data.title} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setData('title', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Section subtitle</Label>
                            <FormInput value={data.subtitle} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setData('subtitle', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Background image</Label>
                            <MediaDropSelect
                                value={data.background_media_id ?? ''}
                                options={mediaChoices}
                                preview={imageFor(data.background_media_id ?? '')}
                                onUploaded={rememberUploadedMedia}
                                onChange={(background_media_id) => setData('background_media_id', background_media_id)}
                                label="Testimonials background"
                            />
                        </Field>
                        <Field>
                            <Label>Background color</Label>
                            <FormInput placeholder="#d7d4cf" value={data.background_color} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setData('background_color', event.target.value)} />
                            <FieldError message={errors.background_color} />
                        </Field>
                    </div>
                    <div className="mt-6 space-y-5">
                        {Array.isArray(data.items) && data.items.map((item, index) => (
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
                                        <FormInput value={item.customer_name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTestimonial(index, { ...item, customer_name: event.target.value })} />
                                        <FieldError message={errors[`items.${index}.customer_name`]} />
                                    </Field>
                                    <Field>
                                        <Label>Location or role</Label>
                                        <FormInput value={item.location_or_role} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTestimonial(index, { ...item, location_or_role: event.target.value })} />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Testimonial text</Label>
                                        <FormTextarea rows={4} value={item.body_text} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setTestimonial(index, { ...item, body_text: event.target.value })} />
                                        <FieldError message={errors[`items.${index}.body_text`]} />
                                    </Field>
                                    <Field>
                                        <Label>Optional image</Label>
                                        <MediaDropSelect
                                            value={item.image_media_id ?? ''}
                                            options={mediaChoices}
                                            preview={imageFor(item.image_media_id ?? '')}
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(image_media_id) => setTestimonial(index, { ...item, image_media_id })}
                                            label={`Testimonial image ${index + 1}`}
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Status</Label>
                                        <FormSelect value={item.status} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setTestimonial(index, { ...item, status: event.target.value as 'draft' | 'published' })}>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </FormSelect>
                                    </Field>
                                    <Field>
                                        <Label>Sort order</Label>
                                        <FormInput type="number" min={0} value={item.sort_order} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTestimonial(index, { ...item, sort_order: Number(event.target.value) })} />
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
