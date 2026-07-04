import { Head, router, useForm } from "@inertiajs/react";
import { Edit3, ExternalLink, Plus, Power, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
    MediaDropSelect,
    type MediaOption as UploadMediaOption,
} from "@admin/Components/MediaDropSelect";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Button } from "@admin/Components/ui/button";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    FieldError,
    FormInput,
    PagePanel,
    StatusBadge,
} from "@admin/Components/AdminPrimitives";

type MediaOption = {
    id: number;
    label: string;
    altText: string | null;
    url: string | null;
    status: string;
    width?: number | null;
    height?: number | null;
};

type ClientPayload = {
    id: number;
    name: string;
    websiteUrl: string | null;
    logoMediaId: number | null;
    externalLogoUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    logoMedia: MediaOption | null;
};

type ClientsIndexProps = {
    clients: ClientPayload[];
    mediaOptions: MediaOption[];
};

type ClientForm = {
    name: string;
    website_url: string;
    logo_media_id: number | "";
    sort_order: number;
    is_active: boolean;
};

const emptyClientForm: ClientForm = {
    name: "",
    website_url: "",
    logo_media_id: "",
    sort_order: 0,
    is_active: true,
};

function emptyToId(value: number | null): number | "" {
    return value ?? "";
}

function imageFor(mediaOptions: MediaOption[], id: number | "") {
    return id === ""
        ? null
        : (mediaOptions.find((media) => media.id === id) ?? null);
}

function fallbackInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "CL";
}

