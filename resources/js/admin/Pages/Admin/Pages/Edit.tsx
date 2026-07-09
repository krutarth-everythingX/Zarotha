import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    MediaDropSelect,
    type MediaOption as UploadMediaOption,
} from "@admin/Components/MediaDropSelect";
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
    FormInput,
    MobileSettingsBreadcrumbs,
    MobileSettingsListItem,
    MobileSettingsScreen,
    FormSelect,
    FormTextarea,
    PagePanel,
    SettingsSectionLayout,
    SettingsSubsectionTabs,
    findActiveAdminSection,
    getAdminScrollContainer,
    scrollToAdminSection,
} from "@admin/Components/AdminPrimitives";
import type { PublishStatus } from "@admin/types";

const aboutSections = [
    { id: "content", label: "Content" },
    { id: "about-details", label: "Details" },
    { id: "why-choose-us", label: "Why choose us" },
    { id: "vision-mission", label: "Vision & mission" },
    { id: "aim-stats", label: "Aim & stats" },
    { id: "strength", label: "Strength" },
    { id: "seo", label: "SEO" },
] as const;

type AboutSectionId = (typeof aboutSections)[number]["id"];

type MediaOption = {
    id: number;
    label: string;
    altText: string | null;
    url: string | null;
    status: string;
    width?: number | null;
    height?: number | null;
};

type AboutStat = {
    value: string;
    label: string;
};

type AboutSkill = {
    label: string;
    percent: number;
};

type AboutDetails = {
    hero_kicker: string;
    hero_note: string;
    video_url: string;
    video_title: string;
    who_we_are_kicker: string;
    who_we_are_title: string;
    who_we_are_body: string;
    why_title: string;
    why_items: string[];
    catalog_title: string;
    catalog_body: string;
    vision_title: string;
    vision_body: string;
    mission_title: string;
    mission_body: string;
    aim_title: string;
    aim_body: string;
    stats: AboutStat[];
    strength_kicker: string;
    strength_title: string;
    strength_body: string;
    skills: AboutSkill[];
    client_title: string;
};

type PageRecord = {
    id: number;
    pageKey: string;
    slug: string;
    navigationLabel: string | null;
    title: string;
    introTitle: string | null;
    introBody: string | null;
    bodyHtml: string | null;
    aboutDetails: Partial<AboutDetails> | null;
    heroMediaId: number | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    effectiveDate: string | null;
    status: PublishStatus;
    publishedAt: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageMediaId: number | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
};

type PageForm = {
    title: string;
    navigation_label: string;
    intro_title: string;
    intro_body: string;
    body_html: string;
    about_details: AboutDetails;
    hero_media_id: number | "";
    cta_label: string;
    cta_url: string;
    effective_date: string;
    status: PublishStatus;
    published_at: string;
    meta_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    canonical_url: string;
    robots_index: boolean;
    robots_follow: boolean;
};

type PageEditProps = {
    page: PageRecord;
    mediaOptions: MediaOption[];
};

const emptyStat: AboutStat = { value: "", label: "" };
const emptySkill: AboutSkill = { label: "", percent: 0 };

function emptyToId(value: number | null | undefined): number | "" {
    return value ?? "";
}

function imageFor(mediaOptions: MediaOption[], id: number | "") {
    return id === ""
        ? null
        : (mediaOptions.find((media) => media.id === id) ?? null);
}

function stringItems(items: unknown, fallbackCount: number): string[] {
    const values = Array.isArray(items)
        ? items.map((item) => String(item ?? ""))
        : [];

    return values.length > 0
        ? values
        : Array.from({ length: fallbackCount }, () => "");
}

function statItems(items: unknown): AboutStat[] {
    const values = Array.isArray(items)
        ? items.map((item) => ({
              value: String((item as Partial<AboutStat>)?.value ?? ""),
              label: String((item as Partial<AboutStat>)?.label ?? ""),
          }))
        : [];

    return values.length > 0
        ? values
        : [{ ...emptyStat }, { ...emptyStat }, { ...emptyStat }];
}

