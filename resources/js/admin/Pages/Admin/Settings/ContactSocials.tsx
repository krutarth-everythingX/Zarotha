import { Head, router, useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { FieldError, FormCheckbox, FormInput, FormSelect, FormTextarea, PagePanel } from '@admin/Components/AdminPrimitives';
import { Plus, Trash2 } from 'lucide-react';

type ContactSocialLink = {
    label: string;
    url: string;
};

type ContactPayload = {
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

type SocialLink = {
    id: number;
    platform_key: string;
    label: string | null;
    url: string;
    sort_order: number;
    is_active: boolean;
};

type ContactForm = {
    business_name: string;
    phone_primary: string;
    phone_secondary: string;
    email_primary: string;
    email_secondary: string;
    whatsapp_number: string;
    whatsapp_text: string;
    page_title: string;
    page_intro: string;
    form_title: string;
    submit_label: string;
    inquiry_type_options: string[];
    location_kicker: string;
    location_title: string;
    location_body: string;
    address_label: string;
    map_embed_url: string;
    map_link_url: string;
    contact_social_links: ContactSocialLink[];
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    show_phone: boolean;
    show_email: boolean;
    show_whatsapp: boolean;
    show_address: boolean;
    contact_intro: string;
    form_helper_text: string;
    success_message: string;
    consent_text: string;
};

type SocialLinkPayload = {
    platform_key: string;
    label: string | null;
    url: string;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    contact: ContactPayload;
    links: SocialLink[];
    settings: {
        showSocialLinksOnHero: boolean;
    };
};

const AVAILABLE_PLATFORMS = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'twitter', label: 'Twitter / X' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'pinterest', label: 'Pinterest' },
    { key: 'whatsapp', label: 'WhatsApp' },
];