export default function ClientsIndex({
    clients,
    mediaOptions,
}: ClientsIndexProps) {
    const [mediaChoices, setMediaChoices] =
        useState<MediaOption[]>(mediaOptions);
    const [editingClientId, setEditingClientId] = useState<number | null>(null);

    const form = useForm<ClientForm>({
        ...emptyClientForm,
        sort_order: clients.length,
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

    const resetForm = () => {
        setEditingClientId(null);
        form.clearErrors();
        form.setData({
            ...emptyClientForm,
            sort_order: clients.length,
        });
    };

    const editClient = (client: ClientPayload) => {
        setEditingClientId(client.id);
        form.clearErrors();
        form.setData({
            name: client.name,
            website_url: client.websiteUrl ?? "",
            logo_media_id: emptyToId(client.logoMediaId),
            sort_order: client.sortOrder,
            is_active: client.isActive,
        });
    };

    const saveClient = () => {
        const options = {
            preserveScroll: true,
            onSuccess: resetForm,
        };

        if (editingClientId) {
            form.patch(`/admin/clients/${editingClientId}`, options);
            return;
        }

        form.post("/admin/clients", options);
    };

    const removeClient = (client: ClientPayload) => {
        if (!window.confirm(`Remove ${client.name}?`)) {
            return;
        }

        router.delete(`/admin/clients/${client.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (editingClientId === client.id) {
                    resetForm();
                }
            },
        });
    };

    const toggleClient = (client: ClientPayload) => {
        router.patch(
            `/admin/clients/${client.id}`,
            {
                name: client.name,
                website_url: client.websiteUrl ?? "",
                logo_media_id: emptyToId(client.logoMediaId),
                sort_order: client.sortOrder,
                is_active: !client.isActive,
            },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Clients" />
            <AdminShell
                title="Clients"
                description="Manage client logos shown in the public homepage marquee."
            >
                <form
                    className="space-y-8"
                    onSubmit={(event) => {
                        event.preventDefault();
                        saveClient();
                    }}
                >
                    <PagePanel>
                        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                    {editingClientId
                                        ? "Edit client"
                                        : "Add client"}
                                </h2>
                                <Text>
                                    Add the client name and site link. Upload a
                                    logo manually, or leave it blank to use the
                                    website favicon.
                                </Text>
                            </div>
                            {editingClientId ? (
                                <Button
                                    type="button"
                                    color="light"
                                    onClick={resetForm}
                                >
                                    <X data-slot="icon" />
                                    Cancel edit
                                </Button>
                            ) : null}
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                            <Field>
                                <Label>Client image</Label>
                                <MediaDropSelect
                                    value={form.data.logo_media_id}
                                    options={mediaChoices}
                                    onChange={(value) =>
                                        form.setData("logo_media_id", value)
                                    }
                                    onUploaded={rememberUploadedMedia}
                                    preview={imageFor(
                                        mediaChoices,
                                        form.data.logo_media_id,
                                    )}
                                    label="Client logo"
                                />
                                <FieldError
                                    message={form.errors.logo_media_id}
                                />
                            </Field>

                            <div className="grid content-start gap-5">
                                <Field>
                                    <Label>Client name</Label>
                                    <FormInput
                                        value={form.data.name}
                                        onChange={(event) =>
                                            form.setData(
                                                "name",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Client name"
                                    />
                                    <FieldError message={form.errors.name} />
                                </Field>

                                <Field>
                                    <Label>Client website link</Label>
                                    <FormInput
                                        type="url"
                                        value={form.data.website_url}
                                        onChange={(event) =>
                                            form.setData(
                                                "website_url",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://example.com"
                                    />
                                    <FieldError
                                        message={form.errors.website_url}
                                    />
                                </Field>

                                <div className="grid gap-5 sm:grid-cols-[10rem_1fr] sm:items-end">
                                    <Field>
                                        <Label>Sort order</Label>
                                        <FormInput
                                            type="number"
                                            min={0}
                                            value={form.data.sort_order}
                                            onChange={(event) =>
                                                form.setData(
                                                    "sort_order",
                                                    Number(event.target.value),
                                                )
                                            }
                                        />
                                    </Field>

                                    <label className="inline-flex w-fit items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_active}
                                            onChange={(event) =>
                                                form.setData(
                                                    "is_active",
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        Active
                                    </label>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        {editingClientId ? (
                                            <Edit3 data-slot="icon" />
                                        ) : (
                                            <Plus data-slot="icon" />
                                        )}
                                        {form.processing
                                            ? "Saving"
                                            : editingClientId
                                              ? "Update client"
                                              : "Add client"}
                                    </Button>
                                    {editingClientId ? (
                                        <Button
                                            type="button"
                                            color="light"
                                            onClick={resetForm}
                                        >
                                            Clear
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </PagePanel>
                </form>

                <PagePanel className="mt-8">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                                Client list
                            </h2>
                            <Text>
                                Edit, remove, or switch existing clients active
                                and inactive.
                            </Text>
                        </div>
                        <StatusBadge>{clients.length} total</StatusBadge>
                    </div>

                    <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                        {clients.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
                                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                    No clients yet
                                </p>
                                <Text className="mt-2">
                                    The public section will show the default
                                    logo until clients are added.
                                </Text>
                            </div>
                        ) : (
                            clients.map((client) => (
                                <div
                                    key={client.id}
                                    className="grid gap-4 py-4 lg:grid-cols-[7rem_1fr_auto] lg:items-center"
                                >
                                    <div className="flex h-20 items-center justify-center overflow-hidden rounded-xl border border-zinc-950/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/5">
                                        {client.logoMedia?.url || client.externalLogoUrl ? (
                                            <img
                                                src={client.logoMedia?.url ?? client.externalLogoUrl ?? ""}
                                                alt={
                                                    client.logoMedia?.altText ??
                                                    client.name
                                                }
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="grid h-full w-full place-items-center rounded-lg bg-zinc-100 text-center dark:bg-white/5">
                                                <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">
                                                    {fallbackInitials(client.name)}
                                                </span>
                                                <span className="sr-only">{client.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
                                                {client.name}
                                            </p>
                                            <StatusBadge
                                                tone={
                                                    client.isActive
                                                        ? "green"
                                                        : "neutral"
                                                }
                                            >
                                                {client.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        </div>
                                        {client.websiteUrl ? (
                                            <a
                                                href={client.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-white"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">
                                                    {client.websiteUrl}
                                                </span>
                                            </a>
                                        ) : (
                                            <Text className="mt-1">
                                                No website link
                                            </Text>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                        <Button
                                            type="button"
                                            color="light"
                                            onClick={() => editClient(client)}
                                        >
                                            <Edit3 data-slot="icon" />
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            color="light"
                                            onClick={() => toggleClient(client)}
                                        >
                                            <Power data-slot="icon" />
                                            {client.isActive
                                                ? "Inactive"
                                                : "Active"}
                                        </Button>
                                        <Button
                                            type="button"
                                            plain
                                            onClick={() => removeClient(client)}
                                        >
                                            <Trash2 data-slot="icon" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </PagePanel>
            </AdminShell>
        </>
    );
}
