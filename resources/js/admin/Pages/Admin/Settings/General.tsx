import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FormInput, FormSelect, PagePanel } from '@admin/Components/AdminPrimitives';

type SettingsGeneralProps = {
    settings: {
        siteName: string;
        lightLogoMediaId: number | null;
        darkLogoMediaId: number | null;
    };
    mediaOptions: { id: number; label: string; status: string }[];
};

export default function SettingsGeneral({ settings, mediaOptions }: SettingsGeneralProps) {
    const form = useForm({
        site_name: settings.siteName ?? '',
        light_logo_media_id: settings.lightLogoMediaId ?? '',
        dark_logo_media_id: settings.darkLogoMediaId ?? '',
    });

    return (
        <>
            <Head title="Settings" />
            <AdminShell title="Settings" description="Manage singleton site-wide operational settings without creating duplicate records.">
                <PagePanel>
                    <form
                        className="space-y-6"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.patch('/admin/settings');
                        }}
                    >
                        <Field>
                            <Label>Site name</Label>
                            <FormInput value={form.data.site_name} onChange={(event) => form.setData('site_name', event.target.value)} />
                        </Field>

                        <Field>
                            <Label>Light Theme Logo</Label>
                            <FormSelect
                                value={form.data.light_logo_media_id}
                                onChange={(event) => form.setData('light_logo_media_id', event.target.value === '' ? '' : Number(event.target.value))}
                            >
                                <option value="">Choose media</option>
                                {mediaOptions.map((media) => (
                                    <option key={media.id} value={media.id}>
                                        {media.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </Field>

                        <Field>
                            <Label>Dark Theme Logo</Label>
                            <FormSelect
                                value={form.data.dark_logo_media_id}
                                onChange={(event) => form.setData('dark_logo_media_id', event.target.value === '' ? '' : Number(event.target.value))}
                            >
                                <option value="">Choose media</option>
                                {mediaOptions.map((media) => (
                                    <option key={media.id} value={media.id}>
                                        {media.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </Field>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Save settings</Button>
                        </div>
                    </form>
                </PagePanel>
            </AdminShell>
        </>
    );
}
