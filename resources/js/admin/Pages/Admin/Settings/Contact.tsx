import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FormInput, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';

type SettingsContactProps = {
    contact: {
        businessName: string | null;
        phonePrimary: string | null;
        phoneSecondary: string | null;
        emailPrimary: string | null;
        emailSecondary: string | null;
        whatsappNumber: string | null;
        showPhone: boolean;
        showEmail: boolean;
        showWhatsapp: boolean;
        showAddress: boolean;
        contactIntro: string | null;
        formHelperText: string | null;
        successMessage: string | null;
        consentText: string | null;
    };
};

export default function SettingsContact({ contact }: SettingsContactProps) {
    const form = useForm({
        business_name: contact.businessName ?? '',
        phone_primary: contact.phonePrimary ?? '',
        phone_secondary: contact.phoneSecondary ?? '',
        email_primary: contact.emailPrimary ?? '',
        email_secondary: contact.emailSecondary ?? '',
        whatsapp_number: contact.whatsappNumber ?? '',
        show_phone: contact.showPhone,
        show_email: contact.showEmail,
        show_whatsapp: contact.showWhatsapp,
        show_address: contact.showAddress,
        contact_intro: contact.contactIntro ?? '',
        form_helper_text: contact.formHelperText ?? '',
        success_message: contact.successMessage ?? '',
        consent_text: contact.consentText ?? '',
    });

    return (
        <>
            <Head title="Contact Settings" />
            <AdminShell title="Contact Settings" description="Manage public contact fields and inquiry helper copy without inventing missing business details.">
                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.patch('/admin/pages/contact');
                    }}
                >
                    <PagePanel>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field><Label>Business name</Label><FormInput value={form.data.business_name} onChange={(event) => form.setData('business_name', event.target.value)} /></Field>
                            <Field><Label>Primary phone</Label><FormInput value={form.data.phone_primary} onChange={(event) => form.setData('phone_primary', event.target.value)} /></Field>
                            <Field><Label>Primary email</Label><FormInput value={form.data.email_primary} onChange={(event) => form.setData('email_primary', event.target.value)} /></Field>
                            <Field><Label>WhatsApp</Label><FormInput value={form.data.whatsapp_number} onChange={(event) => form.setData('whatsapp_number', event.target.value)} /></Field>
                            <Field className="lg:col-span-2"><Label>Contact intro</Label><FormTextarea rows={3} value={form.data.contact_intro} onChange={(event) => form.setData('contact_intro', event.target.value)} /></Field>
                            <Field className="lg:col-span-2"><Label>Form helper text</Label><FormTextarea rows={3} value={form.data.form_helper_text} onChange={(event) => form.setData('form_helper_text', event.target.value)} /></Field>
                            <Field className="lg:col-span-2"><Label>Consent text</Label><FormTextarea rows={3} value={form.data.consent_text} onChange={(event) => form.setData('consent_text', event.target.value)} /></Field>
                        </div>
                    </PagePanel>
                    <Button type="submit">Save contact settings</Button>
                </form>
            </AdminShell>
        </>
    );
}
