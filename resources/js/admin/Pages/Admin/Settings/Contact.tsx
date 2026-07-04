import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormCheckbox, FormInput, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import { Plus, Trash2 } from 'lucide-react';

type ContactSocialLink = {
    label: string;
    url: string;
};

type SettingsContactProps = {
    contact: {
        businessName: string | null;
        phonePrimary: string | null;
        phoneSecondary: string | null;
        emailPrimary: string | null;
        emailSecondary: string | null;
        whatsappNumber: string | null;
        whatsappText: string | null;
        pageTitle: string | null;
        pageIntro: string | null;
        formTitle: string | null;
        submitLabel: string | null;
        inquiryTypeOptions: string[];
        locationKicker: string | null;
        locationTitle: string | null;
        locationBody: string | null;
        addressLabel: string | null;
        mapEmbedUrl: string | null;
        mapLinkUrl: string | null;
        contactSocialLinks: ContactSocialLink[];
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
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
        whatsapp_text: contact.whatsappText ?? '',
        page_title: contact.pageTitle ?? '',
        page_intro: contact.pageIntro ?? '',
        form_title: contact.formTitle ?? '',
        submit_label: contact.submitLabel ?? '',
        inquiry_type_options:
            contact.inquiryTypeOptions?.length > 0
                ? contact.inquiryTypeOptions
                : ['Home furniture', 'Office furniture', 'Custom wooden art'],
        location_kicker: contact.locationKicker ?? '',
        location_title: contact.locationTitle ?? '',
        location_body: contact.locationBody ?? '',
        address_label: contact.addressLabel ?? '',
        map_embed_url: contact.mapEmbedUrl ?? '',
        map_link_url: contact.mapLinkUrl ?? '',
        contact_social_links:
            contact.contactSocialLinks?.length > 0
                ? contact.contactSocialLinks
                : [{ label: 'WhatsApp', url: '' }],
        address_line_1: contact.addressLine1 ?? '',
        address_line_2: contact.addressLine2 ?? '',
        city: contact.city ?? '',
        state: contact.state ?? '',
        postal_code: contact.postalCode ?? '',
        country: contact.country ?? '',
        show_phone: contact.showPhone,
        show_email: contact.showEmail,
        show_whatsapp: contact.showWhatsapp,
        show_address: contact.showAddress,
        contact_intro: contact.contactIntro ?? '',
        form_helper_text: contact.formHelperText ?? '',
        success_message: contact.successMessage ?? '',
        consent_text: contact.consentText ?? '',
    });

    const setInquiryOption = (index: number, value: string) => {
        const next = [...form.data.inquiry_type_options];
        next[index] = value;
        form.setData('inquiry_type_options', next);
    };

    const removeInquiryOption = (index: number) => {
        form.setData(
            'inquiry_type_options',
            form.data.inquiry_type_options.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const setSocialLink = (index: number, field: keyof ContactSocialLink, value: string) => {
        const next = form.data.contact_social_links.map((link, itemIndex) =>
            itemIndex === index ? { ...link, [field]: value } : link,
        );

        form.setData('contact_social_links', next);
    };

    const removeSocialLink = (index: number) => {
        form.setData(
            'contact_social_links',
            form.data.contact_social_links.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    return (
        <>
            <Head title="Contact Settings" />
            <AdminShell title="Contact Settings" description="Manage the public contact page form, location, map, and social links.">
                <form
                    className="space-y-8"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.patch('/admin/pages/contact');
                    }}
                >
                    <PagePanel>
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Page and form</h2>
                            <Text>These fields control the top contact form shown to public visitors.</Text>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field>
                                <Label>Page title</Label>
                                <FormInput value={form.data.page_title} onChange={(event) => form.setData('page_title', event.target.value)} placeholder="Contact Form" />
                                <FieldError message={form.errors.page_title} />
                            </Field>
                            <Field>
                                <Label>Form title</Label>
                                <FormInput value={form.data.form_title} onChange={(event) => form.setData('form_title', event.target.value)} placeholder="Tell us about your project" />
                                <FieldError message={form.errors.form_title} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Page intro</Label>
                                <FormTextarea rows={3} value={form.data.page_intro} onChange={(event) => form.setData('page_intro', event.target.value)} />
                                <FieldError message={form.errors.page_intro} />
                            </Field>
                            <Field>
                                <Label>Submit button label</Label>
                                <FormInput value={form.data.submit_label} onChange={(event) => form.setData('submit_label', event.target.value)} placeholder="Send now" />
                                <FieldError message={form.errors.submit_label} />
                            </Field>
                            <Field>
                                <Label>Success message</Label>
                                <FormInput value={form.data.success_message} onChange={(event) => form.setData('success_message', event.target.value)} />
                                <FieldError message={form.errors.success_message} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Form helper text</Label>
                                <FormTextarea rows={3} value={form.data.form_helper_text} onChange={(event) => form.setData('form_helper_text', event.target.value)} />
                                <FieldError message={form.errors.form_helper_text} />
                            </Field>
                            <Field className="lg:col-span-2">
                                <Label>Consent text</Label>
                                <FormTextarea rows={3} value={form.data.consent_text} onChange={(event) => form.setData('consent_text', event.target.value)} />
                                <FieldError message={form.errors.consent_text} />
                            </Field>
                        </div>
                    </PagePanel>

                    <PagePanel>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Inquiry type options</h2>
                                <Text>Options shown in the contact form subject dropdown.</Text>
                            </div>
                            <Button type="button" color="light" onClick={() => form.setData('inquiry_type_options', [...form.data.inquiry_type_options, ''])}>
                                <Plus data-slot="icon" />
                                Add option
                            </Button>
                        </div>
                        <div className="grid gap-3">
                            {form.data.inquiry_type_options.map((option, index) => (
                                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                    <FormInput value={option} onChange={(event) => setInquiryOption(index, event.target.value)} placeholder="Inquiry type" />
                                    <Button type="button" plain onClick={() => removeInquiryOption(index)}>
                                        <Trash2 data-slot="icon" />
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </PagePanel>

                    <PagePanel>
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact details</h2>
                            <Text>Phone, email, WhatsApp, address, and visibility controls for the public contact page.</Text>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field><Label>Business name</Label><FormInput value={form.data.business_name} onChange={(event) => form.setData('business_name', event.target.value)} /></Field>
                            <Field><Label>Primary phone</Label><FormInput value={form.data.phone_primary} onChange={(event) => form.setData('phone_primary', event.target.value)} /></Field>
                            <Field><Label>Secondary phone</Label><FormInput value={form.data.phone_secondary} onChange={(event) => form.setData('phone_secondary', event.target.value)} /></Field>
                            <Field><Label>Primary email</Label><FormInput type="email" value={form.data.email_primary} onChange={(event) => form.setData('email_primary', event.target.value)} /></Field>
                            <Field><Label>Secondary email</Label><FormInput type="email" value={form.data.email_secondary} onChange={(event) => form.setData('email_secondary', event.target.value)} /></Field>
                            <Field><Label>WhatsApp number</Label><FormInput value={form.data.whatsapp_number} onChange={(event) => form.setData('whatsapp_number', event.target.value)} /></Field>
                            <Field className="lg:col-span-2"><Label>WhatsApp message</Label><FormInput value={form.data.whatsapp_text} onChange={(event) => form.setData('whatsapp_text', event.target.value)} /></Field>
                            <Field><Label>Address label</Label><FormInput value={form.data.address_label} onChange={(event) => form.setData('address_label', event.target.value)} placeholder="Showroom" /></Field>
                            <Field><Label>Address line 1</Label><FormInput value={form.data.address_line_1} onChange={(event) => form.setData('address_line_1', event.target.value)} /></Field>
                            <Field><Label>Address line 2</Label><FormInput value={form.data.address_line_2} onChange={(event) => form.setData('address_line_2', event.target.value)} /></Field>
                            <Field><Label>City</Label><FormInput value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} /></Field>
                            <Field><Label>State</Label><FormInput value={form.data.state} onChange={(event) => form.setData('state', event.target.value)} /></Field>
                            <Field><Label>Postal code</Label><FormInput value={form.data.postal_code} onChange={(event) => form.setData('postal_code', event.target.value)} /></Field>
                            <Field><Label>Country</Label><FormInput value={form.data.country} onChange={(event) => form.setData('country', event.target.value)} /></Field>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-4">
                            <FormCheckbox checked={form.data.show_phone} onChange={(event) => form.setData('show_phone', event.target.checked)} label="Show phone" />
                            <FormCheckbox checked={form.data.show_email} onChange={(event) => form.setData('show_email', event.target.checked)} label="Show email" />
                            <FormCheckbox checked={form.data.show_whatsapp} onChange={(event) => form.setData('show_whatsapp', event.target.checked)} label="Show WhatsApp" />
                            <FormCheckbox checked={form.data.show_address} onChange={(event) => form.setData('show_address', event.target.checked)} label="Show address" />
                        </div>
                    </PagePanel>

                    <PagePanel>
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Map and location copy</h2>
                            <Text>Add a Google Maps embed URL or a normal map link. The page falls back gracefully when empty.</Text>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Field><Label>Location kicker</Label><FormInput value={form.data.location_kicker} onChange={(event) => form.setData('location_kicker', event.target.value)} /></Field>
                            <Field><Label>Location title</Label><FormInput value={form.data.location_title} onChange={(event) => form.setData('location_title', event.target.value)} /></Field>
                            <Field className="lg:col-span-2"><Label>Location body</Label><FormTextarea rows={3} value={form.data.location_body} onChange={(event) => form.setData('location_body', event.target.value)} /></Field>
                            <Field><Label>Map embed URL</Label><FormInput type="url" value={form.data.map_embed_url} onChange={(event) => form.setData('map_embed_url', event.target.value)} placeholder="https://www.google.com/maps/embed?..." /></Field>
                            <Field><Label>Map link URL</Label><FormInput type="url" value={form.data.map_link_url} onChange={(event) => form.setData('map_link_url', event.target.value)} placeholder="https://maps.google.com/..." /></Field>
                        </div>
                    </PagePanel>

                    <PagePanel>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact page social links</h2>
                                <Text>Links shown near the contact form and location details.</Text>
                            </div>
                            <Button type="button" color="light" onClick={() => form.setData('contact_social_links', [...form.data.contact_social_links, { label: '', url: '' }])}>
                                <Plus data-slot="icon" />
                                Add link
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {form.data.contact_social_links.map((link, index) => (
                                <div key={index} className="grid gap-3 lg:grid-cols-[0.45fr_1fr_auto] lg:items-center">
                                    <FormInput value={link.label} onChange={(event) => setSocialLink(index, 'label', event.target.value)} placeholder="Instagram" />
                                    <FormInput type="url" value={link.url} onChange={(event) => setSocialLink(index, 'url', event.target.value)} placeholder="https://..." />
                                    <Button type="button" plain onClick={() => removeSocialLink(index)}>
                                        <Trash2 data-slot="icon" />
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </PagePanel>

                    <Button type="submit" disabled={form.processing}>Save contact settings</Button>
                </form>
            </AdminShell>
        </>
    );
}