function skillItems(items: unknown): AboutSkill[] {
    const values = Array.isArray(items)
        ? items.map((item) => ({
              label: String((item as Partial<AboutSkill>)?.label ?? ""),
              percent: Number((item as Partial<AboutSkill>)?.percent ?? 0),
          }))
        : [];

    return values.length > 0 ? values : [{ ...emptySkill }, { ...emptySkill }];
}

function aboutDetailsWithDefaults(
    details: Partial<AboutDetails> | null,
): AboutDetails {
    return {
        hero_kicker: details?.hero_kicker ?? "",
        hero_note: details?.hero_note ?? "",
        video_url: details?.video_url ?? "",
        video_title: details?.video_title ?? "",
        who_we_are_kicker: details?.who_we_are_kicker ?? "",
        who_we_are_title: details?.who_we_are_title ?? "",
        who_we_are_body: details?.who_we_are_body ?? "",
        why_title: details?.why_title ?? "",
        why_items: stringItems(details?.why_items, 6),
        catalog_title: details?.catalog_title ?? "",
        catalog_body: details?.catalog_body ?? "",
        vision_title: details?.vision_title ?? "",
        vision_body: details?.vision_body ?? "",
        mission_title: details?.mission_title ?? "",
        mission_body: details?.mission_body ?? "",
        aim_title: details?.aim_title ?? "",
        aim_body: details?.aim_body ?? "",
        stats: statItems(details?.stats),
        strength_kicker: details?.strength_kicker ?? "",
        strength_title: details?.strength_title ?? "",
        strength_body: details?.strength_body ?? "",
        skills: skillItems(details?.skills),
        client_title: details?.client_title ?? "",
    };
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {children}
        </p>
    );
}