export default function ContactSocials({ contact, links, settings }: Props) {
    const [localLinks, setLocalLinks] = React.useState<SocialLink[]>(links);
    const [isSavingLinks, setIsSavingLinks] = React.useState(false);
    const [showHeroSocials, setShowHeroSocials] = React.useState(settings.showSocialLinksOnHero);
    const contactForm = useForm<ContactForm>({
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

    React.useEffect(() => {
        setLocalLinks(links);
    }, [links]);

    const setContactPageSocialLink = (index: number, field: keyof ContactSocialLink, value: string) => {
        contactForm.setData(
            'contact_social_links',
            contactForm.data.contact_social_links.map((link, itemIndex) =>
                itemIndex === index ? { ...link, [field]: value } : link,
            ),
        );
    };

    const addSocialLink = () => {
        const nextId = Math.min(-1, ...localLinks.map((link) => link.id)) - 1;
        setLocalLinks([
            ...localLinks,
            {
                id: nextId,
                platform_key: 'instagram',
                label: '',
                url: '',
                sort_order: localLinks.length,
                is_active: true,
            },
        ]);
    };

    const updateSocialLink = (id: number, data: Partial<SocialLink>) => {
        setLocalLinks((current) =>
            current.map((link) => (link.id === id ? { ...link, ...data } : link)),
        );
    };

    const removeSocialLink = (id: number) => {
        if (id > 0) {
            router.delete(`/admin/social-links/${id}`, {
                preserveScroll: true,
                onSuccess: () => setLocalLinks((current) => current.filter((link) => link.id !== id)),
            });
            return;
        }

        setLocalLinks((current) => current.filter((link) => link.id !== id));
    };

    const saveSocialLinks = async () => {
        setIsSavingLinks(true);
        let hasError = false;

        for (const link of localLinks) {
            if (link.url.trim() === '') {
                alert(`URL is required for ${link.platform_key || 'social link'}.`);
                hasError = true;
                break;
            }

            const payload: SocialLinkPayload = {
                platform_key: link.platform_key,
                label: link.label,
                url: link.url,
                sort_order: link.sort_order,
                is_active: link.is_active,
            };

            await new Promise<void>((resolve) => {
                const options = {
                    preserveScroll: true,
                    onError: (errors: Record<string, string>) => {
                        alert(Object.values(errors)[0] ?? `Failed to save ${link.platform_key}.`);
                        hasError = true;
                    },
                    onFinish: () => resolve(),
                };

                if (link.id < 0) {
                    router.post('/admin/social-links', payload, options);
                } else {
                    router.put(`/admin/social-links/${link.id}`, payload, options);
                }
            });

            if (hasError) {
                break;
            }
        }

        setIsSavingLinks(false);

        if (!hasError) {
            router.reload({ only: ['links'] });
        }
    };

    return (
        <>
            <Head title="Contact & Socials" />
            <AdminShell title="Contact & Socials" description="Manage footer contact details, contact page information, and public social links.">
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
                    <form
                        className="space-y-8"
                        onSubmit={(event) => {
                            event.preventDefault();
                            contactForm.patch('/admin/contact-socials/contact');
                        }}
                    >
                        <PagePanel>
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact details</h2>
                                <Text>Phone, email, WhatsApp, address, and visibility controls used across public contact areas.</Text>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <Field><Label>Business name</Label><FormInput value={contactForm.data.business_name} onChange={(event) => contactForm.setData('business_name', event.target.value)} /></Field>
                                <Field><Label>Primary phone</Label><FormInput value={contactForm.data.phone_primary} onChange={(event) => contactForm.setData('phone_primary', event.target.value)} /></Field>
                                <Field><Label>Secondary phone</Label><FormInput value={contactForm.data.phone_secondary} onChange={(event) => contactForm.setData('phone_secondary', event.target.value)} /></Field>
                                <Field><Label>Primary email</Label><FormInput type="email" value={contactForm.data.email_primary} onChange={(event) => contactForm.setData('email_primary', event.target.value)} /></Field>
                                <Field><Label>Secondary email</Label><FormInput type="email" value={contactForm.data.email_secondary} onChange={(event) => contactForm.setData('email_secondary', event.target.value)} /></Field>
                                <Field><Label>WhatsApp number</Label><FormInput value={contactForm.data.whatsapp_number} onChange={(event) => contactForm.setData('whatsapp_number', event.target.value)} /></Field>
                                <Field className="lg:col-span-2"><Label>WhatsApp message</Label><FormInput value={contactForm.data.whatsapp_text} onChange={(event) => contactForm.setData('whatsapp_text', event.target.value)} /></Field>
                                <Field><Label>Address label</Label><FormInput value={contactForm.data.address_label} onChange={(event) => contactForm.setData('address_label', event.target.value)} placeholder="Showroom" /></Field>
                                <Field><Label>Address line 1</Label><FormInput value={contactForm.data.address_line_1} onChange={(event) => contactForm.setData('address_line_1', event.target.value)} /></Field>
                                <Field><Label>Address line 2</Label><FormInput value={contactForm.data.address_line_2} onChange={(event) => contactForm.setData('address_line_2', event.target.value)} /></Field>
                                <Field><Label>City</Label><FormInput value={contactForm.data.city} onChange={(event) => contactForm.setData('city', event.target.value)} /></Field>
                                <Field><Label>State</Label><FormInput value={contactForm.data.state} onChange={(event) => contactForm.setData('state', event.target.value)} /></Field>
                                <Field><Label>Postal code</Label><FormInput value={contactForm.data.postal_code} onChange={(event) => contactForm.setData('postal_code', event.target.value)} /></Field>
                                <Field><Label>Country</Label><FormInput value={contactForm.data.country} onChange={(event) => contactForm.setData('country', event.target.value)} /></Field>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-4">
                                <FormCheckbox checked={contactForm.data.show_phone} onChange={(event) => contactForm.setData('show_phone', event.target.checked)} label="Show phone" />
                                <FormCheckbox checked={contactForm.data.show_email} onChange={(event) => contactForm.setData('show_email', event.target.checked)} label="Show email" />
                                <FormCheckbox checked={contactForm.data.show_whatsapp} onChange={(event) => contactForm.setData('show_whatsapp', event.target.checked)} label="Show WhatsApp" />
                                <FormCheckbox checked={contactForm.data.show_address} onChange={(event) => contactForm.setData('show_address', event.target.checked)} label="Show address" />
                            </div>
                        </PagePanel>

                        <PagePanel>
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact page copy</h2>
                                <Text>Headings, helper text, map links, and form messaging for the public contact page.</Text>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <Field><Label>Page title</Label><FormInput value={contactForm.data.page_title} onChange={(event) => contactForm.setData('page_title', event.target.value)} /><FieldError message={contactForm.errors.page_title} /></Field>
                                <Field><Label>Form title</Label><FormInput value={contactForm.data.form_title} onChange={(event) => contactForm.setData('form_title', event.target.value)} /><FieldError message={contactForm.errors.form_title} /></Field>
                                <Field className="lg:col-span-2"><Label>Page intro</Label><FormTextarea rows={3} value={contactForm.data.page_intro} onChange={(event) => contactForm.setData('page_intro', event.target.value)} /><FieldError message={contactForm.errors.page_intro} /></Field>
                                <Field><Label>Submit button label</Label><FormInput value={contactForm.data.submit_label} onChange={(event) => contactForm.setData('submit_label', event.target.value)} /><FieldError message={contactForm.errors.submit_label} /></Field>
                                <Field><Label>Success message</Label><FormInput value={contactForm.data.success_message} onChange={(event) => contactForm.setData('success_message', event.target.value)} /><FieldError message={contactForm.errors.success_message} /></Field>
                                <Field className="lg:col-span-2"><Label>Form helper text</Label><FormTextarea rows={3} value={contactForm.data.form_helper_text} onChange={(event) => contactForm.setData('form_helper_text', event.target.value)} /><FieldError message={contactForm.errors.form_helper_text} /></Field>
                                <Field className="lg:col-span-2"><Label>Consent text</Label><FormTextarea rows={3} value={contactForm.data.consent_text} onChange={(event) => contactForm.setData('consent_text', event.target.value)} /><FieldError message={contactForm.errors.consent_text} /></Field>
                                <Field><Label>Location kicker</Label><FormInput value={contactForm.data.location_kicker} onChange={(event) => contactForm.setData('location_kicker', event.target.value)} /></Field>
                                <Field><Label>Location title</Label><FormInput value={contactForm.data.location_title} onChange={(event) => contactForm.setData('location_title', event.target.value)} /></Field>
                                <Field className="lg:col-span-2"><Label>Location body</Label><FormTextarea rows={3} value={contactForm.data.location_body} onChange={(event) => contactForm.setData('location_body', event.target.value)} /></Field>
                                <Field><Label>Map embed URL</Label><FormInput type="url" value={contactForm.data.map_embed_url} onChange={(event) => contactForm.setData('map_embed_url', event.target.value)} placeholder="https://www.google.com/maps/embed?..." /></Field>
                                <Field><Label>Map link URL</Label><FormInput type="url" value={contactForm.data.map_link_url} onChange={(event) => contactForm.setData('map_link_url', event.target.value)} placeholder="https://maps.google.com/..." /></Field>
                            </div>
                        </PagePanel>

                        <PagePanel>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Contact page social links</h2>
                                    <Text>Optional links shown on the public contact page.</Text>
                                </div>
                                <Button type="button" color="light" onClick={() => contactForm.setData('contact_social_links', [...contactForm.data.contact_social_links, { label: '', url: '' }])}>
                                    <Plus data-slot="icon" />
                                    Add link
                                </Button>
                            </div>
                            <div className="grid gap-4">
                                {contactForm.data.contact_social_links.map((link, index) => (
                                    <div key={index} className="grid gap-3 lg:grid-cols-[0.45fr_1fr_auto] lg:items-center">
                                        <FormInput value={link.label} onChange={(event) => setContactPageSocialLink(index, 'label', event.target.value)} placeholder="Instagram" />
                                        <FormInput type="url" value={link.url} onChange={(event) => setContactPageSocialLink(index, 'url', event.target.value)} placeholder="https://..." />
                                        <Button
                                            type="button"
                                            plain
                                            onClick={() =>
                                                contactForm.setData(
                                                    'contact_social_links',
                                                    contactForm.data.contact_social_links.filter((_, itemIndex) => itemIndex !== index),
                                                )
                                            }
                                        >
                                            <Trash2 data-slot="icon" />
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </PagePanel>

                        <Button type="submit" disabled={contactForm.processing}>Save contact info</Button>
                    </form>

                    <div className="space-y-8">
                        <PagePanel>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Public social links</h2>
                                    <Text>Active links appear in public social link areas such as the footer.</Text>
                                </div>
                                <Button type="button" color="light" onClick={addSocialLink}>
                                    <Plus data-slot="icon" />
                                    Add link
                                </Button>
                            </div>

                            <label className="mb-5 inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                                <input
                                    type="checkbox"
                                    checked={showHeroSocials}
                                    onChange={(event) => {
                                        const checked = event.target.checked;
                                        setShowHeroSocials(checked);
                                        router.patch('/admin/social-links/settings', {
                                            show_social_links_on_hero: checked,
                                        }, {
                                            preserveScroll: true,
                                        });
                                    }}
                                />
                                Show active social links on homepage hero
                            </label>

                            <div className="space-y-4">
                                {localLinks.map((link, index) => (
                                    <div key={link.id} className="space-y-3 rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                        <div className="grid gap-3">
                                            <Field>
                                                <Label>Platform</Label>
                                                <FormSelect value={link.platform_key} onChange={(event) => updateSocialLink(link.id, { platform_key: event.target.value })}>
                                                    {AVAILABLE_PLATFORMS.map((platform) => (
                                                        <option key={platform.key} value={platform.key}>{platform.label}</option>
                                                    ))}
                                                </FormSelect>
                                            </Field>
                                            <Field>
                                                <Label>URL</Label>
                                                <FormInput value={link.url} onChange={(event) => updateSocialLink(link.id, { url: event.target.value })} placeholder="https://..." />
                                            </Field>
                                            <Field>
                                                <Label>Sort order</Label>
                                                <FormInput type="number" value={link.sort_order} onChange={(event) => updateSocialLink(link.id, { sort_order: Number(event.target.value) })} />
                                            </Field>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={link.is_active}
                                                    onChange={(event) => updateSocialLink(link.id, { is_active: event.target.checked })}
                                                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
                                            </label>
                                            <Button type="button" plain onClick={() => removeSocialLink(link.id)}>
                                                <Trash2 data-slot="icon" />
                                                Remove
                                            </Button>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Saved as item {index + 1}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button type="button" onClick={saveSocialLinks} disabled={isSavingLinks}>
                                    Save social links
                                </Button>
                            </div>
                        </PagePanel>
                    </div>
                </div>
            </AdminShell>
        </>
    );
}
