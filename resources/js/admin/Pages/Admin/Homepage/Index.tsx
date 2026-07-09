import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
    EditableTable,
    EditableTableBody,
    EditableTableCell,
    EditableTableHead,
    EditableTableHeader,
    FieldError,
    FormInput,
    FormTextarea,
    MobileSettingsBreadcrumbs,
    MobileSettingsListItem,
    MobileSettingsScreen,
    MobileTableList,
    MobileTableRow,
    PagePanel,
    SettingsSectionLayout,
    SettingsSubsectionTabs,
    StatusBadge,
    findActiveAdminSection,
    getAdminScrollContainer,
    mobileSettingsLinks,
    scrollToAdminSection,
} from "@admin/Components/AdminPrimitives";
import { HeroSection } from "./Components/HeroSection";
import { LatestProducts } from "./Components/LatestProducts";
import { QuickInquiry } from "./Components/QuickInquiry";
import {
    MediaDropSelect,
    type MediaOption as UploadMediaOption,
} from "@admin/Components/MediaDropSelect";

type MediaOption = UploadMediaOption;

type MediaReference = MediaOption | null;

type HeroPayload = {
    heading: string;
    subtext: string | null;
    desktopMediaId: number | null;
    mobileMediaId: number | null;
    primaryButtonLabel: string | null;
    primaryButtonUrl: string | null;
    secondaryButtonLabel: string | null;
    secondaryButtonUrl: string | null;
    overlayOpacity: number;
    backgroundColor: string | null;
    textTheme: "light" | "dark";
    isVisible: boolean;
    items: BannerPayload[];
};

type BannerPayload = {
    id: number;
    imageMediaId: number | null;
    sortOrder: number;
    isVisible: boolean;
    imageMedia: MediaReference;
};

type SectionPayload = {
    eyebrow: string | null;
    title: string | null;
    subtitle: string | null;
    body: string | null;
    viewAllLabel: string | null;
    viewAllUrl: string | null;
    primaryButtonLabel: string | null;
    primaryButtonUrl: string | null;
    secondaryButtonLabel: string | null;
    secondaryButtonUrl: string | null;
    buttonLabel: string | null;
    buttonUrl: string | null;
    maxItems: number;
    backgroundMediaId: number | null;
    backgroundMedia: MediaReference;
    backgroundColor: string | null;
    isVisible: boolean;
};

type ContentItemPayload = {
    id: number;
    heading: string;
    bodyText: string | null;
    sortOrder: number;
    isActive: boolean;
};

type ContentSectionPayload = SectionPayload & {
    items: ContentItemPayload[];
};

type HomepagePayload = {
    hero: HeroPayload;
    turnkey: ContentSectionPayload;
    aboutPreview: ContentSectionPayload;
    industryStats: ContentSectionPayload;
    latest: SectionPayload;
    quickInquiry: SectionPayload & {
        items: BannerPayload[];
    };
};

type SettingsPayload = {
    show_whatsapp: boolean;
    whatsapp_text: string;
    whatsapp_number: string;
};

type HomepageIndexProps = {
    homepage: HomepagePayload;
    settings: SettingsPayload;
    mediaOptions: MediaOption[];
};

type ContentItemForm = {
    id?: number;
    heading: string;
    body_text: string;
    sort_order: number;
    is_active: boolean;
};

type HomepageForm = {
    hero: {
        heading: string;
        subtext: string;
        desktop_media_id: number | "";
        mobile_media_id: number | "";
        primary_button_label: string;
        primary_button_url: string;
        secondary_button_label: string;
        secondary_button_url: string;
        overlay_opacity: number;
        background_color: string;
        text_theme: "light" | "dark";
        is_visible: boolean;
        items: Array<{
            id?: number;
            imageMediaId: number | "";
            sortOrder: number;
            isVisible: boolean;
        }>;
    };
    settings: SettingsPayload;
    turnkey: {
        eyebrow: string;
        title: string;
        subtitle: string;
        button_url: string;
        is_visible: boolean;
        items: ContentItemForm[];
    };
    aboutPreview: {
        eyebrow: string;
        title: string;
        subtitle: string;
        body: string;
        primary_button_label: string;
        primary_button_url: string;
        secondary_button_label: string;
        secondary_button_url: string;
        background_media_id: number | "";
        is_visible: boolean;
        points: ContentItemForm[];
    };
    industryStats: {
        title: string;
        highlight: string;
        subtitle: string;
        body: string;
        contact_label: string;
        contact_url: string;
        more_label: string;
        more_url: string;
        is_visible: boolean;
        items: ContentItemForm[];
    };
    latest: {
        title: string;
        subtitle: string;
        max_items: number;
        view_all_label: string;
        view_all_url: string;
        is_visible: boolean;
    };
    quickInquiry: {
        title: string;
        subtitle: string;
        button_label: string;
        button_url: string;
        background_media_id: number | "";
        background_color: string;
        is_visible: boolean;
        items: Array<{
            id?: number;
            imageMediaId: number | "";
            sortOrder: number;
            isVisible: boolean;
        }>;
    };
};

function emptyToId(value: number | null): number | "" {
    return value ?? "";
}

function imageFor(mediaOptions: MediaOption[], id: number | "") {
    return id === ""
        ? null
        : (mediaOptions.find((media) => media.id === id) ?? null);
}

