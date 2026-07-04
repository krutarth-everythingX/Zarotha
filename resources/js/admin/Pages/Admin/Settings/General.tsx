import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FormInput, PagePanel } from '@admin/Components/AdminPrimitives';
import { Text } from '@admin/Components/ui/text';
import { MediaDropSelect, type MediaOption as UploadMediaOption } from '@admin/Components/MediaDropSelect';
import { useState } from 'react';

type SettingsGeneralProps = {
    settings: {
        siteName: string;
        lightLogoMediaId: number | null;
        darkLogoMediaId: number | null;
        lightLogo: UploadMediaOption | null;
        darkLogo: UploadMediaOption | null;
    };
    mediaOptions: UploadMediaOption[];
};

type SettingsForm = {
    site_name: string;
    light_logo_media_id: number | '';
    dark_logo_media_id: number | '';
};

export default function SettingsGeneral({ settings, mediaOptions }: SettingsGeneralProps) {
    const [mediaChoices, setMediaChoices] = useState<UploadMediaOption[]>(mediaOptions);
    const form = useForm<SettingsForm>({
        site_name: settings.siteName ?? '',
        light_logo_media_id: settings.lightLogoMediaId ?? '',
        dark_logo_media_id: settings.darkLogoMediaId ?? '',
    });

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        setMediaChoices((current) => [media, ...current.filter((item) => item.id !== media.id)]);
    };

    const removeLogos = () => {
        form.setData({
            ...form.data,
            light_logo_media_id: '',
            dark_logo_media_id: '',
        });
    };

    return (
        <>
            <Head title="Settings" />
            <AdminShell title="Settings" description="Keep one company name and logo set for the CMS and public website.">
                <PagePanel>
                    <form
                        className="space-y-6"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.patch('/admin/settings');
                        }}
                    >
                        <div>
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Company identity</h2>
                            <Text className="mt-2">There is one settings record. Editing here updates the existing company name and logo instead of creating duplicates.</Text>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <Field className="lg:col-span-2">
                                <Label>Company name</Label>
                                <FormInput value={form.data.site_name} onChange={(event) => form.setData('site_name', event.target.value)} />
                            </Field>

                            <Field>
                                <Label>Main logo</Label>
                                <MediaDropSelect
                                    value={form.data.light_logo_media_id}
                                    options={mediaChoices}
                                    preview={settings.lightLogo}
                                    onUploaded={rememberUploadedMedia}
                                    onChange={(val) => form.setData('light_logo_media_id', val)}
                                    label="Main logo"
                                />
                            </Field>

                            <Field>
                                <Label>Mobile/sidebar logo</Label>
                                <MediaDropSelect
                                    value={form.data.dark_logo_media_id}
                                    options={mediaChoices}
                                    preview={settings.darkLogo}
                                    onUploaded={rememberUploadedMedia}
                                    onChange={(val) => form.setData('dark_logo_media_id', val)}
                                    label="Mobile/sidebar logo"
                                />
                            </Field>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 pt-4">
                            <Button type="button" color="light" onClick={removeLogos}>
                                Remove logo
                            </Button>
                            <Button type="submit">Save settings</Button>
                        </div>
                    </form>
                </PagePanel>
            </AdminShell>
        </>
    );
}
