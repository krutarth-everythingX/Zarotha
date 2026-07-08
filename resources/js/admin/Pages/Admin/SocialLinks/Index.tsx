import { Head, router } from "@inertiajs/react";
import React from "react";
import { Button } from "@admin/Components/ui/button";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import { Field, Label } from "@admin/Components/ui/fieldset";
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
    FormInput,
    FormSelect,
    ListTableFooter,
    ListTablePanel,
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
    scrollToAdminSection,
} from "@admin/Components/AdminPrimitives";
import { TrashIcon, PlusIcon, GripVerticalIcon } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SocialLink {
    id: number;
    platform_key: string;
    label: string | null;
    url: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    links: SocialLink[];
    settings: {
        showSocialLinksOnHero: boolean;
    };
}

type SocialLinkPayload = {
    platform_key: string;
    label: string | null;
    url: string;
    sort_order: number;
    is_active: boolean;
};

const AVAILABLE_PLATFORMS = [
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "twitter", label: "Twitter / X" },
    { key: "youtube", label: "YouTube" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "pinterest", label: "Pinterest" },
    { key: "whatsapp", label: "WhatsApp" },
];

const sections = [
    { id: "social-display", label: "Social display" },
    { id: "public-social-links", label: "Public social links" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SortableLinkItem({
    link,
    onUpdate,
    onRemove,
}: {
    link: SocialLink;
    onUpdate: (data: Partial<SocialLink>) => void;
    onRemove: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} className="align-top">
            <EditableTableCell>
                <div
                    className="cursor-grab pt-2"
                    {...attributes}
                    {...listeners}
                    aria-label={`Reorder ${link.platform_key}`}
                >
                    <GripVerticalIcon className="h-5 w-5 text-zinc-400" />
                </div>
            </EditableTableCell>
            <EditableTableCell>
                <Field>
                    <Label className="sr-only">Platform</Label>
                    <FormSelect
                        value={link.platform_key}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            onUpdate({ platform_key: e.target.value })
                        }
                    >
                        <option value="">Select platform</option>
                        {AVAILABLE_PLATFORMS.map((p) => (
                            <option key={p.key} value={p.key}>
                                {p.label}
                            </option>
                        ))}
                    </FormSelect>
                </Field>
            </EditableTableCell>
            <EditableTableCell>
                <Field>
                    <Label className="sr-only">URL</Label>
                    <FormInput
                        value={link.url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onUpdate({ url: e.target.value })
                        }
                        placeholder="https://..."
                    />
                </Field>
            </EditableTableCell>
            <EditableTableCell>
                <label className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        checked={link.is_active}
                        onChange={(e) =>
                            onUpdate({ is_active: e.target.checked })
                        }
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Active
                    </span>
                </label>
            </EditableTableCell>
            <EditableTableCell className="text-right">
                <Button
                    type="button"
                    color="light"
                    onClick={onRemove}
                    className="justify-center text-red-500"
                >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                </Button>
            </EditableTableCell>
        </tr>
    );
}

