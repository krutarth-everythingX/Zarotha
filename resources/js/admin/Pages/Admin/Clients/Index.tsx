import { Head, router, useForm } from "@inertiajs/react";
import {
    Edit3,
    ExternalLink,
    Globe2,
    Plus,
    Power,
    PowerOff,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    MediaDropSelect,
    type MediaOption as UploadMediaOption,
} from "@admin/Components/MediaDropSelect";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
    EmptyState,
    FieldError,
    FormInput,
    FormSelect,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PaginationLinks,
    SearchFilterPanel,
    StatusBadge,
    StatsStrip,
} from "@admin/Components/AdminPrimitives";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import { useLockedAdminScroll } from "@admin/hooks/useLockedAdminScroll";
import type { Paginated } from "@admin/types";
import { useMemo } from "react";

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
    clients: Paginated<ClientPayload>;
    mediaOptions: MediaOption[];
    filters: {
        search: string | null;
        is_active: string | null;
    };
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
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
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "CL"
    );
}

function faviconUrl(websiteUrl: string) {
    try {
        const parsedUrl = new URL(websiteUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return null;
        }

        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsedUrl.hostname.toLowerCase())}&sz=128`;
    } catch {
        return null;
    }
}

function ToggleField({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            type="button"
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-950/10 bg-white p-3 text-left shadow-sm dark:border-white/10 dark:bg-white/5"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
        >
            <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-950 dark:text-white">
                    Active
                </span>
                <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
                    Show this client in the public homepage marquee.
                </span>
            </span>
            <span
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                    checked
                        ? "bg-zinc-950 dark:bg-white"
                        : "bg-zinc-300 dark:bg-zinc-700"
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform dark:bg-zinc-950 ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </span>
        </button>
    );
}

function ClientLogo({
    client,
    className = "h-12 w-12",
}: {
    client: ClientPayload;
    className?: string;
}) {
    const logoUrl = client.logoMedia?.url ?? client.externalLogoUrl;

    return (
        <div
            className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-zinc-950/10 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5 ${className}`}
        >
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={client.logoMedia?.altText ?? client.name}
                    className="max-h-full max-w-full object-contain"
                />
            ) : (
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                    {fallbackInitials(client.name)}
                </span>
            )}
        </div>
    );
}