export default function PageEdit({ page, mediaOptions }: PageEditProps) {
    const [mediaChoices, setMediaChoices] =
        useState<MediaOption[]>(mediaOptions);
    const isAboutPage = page.pageKey === "about_us";
    const [mobileStep, setMobileStep] = useState<"sections" | "editor">(
        "sections",
    );
    const [mobileSection, setMobileSection] = useState<AboutSectionId>(
        "content",
    );
    const sectionLinks = isAboutPage
        ? aboutSections
        : ([
              { id: "content", label: "Content" },
              { id: "seo", label: "SEO" },
          ] as const);
    const [activeSection, setActiveSection] = useState<string>(
        sectionLinks[0].id,
    );

    const form = useForm<PageForm>({
        title: page.title,
        navigation_label: page.navigationLabel ?? "",
        intro_title: page.introTitle ?? "",
        intro_body: page.introBody ?? "",
        body_html: page.bodyHtml ?? "",
        about_details: aboutDetailsWithDefaults(page.aboutDetails),
        hero_media_id: emptyToId(page.heroMediaId),
        cta_label: page.ctaLabel ?? "",
        cta_url: page.ctaUrl ?? "",
        effective_date: page.effectiveDate ?? "",
        status: page.status,
        published_at: page.publishedAt ?? "",
        meta_title: page.metaTitle ?? "",
        meta_description: page.metaDescription ?? "",
        og_title: page.ogTitle ?? "",
        og_description: page.ogDescription ?? "",
        canonical_url: page.canonicalUrl ?? "",
        robots_index: page.robotsIndex,
        robots_follow: page.robotsFollow,
    });

    const rememberUploadedMedia = (media: UploadMediaOption) => {
        const option: MediaOption = {
            id: media.id,
            label: media.label,
            altText: media.altText ?? null,
            url: media.url ?? null,
            status: media.status ?? "uploaded",
            width: media.width ?? null,
            height: media.height ?? null,
        };

        setMediaChoices((current) => [
            option,
            ...current.filter((item) => item.id !== option.id),
        ]);
    };

    const setAboutDetails = (updates: Partial<AboutDetails>) => {
        form.setData("about_details", {
            ...form.data.about_details,
            ...updates,
        });
    };

    const setWhyItem = (index: number, value: string) => {
        setAboutDetails({
            why_items: form.data.about_details.why_items.map(
                (item, currentIndex) => (currentIndex === index ? value : item),
            ),
        });
    };

    const setStat = (index: number, stat: AboutStat) => {
        setAboutDetails({
            stats: form.data.about_details.stats.map((item, currentIndex) =>
                currentIndex === index ? stat : item,
            ),
        });
    };

    const setSkill = (index: number, skill: AboutSkill) => {
        setAboutDetails({
            skills: form.data.about_details.skills.map((item, currentIndex) =>
                currentIndex === index ? skill : item,
            ),
        });
    };

    const submit = () => {
        form.transform((data) => ({
            ...data,
            about_details: {
                ...data.about_details,
                why_items: data.about_details.why_items
                    .map((item) => item.trim())
                    .filter(Boolean),
                stats: data.about_details.stats.filter(
                    (item) =>
                        item.value.trim() !== "" || item.label.trim() !== "",
                ),
                skills: data.about_details.skills.filter(
                    (item) => item.label.trim() !== "",
                ),
            },
        }));
        form.patch(
            page.slug === "about-us"
                ? "/admin/settings/about"
                : `/admin/pages/${page.slug}`,
        );
    };

    const SettingsFrame = ({ children }: { children: React.ReactNode }) =>
        page.slug === "about-us" ? (
            <SettingsSectionLayout active="about" contentClassName="min-h-0">
                {children}
            </SettingsSectionLayout>
        ) : (
            <>{children}</>
        );

    const openMobileEditor = (section: AboutSectionId) => {
        setMobileSection(section);
        setActiveSection(section);
        setMobileStep("editor");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const selectedMobileSectionLabel =
        aboutSections.find((section) => section.id === mobileSection)?.label ??
        "About";

    const mobileSectionClass = (id: AboutSectionId) =>
        `${mobileStep === "editor" && mobileSection === id ? "block" : "hidden"} scroll-mt-28 md:block`;

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
    }, [sectionLinks]);

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        scrollToAdminSection(id);
    };

    return (
        <>
            <Head title={`Edit ${page.title}`} />
            <AdminShell
                title={`Edit ${page.title}`}
                description="Manage fixed public page content. Missing client facts should remain empty until approved."
                containedScroll
                mobileTitle={
                    page.slug === "about-us"
                        ? mobileStep === "sections"
                            ? "About"
                            : selectedMobileSectionLabel
                        : undefined
                }
                mobileDescription={
                    page.slug === "about-us"
                        ? mobileStep === "sections"
                            ? "Manage the public About page content."
                            : null
                        : undefined
                }
                mobileActions={
                    page.slug === "about-us" ? (
                        mobileStep === "editor" ? (
                            <Button
                                type="submit"
                                form="about-mobile-form"
                                disabled={form.processing}
                            >
                                {form.processing ? "Saving" : "Save Changes"}
                            </Button>
                        ) : null
                    ) : undefined
                }
                mobileBreadcrumbs={
                    page.slug === "about-us" && mobileStep === "editor" ? (
                        <MobileSettingsBreadcrumbs
                            items={[
                                {
                                    label: "Settings",
                                    onClick: () => window.history.back(),
                                },
                                {
                                    label: "About",
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
                            Save page
                        </Button>
                    </div>
                }
            >
                <SettingsFrame>
                    {page.slug === "about-us" && mobileStep === "sections" ? (
                        <MobileSettingsScreen>
                            {aboutSections.map((section) => (
                                <MobileSettingsListItem
                                    key={section.id}
                                    onClick={() => openMobileEditor(section.id)}
                                >
                                    {section.label}
                                </MobileSettingsListItem>
                            ))}
                        </MobileSettingsScreen>
                    ) : null}

                    <form
                        id={page.slug === "about-us" ? "about-mobile-form" : undefined}
                        className={`space-y-6 ${page.slug === "about-us" ? (mobileStep === "editor" ? "block" : "hidden") : "block"} md:block`}
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                    >
                        <div className="sticky top-0 z-20 hidden bg-white/95 py-2 backdrop-blur-sm md:block dark:bg-zinc-950/95">
                            <SettingsSubsectionTabs
                                activeSection={activeSection}
                                label={
                                    isAboutPage
                                        ? "About Sections"
                                        : "Page Sections"
                                }
                                sections={sectionLinks}
                                onSelect={scrollToSection}
                            />
                        </div>

                        <section
                            id="content"
                            className={
                                isAboutPage
                                    ? mobileSectionClass("content")
                                    : undefined
                            }
                        >
                            <PagePanel>
                                <div className="mb-5">
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                        Page content
                                    </h2>
                                    <Text>
                                        Hero copy, publishing, image, and
                                        primary call to action.
                                    </Text>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Title</Label>
                                        <FormInput
                                            value={form.data.title}
                                            onChange={(event) =>
                                                form.setData(
                                                    "title",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={form.errors.title}
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Status</Label>
                                        <FormSelect
                                            value={form.data.status}
                                            onChange={(event) =>
                                                form.setData(
                                                    "status",
                                                    event.target
                                                        .value as PublishStatus,
                                                )
                                            }
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">
                                                Published
                                            </option>
                                            <option value="archived">
                                                Archived
                                            </option>
                                        </FormSelect>
                                    </Field>
                                    <Field>
                                        <Label>Intro title</Label>
                                        <FormInput
                                            value={form.data.intro_title}
                                            onChange={(event) =>
                                                form.setData(
                                                    "intro_title",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>CTA label</Label>
                                        <FormInput
                                            value={form.data.cta_label}
                                            onChange={(event) =>
                                                form.setData(
                                                    "cta_label",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>CTA URL</Label>
                                        <FormInput
                                            value={form.data.cta_url}
                                            onChange={(event) =>
                                                form.setData(
                                                    "cta_url",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Published at</Label>
                                        <FormInput
                                            value={form.data.published_at}
                                            onChange={(event) =>
                                                form.setData(
                                                    "published_at",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="YYYY-MM-DD HH:MM:SS"
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Intro body</Label>
                                        <FormTextarea
                                            rows={3}
                                            value={form.data.intro_body}
                                            onChange={(event) =>
                                                form.setData(
                                                    "intro_body",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Hero image</Label>
                                        <MediaDropSelect
                                            value={form.data.hero_media_id}
                                            options={mediaChoices}
                                            preview={imageFor(
                                                mediaChoices,
                                                form.data.hero_media_id,
                                            )}
                                            label="Hero image"
                                            onUploaded={rememberUploadedMedia}
                                            onChange={(value) =>
                                                form.setData(
                                                    "hero_media_id",
                                                    value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={form.errors.hero_media_id}
                                        />
                                    </Field>
                                    <Field className="lg:col-span-2">
                                        <Label>Body HTML</Label>
                                        <FormTextarea
                                            rows={8}
                                            value={form.data.body_html}
                                            onChange={(event) =>
                                                form.setData(
                                                    "body_html",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldHint>
                                            Used by standard static pages. The
                                            About page uses the structured
                                            fields below.
                                        </FieldHint>
                                    </Field>
                                </div>
                            </PagePanel>
                        </section>

                        {isAboutPage ? (
                            <>
                                <section
                                    id="about-details"
                                    className={mobileSectionClass(
                                        "about-details",
                                    )}
                                >
                                    <PagePanel>
                                        <div className="mb-5">
                                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                                About page details
                                            </h2>
                                            <Text>
                                                Manage the public About layout
                                                sections without editing Blade
                                                templates.
                                            </Text>
                                        </div>
                                        <div className="grid gap-5 lg:grid-cols-2">
                                            <Field>
                                                <Label>YouTube video URL</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .video_url
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            video_url:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />
                                                <FieldError
                                                    message={
                                                        form.errors[
                                                            "about_details.video_url"
                                                        ]
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Video title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .video_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            video_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Who we are kicker</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .who_we_are_kicker
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            who_we_are_kicker:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Who we are title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .who_we_are_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            who_we_are_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field className="lg:col-span-2">
                                                <Label>Who we are body</Label>
                                                <FormTextarea
                                                    rows={4}
                                                    value={
                                                        form.data.about_details
                                                            .who_we_are_body
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            who_we_are_body:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field className="lg:col-span-2">
                                                <Label>Hero note</Label>
                                                <FormTextarea
                                                    rows={2}
                                                    value={
                                                        form.data.about_details
                                                            .hero_note
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            hero_note:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                        </div>
                                    </PagePanel>
                                </section>

                                <section
                                    id="why-choose-us"
                                    className={mobileSectionClass(
                                        "why-choose-us",
                                    )}
                                >
                                    <PagePanel>
                                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                                    Why choose us
                                                </h2>
                                                <Text>
                                                    Bullet points and small
                                                    catalogue callout.
                                                </Text>
                                            </div>
                                            <Button
                                                type="button"
                                                color="light"
                                                onClick={() =>
                                                    setAboutDetails({
                                                        why_items: [
                                                            ...form.data
                                                                .about_details
                                                                .why_items,
                                                            "",
                                                        ],
                                                    })
                                                }
                                            >
                                                Add point
                                            </Button>
                                        </div>
                                        <div className="grid gap-5 lg:grid-cols-2">
                                            <Field className="lg:col-span-2">
                                                <Label>Section title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .why_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            why_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <div className="lg:col-span-2">
                                                <EditableTable minWidth="40rem">
                                                    <colgroup>
                                                        <col className="w-[90px]" />
                                                        <col />
                                                        <col className="w-[120px]" />
                                                    </colgroup>
                                                    <EditableTableHead>
                                                        <EditableTableHeader>
                                                            Item
                                                        </EditableTableHeader>
                                                        <EditableTableHeader>
                                                            Point
                                                        </EditableTableHeader>
                                                        <EditableTableHeader className="text-right">
                                                            Actions
                                                        </EditableTableHeader>
                                                    </EditableTableHead>
                                                    <EditableTableBody>
                                                        {form.data.about_details.why_items.map(
                                                            (item, index) => (
                                                                <tr
                                                                    key={`why-${index}`}
                                                                >
                                                                    <EditableTableCell>
                                                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </p>
                                                                    </EditableTableCell>
                                                                    <EditableTableCell>
                                                                        <FormInput
                                                                            value={
                                                                                item
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                setWhyItem(
                                                                                    index,
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            placeholder={`Point ${index + 1}`}
                                                                        />
                                                                    </EditableTableCell>
                                                                    <EditableTableCell className="text-right">
                                                                        <Button
                                                                            type="button"
                                                                            color="light"
                                                                            onClick={() =>
                                                                                setAboutDetails(
                                                                                    {
                                                                                        why_items:
                                                                                            form.data.about_details.why_items.filter(
                                                                                                (
                                                                                                    _,
                                                                                                    currentIndex,
                                                                                                ) =>
                                                                                                    currentIndex !==
                                                                                                    index,
                                                                                            ),
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </EditableTableCell>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </EditableTableBody>
                                                </EditableTable>
                                            </div>
                                            <Field>
                                                <Label>Catalogue title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .catalog_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            catalog_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Catalogue body</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .catalog_body
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            catalog_body:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                        </div>
                                    </PagePanel>
                                </section>

                                <section
                                    id="vision-mission"
                                    className={mobileSectionClass(
                                        "vision-mission",
                                    )}
                                >
                                    <PagePanel>
                                        <div className="mb-5">
                                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                                Vision and mission
                                            </h2>
                                            <Text>
                                                These fields power the dedicated
                                                Vision & Mission section on the
                                                About page.
                                            </Text>
                                        </div>
                                        <div className="grid gap-5 lg:grid-cols-2">
                                            <Field>
                                                <Label>Vision title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .vision_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            vision_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Mission title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .mission_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            mission_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Vision body</Label>
                                                <FormTextarea
                                                    rows={4}
                                                    value={
                                                        form.data.about_details
                                                            .vision_body
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            vision_body:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Mission body</Label>
                                                <FormTextarea
                                                    rows={4}
                                                    value={
                                                        form.data.about_details
                                                            .mission_body
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            mission_body:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                        </div>
                                    </PagePanel>
                                </section>

                                <section
                                    id="aim-stats"
                                    className={mobileSectionClass("aim-stats")}
                                >
                                    <PagePanel>
                                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                                    Aim and stats
                                                </h2>
                                                <Text>
                                                    Manage the compact aim card
                                                    and numeric highlights.
                                                </Text>
                                            </div>
                                            <Button
                                                type="button"
                                                color="light"
                                                onClick={() =>
                                                    setAboutDetails({
                                                        stats: [
                                                            ...form.data
                                                                .about_details
                                                                .stats,
                                                            { ...emptyStat },
                                                        ],
                                                    })
                                                }
                                            >
                                                Add stat
                                            </Button>
                                        </div>
                                        <div className="grid gap-5 lg:grid-cols-2">
                                            <Field>
                                                <Label>Aim title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .aim_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            aim_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>
                                                    Client section title
                                                </Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .client_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            client_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field className="lg:col-span-2">
                                                <Label>Aim body</Label>
                                                <FormTextarea
                                                    rows={3}
                                                    value={
                                                        form.data.about_details
                                                            .aim_body
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            aim_body:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <div className="lg:col-span-2">
                                                <EditableTable minWidth="46rem">
                                                    <colgroup>
                                                        <col className="w-[90px]" />
                                                        <col className="w-[180px]" />
                                                        <col />
                                                        <col className="w-[120px]" />
                                                    </colgroup>
                                                    <EditableTableHead>
                                                        <EditableTableHeader>
                                                            Item
                                                        </EditableTableHeader>
                                                        <EditableTableHeader>
                                                            Value
                                                        </EditableTableHeader>
                                                        <EditableTableHeader>
                                                            Label
                                                        </EditableTableHeader>
                                                        <EditableTableHeader className="text-right">
                                                            Actions
                                                        </EditableTableHeader>
                                                    </EditableTableHead>
                                                    <EditableTableBody>
                                                        {form.data.about_details.stats.map(
                                                            (stat, index) => (
                                                                <tr
                                                                    key={`stat-${index}`}
                                                                >
                                                                    <EditableTableCell>
                                                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </p>
                                                                    </EditableTableCell>
                                                                    <EditableTableCell>
                                                                        <FormInput
                                                                            value={
                                                                                stat.value
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                setStat(
                                                                                    index,
                                                                                    {
                                                                                        ...stat,
                                                                                        value: event
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                                )
                                                                            }
                                                                        />
                                                                    </EditableTableCell>
                                                                    <EditableTableCell>
                                                                        <FormInput
                                                                            value={
                                                                                stat.label
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                setStat(
                                                                                    index,
                                                                                    {
                                                                                        ...stat,
                                                                                        label: event
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                                )
                                                                            }
                                                                        />
                                                                    </EditableTableCell>
                                                                    <EditableTableCell className="text-right">
                                                                        <Button
                                                                            type="button"
                                                                            color="light"
                                                                            onClick={() =>
                                                                                setAboutDetails(
                                                                                    {
                                                                                        stats: form.data.about_details.stats.filter(
                                                                                            (
                                                                                                _,
                                                                                                currentIndex,
                                                                                            ) =>
                                                                                                currentIndex !==
                                                                                                index,
                                                                                        ),
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </EditableTableCell>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </EditableTableBody>
                                                </EditableTable>
                                            </div>
                                        </div>
                                    </PagePanel>
                                </section>

                                <section
                                    id="strength"
                                    className={mobileSectionClass("strength")}
                                >
                                    <PagePanel>
                                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                                    Strength
                                                </h2>
                                                <Text>
                                                    Manage the dark strength
                                                    band, production image, and
                                                    skill bars.
                                                </Text>
                                            </div>
                                            <Button
                                                type="button"
                                                color="light"
                                                onClick={() =>
                                                    setAboutDetails({
                                                        skills: [
                                                            ...form.data
                                                                .about_details
                                                                .skills,
                                                            { ...emptySkill },
                                                        ],
                                                    })
                                                }
                                            >
                                                Add skill
                                            </Button>
                                        </div>
                                        <div className="grid gap-5 lg:grid-cols-2">
                                            <Field>
                                                <Label>Kicker</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .strength_kicker
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            strength_kicker:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field>
                                                <Label>Title</Label>
                                                <FormInput
                                                    value={
                                                        form.data.about_details
                                                            .strength_title
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            strength_title:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field className="lg:col-span-2">
                                                <Label>Body</Label>
                                                <FormTextarea
                                                    rows={4}
                                                    value={
                                                        form.data.about_details
                                                            .strength_body
                                                    }
                                                    onChange={(event) =>
                                                        setAboutDetails({
                                                            strength_body:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <div className="lg:col-span-2">
                                                <EditableTable minWidth="42rem">
                                                    <colgroup>
                                                        <col className="w-[90px]" />
                                                        <col />
                                                        <col className="w-[140px]" />
                                                        <col className="w-[120px]" />
                                                    </colgroup>
                                                    <EditableTableHead>
                                                        <EditableTableHeader>
                                                            Item
                                                        </EditableTableHeader>
                                                        <EditableTableHeader>
                                                            Label
                                                        </EditableTableHeader>
                                                        <EditableTableHeader>
                                                            Percent
                                                        </EditableTableHeader>
                                                        <EditableTableHeader className="text-right">
                                                            Actions
                                                        </EditableTableHeader>
                                                    </EditableTableHead>
                                                    <EditableTableBody>
                                                        {form.data.about_details.skills.map(
                                                            (skill, index) => (
                                                                <tr
                                                                    key={`skill-${index}`}
                                                                >
                                                                    <EditableTableCell>
                                                                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                                            #
                                                                            {index +
                                                                                1}
                                                                        </p>
                                                                    </EditableTableCell>
                                                                    <EditableTableCell>
                                                                        <FormInput
                                                                            value={
                                                                                skill.label
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                setSkill(
                                                                                    index,
                                                                                    {
                                                                                        ...skill,
                                                                                        label: event
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                                )
                                                                            }
                                                                        />
                                                                    </EditableTableCell>
                                                                    <EditableTableCell>
                                                                        <FormInput
                                                                            type="number"
                                                                            min={
                                                                                0
                                                                            }
                                                                            max={
                                                                                100
                                                                            }
                                                                            value={
                                                                                skill.percent
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                setSkill(
                                                                                    index,
                                                                                    {
                                                                                        ...skill,
                                                                                        percent:
                                                                                            Number(
                                                                                                event
                                                                                                    .target
                                                                                                    .value,
                                                                                            ),
                                                                                    },
                                                                                )
                                                                            }
                                                                        />
                                                                    </EditableTableCell>
                                                                    <EditableTableCell className="text-right">
                                                                        <Button
                                                                            type="button"
                                                                            color="light"
                                                                            onClick={() =>
                                                                                setAboutDetails(
                                                                                    {
                                                                                        skills: form.data.about_details.skills.filter(
                                                                                            (
                                                                                                _,
                                                                                                currentIndex,
                                                                                            ) =>
                                                                                                currentIndex !==
                                                                                                index,
                                                                                        ),
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </EditableTableCell>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </EditableTableBody>
                                                </EditableTable>
                                            </div>
                                        </div>
                                    </PagePanel>
                                </section>
                            </>
                        ) : null}

                        <section
                            id="seo"
                            className={
                                isAboutPage
                                    ? mobileSectionClass("seo")
                                    : undefined
                            }
                        >
                            <PagePanel>
                                <div className="mb-5">
                                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                        SEO
                                    </h2>
                                    <Text>
                                        Search metadata and canonical controls.
                                    </Text>
                                </div>
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <Field>
                                        <Label>Meta title</Label>
                                        <FormInput
                                            value={form.data.meta_title}
                                            onChange={(event) =>
                                                form.setData(
                                                    "meta_title",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Meta description</Label>
                                        <FormInput
                                            value={form.data.meta_description}
                                            onChange={(event) =>
                                                form.setData(
                                                    "meta_description",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Canonical URL</Label>
                                        <FormInput
                                            value={form.data.canonical_url}
                                            onChange={(event) =>
                                                form.setData(
                                                    "canonical_url",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Effective date</Label>
                                        <FormInput
                                            type="date"
                                            value={form.data.effective_date}
                                            onChange={(event) =>
                                                form.setData(
                                                    "effective_date",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Open Graph title</Label>
                                        <FormInput
                                            value={form.data.og_title}
                                            onChange={(event) =>
                                                form.setData(
                                                    "og_title",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Open Graph description</Label>
                                        <FormInput
                                            value={form.data.og_description}
                                            onChange={(event) =>
                                                form.setData(
                                                    "og_description",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                            </PagePanel>
                        </section>

                        <div className="flex flex-wrap gap-3">
                            <Button href="/admin" color="light">
                                Back to dashboard
                            </Button>
                        </div>
                    </form>
                </SettingsFrame>
            </AdminShell>
        </>
    );
}
