import { Head, useForm } from "@inertiajs/react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    FormInput,
    MobileSettingsBreadcrumbs,
    PagePanel,
    SettingsSectionLayout,
} from "@admin/Components/AdminPrimitives";
import { Text } from "@admin/Components/ui/text";
import {
    MediaDropSelect,
    type MediaOption as UploadMediaOption,
} from "@admin/Components/MediaDropSelect";
import { useState } from "react";

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
    light_logo_media_id: number | "";
    dark_logo_media_id: number | "";
};

export default function SettingsGeneral({
    settings,
    mediaOptions,
}: SettingsGeneralProps) {
    const [mediaChoices, setMediaChoices] =
        useState<UploadMediaOption[]>(mediaOptions);
    const form = useForm<SettingsForm>({
        site_name: settings.siteName ?? "",
        light_logo_media_id: settings.lightLogoMediaId ?? "",
        dark_logo_media_id: settings.darkLogoMediaId ?? "",
    });

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        setMediaChoices((current) => [
            media,
            ...current.filter((item) => item.id !== media.id),
        ]);
    };

    const removeLogos = () => {
        form.setData({
            ...form.data,
            light_logo_media_id: "",
            dark_logo_media_id: "",
        });
    };

    return (
        <>
            <Head title="Settings" />
            <AdminShell
                title="Settings"
                description="Keep one company name, logo, and favicon set for the CMS and public website."
                mobileTitle="Settings"
                mobileDescription="Update company identity and shared site assets."
                mobileActions={
                    <Button
                        type="submit"
                        form="general-settings-mobile-form"
                        disabled={form.processing}
                        className="shrink-0"
                    >
                        {form.processing ? "Saving" : "Save Changes"}
                    </Button>
                }
                mobileBreadcrumbs={
                    <MobileSettingsBreadcrumbs
                        items={[
                            {
                                label: "Settings",
                                onClick: () => window.history.back(),
                            },
                            { label: "Company identity", current: true },
                        ]}
                    />
                }
                actions={
                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            color="light"
                            onClick={removeLogos}
                        >
                            Remove logo
                        </Button>
                        <Button
                            type="button"
                            onClick={() => form.patch("/admin/settings")}
                            disabled={form.processing}
                        >
                            Save settings
                        </Button>
                    </div>
                }
            >
                <SettingsSectionLayout active="settings">
                    <PagePanel>
                        <form
                            id="general-settings-mobile-form"
                            className="space-y-6"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.patch("/admin/settings");
                            }}
                        >
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                        Company identity
                                    </h2>
                                    <Text className="mt-2">
                                        There is one settings record. Editing
                                        here updates the existing company name,
                                        logo, and favicon instead of creating
                                        duplicates.
                                    </Text>
                                </div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <Field className="lg:col-span-2">
                                    <Label>Company name</Label>
                                    <FormInput
                                        value={form.data.site_name}
                                        onChange={(event) =>
                                            form.setData(
                                                "site_name",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </Field>

                                <Field>
                                    <Label>Main logo</Label>
                                    <MediaDropSelect
                                        value={form.data.light_logo_media_id}
                                        options={mediaChoices}
                                        preview={settings.lightLogo}
                                        onUploaded={rememberUploadedMedia}
                                        onChange={(val) =>
                                            form.setData(
                                                "light_logo_media_id",
                                                val,
                                            )
                                        }
                                        label="Main logo"
                                    />
                                </Field>

                                <Field>
                                    <Label>Favicon icon</Label>
                                    <MediaDropSelect
                                        value={form.data.dark_logo_media_id}
                                        options={mediaChoices}
                                        preview={settings.darkLogo}
                                        onUploaded={rememberUploadedMedia}
                                        onChange={(val) =>
                                            form.setData(
                                                "dark_logo_media_id",
                                                val,
                                            )
                                        }
                                        label="Favicon icon"
                                    />
                                </Field>
                            </div>
                        </form>
                    </PagePanel>
                </SettingsSectionLayout>
            </AdminShell>
        </>
    );
}