export default function ClientsIndex({
    clients,
    mediaOptions,
    filters,
    stats,
}: ClientsIndexProps) {
    const [mediaChoices, setMediaChoices] =
        useState<MediaOption[]>(mediaOptions);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientPayload | null>(
        null,
    );
    const [selectedClient, setSelectedClient] = useState<ClientPayload | null>(
        null,
    );
    useLockedAdminScroll(drawerOpen);

    const firstClientNumber = clients.meta.from ?? 1;
    const clientFilterFields = useMemo(
        () => [
            {
                name: "is_active",
                label: "Status",
                value: filters.is_active,
                allLabel: "All",
                options: [
                    { value: "1", label: "Active" },
                    { value: "0", label: "Inactive" },
                ],
            },
        ],
        [filters.is_active],
    );

    const form = useForm<ClientForm>({
        ...emptyClientForm,
        sort_order: clients.meta.total,
    });

    const selectedLogo = imageFor(mediaChoices, form.data.logo_media_id);
    const websiteLogoUrl =
        form.data.logo_media_id === ""
            ? faviconUrl(form.data.website_url)
            : null;
    const hasLogoSource =
        form.data.logo_media_id !== "" || websiteLogoUrl !== null;

    useEffect(() => {
        if (!drawerOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setDrawerOpen(false);
                setEditingClient(null);
                form.clearErrors();
                form.setData({
                    ...emptyClientForm,
                    sort_order: clients.meta.total,
                });
            }
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [clients.meta.total, drawerOpen, form]);

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
        setEditingClient(null);
        form.clearErrors();
        form.setData({
            ...emptyClientForm,
            sort_order: clients.meta.total,
        });
    };

    const openAddDrawer = () => {
        resetForm();
        setDrawerOpen(true);
    };

    const openEditDrawer = (client: ClientPayload) => {
        setEditingClient(client);
        form.clearErrors();
        form.setData({
            name: client.name,
            website_url: client.websiteUrl ?? "",
            logo_media_id: emptyToId(client.logoMediaId),
            sort_order: client.sortOrder,
            is_active: client.isActive,
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        resetForm();
    };

    const saveClient = () => {
        const options = {
            preserveScroll: true,
            onSuccess: closeDrawer,
        };

        if (editingClient) {
            form.patch(`/admin/clients/${editingClient.id}`, options);
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
                if (editingClient?.id === client.id) {
                    closeDrawer();
                }
                if (selectedClient?.id === client.id) {
                    setSelectedClient(null);
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
                description="List, add, edit, remove, and switch client logos active or inactive."
                actions={
                    <Button type="button" onClick={openAddDrawer}>
                        <Plus data-slot="icon" />
                        Add client
                    </Button>
                }
            >
                <StatsStrip
                    items={[
                        { label: "Total", value: stats.total, tone: "blue" },
                        { label: "Active", value: stats.active, tone: "green" },
                        {
                            label: "Inactive",
                            value: stats.inactive,
                            tone: "amber",
                        },
                    ]}
                />

                <ListTablePanel
                    toolbar={
                        <SearchFilterPanel
                            action="/admin/clients"
                            clearHref="/admin/clients"
                            variant="toolbar"
                            searchValue={filters.search}
                            searchPlaceholder="Search clients"
                            hasActiveFilters={Boolean(
                                filters.search || filters.is_active,
                            )}
                            filterFields={clientFilterFields}
                        />
                    }
                    footer={
                        <PaginationLinks
                            meta={clients.meta}
                            baseUrl="/admin/clients"
                        />
                    }
                >
                    {clients.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No clients found"
                                description="Add client logos to show trusted brands on the homepage."
                            />
                        </div>
                    ) : (
                        <>
                            <MobileTableList className="p-4">
                                {clients.data.map((client, index) => (
                                    <MobileTableRow
                                        key={client.id}
                                        number={firstClientNumber + index}
                                        title={client.name}
                                        subtitle={
                                            client.websiteUrl ??
                                            "Uploaded logo only"
                                        }
                                        media={
                                            <ClientLogo
                                                client={client}
                                                className="h-10 w-10"
                                            />
                                        }
                                        badge={
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
                                        }
                                        onOpen={() => setSelectedClient(client)}
                                    />
                                ))}
                            </MobileTableList>

                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col className="w-[4rem]" />
                                        <col className="w-[112px]" />
                                        <col />
                                        <col className="w-[130px]" />
                                        <col className="w-[90px]" />
                                        <col className="w-[220px]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                No.
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Logo
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Client
                                            </th>
                                            <th className="px-4 py-2.5 text-left text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Status
                                            </th>
                                            <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Sort
                                            </th>
                                            <th className="px-4 py-2.5 text-right text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                        {clients.data.map((client, index) => (
                                            <tr
                                                key={client.id}
                                                className="cursor-pointer align-middle"
                                                onClick={() =>
                                                    setSelectedClient(client)
                                                }
                                            >
                                                <td className="px-4 py-2.5">
                                                    <Text>
                                                        {firstClientNumber +
                                                            index}
                                                    </Text>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <ClientLogo
                                                        client={client}
                                                    />
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <p className="truncate text-sm font-medium leading-5 text-zinc-950 dark:text-white">
                                                        {client.name}
                                                    </p>
                                                    {client.websiteUrl ? (
                                                        <a
                                                            href={
                                                                client.websiteUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-white"
                                                            onClick={(
                                                                event,
                                                            ) =>
                                                                event.stopPropagation()
                                                            }
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    client.websiteUrl
                                                                }
                                                            </span>
                                                        </a>
                                                    ) : (
                                                        <Text>
                                                            Uploaded logo only
                                                        </Text>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2.5">
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
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <Text>
                                                        {client.sortOrder}
                                                    </Text>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <div
                                                        className="flex items-center justify-end gap-2"
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        <Button
                                                            type="button"
                                                            color="light"
                                                            className="h-9 w-9 px-0"
                                                            aria-label={`Edit ${client.name}`}
                                                            title={`Edit ${client.name}`}
                                                            onClick={() =>
                                                                openEditDrawer(
                                                                    client,
                                                                )
                                                            }
                                                        >
                                                            <Edit3 data-slot="icon" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            color="light"
                                                            className="h-9 w-9 px-0"
                                                            aria-label={`${client.isActive ? "Deactivate" : "Activate"} ${client.name}`}
                                                            title={`${client.isActive ? "Deactivate" : "Activate"} ${client.name}`}
                                                            onClick={() =>
                                                                toggleClient(
                                                                    client,
                                                                )
                                                            }
                                                        >
                                                                {client.isActive ? (
                                                                    <PowerOff data-slot="icon" />
                                                                ) : (
                                                                    <Power data-slot="icon" />
                                                                )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            plain
                                                            className="h-9 w-9 px-0"
                                                            aria-label={`Remove ${client.name}`}
                                                            title={`Remove ${client.name}`}
                                                            onClick={() =>
                                                                removeClient(
                                                                    client,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 data-slot="icon" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </ListTablePanel>

                {selectedClient ? (
                    <DetailModal
                        title={selectedClient.name}
                        subtitle={
                            selectedClient.websiteUrl ?? "Uploaded logo only"
                        }
                        badge={
                            <StatusBadge
                                tone={
                                    selectedClient.isActive
                                        ? "green"
                                        : "neutral"
                                }
                            >
                                {selectedClient.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedClient(null)}
                        titleId="client-detail-title"
                        actions={
                            <>
                                <Button
                                    type="button"
                                    className="justify-center"
                                    onClick={() => {
                                        openEditDrawer(selectedClient);
                                        setSelectedClient(null);
                                    }}
                                >
                                    <Edit3 data-slot="icon" />
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    color="light"
                                    className="justify-center"
                                    onClick={() => toggleClient(selectedClient)}
                                >
                                    {selectedClient.isActive ? (
                                        <PowerOff data-slot="icon" />
                                    ) : (
                                        <Power data-slot="icon" />
                                    )}
                                    {selectedClient.isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                </Button>
                                <Button
                                    type="button"
                                    plain
                                    className="justify-center"
                                    onClick={() => removeClient(selectedClient)}
                                >
                                    <Trash2 data-slot="icon" />
                                    Remove
                                </Button>
                            </>
                        }
                    >
                        <div className="space-y-4">
                            <DetailSection title="Client">
                                <div className="mb-4 flex items-center gap-3">
                                    <ClientLogo
                                        client={selectedClient}
                                        className="h-14 w-14"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
                                            {selectedClient.name}
                                        </p>
                                        <Text className="truncate">
                                            {selectedClient.websiteUrl ??
                                                "Uploaded logo only"}
                                        </Text>
                                    </div>
                                </div>
                                <DetailGrid>
                                    <DetailItem label="No.">
                                        {clients.data.findIndex(
                                            (client) =>
                                                client.id === selectedClient.id,
                                        ) + firstClientNumber}
                                    </DetailItem>
                                    <DetailItem label="Sort Order">
                                        {selectedClient.sortOrder}
                                    </DetailItem>
                                    <DetailItem label="Website" full>
                                        {selectedClient.websiteUrl ? (
                                            <a
                                                href={selectedClient.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex max-w-full items-center gap-1 truncate underline decoration-zinc-300 underline-offset-4 hover:text-zinc-700 dark:decoration-zinc-600 dark:hover:text-zinc-200"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">
                                                    {selectedClient.websiteUrl}
                                                </span>
                                            </a>
                                        ) : null}
                                    </DetailItem>
                                </DetailGrid>
                            </DetailSection>

                            <DetailSection title="Logo Source">
                                <DetailGrid>
                                    <DetailItem label="Media ID">
                                        {selectedClient.logoMediaId}
                                    </DetailItem>
                                    <DetailItem label="External Logo">
                                        {selectedClient.externalLogoUrl}
                                    </DetailItem>
                                    <DetailItem label="Media Label" full>
                                        {selectedClient.logoMedia?.label}
                                    </DetailItem>
                                </DetailGrid>
                            </DetailSection>
                        </div>
                    </DetailModal>
                ) : null}

                {drawerOpen ? (
                    <div
                        className="fixed inset-0 z-[80]"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="client-drawer-title"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 h-full w-full bg-zinc-950/45"
                            aria-label="Close client drawer"
                            onClick={closeDrawer}
                        />
                        <form
                            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-zinc-950 sm:border-l sm:border-zinc-950/10 dark:sm:border-white/10"
                            onSubmit={(event) => {
                                event.preventDefault();
                                saveClient();
                            }}
                        >
                            <div className="flex items-start justify-between gap-4 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-6">
                                <div>
                                    <h2
                                        id="client-drawer-title"
                                        className="text-lg font-semibold text-zinc-950 dark:text-white"
                                    >
                                        {editingClient
                                            ? "Edit client"
                                            : "Add client"}
                                    </h2>
                                    <Text>
                                        Add a website to fetch its logo, or
                                        upload a logo manually.
                                    </Text>
                                </div>
                                <Button
                                    type="button"
                                    plain
                                    className="h-10 w-10 px-0"
                                    onClick={closeDrawer}
                                    aria-label="Close drawer"
                                >
                                    <X data-slot="icon" />
                                </Button>
                            </div>

                            <div className="admin-hidden-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                                <div className="grid gap-5">
                                    <Field>
                                        <Label>Name</Label>
                                        <FormInput
                                            value={form.data.name}
                                            onChange={(event) =>
                                                form.setData(
                                                    "name",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Client name"
                                            autoFocus
                                        />
                                        <FieldError
                                            message={form.errors.name}
                                        />
                                    </Field>

                                    <Field>
                                        <Label>Website link</Label>
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

                                    {websiteLogoUrl ? (
                                        <div className="rounded-2xl border border-zinc-950/8 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-zinc-950/10 bg-white p-2 dark:border-white/10 dark:bg-zinc-900">
                                                    <img
                                                        src={websiteLogoUrl}
                                                        alt=""
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                        Website logo found
                                                    </p>
                                                    <Text className="truncate">
                                                        This logo will be used
                                                        unless you upload
                                                        another one.
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-zinc-950/8 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-zinc-950/10 bg-white text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
                                                    <Globe2 className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                                                        No website logo source
                                                    </p>
                                                    <Text>
                                                        Add a website link or
                                                        upload a logo before
                                                        saving.
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Field>
                                        <Label>Logo upload</Label>
                                        <MediaDropSelect
                                            value={form.data.logo_media_id}
                                            options={mediaChoices}
                                            onChange={(value) =>
                                                form.setData(
                                                    "logo_media_id",
                                                    value,
                                                )
                                            }
                                            onUploaded={rememberUploadedMedia}
                                            preview={selectedLogo}
                                            label="Client logo"
                                        />
                                        <FieldError
                                            message={form.errors.logo_media_id}
                                        />
                                    </Field>

                                    <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
                                        <Field>
                                            <Label>Status</Label>
                                            <FormSelect
                                                value={
                                                    form.data.is_active
                                                        ? "1"
                                                        : "0"
                                                }
                                                onChange={(event) =>
                                                    form.setData(
                                                        "is_active",
                                                        event.target.value ===
                                                            "1",
                                                    )
                                                }
                                            >
                                                <option value="1">
                                                    Active
                                                </option>
                                                <option value="0">
                                                    Inactive
                                                </option>
                                            </FormSelect>
                                        </Field>

                                        <Field>
                                            <Label>Sort</Label>
                                            <FormInput
                                                type="number"
                                                min={0}
                                                value={form.data.sort_order}
                                                onChange={(event) =>
                                                    form.setData(
                                                        "sort_order",
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                            <FieldError
                                                message={form.errors.sort_order}
                                            />
                                        </Field>
                                    </div>

                                    <ToggleField
                                        checked={form.data.is_active}
                                        onChange={(checked) =>
                                            form.setData("is_active", checked)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 border-t border-zinc-950/8 bg-white px-4 py-4 dark:border-white/10 dark:bg-zinc-950 sm:flex sm:flex-row-reverse sm:px-6">
                                <Button
                                    type="submit"
                                    disabled={form.processing || !hasLogoSource}
                                    className="justify-center"
                                >
                                    {editingClient ? (
                                        <Edit3 data-slot="icon" />
                                    ) : (
                                        <Plus data-slot="icon" />
                                    )}
                                    {form.processing ? "Saving" : "Save client"}
                                </Button>
                                <Button
                                    type="button"
                                    color="light"
                                    className="justify-center"
                                    onClick={closeDrawer}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : null}
            </AdminShell>
        </>
    );
}
