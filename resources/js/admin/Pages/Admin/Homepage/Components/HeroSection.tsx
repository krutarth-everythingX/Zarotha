import type React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
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
    MobileTableList,
    MobileTableRow,
    PagePanel,
    StatusBadge,
} from "@admin/Components/AdminPrimitives";
import {
    MediaDropSelect,
    type MediaOption,
} from "@admin/Components/MediaDropSelect";

type HeroBannerForm = {
    id?: number;
    imageMediaId: number | "";
    sortOrder: number;
    isVisible: boolean;
};

type HeroForm = {
    heading: string;
    subtext: string;
    primary_button_label: string;
    primary_button_url: string;
    secondary_button_label: string;
    secondary_button_url: string;
    is_visible: boolean;
    text_theme: "light" | "dark";
    overlay_opacity: number;
    items: HeroBannerForm[];
};

type HeroSectionProps = {
    form: {
        data: { hero: HeroForm };
        errors: Record<string, string | undefined>;
        setData: (key: "hero", value: HeroForm) => void;
    };
    mediaOptions: MediaOption[];
    imageFor: (
        mediaOptions: MediaOption[],
        id: number | "",
    ) => MediaOption | null;
    ToggleField: (props: {
        label: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
    }) => JSX.Element;
    addBanner: () => void;
    setBanner: (index: number, item: HeroBannerForm) => void;
    removeBanner: (index: number) => void;
    onMediaUploaded: (media: MediaOption) => void;
};

function bannerImageName(mediaOptions: MediaOption[], banner: HeroBannerForm) {
    return (
        mediaOptions.find((media) => media.id === banner.imageMediaId)?.label ??
        "No image selected"
    );
}

