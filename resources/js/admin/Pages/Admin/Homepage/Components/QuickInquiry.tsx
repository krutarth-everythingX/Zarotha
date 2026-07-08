import type React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import {
    EditableTable,
    EditableTableBody,
    EditableTableCell,
    EditableTableHead,
    EditableTableHeader,
    FieldError,
    FormColorInput,
    FormInput,
    PagePanel,
    StatusBadge,
} from "@admin/Components/AdminPrimitives";
import {
    MediaDropSelect,
    type MediaOption,
} from "@admin/Components/MediaDropSelect";

type QuickInquiryForm = {
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

type QuickInquiryProps = {
    form: {
        data: { quickInquiry: QuickInquiryForm };
        errors: Record<string, string | undefined>;
        setData: (key: "quickInquiry", value: QuickInquiryForm) => void;
    };
    ToggleField: (props: {
        label: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
    }) => JSX.Element;
    mediaOptions: MediaOption[];
    onMediaUploaded: (media: MediaOption) => void;
};

const findMedia = (mediaOptions: MediaOption[], id: number | "") =>
    id === "" ? null : (mediaOptions.find((media) => media.id === id) ?? null);

export function QuickInquiry({
    form,
    ToggleField,
    mediaOptions,
    onMediaUploaded,
}: QuickInquiryProps) {
    const setCard = (
        index: number,
        item: QuickInquiryForm["items"][number],
    ) => {
        form.setData("quickInquiry", {
            ...form.data.quickInquiry,
            items: form.data.quickInquiry.items.map((current, currentIndex) =>
                currentIndex === index ? item : current,
            ),
        });
    };

    const addCard = () => {
        if (form.data.quickInquiry.items.length >= 3) {
            return;
        }

        form.setData("quickInquiry", {
            ...form.data.quickInquiry,
            items: [
                ...form.data.quickInquiry.items,
                {
                    imageMediaId: "",
                    sortOrder: form.data.quickInquiry.items.length,
                    isVisible: true,
                },
            ],
        });
    };

    const removeCard = (index: number) => {
        form.setData("quickInquiry", {
            ...form.data.quickInquiry,
            items: form.data.quickInquiry.items.filter(
                (_, currentIndex) => currentIndex !== index,
            ),
        });
    };

    return (
        <PagePanel>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                        Quick Inquiry
                    </h2>
                    <Text>
                        Clean public callout with CMS-managed background and
                        item image cards.
                    </Text>
                </div>
                <ToggleField
                    label="Visible"
                    checked={form.data.quickInquiry.is_visible}
                    onChange={(checked: boolean) =>
                        form.setData("quickInquiry", {
                            ...form.data.quickInquiry,
                            is_visible: checked,
                        })
                    }
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Field>
                    <Label>Heading</Label>
                    <FormInput
                        value={form.data.quickInquiry.title}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) =>
                            form.setData("quickInquiry", {
                                ...form.data.quickInquiry,
                                title: event.target.value,
                            })
                        }
                    />
                </Field>
                <Field>
                    <Label>Subtext</Label>
                    <FormInput
                        value={form.data.quickInquiry.subtitle}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) =>
                            form.setData("quickInquiry", {
                                ...form.data.quickInquiry,
                                subtitle: event.target.value,
                            })
                        }
                    />
                </Field>
                <Field>
                    <Label>Button label</Label>
                    <FormInput
                        value={form.data.quickInquiry.button_label}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) =>
                            form.setData("quickInquiry", {
                                ...form.data.quickInquiry,
                                button_label: event.target.value,
                            })
                        }
                    />
                </Field>
                <Field>
                    <Label>Button URL</Label>
                    <FormInput
                        value={form.data.quickInquiry.button_url}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) =>
                            form.setData("quickInquiry", {
                                ...form.data.quickInquiry,
                                button_url: event.target.value,
                            })
                        }
                    />
                    <FieldError
                        message={form.errors["quickInquiry.button_url"]}
                    />
                </Field>
                <Field>
                    <Label>Optional background texture</Label>
                    <MediaDropSelect
                        value={form.data.quickInquiry.background_media_id}
                        options={mediaOptions}
                        preview={findMedia(
                            mediaOptions,
                            form.data.quickInquiry.background_media_id,
                        )}
                        label="Optional quick inquiry background texture"
                        onUploaded={onMediaUploaded}
                        onChange={(background_media_id) =>
                            form.setData("quickInquiry", {
                                ...form.data.quickInquiry,
                                background_media_id,
                            })
                        }
                    />
                </Field>
                <Field>
                    <Label>Background color</Label>
                    <FormColorInput
                        placeholder="#ffffff"
                        value={form.data.quickInquiry.background_color}
                        pickerLabel="Pick quick inquiry background color"
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) =>
                            form.setData("quickInquiry", {
                                ...form.data.quickInquiry,
                                background_color: event.target.value,
                            })
                        }
                    />
                    <FieldError
                        message={form.errors["quickInquiry.background_color"]}
                    />
                </Field>
            </div>

            <div className="mt-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                            Item image cards
                        </h3>
                        <Text>
                            Add up to three images shown above the CTA text on
                            mobile.
                        </Text>
                    </div>
                    <Button
                        type="button"
                        color="light"
                        onClick={addCard}
                        disabled={form.data.quickInquiry.items.length >= 3}
                    >
                        <Plus data-slot="icon" />
                        Add image
                    </Button>
                </div>

                {form.data.quickInquiry.items.length > 0 ? (
                    <EditableTable minWidth="100%">
                        <colgroup>
                            <col className="w-[110px]" />
                            <col />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[120px]" />
                        </colgroup>
                        <EditableTableHead>
                            <EditableTableHeader>Card</EditableTableHeader>
                            <EditableTableHeader>Image</EditableTableHeader>
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
                            {form.data.quickInquiry.items.map((card, index) => (
                                <tr key={card.id ?? `quick-card-${index}`}>
                                    <EditableTableCell>
                                        <div className="grid gap-2">
                                            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                Card {index + 1}
                                            </p>
                                            <StatusBadge
                                                tone={
                                                    card.isVisible
                                                        ? "green"
                                                        : "amber"
                                                }
                                            >
                                                {card.isVisible
                                                    ? "Visible"
                                                    : "Hidden"}
                                            </StatusBadge>
                                        </div>
                                    </EditableTableCell>
                                    <EditableTableCell>
                                        <MediaDropSelect
                                            value={card.imageMediaId}
                                            options={mediaOptions}
                                            preview={findMedia(
                                                mediaOptions,
                                                card.imageMediaId,
                                            )}
                                            label={`Quick inquiry card ${index + 1}`}
                                            onUploaded={onMediaUploaded}
                                            onChange={(imageMediaId) =>
                                                setCard(index, {
                                                    ...card,
                                                    imageMediaId,
                                                })
                                            }
                                        />
                                        <FieldError
                                            message={
                                                form.errors[
                                                    `quickInquiry.items.${index}.imageMediaId`
                                                ]
                                            }
                                        />
                                    </EditableTableCell>
                                    <EditableTableCell>
                                        <FormInput
                                            type="number"
                                            min={0}
                                            value={card.sortOrder}
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setCard(index, {
                                                    ...card,
                                                    sortOrder: Number(
                                                        event.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                    </EditableTableCell>
                                    <EditableTableCell>
                                        <ToggleField
                                            label="Visible"
                                            checked={card.isVisible}
                                            onChange={(checked) =>
                                                setCard(index, {
                                                    ...card,
                                                    isVisible: checked,
                                                })
                                            }
                                        />
                                    </EditableTableCell>
                                    <EditableTableCell className="text-right">
                                        <Button
                                            type="button"
                                            color="light"
                                            onClick={() => removeCard(index)}
                                        >
                                            <Trash2 data-slot="icon" />
                                            Remove
                                        </Button>
                                    </EditableTableCell>
                                </tr>
                            ))}
                        </EditableTableBody>
                    </EditableTable>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                            No image cards yet
                        </p>
                        <Text className="mt-2">
                            Add three handcrafted item images for the public
                            CTA.
                        </Text>
                    </div>
                )}
            </div>
        </PagePanel>
    );
}