function ToggleField({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="inline-flex h-[38px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-zinc-950/10 bg-white px-3 py-0 text-sm font-medium text-zinc-700 transition hover:border-zinc-950/20 sm:w-auto dark:border-white/10 dark:bg-zinc-950/30 dark:text-zinc-300 dark:hover:border-white/20">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="sr-only"
            />
            <span>{label}</span>
            <span
                aria-hidden="true"
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    checked
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-zinc-300 dark:bg-zinc-700"
                }`}
            >
                <span
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
            </span>
        </label>
    );
}

function FieldHint({ children }: { children: ReactNode }) {
    return (
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {children}
        </p>
    );
}

function singularLabel(label: string) {
    return label.endsWith("s") ? label.slice(0, -1) : label;
}

function contentItemMobileSubtitle({
    bodyLabel,
    item,
    itemLabel,
    showBody,
}: {
    bodyLabel: string;
    item: ContentItemForm;
    itemLabel: string;
    showBody: boolean;
}) {
    const bodyText = item.body_text.trim();

    if (showBody && bodyText !== "") {
        return bodyText;
    }

    if (showBody) {
        return `${bodyLabel} not set`;
    }

    return singularLabel(itemLabel);
}

function ContentItemsTable({
    addLabel,
    emptyTitle,
    emptyDescription,
    errors,
    headingLabel,
    itemLabel,
    items,
    onAdd,
    onChange,
    onRemove,
    showBody = true,
    bodyLabel = "Text",
    errorPrefix,
}: {
    addLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    errors: Record<string, string | undefined>;
    headingLabel: string;
    itemLabel: string;
    items: ContentItemForm[];
    onAdd: () => void;
    onChange: (index: number, item: ContentItemForm) => void;
    onRemove: (index: number) => void;
    showBody?: boolean;
    bodyLabel?: string;
    errorPrefix: string;
}) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedItem =
        selectedIndex === null ? null : (items[selectedIndex] ?? null);

    return (
        <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    {itemLabel}
                </h3>
                <Button type="button" color="light" onClick={onAdd}>
                    <Plus data-slot="icon" />
                    {addLabel}
                </Button>
            </div>

            {items.length > 0 ? (
                <>
                    <MobileTableList className="gap-3 p-0">
                        {items.map((item, index) => (
                            <MobileTableRow
                                key={item.id ?? `${errorPrefix}-card-${index}`}
                                number={index + 1}
                                title={item.heading || `${itemLabel} item`}
                                subtitle={contentItemMobileSubtitle({
                                    bodyLabel,
                                    item,
                                    itemLabel,
                                    showBody,
                                })}
                                badge={
                                    <StatusBadge
                                        tone={
                                            item.is_active ? "green" : "amber"
                                        }
                                    >
                                        {item.is_active ? "Visible" : "Hidden"}
                                    </StatusBadge>
                                }
                                onOpen={() => setSelectedIndex(index)}
                            />
                        ))}
                    </MobileTableList>

                    <div className="hidden md:block">
                        <EditableTable minWidth="100%">
                            <colgroup>
                                <col className="w-[96px]" />
                                <col />
                                {showBody ? <col /> : null}
                                <col className="w-[140px]" />
                                <col className="w-[150px]" />
                                <col className="w-[120px]" />
                            </colgroup>
                            <EditableTableHead>
                                <EditableTableHeader>Item</EditableTableHeader>
                                <EditableTableHeader>
                                    {headingLabel}
                                </EditableTableHeader>
                                {showBody ? (
                                    <EditableTableHeader>
                                        {bodyLabel}
                                    </EditableTableHeader>
                                ) : null}
                                <EditableTableHeader>
                                    Sort order
                                </EditableTableHeader>
                                <EditableTableHeader>
                                    Visibility
                                </EditableTableHeader>
                                <EditableTableHeader className="text-right">
                                    Actions
                                </EditableTableHeader>
                            </EditableTableHead>
                            <EditableTableBody>
                                {items.map((item, index) => (
                                    <tr
                                        key={
                                            item.id ??
                                            `${errorPrefix}-row-${index}`
                                        }
                                    >
                                        <EditableTableCell>
                                            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                #{index + 1}
                                            </p>
                                        </EditableTableCell>
                                        <EditableTableCell>
                                            <FormInput
                                                value={item.heading}
                                                onChange={(event) =>
                                                    onChange(index, {
                                                        ...item,
                                                        heading:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            <FieldError
                                                message={
                                                    errors[
                                                        `${errorPrefix}.${index}.heading`
                                                    ]
                                                }
                                            />
                                        </EditableTableCell>
                                        {showBody ? (
                                            <EditableTableCell>
                                                <FormTextarea
                                                    rows={2}
                                                    value={item.body_text}
                                                    onChange={(event) =>
                                                        onChange(index, {
                                                            ...item,
                                                            body_text:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                                <FieldError
                                                    message={
                                                        errors[
                                                            `${errorPrefix}.${index}.body_text`
                                                        ]
                                                    }
                                                />
                                            </EditableTableCell>
                                        ) : null}
                                        <EditableTableCell>
                                            <FormInput
                                                type="number"
                                                min={0}
                                                value={item.sort_order}
                                                onChange={(event) =>
                                                    onChange(index, {
                                                        ...item,
                                                        sort_order: Number(
                                                            event.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </EditableTableCell>
                                        <EditableTableCell>
                                            <ToggleField
                                                label="Visible"
                                                checked={item.is_active}
                                                onChange={(checked) =>
                                                    onChange(index, {
                                                        ...item,
                                                        is_active: checked,
                                                    })
                                                }
                                            />
                                        </EditableTableCell>
                                        <EditableTableCell className="text-right">
                                            <Button
                                                type="button"
                                                color="light"
                                                onClick={() => onRemove(index)}
                                            >
                                                <Trash2 data-slot="icon" />
                                                Remove
                                            </Button>
                                        </EditableTableCell>
                                    </tr>
                                ))}
                            </EditableTableBody>
                        </EditableTable>
                    </div>
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                        {emptyTitle}
                    </p>
                    <Text className="mt-2">{emptyDescription}</Text>
                </div>
            )}

            {selectedItem && selectedIndex !== null ? (
                <DetailModal
                    title={selectedItem.heading || `${itemLabel} item`}
                    subtitle={`Item #${selectedIndex + 1}`}
                    badge={
                        <StatusBadge
                            tone={selectedItem.is_active ? "green" : "amber"}
                        >
                            {selectedItem.is_active ? "Visible" : "Hidden"}
                        </StatusBadge>
                    }
                    onClose={() => setSelectedIndex(null)}
                    titleId={`${errorPrefix}-detail-title`}
                    actions={
                        <Button
                            type="button"
                            plain
                            className="justify-center"
                            onClick={() => {
                                onRemove(selectedIndex);
                                setSelectedIndex(null);
                            }}
                        >
                            <Trash2 data-slot="icon" />
                            Remove
                        </Button>
                    }
                >
                    <DetailSection title="Item Details">
                        <div className="grid gap-4">
                            <Field>
                                <Label>{headingLabel}</Label>
                                <FormInput
                                    value={selectedItem.heading}
                                    onChange={(event) =>
                                        onChange(selectedIndex, {
                                            ...selectedItem,
                                            heading: event.target.value,
                                        })
                                    }
                                />
                                <FieldError
                                    message={
                                        errors[
                                            `${errorPrefix}.${selectedIndex}.heading`
                                        ]
                                    }
                                />
                            </Field>
                            {showBody ? (
                                <Field>
                                    <Label>{bodyLabel}</Label>
                                    <FormTextarea
                                        rows={4}
                                        value={selectedItem.body_text}
                                        onChange={(event) =>
                                            onChange(selectedIndex, {
                                                ...selectedItem,
                                                body_text: event.target.value,
                                            })
                                        }
                                    />
                                    <FieldError
                                        message={
                                            errors[
                                                `${errorPrefix}.${selectedIndex}.body_text`
                                            ]
                                        }
                                    />
                                </Field>
                            ) : null}
                            <DetailGrid>
                                <DetailItem label="Item">
                                    #{selectedIndex + 1}
                                </DetailItem>
                                <Field>
                                    <Label>Sort order</Label>
                                    <FormInput
                                        type="number"
                                        min={0}
                                        value={selectedItem.sort_order}
                                        onChange={(event) =>
                                            onChange(selectedIndex, {
                                                ...selectedItem,
                                                sort_order: Number(
                                                    event.target.value,
                                                ),
                                            })
                                        }
                                    />
                                </Field>
                            </DetailGrid>
                            <ToggleField
                                label="Visible"
                                checked={selectedItem.is_active}
                                onChange={(checked) =>
                                    onChange(selectedIndex, {
                                        ...selectedItem,
                                        is_active: checked,
                                    })
                                }
                            />
                        </div>
                    </DetailSection>
                </DetailModal>
            ) : null}
        </div>
    );
}

