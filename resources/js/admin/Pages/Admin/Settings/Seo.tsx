import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FormInput, PagePanel } from '@admin/Components/AdminPrimitives';

type SettingsSeoProps = {
    settings: {
        defaultMetaTitle: string | null;
        defaultMetaDescription: string | null;
        defaultOgImageMediaId: number | null;
        defaultRobotsIndex: boolean;
        defaultRobotsFollow: boolean;
    };
};

export default function SettingsSeo({ settings }: SettingsSeoProps) {
    const form = useForm({
        default_meta_title: settings.defaultMetaTitle ?? '',
        default_meta_description: settings.defaultMetaDescription ?? '',
        default_og_image_media_id: settings.defaultOgImageMediaId ?? '',
        default_robots_index: settings.defaultRobotsIndex,
        default_robots_follow: settings.defaultRobotsFollow,
    });

    return (
        <>
            <Head title="SEO Defaults" />
            <AdminShell
                title="SEO Defaults"
                description="Manage safe fallback metadata and robots defaults for public pages."
                actions={
                    <Button type="button" onClick={() => form.patch('/admin/seo')} disabled={form.processing}>
                        Save SEO defaults
                    </Button>
                }
            >
                <PagePanel>
                    <form
                        className="grid gap-4 lg:grid-cols-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.patch('/admin/seo');
                        }}
                    >
                        <Field>
                            <Label>Default meta title</Label>
                            <FormInput value={form.data.default_meta_title} onChange={(event) => form.setData('default_meta_title', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Default OG image media ID</Label>
                            <FormInput value={form.data.default_og_image_media_id} onChange={(event) => form.setData('default_og_image_media_id', event.target.value)} />
                        </Field>
                        <Field className="lg:col-span-2">
                            <Label>Default meta description</Label>
                            <FormInput value={form.data.default_meta_description} onChange={(event) => form.setData('default_meta_description', event.target.value)} />
                        </Field>
                    </form>
                </PagePanel>
            </AdminShell>
        </>
    );
}
