import type React from 'react';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { FieldError, FormInput, PagePanel } from '@admin/Components/AdminPrimitives';

type LatestForm = {
    title: string;
    subtitle: string;
    max_items: number;
    view_all_label: string;
    view_all_url: string;
    is_visible: boolean;
};

type LatestProductsProps = {
    form: {
        data: { latest: LatestForm };
        errors: Record<string, string | undefined>;
        setData: (key: 'latest', value: LatestForm) => void;
    };
    ToggleField: (props: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => JSX.Element;
};

export function LatestProducts({ form, ToggleField }: LatestProductsProps) {
    return (
        <PagePanel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Latest Products</h2>
                    <Text>Automatically pulls latest published products, capped at 10.</Text>
                </div>
                <ToggleField
                    label="Visible"
                    checked={form.data.latest.is_visible}
                    onChange={(checked: boolean) => form.setData('latest', { ...form.data.latest, is_visible: checked })}
                />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
                <Field>
                    <Label>Title</Label>
                    <FormInput value={form.data.latest.title} onChange={(event: React.ChangeEvent<HTMLInputElement>) => form.setData('latest', { ...form.data.latest, title: event.target.value })} />
                </Field>
                <Field>
                    <Label>Subtitle</Label>
                    <FormInput value={form.data.latest.subtitle} onChange={(event: React.ChangeEvent<HTMLInputElement>) => form.setData('latest', { ...form.data.latest, subtitle: event.target.value })} />
                </Field>
                <Field>
                    <Label>Maximum count</Label>
                    <FormInput type="number" min={1} max={10} value={form.data.latest.max_items} onChange={(event: React.ChangeEvent<HTMLInputElement>) => form.setData('latest', { ...form.data.latest, max_items: Number(event.target.value) })} />
                    <FieldError message={form.errors['latest.max_items']} />
                </Field>
                <Field>
                    <Label>View all label</Label>
                    <FormInput value={form.data.latest.view_all_label} onChange={(event: React.ChangeEvent<HTMLInputElement>) => form.setData('latest', { ...form.data.latest, view_all_label: event.target.value })} />
                </Field>
                <Field>
                    <Label>View all URL</Label>
                    <FormInput value={form.data.latest.view_all_url} onChange={(event: React.ChangeEvent<HTMLInputElement>) => form.setData('latest', { ...form.data.latest, view_all_url: event.target.value })} />
                    <FieldError message={form.errors['latest.view_all_url']} />
                </Field>
            </div>
        </PagePanel>
    );
}