export function HeroSection({
    form,
    mediaOptions,
    imageFor,
    ToggleField,
    addBanner,
    setBanner,
    removeBanner,
    onMediaUploaded,
}: HeroSectionProps) {
    const [selectedBannerIndex, setSelectedBannerIndex] = useState<
        number | null
    >(null);
    const selectedBanner =
        selectedBannerIndex === null
            ? null
            : (form.data.hero.items[selectedBannerIndex] ?? null);

    return (
        <PagePanel>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 max-md:hidden dark:text-white">
                        Hero Banners
                    </h2>
                    <h2 className="text-base font-semibold text-zinc-950 md:hidden dark:text-white">
                        HERO BANNERS
                    </h2>
                    <Text>Manage the homepage hero slider images.</Text>
                </div>
                <ToggleField
                    label="Visible"
                    checked={form.data.hero.is_visible}
                    onChange={(checked: boolean) =>
                        form.setData("hero", {
                            ...form.data.hero,
                            is_visible: checked,
                        })
                    }
                />
            </div>

            <div className="mt-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                        Slider images
                    </h3>
                    <Button type="button" color="light" onClick={addBanner}>
                        <Plus data-slot="icon" />
                        Add image
                    </Button>
                </div>

                {form.data.hero.items.length > 0 ? (
                    <>
                        <MobileTableList className="gap-3 p-0">
                            {form.data.hero.items.map((banner, index) => (
                                <MobileTableRow
                                    key={
                                        banner.id ?? `hero-banner-card-${index}`
                                    }
                                    number={index + 1}
                                    title={`Banner ${index + 1}`}
                                    subtitle={bannerImageName(
                                        mediaOptions,
                                        banner,
                                    )}
                                    badge={
                                        <StatusBadge
                                            tone={
                                                banner.isVisible
                                                    ? "green"
                                                    : "amber"
                                            }
                                        >
                                            {banner.isVisible
                                                ? "Visible"
                                                : "Hidden"}
                                        </StatusBadge>
                                    }
                                    onOpen={() => setSelectedBannerIndex(index)}
                                />
                            ))}
                        </MobileTableList>

                        <div className="hidden md:block">
                            <EditableTable minWidth="100%">
                                <colgroup>
                                    <col className="w-[110px]" />
                                    <col />
                                    <col className="w-[150px]" />
                                    <col className="w-[150px]" />
                                    <col className="w-[120px]" />
                                </colgroup>
                                <EditableTableHead>
                                    <EditableTableHeader>
                                        Banner
                                    </EditableTableHeader>
                                    <EditableTableHeader>
                                        Image
                                    </EditableTableHeader>
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
                                    {form.data.hero.items.map(
                                        (banner, index) => (
                                            <tr
                                                key={
                                                    banner.id ??
                                                    `hero-banner-row-${index}`
                                                }
                                            >
                                                <EditableTableCell>
                                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                        Banner {index + 1}
                                                    </p>
                                                </EditableTableCell>
                                                <EditableTableCell>
                                                    <MediaDropSelect
                                                        value={
                                                            banner.imageMediaId
                                                        }
                                                        options={mediaOptions}
                                                        preview={imageFor(
                                                            mediaOptions,
                                                            banner.imageMediaId,
                                                        )}
                                                        label={`Hero banner ${index + 1}`}
                                                        onUploaded={
                                                            onMediaUploaded
                                                        }
                                                        onChange={(
                                                            imageMediaId,
                                                        ) =>
                                                            setBanner(index, {
                                                                ...banner,
                                                                imageMediaId,
                                                            })
                                                        }
                                                    />
                                                    <FieldError
                                                        message={
                                                            form.errors[
                                                                `hero.items.${index}.imageMediaId`
                                                            ]
                                                        }
                                                    />
                                                </EditableTableCell>
                                                <EditableTableCell>
                                                    <FormInput
                                                        type="number"
                                                        min={0}
                                                        value={banner.sortOrder}
                                                        onChange={(
                                                            event: React.ChangeEvent<HTMLInputElement>,
                                                        ) =>
                                                            setBanner(index, {
                                                                ...banner,
                                                                sortOrder:
                                                                    Number(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    ),
                                                            })
                                                        }
                                                    />
                                                </EditableTableCell>
                                                <EditableTableCell>
                                                    <ToggleField
                                                        label="Visible"
                                                        checked={
                                                            banner.isVisible
                                                        }
                                                        onChange={(checked) =>
                                                            setBanner(index, {
                                                                ...banner,
                                                                isVisible:
                                                                    checked,
                                                            })
                                                        }
                                                    />
                                                </EditableTableCell>
                                                <EditableTableCell className="text-right">
                                                    <Button
                                                        type="button"
                                                        color="light"
                                                        onClick={() =>
                                                            removeBanner(index)
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
                    </>
                ) : null}

                {form.data.hero.items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                            No CMS hero banners yet
                        </p>
                        <Text className="mt-2">
                            The public homepage will show default wooden art
                            banners until you upload hero images.
                        </Text>
                    </div>
                ) : null}

                {selectedBanner && selectedBannerIndex !== null ? (
                    <DetailModal
                        title={`Banner ${selectedBannerIndex + 1}`}
                        subtitle={bannerImageName(
                            mediaOptions,
                            selectedBanner,
                        )}
                        badge={
                            <StatusBadge
                                tone={
                                    selectedBanner.isVisible ? "green" : "amber"
                                }
                            >
                                {selectedBanner.isVisible
                                    ? "Visible"
                                    : "Hidden"}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedBannerIndex(null)}
                        titleId="hero-banner-detail-title"
                        actions={
                            <Button
                                type="button"
                                plain
                                className="justify-center"
                                onClick={() => {
                                    removeBanner(selectedBannerIndex);
                                    setSelectedBannerIndex(null);
                                }}
                            >
                                <Trash2 data-slot="icon" />
                                Remove
                            </Button>
                        }
                    >
                        <DetailSection title="Banner Details">
                            <div className="grid gap-4">
                                <Field>
                                    <Label>Image</Label>
                                    <MediaDropSelect
                                        value={selectedBanner.imageMediaId}
                                        options={mediaOptions}
                                        preview={imageFor(
                                            mediaOptions,
                                            selectedBanner.imageMediaId,
                                        )}
                                        label={`Hero banner ${selectedBannerIndex + 1}`}
                                        onUploaded={onMediaUploaded}
                                        onChange={(imageMediaId) =>
                                            setBanner(selectedBannerIndex, {
                                                ...selectedBanner,
                                                imageMediaId,
                                            })
                                        }
                                    />
                                    <FieldError
                                        message={
                                            form.errors[
                                                `hero.items.${selectedBannerIndex}.imageMediaId`
                                            ]
                                        }
                                    />
                                </Field>
                                <DetailGrid>
                                    <DetailItem label="Banner">
                                        #{selectedBannerIndex + 1}
                                    </DetailItem>
                                    <Field>
                                        <Label>Sort order</Label>
                                        <FormInput
                                            type="number"
                                            min={0}
                                            value={selectedBanner.sortOrder}
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setBanner(selectedBannerIndex, {
                                                    ...selectedBanner,
                                                    sortOrder: Number(
                                                        event.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                    </Field>
                                </DetailGrid>
                                <ToggleField
                                    label="Visible"
                                    checked={selectedBanner.isVisible}
                                    onChange={(checked: boolean) =>
                                        setBanner(selectedBannerIndex, {
                                            ...selectedBanner,
                                            isVisible: checked,
                                        })
                                    }
                                />
                            </div>
                        </DetailSection>
                    </DetailModal>
                ) : null}
            </div>
        </PagePanel>
    );
}