export default function SocialLinksIndex({ links, settings }: Props) {
    const [localLinks, setLocalLinks] = React.useState<SocialLink[]>(links);
    const [isSaving, setIsSaving] = React.useState(false);
    const [mobileStep, setMobileStep] = React.useState<"sections" | "editor">(
        "sections",
    );
    const [mobileSection, setMobileSection] = React.useState<SectionId>(
        sections[0].id,
    );
    const [activeSection, setActiveSection] = React.useState<SectionId>(
        sections[0].id,
    );
    const [selectedLinkId, setSelectedLinkId] = React.useState<number | null>(
        null,
    );
    const [showHeroSocials, setShowHeroSocials] = React.useState(
        settings.showSocialLinksOnHero,
    );
    const selectedLink =
        selectedLinkId === null
            ? null
            : (localLinks.find((link) => link.id === selectedLinkId) ?? null);

    React.useEffect(() => {
        setLocalLinks(links);
    }, [links]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalLinks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Reassign sort_order
                const reordered = newItems.map((item, idx) => ({
                    ...item,
                    sort_order: idx,
                }));

                // Save new order immediately if desired, or let the user click save all
                return reordered;
            });
        }
    };

    const handleAdd = () => {
        const newId = Math.min(-1, ...localLinks.map((l) => l.id)) - 1; // negative IDs for unsaved items
        setLocalLinks([
            ...localLinks,
            {
                id: newId,
                platform_key: "facebook",
                label: "",
                url: "",
                sort_order: localLinks.length,
                is_active: true,
            },
        ]);
    };

    const handleUpdate = (id: number, data: Partial<SocialLink>) => {
        setLocalLinks(
            localLinks.map((l) => (l.id === id ? { ...l, ...data } : l)),
        );
    };

    const handleRemove = (id: number) => {
        if (id > 0) {
            router.delete(`/admin/settings/socials/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalLinks(localLinks.filter((l) => l.id !== id));
                },
            });
        } else {
            setLocalLinks(localLinks.filter((l) => l.id !== id));
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        let hasError = false;
        for (const link of localLinks) {
            if (!link.url || link.url.trim() === "") {
                alert(`URL is required for platform: ${link.platform_key}`);
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

            if (link.id < 0) {
                // new link
                await new Promise<void>((resolve) =>
                    router.post("/admin/settings/socials", payload, {
                        preserveScroll: true,
                        onError: (err) => {
                            console.error(err);
                            alert(
                                `Failed to save ${link.platform_key}: ${Object.values(err)[0]}`,
                            );
                            hasError = true;
                        },
                        onFinish: () => resolve(),
                    }),
                );
            } else {
                // update existing
                await new Promise<void>((resolve) =>
                    router.put(`/admin/settings/socials/${link.id}`, payload, {
                        preserveScroll: true,
                        onError: (err) => {
                            console.error(err);
                            alert(
                                `Failed to update ${link.platform_key}: ${Object.values(err)[0]}`,
                            );
                            hasError = true;
                        },
                        onFinish: () => resolve(),
                    }),
                );
            }
            if (hasError) break;
        }
        setIsSaving(false);
        if (!hasError) {
            router.reload({ only: ["links"] });
        }
    };

    const openMobileEditor = (section: SectionId) => {
        setMobileSection(section);
        setActiveSection(section);
        setMobileStep("editor");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const selectedMobileSectionLabel =
        sections.find((section) => section.id === mobileSection)?.label ??
        "Socials";

    const mobileSectionClass = (id: SectionId) =>
        `${mobileStep === "editor" && mobileSection === id ? "block" : "hidden"} scroll-mt-28 md:block`;

    React.useEffect(() => {
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
        setActiveSection(id);
        scrollToAdminSection(id);
    };

    return (
        <>
            <Head title="Socials" />
            <AdminShell
                title="Socials"
                description="Add social links, edit existing links, remove links, and switch them active or inactive."
                containedScroll
                mobileTitle={
                    mobileStep === "sections"
                        ? "Socials"
                        : selectedMobileSectionLabel
                }
                mobileDescription={
                    mobileStep === "sections"
                        ? "Manage public social links and display."
                        : null
                }
                mobileActions={
                    mobileStep === "editor" ? (
                        <Button onClick={handleSaveAll} disabled={isSaving}>
                            {isSaving ? "Saving" : "Save Changes"}
                        </Button>
                    ) : null
                }
                mobileBreadcrumbs={
                    mobileStep === "editor" ? (
                        <MobileSettingsBreadcrumbs
                            items={[
                                {
                                    label: "Settings",
                                    onClick: () => window.history.back(),
                                },
                                {
                                    label: "Socials",
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
                    <Button onClick={handleSaveAll} disabled={isSaving}>
                        Save socials
                    </Button>
                }
            >
                <SettingsSectionLayout
                    active="socials"
                    contentClassName="min-h-0 space-y-6"
                >
                    {mobileStep === "sections" ? (
                        <MobileSettingsScreen>
                            {sections.map((section) => (
                                <MobileSettingsListItem
                                    key={section.id}
                                    onClick={() => openMobileEditor(section.id)}
                                >
                                    {section.label}
                                </MobileSettingsListItem>
                            ))}
                        </MobileSettingsScreen>
                    ) : null}

                    <div className="sticky top-0 z-20 hidden bg-zinc-100/95 py-2 backdrop-blur-sm md:block dark:bg-zinc-900/95">
                        <SettingsSubsectionTabs
                            activeSection={activeSection}
                            label="Social Sections"
                            sections={sections}
                            onSelect={scrollToSection}
                        />
                    </div>

                    <div
                        id="social-display"
                        className={mobileSectionClass("social-display")}
                    >
                    <PagePanel>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                    Socials
                                </h2>
                                <Text>
                                    Active links are shared across the homepage
                                    hero, footer, contact page, and other public
                                    social icon areas.
                                </Text>
                            </div>
                            <label className="inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                                <input
                                    type="checkbox"
                                    checked={showHeroSocials}
                                    onChange={(event) => {
                                        const checked = event.target.checked;
                                        setShowHeroSocials(checked);
                                        router.patch(
                                            "/admin/settings/socials/display",
                                            {
                                                show_social_links_on_hero:
                                                    checked,
                                            },
                                            {
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                />
                                Show active social links on homepage hero
                            </label>
                        </div>
                    </PagePanel>
                    </div>

                    <div
                        id="public-social-links"
                        className={mobileSectionClass("public-social-links")}
                    >
                    <ListTablePanel
                        footer={
                            <ListTableFooter>
                                <span>{localLinks.length} social links</span>
                                <Button
                                    type="button"
                                    color="light"
                                    className="w-full justify-center sm:w-auto"
                                    onClick={handleAdd}
                                >
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add social link
                                </Button>
                            </ListTableFooter>
                        }
                    >
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <MobileTableList>
                                {localLinks.map((link, index) => (
                                    <MobileTableRow
                                        key={link.id}
                                        number={index + 1}
                                        title={
                                            link.label ||
                                            AVAILABLE_PLATFORMS.find(
                                                (platform) =>
                                                    platform.key ===
                                                    link.platform_key,
                                            )?.label ||
                                            link.platform_key
                                        }
                                        subtitle={link.url || "No URL"}
                                        badge={
                                            <StatusBadge
                                                tone={
                                                    link.is_active
                                                        ? "green"
                                                        : "amber"
                                                }
                                            >
                                                {link.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        }
                                        onOpen={() =>
                                            setSelectedLinkId(link.id)
                                        }
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden md:block">
                                <EditableTable
                                    minWidth="56rem"
                                    className="rounded-none border-0 bg-transparent"
                                >
                                    <colgroup>
                                        <col className="w-[72px]" />
                                        <col className="w-[220px]" />
                                        <col />
                                        <col className="w-[140px]" />
                                        <col className="w-[100px]" />
                                    </colgroup>
                                    <EditableTableHead>
                                        <EditableTableHeader>
                                            Move
                                        </EditableTableHeader>
                                        <EditableTableHeader>
                                            Platform
                                        </EditableTableHeader>
                                        <EditableTableHeader>
                                            URL
                                        </EditableTableHeader>
                                        <EditableTableHeader>
                                            Status
                                        </EditableTableHeader>
                                        <EditableTableHeader className="text-right">
                                            Actions
                                        </EditableTableHeader>
                                    </EditableTableHead>
                                    <SortableContext
                                        items={localLinks.map((i) => i.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <EditableTableBody>
                                            {localLinks.map((link) => (
                                                <SortableLinkItem
                                                    key={link.id}
                                                    link={link}
                                                    onUpdate={(data) =>
                                                        handleUpdate(
                                                            link.id,
                                                            data,
                                                        )
                                                    }
                                                    onRemove={() =>
                                                        handleRemove(link.id)
                                                    }
                                                />
                                            ))}
                                        </EditableTableBody>
                                    </SortableContext>
                                </EditableTable>
                            </div>
                        </DndContext>
                    </ListTablePanel>
                    </div>
                </SettingsSectionLayout>

                {selectedLink ? (
                    <DetailModal
                        title={
                            selectedLink.label ||
                            AVAILABLE_PLATFORMS.find(
                                (platform) =>
                                    platform.key === selectedLink.platform_key,
                            )?.label ||
                            selectedLink.platform_key
                        }
                        subtitle={selectedLink.url || "No URL"}
                        badge={
                            <StatusBadge
                                tone={
                                    selectedLink.is_active ? "green" : "amber"
                                }
                            >
                                {selectedLink.is_active ? "Active" : "Inactive"}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedLinkId(null)}
                        titleId="social-link-detail-title"
                        actions={
                            <Button
                                type="button"
                                plain
                                className="justify-center"
                                onClick={() => {
                                    handleRemove(selectedLink.id);
                                    setSelectedLinkId(null);
                                }}
                            >
                                <TrashIcon className="h-4 w-4" />
                                Remove
                            </Button>
                        }
                    >
                        <DetailSection title="Social Link">
                            <div className="grid gap-4">
                                <DetailGrid>
                                    <DetailItem label="No.">
                                        {localLinks.findIndex(
                                            (link) =>
                                                link.id === selectedLink.id,
                                        ) + 1}
                                    </DetailItem>
                                    <DetailItem label="Sort Order">
                                        {selectedLink.sort_order}
                                    </DetailItem>
                                </DetailGrid>
                                <Field>
                                    <Label>Platform</Label>
                                    <FormSelect
                                        value={selectedLink.platform_key}
                                        onChange={(event) =>
                                            handleUpdate(selectedLink.id, {
                                                platform_key:
                                                    event.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Select platform
                                        </option>
                                        {AVAILABLE_PLATFORMS.map((platform) => (
                                            <option
                                                key={platform.key}
                                                value={platform.key}
                                            >
                                                {platform.label}
                                            </option>
                                        ))}
                                    </FormSelect>
                                </Field>
                                <Field>
                                    <Label>URL</Label>
                                    <FormInput
                                        value={selectedLink.url}
                                        onChange={(event) =>
                                            handleUpdate(selectedLink.id, {
                                                url: event.target.value,
                                            })
                                        }
                                        placeholder="https://..."
                                    />
                                </Field>
                                <label className="flex items-center gap-2 rounded-xl border border-zinc-950/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={selectedLink.is_active}
                                        onChange={(event) =>
                                            handleUpdate(selectedLink.id, {
                                                is_active: event.target.checked,
                                            })
                                        }
                                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Active
                                    </span>
                                </label>
                            </div>
                        </DetailSection>
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}