function contentItems(
    items: ContentItemPayload[],
    defaults: ContentItemForm[],
): ContentItemForm[] {
    if (items.length === 0) {
        return defaults;
    }

    return items.map((item) => ({
        id: item.id,
        heading: item.heading,
        body_text: item.bodyText ?? "",
        sort_order: item.sortOrder,
        is_active: item.isActive,
    }));
}

const sections = [
    { id: "hero-section", label: "Hero Banners" },
    { id: "whatsapp-section", label: "WhatsApp" },
    { id: "turnkey-section", label: "Turnkey Solutions" },
    { id: "about-preview-section", label: "About Zarokha" },
    { id: "stats-section", label: "Stats of Zarokha" },
    { id: "latest-products-section", label: "Latest Products" },
    { id: "quick-inquiry-section", label: "Quick Inquiry" },
] as const;

type SectionId = (typeof sections)[number]["id"];
type MobileSettingsStep = "settings" | "sections" | "editor";

export default function HomepageIndex({
    homepage,
    settings,
    mediaOptions,
}: HomepageIndexProps) {
    const [mediaChoices, setMediaChoices] =
        useState<MediaOption[]>(mediaOptions);
    const [activeSection, setActiveSection] = useState<SectionId>(
        sections[0].id,
    );
    const [mobileStep, setMobileStep] =
        useState<MobileSettingsStep>("settings");
    const [mobileSection, setMobileSection] = useState<SectionId>(
        sections[0].id,
    );

    const form = useForm<HomepageForm>({
        hero: {
            heading: homepage.hero.heading ?? "Zarokha Wooden Arts",
            subtext:
                homepage.hero.subtext ??
                "Custom wooden furniture and carved pieces for homes, workspaces, and hospitality interiors.",
            desktop_media_id: emptyToId(homepage.hero.desktopMediaId),
            mobile_media_id: emptyToId(homepage.hero.mobileMediaId),
            primary_button_label:
                homepage.hero.primaryButtonLabel ?? "View Products",
            primary_button_url: homepage.hero.primaryButtonUrl ?? "/products",
            secondary_button_label:
                homepage.hero.secondaryButtonLabel ?? "Contact",
            secondary_button_url:
                homepage.hero.secondaryButtonUrl ?? "/contact",
            overlay_opacity: homepage.hero.overlayOpacity ?? 35,
            background_color: homepage.hero.backgroundColor ?? "#eadac5",
            text_theme: homepage.hero.textTheme ?? "light",
            is_visible: homepage.hero.isVisible,
            items: homepage.hero.items.map((banner) => ({
                id: banner.id,
                imageMediaId: emptyToId(banner.imageMediaId),
                sortOrder: banner.sortOrder,
                isVisible: banner.isVisible,
            })),
        },
        settings: {
            show_whatsapp: settings.show_whatsapp ?? true,
            whatsapp_text: settings.whatsapp_text ?? "",
            whatsapp_number: settings.whatsapp_number ?? "",
        },
        turnkey: {
            eyebrow: homepage.turnkey.eyebrow ?? "A complete custom",
            title: homepage.turnkey.title ?? "furniture solution",
            subtitle:
                homepage.turnkey.subtitle ??
                "Crafted for homes, workspaces, and hospitality interiors with careful material choices.",
            button_url:
                homepage.turnkey.buttonUrl &&
                homepage.turnkey.buttonUrl.includes("youtu")
                    ? homepage.turnkey.buttonUrl
                    : "",
            is_visible: homepage.turnkey.isVisible,
            items: contentItems(homepage.turnkey.items, [
                {
                    heading: "Home Furniture",
                    body_text:
                        "Wardrobes, consoles, tables, and storage pieces tailored to the way your rooms are used.",
                    sort_order: 0,
                    is_active: true,
                },
                {
                    heading: "Office Furniture",
                    body_text:
                        "Desks, meeting tables, shelves, and focused storage for calm, efficient workspaces.",
                    sort_order: 1,
                    is_active: true,
                },
                {
                    heading: "Hospitality Pieces",
                    body_text:
                        "Reception counters, room furniture, and display units designed for durable daily use.",
                    sort_order: 2,
                    is_active: true,
                },
                {
                    heading: "Institutional Work",
                    body_text:
                        "Furniture and fixtures for studios, learning spaces, clinics, and public-facing interiors.",
                    sort_order: 3,
                    is_active: true,
                },
            ]),
        },
        aboutPreview: {
            eyebrow: homepage.aboutPreview.eyebrow ?? "About Zarokha",
            title:
                homepage.aboutPreview.title ??
                "The leading furniture brand for thoughtful custom spaces.",
            subtitle:
                homepage.aboutPreview.subtitle ??
                "Zarokha brings together measured design, material knowledge, and workshop discipline to create furniture that fits the room, the routine, and the people who use it every day.",
            body:
                homepage.aboutPreview.body ??
                "From homes and workspaces to hospitality interiors, every project is shaped with practical details, careful finishing, and a clear conversation from idea to installation.",
            primary_button_label:
                homepage.aboutPreview.primaryButtonLabel ?? "View more",
            primary_button_url:
                homepage.aboutPreview.primaryButtonUrl ?? "/about-us",
            secondary_button_label:
                homepage.aboutPreview.secondaryButtonLabel ?? "Contact us",
            secondary_button_url:
                homepage.aboutPreview.secondaryButtonUrl ?? "/contact",
            background_media_id: emptyToId(
                homepage.aboutPreview.backgroundMediaId,
            ),
            is_visible: homepage.aboutPreview.isVisible,
            points: contentItems(homepage.aboutPreview.items, [
                {
                    heading: "Direct factory manufacturing",
                    body_text: "",
                    sort_order: 0,
                    is_active: true,
                },
                {
                    heading: "Strict quality control",
                    body_text: "",
                    sort_order: 1,
                    is_active: true,
                },
                {
                    heading: "Timely production",
                    body_text: "",
                    sort_order: 2,
                    is_active: true,
                },
                {
                    heading: "Experienced team",
                    body_text: "",
                    sort_order: 3,
                    is_active: true,
                },
            ]),
        },
        industryStats: {
            title:
                homepage.industryStats.title ??
                "Furniture made at scale, finished with care.",
            highlight: homepage.industryStats.eyebrow ?? "finished with care",
            subtitle: homepage.industryStats.subtitle ?? "",
            body:
                homepage.industryStats.body ??
                "Don't hesitate, :contact for better help and products. :more",
            contact_label:
                homepage.industryStats.primaryButtonLabel ?? "contact us",
            contact_url: homepage.industryStats.primaryButtonUrl ?? "/contact",
            more_label:
                homepage.industryStats.secondaryButtonLabel ?? "View More",
            more_url: homepage.industryStats.secondaryButtonUrl ?? "/products",
            is_visible: homepage.industryStats.isVisible,
            items: contentItems(homepage.industryStats.items, [
                {
                    heading: "6000",
                    body_text: "Residential Projects",
                    sort_order: 0,
                    is_active: true,
                },
                {
                    heading: "4100",
                    body_text: "Commercial Projects",
                    sort_order: 1,
                    is_active: true,
                },
                {
                    heading: "25000",
                    body_text: "Satisfied Customers",
                    sort_order: 2,
                    is_active: true,
                },
                {
                    heading: "18",
                    body_text: "Years of Experience",
                    sort_order: 3,
                    is_active: true,
                },
            ]),
        },
        latest: {
            title: homepage.latest.title ?? "Latest Products",
            subtitle: homepage.latest.subtitle ?? "",
            max_items: Math.min(homepage.latest.maxItems || 10, 10),
            view_all_label: homepage.latest.viewAllLabel ?? "View All Products",
            view_all_url: homepage.latest.viewAllUrl ?? "/products",
            is_visible: homepage.latest.isVisible,
        },
        quickInquiry: {
            title: homepage.quickInquiry.title ?? "Custom Commissions",
            subtitle:
                homepage.quickInquiry.subtitle ??
                "Have a vision for a specific space? We collaborate with architects, designers, and homeowners to bring unique wooden dreams to life. Your heritage, our hands.",
            button_label:
                homepage.quickInquiry.buttonLabel ?? "Start a Conversation",
            button_url: homepage.quickInquiry.buttonUrl ?? "/contact",
            background_media_id: emptyToId(
                homepage.quickInquiry.backgroundMediaId,
            ),
            background_color: homepage.quickInquiry.backgroundColor ?? "",
            is_visible: homepage.quickInquiry.isVisible,
            items: homepage.quickInquiry.items.map((card) => ({
                id: card.id,
                imageMediaId: emptyToId(card.imageMediaId),
                sortOrder: card.sortOrder,
                isVisible: card.isVisible,
            })),
        },
    });

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        const option: MediaOption = {
            id: media.id,
            label: media.label,
            altText: media.altText ?? null,
            url: media.url ?? null,
            status: media.status ?? "uploaded",
        };

        setMediaChoices((current) => [
            option,
            ...current.filter((item) => item.id !== option.id),
        ]);
    };

    const addHeroBanner = () => {
        form.setData("hero", {
            ...form.data.hero,
            items: [
                ...form.data.hero.items,
                {
                    imageMediaId: "",
                    sortOrder: form.data.hero.items.length,
                    isVisible: true,
                },
            ],
        });
    };

    const setHeroBanner = (
        index: number,
        item: HomepageForm["hero"]["items"][number],
    ) => {
        form.setData("hero", {
            ...form.data.hero,
            items: form.data.hero.items.map((current, currentIndex) =>
                currentIndex === index ? item : current,
            ),
        });
    };

    const removeHeroBanner = (index: number) => {
        form.setData("hero", {
            ...form.data.hero,
            items: form.data.hero.items.filter(
                (_, currentIndex) => currentIndex !== index,
            ),
        });
    };

    const setTurnkeyItem = (index: number, item: ContentItemForm) => {
        form.setData("turnkey", {
            ...form.data.turnkey,
            items: form.data.turnkey.items.map((current, currentIndex) =>
                currentIndex === index ? item : current,
            ),
        });
    };

    const addTurnkeyItem = () => {
        form.setData("turnkey", {
            ...form.data.turnkey,
            items: [
                ...form.data.turnkey.items,
                {
                    heading: "",
                    body_text: "",
                    sort_order: form.data.turnkey.items.length,
                    is_active: true,
                },
            ],
        });
    };

    const removeTurnkeyItem = (index: number) => {
        form.setData("turnkey", {
            ...form.data.turnkey,
            items: form.data.turnkey.items.filter(
                (_, currentIndex) => currentIndex !== index,
            ),
        });
    };

    const setAboutPoint = (index: number, item: ContentItemForm) => {
        form.setData("aboutPreview", {
            ...form.data.aboutPreview,
            points: form.data.aboutPreview.points.map(
                (current, currentIndex) =>
                    currentIndex === index ? item : current,
            ),
        });
    };

    const addAboutPoint = () => {
        form.setData("aboutPreview", {
            ...form.data.aboutPreview,
            points: [
                ...form.data.aboutPreview.points,
                {
                    heading: "",
                    body_text: "",
                    sort_order: form.data.aboutPreview.points.length,
                    is_active: true,
                },
            ],
        });
    };

    const removeAboutPoint = (index: number) => {
        form.setData("aboutPreview", {
            ...form.data.aboutPreview,
            points: form.data.aboutPreview.points.filter(
                (_, currentIndex) => currentIndex !== index,
            ),
        });
    };

    const setIndustryStat = (index: number, item: ContentItemForm) => {
        form.setData("industryStats", {
            ...form.data.industryStats,
            items: form.data.industryStats.items.map((current, currentIndex) =>
                currentIndex === index ? item : current,
            ),
        });
    };

    const addIndustryStat = () => {
        form.setData("industryStats", {
            ...form.data.industryStats,
            items: [
                ...form.data.industryStats.items,
                {
                    heading: "",
                    body_text: "",
                    sort_order: form.data.industryStats.items.length,
                    is_active: true,
                },
            ],
        });
    };

    const removeIndustryStat = (index: number) => {
        form.setData("industryStats", {
            ...form.data.industryStats,
            items: form.data.industryStats.items.filter(
                (_, currentIndex) => currentIndex !== index,
            ),
        });
    };

    const submit = () => {
        form.transform((data) => ({
            ...data,
            hero: {
                ...data.hero,
                items: data.hero.items.filter(
                    (item) => item.imageMediaId !== "",
                ),
            },
        }));
        form.patch("/admin/settings/home", { preserveScroll: true });
    };

    useEffect(() => {
        const handleScroll = () => {
            const nextSection = findActiveAdminSection(sections);

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
        scrollToAdminSection(id);
    };

    const openMobileSections = () => {
        setMobileStep("sections");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openMobileEditor = (id: SectionId) => {
        setMobileSection(id);
        setActiveSection(id);
        setMobileStep("editor");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const selectedMobileSectionLabel =
        sections.find((section) => section.id === mobileSection)?.label ??
        "Editor";

    const mobileEditorSectionClass = (id: SectionId) =>
        `${mobileStep === "editor" && mobileSection === id ? "block" : "hidden"} scroll-mt-28 md:block`;

    return (
        <>
            <Head title="Homepage" />
            <AdminShell
                title="Homepage"
                description="Manage only the homepage sections shown on the public homepage."
                containedScroll
                mobileTitle={
                    mobileStep === "settings"
                        ? "Settings"
                        : mobileStep === "sections"
                          ? "Home"
                          : selectedMobileSectionLabel
                }
                mobileDescription={
                    mobileStep === "settings"
                        ? "Choose a settings area to edit."
                        : mobileStep === "sections"
                          ? "Choose a homepage section to edit."
                          : null
                }
                mobileActions={
                    mobileStep === "editor" ? (
                        <Button
                            type="submit"
                            form="homepage-mobile-form"
                            disabled={form.processing}
                            className="shrink-0"
                        >
                            {form.processing ? "Saving" : "Save Changes"}
                        </Button>
                    ) : null
                }
                mobileBreadcrumbs={
                    mobileStep === "sections" ? (
                        <MobileSettingsBreadcrumbs
                            items={[
                                {
                                    label: "Settings",
                                    onClick: () => {
                                        setMobileStep("settings");
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    },
                                },
                                { label: "Home", current: true },
                            ]}
                        />
                    ) : mobileStep === "editor" ? (
                        <MobileSettingsBreadcrumbs
                            items={[
                                {
                                    label: "Settings",
                                    onClick: () => {
                                        setMobileStep("settings");
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    },
                                },
                                {
                                    label: "Home",
                                    onClick: () => {
                                        setMobileStep("sections");
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    },
                                },
                                {
                                    label: selectedMobileSectionLabel,
                                    current: true,
                                },
                            ]}
                        />
                    ) : null
                }
                actions={
                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={submit}
                            disabled={form.processing}
                        >
                            {form.processing ? "Saving" : "Save homepage"}
                        </Button>
                    </div>
                }
            >
                <SettingsSectionLayout active="home" contentClassName="min-h-0">
                    {mobileStep === "settings" ? (
                        <MobileSettingsScreen>
                            {mobileSettingsLinks.map((item) => (
                                <MobileSettingsListItem
                                    key={item.key}
                                    href={
                                        item.key === "home"
                                            ? undefined
                                            : item.href
                                    }
                                    onClick={
                                        item.key === "home"
                                            ? openMobileSections
                                            : undefined
                                    }
                                >
                                    {item.label}
                                </MobileSettingsListItem>
                            ))}
                        </MobileSettingsScreen>
                    ) : null}

                    {mobileStep === "sections" ? (
                        <MobileSettingsScreen>
                            {sections.map((section) => (
                                <MobileSettingsListItem
                                    key={section.id}
                                    onClick={() =>
                                        openMobileEditor(section.id)
                                    }
                                >
                                    {section.label}
                                </MobileSettingsListItem>
                            ))}
                        </MobileSettingsScreen>
                    ) : null}

                    <form
                        id="homepage-mobile-form"
                        className={`space-y-5 sm:space-y-6 ${
                            mobileStep === "editor" ? "block" : "hidden"
                        } md:block`}
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                    >
                        <div className="sticky top-0 z-20 hidden bg-white/95 py-2 backdrop-blur-sm md:block dark:bg-transparent">
                            <SettingsSubsectionTabs
                                activeSection={activeSection}
                                label="Home Sections"
                                sections={sections}
                                onSelect={scrollToSection}
                                className="dark:border-transparent dark:bg-transparent dark:shadow-none"
                            />
                        </div>

                        <div
                            id="hero-section"
                            className={mobileEditorSectionClass(
                                "hero-section",
                            )}
                        >
                            <HeroSection
                                form={form}
                                mediaOptions={mediaChoices}
                                imageFor={imageFor}
                                ToggleField={ToggleField}
                                addBanner={addHeroBanner}
                                setBanner={setHeroBanner}
                                removeBanner={removeHeroBanner}
                                onMediaUploaded={rememberUploadedMedia}
                            />
                        </div>

                        <div
                            id="whatsapp-section"
                            className={mobileEditorSectionClass(
                                "whatsapp-section",
                            )}
                        >
                            <PagePanel>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                            Left Side WhatsApp
                                        </h2>
                                        <Text>
                                            Controls the floating WhatsApp
                                            inquiry widget on the homepage hero.
                                        </Text>
                                    </div>
                                    <ToggleField
                                        label="Visible"
                                        checked={
                                            form.data.settings.show_whatsapp
                                        }
                                        onChange={(checked) =>
                                            form.setData("settings", {
                                                ...form.data.settings,
                                                show_whatsapp: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>WhatsApp Number</Label>
                                        <FormInput
                                            type="text"
                                            value={
                                                form.data.settings
                                                    .whatsapp_number
                                            }
                                            onChange={(event) =>
                                                form.setData("settings", {
                                                    ...form.data.settings,
                                                    whatsapp_number:
                                                        event.target.value,
                                                })
                                            }
                                            placeholder="e.g. +919876543210"
                                        />
                                    </Field>
                                    <Field>
                                        <Label>WhatsApp Text</Label>
                                        <FormInput
                                            type="text"
                                            value={
                                                form.data.settings.whatsapp_text
                                            }
                                            onChange={(event) =>
                                                form.setData("settings", {
                                                    ...form.data.settings,
                                                    whatsapp_text:
                                                        event.target.value,
                                                })
                                            }
                                            placeholder="Hi Zarokha, I want to discuss a custom project."
                                        />
                                    </Field>
                                </div>
                            </PagePanel>
                        </div>

                        <div
                            id="turnkey-section"
                            className={mobileEditorSectionClass(
                                "turnkey-section",
                            )}
                        >
                            <PagePanel>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                            Turnkey Solutions
                                        </h2>
                                        <Text>
                                            Manage the complete custom furniture
                                            section, YouTube video, and service
                                            cards.
                                        </Text>
                                    </div>
                                    <ToggleField
                                        label="Visible"
                                        checked={form.data.turnkey.is_visible}
                                        onChange={(checked) =>
                                            form.setData("turnkey", {
                                                ...form.data.turnkey,
                                                is_visible: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Eyebrow</Label>
                                        <FormInput
                                            value={form.data.turnkey.eyebrow}
                                            onChange={(event) =>
                                                form.setData("turnkey", {
                                                    ...form.data.turnkey,
                                                    eyebrow: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Heading</Label>
                                        <FormInput
                                            value={form.data.turnkey.title}
                                            onChange={(event) =>
                                                form.setData("turnkey", {
                                                    ...form.data.turnkey,
                                                    title: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Caption</Label>
                                        <FormInput
                                            value={form.data.turnkey.subtitle}
                                            onChange={(event) =>
                                                form.setData("turnkey", {
                                                    ...form.data.turnkey,
                                                    subtitle:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>YouTube video link</Label>
                                        <FormInput
                                            value={form.data.turnkey.button_url}
                                            onChange={(event) =>
                                                form.setData("turnkey", {
                                                    ...form.data.turnkey,
                                                    button_url:
                                                        event.target.value,
                                                })
                                            }
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                        <FieldError
                                            message={
                                                form.errors[
                                                    "turnkey.button_url"
                                                ]
                                            }
                                        />
                                        <FieldHint>
                                            Leave blank to show the default
                                            wooden-art media in this section.
                                        </FieldHint>
                                    </Field>
                                </div>
                                <ContentItemsTable
                                    addLabel="Add service"
                                    emptyTitle="No service cards yet"
                                    emptyDescription="Add services to manage the turnkey section cards."
                                    errors={form.errors}
                                    errorPrefix="turnkey.items"
                                    headingLabel="Title"
                                    itemLabel="Service cards"
                                    items={form.data.turnkey.items}
                                    onAdd={addTurnkeyItem}
                                    onChange={setTurnkeyItem}
                                    onRemove={removeTurnkeyItem}
                                />
                            </PagePanel>
                        </div>

                        <div
                            id="about-preview-section"
                            className={mobileEditorSectionClass(
                                "about-preview-section",
                            )}
                        >
                            <PagePanel>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                            About Zarokha
                                        </h2>
                                        <Text>
                                            Manage the homepage about preview
                                            section.
                                        </Text>
                                    </div>
                                    <ToggleField
                                        label="Visible"
                                        checked={
                                            form.data.aboutPreview.is_visible
                                        }
                                        onChange={(checked) =>
                                            form.setData("aboutPreview", {
                                                ...form.data.aboutPreview,
                                                is_visible: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Eyebrow</Label>
                                        <FormInput
                                            value={
                                                form.data.aboutPreview.eyebrow
                                            }
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    eyebrow: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Heading</Label>
                                        <FormInput
                                            value={form.data.aboutPreview.title}
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    title: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Intro</Label>
                                        <FormTextarea
                                            rows={3}
                                            value={
                                                form.data.aboutPreview.subtitle
                                            }
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    subtitle:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Body</Label>
                                        <FormTextarea
                                            rows={3}
                                            value={form.data.aboutPreview.body}
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    body: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Primary button label</Label>
                                        <FormInput
                                            value={
                                                form.data.aboutPreview
                                                    .primary_button_label
                                            }
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    primary_button_label:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Primary button URL</Label>
                                        <FormInput
                                            value={
                                                form.data.aboutPreview
                                                    .primary_button_url
                                            }
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    primary_button_url:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <FieldError
                                            message={
                                                form.errors[
                                                    "aboutPreview.primary_button_url"
                                                ]
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Secondary button label</Label>
                                        <FormInput
                                            value={
                                                form.data.aboutPreview
                                                    .secondary_button_label
                                            }
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    secondary_button_label:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Secondary button URL</Label>
                                        <FormInput
                                            value={
                                                form.data.aboutPreview
                                                    .secondary_button_url
                                            }
                                            onChange={(event) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    secondary_button_url:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <FieldError
                                            message={
                                                form.errors[
                                                    "aboutPreview.secondary_button_url"
                                                ]
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Section image</Label>
                                        <MediaDropSelect
                                            value={
                                                form.data.aboutPreview
                                                    .background_media_id
                                            }
                                            options={mediaChoices}
                                            preview={imageFor(
                                                mediaChoices,
                                                form.data.aboutPreview
                                                    .background_media_id,
                                            )}
                                            label="About preview image"
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(background_media_id) =>
                                                form.setData("aboutPreview", {
                                                    ...form.data.aboutPreview,
                                                    background_media_id,
                                                })
                                            }
                                        />
                                    </Field>
                                </div>
                                <ContentItemsTable
                                    addLabel="Add point"
                                    emptyTitle="No strength points yet"
                                    emptyDescription="Add points to show the short About preview list."
                                    errors={form.errors}
                                    errorPrefix="aboutPreview.points"
                                    headingLabel="Text"
                                    itemLabel="Strength points"
                                    items={form.data.aboutPreview.points}
                                    onAdd={addAboutPoint}
                                    onChange={setAboutPoint}
                                    onRemove={removeAboutPoint}
                                    showBody={false}
                                />
                            </PagePanel>
                        </div>

                        <div
                            id="stats-section"
                            className={mobileEditorSectionClass(
                                "stats-section",
                            )}
                        >
                            <PagePanel>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                            Stats of Zarokha
                                        </h2>
                                        <Text>
                                            Manage the homepage counter section.
                                        </Text>
                                    </div>
                                    <ToggleField
                                        label="Visible"
                                        checked={
                                            form.data.industryStats.is_visible
                                        }
                                        onChange={(checked) =>
                                            form.setData("industryStats", {
                                                ...form.data.industryStats,
                                                is_visible: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Title</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats.title
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    title: event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Highlighted word</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats
                                                    .highlight
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    highlight:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Subtitle</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats.subtitle
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    subtitle:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Footer text</Label>
                                        <FormTextarea
                                            rows={3}
                                            value={form.data.industryStats.body}
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    body: event.target.value,
                                                })
                                            }
                                        />
                                        <FieldHint>
                                            Use :contact and :more where the
                                            links should appear.
                                        </FieldHint>
                                    </Field>
                                    <Field>
                                        <Label>Contact label</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats
                                                    .contact_label
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    contact_label:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Contact URL</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats
                                                    .contact_url
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    contact_url:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <FieldError
                                            message={
                                                form.errors[
                                                    "industryStats.contact_url"
                                                ]
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>View more label</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats
                                                    .more_label
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    more_label:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>View more URL</Label>
                                        <FormInput
                                            value={
                                                form.data.industryStats.more_url
                                            }
                                            onChange={(event) =>
                                                form.setData("industryStats", {
                                                    ...form.data.industryStats,
                                                    more_url:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <FieldError
                                            message={
                                                form.errors[
                                                    "industryStats.more_url"
                                                ]
                                            }
                                        />
                                    </Field>
                                </div>
                                <ContentItemsTable
                                    addLabel="Add counter"
                                    bodyLabel="Label"
                                    emptyTitle="No counters yet"
                                    emptyDescription="Add counters to manage the homepage stats section."
                                    errors={form.errors}
                                    errorPrefix="industryStats.items"
                                    headingLabel="Number"
                                    itemLabel="Counters"
                                    items={form.data.industryStats.items}
                                    onAdd={addIndustryStat}
                                    onChange={setIndustryStat}
                                    onRemove={removeIndustryStat}
                                />
                            </PagePanel>
                        </div>

                        <div
                            id="latest-products-section"
                            className={mobileEditorSectionClass(
                                "latest-products-section",
                            )}
                        >
                            <LatestProducts
                                form={form}
                                ToggleField={ToggleField}
                            />
                        </div>

                        <div
                            id="quick-inquiry-section"
                            className={mobileEditorSectionClass(
                                "quick-inquiry-section",
                            )}
                        >
                            <QuickInquiry
                                form={form}
                                ToggleField={ToggleField}
                                mediaOptions={mediaChoices}
                                onMediaUploaded={rememberUploadedMedia}
                            />
                        </div>

                        {Object.keys(form.errors).length > 0 ? (
                            <PagePanel className="border-red-500/40">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    Homepage was not saved. Please fix the
                                    highlighted fields and save again.
                                </p>
                            </PagePanel>
                        ) : null}
                    </form>
                </SettingsSectionLayout>
            </AdminShell>
        </>
    );
}
