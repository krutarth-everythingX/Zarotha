import { Head, useForm } from "@inertiajs/react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    EditableTable,
    EditableTableBody,
    EditableTableCell,
    EditableTableHead,
    EditableTableHeader,
    FieldError,
    findActiveAdminSection,
    FormInput,
    FormTextarea,
    getAdminScrollContainer,
    MobileSettingsListItem,
    MobileSettingsScreen,
    PagePanel,
    SettingsSectionLayout,
    SettingsSubsectionTabs,
    scrollToAdminSection,
} from "@admin/Components/AdminPrimitives";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

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

const sectionLinks = [
    { id: "page-copy", label: "Page copy" },
    { id: "inquiry-form", label: "Inquiry form" },
    { id: "contact-details", label: "Contact details" },
    { id: "social-map", label: "Socials and map" },
] as const;

type SectionId = (typeof sectionLinks)[number]["id"];

const defaultInquiryOptions = [
    "Home furniture",
    "Office furniture",
    "Custom wooden art",
    "Commercial project",
    "General inquiry",
];

export default function SettingsContact({ contact }: SettingsContactProps) {
    const [activeSection, setActiveSection] = useState<SectionId>(
        sectionLinks[0].id,
    );

    const form = useForm<ContactForm>({
        business_name: contact.businessName ?? "",
        phone_primary: contact.phonePrimary ?? "",
        phone_secondary: contact.phoneSecondary ?? "",
        email_primary: contact.emailPrimary ?? "",
        email_secondary: contact.emailSecondary ?? "",
        whatsapp_number: contact.whatsappNumber ?? "",
        whatsapp_text: contact.whatsappText ?? "",
        page_title: contact.pageTitle ?? "",
        page_intro: contact.pageIntro ?? "",
        form_title: contact.formTitle ?? "",
        submit_label: contact.submitLabel ?? "",
        inquiry_type_options:
            contact.inquiryTypeOptions?.length > 0
                ? contact.inquiryTypeOptions
                : defaultInquiryOptions,
        location_kicker: contact.locationKicker ?? "",
        location_title: contact.locationTitle ?? "",
        location_body: contact.locationBody ?? "",
        address_label: contact.addressLabel ?? "",
        map_embed_url: contact.mapEmbedUrl ?? "",
        map_link_url: contact.mapLinkUrl ?? "",
        contact_social_links:
            contact.contactSocialLinks?.length > 0
                ? contact.contactSocialLinks
                : [],
        address_line_1: contact.addressLine1 ?? "",
        address_line_2: contact.addressLine2 ?? "",
        city: contact.city ?? "",
        state: contact.state ?? "",
        postal_code: contact.postalCode ?? "",
        country: contact.country ?? "",
        show_phone: true,
        show_email: true,
        show_whatsapp: true,
        show_address: true,
        contact_intro: contact.contactIntro ?? "",
        form_helper_text: contact.formHelperText ?? "",
        success_message: contact.successMessage ?? "",
        consent_text: contact.consentText ?? "",
    });

    const save = () => form.patch("/admin/settings/contact");

    useEffect(() => {
        const handleScroll = () => {
            const nextSection = findActiveAdminSection(sectionLinks);

            if (nextSection) {
                setActiveSection(nextSection);
            }
        };

        const scrollContainer = getAdminScrollContainer();
        const scrollTarget = scrollContainer ?? window;

        handleScroll();
        scrollTarget.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => scrollTarget.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: SectionId) => {
        setActiveSection(id);
        scrollToAdminSection(id);
    };

    const setInquiryOption = (index: number, value: string) => {
        const next = [...form.data.inquiry_type_options];
        next[index] = value;
        form.setData("inquiry_type_options", next);
    };

    const setContactSocialLink = (
        index: number,
        field: keyof ContactSocialLink,
        value: string,
    ) => {
        form.setData(
            "contact_social_links",
            form.data.contact_social_links.map((link, itemIndex) =>
                itemIndex === index ? { ...link, [field]: value } : link,
            ),
        );
    };

    return (
        <>
            <Head title="Contact Settings" />
            <AdminShell
                title="Contact Settings"
                description="Manage the public contact page, inquiry form, contact details, social links, and map."
                containedScroll
                mobileTitle="Contact"
                mobileDescription="Manage public contact page details."
                actions={
                    <Button type="button" onClick={save} disabled={form.processing}>
                        {form.processing ? "Saving" : "Save contact settings"}
                    </Button>
                }
            >
                <SettingsSectionLayout
                    active="contact"
                    contentClassName="min-h-0 space-y-8"
                >
                    <MobileSettingsScreen>
                        {sectionLinks.map((section) => (
                            <MobileSettingsListItem
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                            >
                                {section.label}
                            </MobileSettingsListItem>
                        ))}
                    </MobileSettingsScreen>

                    <form
                        className="space-y-8"
                        onSubmit={(event) => {
                            event.preventDefault();
                            save();
                        }}
                    >
                        <div className="sticky top-0 z-20 hidden bg-white/95 py-2 backdrop-blur-sm md:block dark:bg-transparent">
                            <SettingsSubsectionTabs
                                activeSection={activeSection}
                                label="Contact Sections"
                                sections={sectionLinks}
                                onSelect={scrollToSection}
                                className="dark:border-transparent dark:bg-transparent dark:shadow-none"
                            />
                        </div>

                        <div id="page-copy" className="scroll-mt-24">
                        <PagePanel>
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                    Page copy
                                </h2>
                                <Text>
                                    Heading and short intro shown above the contact page layout.
                                </Text>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <Field>
                                    <Label>Page title</Label>
                                    <FormInput
                                        value={form.data.page_title}
                                        onChange={(event) =>
                                            form.setData("page_title", event.target.value)
                                        }
                                        placeholder="Contact Us"
                                    />
                                    <FieldError message={form.errors.page_title} />
                                </Field>
                                <Field className="lg:col-span-2">
                                    <Label>Page intro</Label>
                                    <FormTextarea
                                        rows={3}
                                        value={form.data.page_intro}
                                        onChange={(event) =>
                                            form.setData("page_intro", event.target.value)
                                        }
                                        placeholder="Share your inquiry and we will get back to you shortly."
                                    />
                                    <FieldError message={form.errors.page_intro} />
                                </Field>
                            </div>
                        </PagePanel>
                        </div>

                        <div id="inquiry-form" className="scroll-mt-24">
                        <PagePanel>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                        Inquiry form
                                    </h2>
                                    <Text>
                                        The public form uses name, optional email, required phone,
                                        inquiry type, and message.
                                    </Text>
                                </div>
                                <Button
                                    type="button"
                                    color="light"
                                    onClick={() =>
                                        form.setData("inquiry_type_options", [
                                            ...form.data.inquiry_type_options,
                                            "",
                                        ])
                                    }
                                >
                                    <Plus data-slot="icon" />
                                    Add type
                                </Button>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <Field>
                                    <Label>Form title</Label>
                                    <FormInput
                                        value={form.data.form_title}
                                        onChange={(event) =>
                                            form.setData("form_title", event.target.value)
                                        }
                                        placeholder="Send an inquiry"
                                    />
                                    <FieldError message={form.errors.form_title} />
                                </Field>
                                <Field>
                                    <Label>Submit button label</Label>
                                    <FormInput
                                        value={form.data.submit_label}
                                        onChange={(event) =>
                                            form.setData(
                                                "submit_label",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Send Inquiry"
                                    />
                                    <FieldError message={form.errors.submit_label} />
                                </Field>
                                <Field className="lg:col-span-2">
                                    <Label>Form helper text</Label>
                                    <FormTextarea
                                        rows={3}
                                        value={form.data.form_helper_text}
                                        onChange={(event) =>
                                            form.setData(
                                                "form_helper_text",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        message={form.errors.form_helper_text}
                                    />
                                </Field>
                            </div>

                            <div className="mt-5">
                                <EditableTable minWidth="34rem">
                                    <colgroup>
                                        <col className="w-[90px]" />
                                        <col />
                                        <col className="w-[120px]" />
                                    </colgroup>
                                    <EditableTableHead>
                                        <EditableTableHeader>Item</EditableTableHeader>
                                        <EditableTableHeader>
                                            Inquiry type
                                        </EditableTableHeader>
                                        <EditableTableHeader className="text-right">
                                            Actions
                                        </EditableTableHeader>
                                    </EditableTableHead>
                                    <EditableTableBody>
                                        {form.data.inquiry_type_options.map(
                                            (option, index) => (
                                                <tr key={index}>
                                                    <EditableTableCell>
                                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                            #{index + 1}
                                                        </p>
                                                    </EditableTableCell>
                                                    <EditableTableCell>
                                                        <FormInput
                                                            value={option}
                                                            onChange={(event) =>
                                                                setInquiryOption(
                                                                    index,
                                                                    event.target.value,
                                                                )
                                                            }
                                                            placeholder="General inquiry"
                                                        />
                                                    </EditableTableCell>
                                                    <EditableTableCell className="text-right">
                                                        <Button
                                                            type="button"
                                                            plain
                                                            onClick={() =>
                                                                form.setData(
                                                                    "inquiry_type_options",
                                                                    form.data.inquiry_type_options.filter(
                                                                        (_, itemIndex) =>
                                                                            itemIndex !==
                                                                            index,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <Trash2 data-slot="icon" />
                                                            Remove
                                                        </Button>
                                                    </EditableTableCell>
                                                </tr>
                                            ),
                                        )}
                                    </EditableTableBody>
                                </EditableTable>
                            </div>
                        </PagePanel>
                        </div>

                        <div id="contact-details" className="scroll-mt-24">
                        <PagePanel>
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                    Contact details
                                </h2>
                                <Text>
                                    Business name, email, phone, WhatsApp, and address shown beside
                                    the form.
                                </Text>
                            </div>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <Field>
                                    <Label>Business name</Label>
                                    <FormInput
                                        value={form.data.business_name}
                                        onChange={(event) =>
                                            form.setData(
                                                "business_name",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Zarokha Wooden Arts"
                                    />
                                    <FieldError message={form.errors.business_name} />
                                </Field>
                                <Field>
                                    <Label>Short line under business name</Label>
                                    <FormInput
                                        value={form.data.contact_intro}
                                        onChange={(event) =>
                                            form.setData(
                                                "contact_intro",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="A short supporting line for the left contact details section"
                                    />
                                    <FieldError message={form.errors.contact_intro} />
                                </Field>
                                <Field>
                                    <Label>Primary email</Label>
                                    <FormInput
                                        type="email"
                                        value={form.data.email_primary}
                                        onChange={(event) =>
                                            form.setData(
                                                "email_primary",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.email_primary} />
                                </Field>
                                <Field>
                                    <Label>Primary phone</Label>
                                    <FormInput
                                        value={form.data.phone_primary}
                                        onChange={(event) =>
                                            form.setData(
                                                "phone_primary",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.phone_primary} />
                                </Field>
                                <Field>
                                    <Label>WhatsApp number</Label>
                                    <FormInput
                                        value={form.data.whatsapp_number}
                                        onChange={(event) =>
                                            form.setData(
                                                "whatsapp_number",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.whatsapp_number} />
                                </Field>
                                <Field className="lg:col-span-2">
                                    <Label>WhatsApp message</Label>
                                    <FormInput
                                        value={form.data.whatsapp_text}
                                        onChange={(event) =>
                                            form.setData(
                                                "whatsapp_text",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.whatsapp_text} />
                                </Field>
                                <Field>
                                    <Label>Address label</Label>
                                    <FormInput
                                        value={form.data.address_label}
                                        onChange={(event) =>
                                            form.setData(
                                                "address_label",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Address"
                                    />
                                    <FieldError message={form.errors.address_label} />
                                </Field>
                                <Field>
                                    <Label>Address line 1</Label>
                                    <FormInput
                                        value={form.data.address_line_1}
                                        onChange={(event) =>
                                            form.setData(
                                                "address_line_1",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.address_line_1} />
                                </Field>
                                <Field>
                                    <Label>Address line 2</Label>
                                    <FormInput
                                        value={form.data.address_line_2}
                                        onChange={(event) =>
                                            form.setData(
                                                "address_line_2",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.address_line_2} />
                                </Field>
                                <Field>
                                    <Label>City</Label>
                                    <FormInput
                                        value={form.data.city}
                                        onChange={(event) =>
                                            form.setData("city", event.target.value)
                                        }
                                    />
                                    <FieldError message={form.errors.city} />
                                </Field>
                                <Field>
                                    <Label>State</Label>
                                    <FormInput
                                        value={form.data.state}
                                        onChange={(event) =>
                                            form.setData("state", event.target.value)
                                        }
                                    />
                                    <FieldError message={form.errors.state} />
                                </Field>
                                <Field>
                                    <Label>Postal code</Label>
                                    <FormInput
                                        value={form.data.postal_code}
                                        onChange={(event) =>
                                            form.setData(
                                                "postal_code",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError message={form.errors.postal_code} />
                                </Field>
                                <Field>
                                    <Label>Country</Label>
                                    <FormInput
                                        value={form.data.country}
                                        onChange={(event) =>
                                            form.setData("country", event.target.value)
                                        }
                                    />
                                    <FieldError message={form.errors.country} />
                                </Field>
                            </div>
                        </PagePanel>
                        </div>

                        <div id="social-map" className="scroll-mt-24">
                        <PagePanel>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                        Socials and map
                                    </h2>
                                    <Text>
                                        Add social links and the map URLs used by the
                                        clickable map preview.
                                    </Text>
                                </div>
                                <Button
                                    type="button"
                                    color="light"
                                    onClick={() =>
                                        form.setData("contact_social_links", [
                                            ...form.data.contact_social_links,
                                            { label: "", url: "" },
                                        ])
                                    }
                                >
                                    <Plus data-slot="icon" />
                                    Add link
                                </Button>
                            </div>
                            <div className="mb-5 grid gap-4 lg:grid-cols-2">
                                <Field>
                                    <Label>Map embed URL</Label>
                                    <FormInput
                                        type="url"
                                        value={form.data.map_embed_url}
                                        onChange={(event) =>
                                            form.setData(
                                                "map_embed_url",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                    <FieldError message={form.errors.map_embed_url} />
                                </Field>
                                <Field>
                                    <Label>Map link URL</Label>
                                    <FormInput
                                        type="url"
                                        value={form.data.map_link_url}
                                        onChange={(event) =>
                                            form.setData(
                                                "map_link_url",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://maps.google.com/..."
                                    />
                                    <FieldError message={form.errors.map_link_url} />
                                </Field>
                            </div>
                            <EditableTable minWidth="44rem">
                                <colgroup>
                                    <col className="w-[90px]" />
                                    <col className="w-[220px]" />
                                    <col />
                                    <col className="w-[120px]" />
                                </colgroup>
                                <EditableTableHead>
                                    <EditableTableHeader>Item</EditableTableHeader>
                                    <EditableTableHeader>Label</EditableTableHeader>
                                    <EditableTableHeader>URL</EditableTableHeader>
                                    <EditableTableHeader className="text-right">
                                        Actions
                                    </EditableTableHeader>
                                </EditableTableHead>
                                <EditableTableBody>
                                    {form.data.contact_social_links.map(
                                        (link, index) => (
                                            <tr key={index}>
                                                <EditableTableCell>
                                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                        #{index + 1}
                                                    </p>
                                                </EditableTableCell>
                                                <EditableTableCell>
                                                    <FormInput
                                                        value={link.label}
                                                        onChange={(event) =>
                                                            setContactSocialLink(
                                                                index,
                                                                "label",
                                                                event.target.value,
                                                            )
                                                        }
                                                        placeholder="Instagram"
                                                    />
                                                </EditableTableCell>
                                                <EditableTableCell>
                                                    <FormInput
                                                        type="url"
                                                        value={link.url}
                                                        onChange={(event) =>
                                                            setContactSocialLink(
                                                                index,
                                                                "url",
                                                                event.target.value,
                                                            )
                                                        }
                                                        placeholder="https://..."
                                                    />
                                                </EditableTableCell>
                                                <EditableTableCell className="text-right">
                                                    <Button
                                                        type="button"
                                                        plain
                                                        onClick={() =>
                                                            form.setData(
                                                                "contact_social_links",
                                                                form.data.contact_social_links.filter(
                                                                    (_, itemIndex) =>
                                                                        itemIndex !==
                                                                        index,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2 data-slot="icon" />
                                                        Remove
                                                    </Button>
                                                </EditableTableCell>
                                            </tr>
                                        ),
                                    )}
                                </EditableTableBody>
                            </EditableTable>
                        </PagePanel>
                        </div>
                    </form>
                </SettingsSectionLayout>
            </AdminShell>
        </>
    );
}
