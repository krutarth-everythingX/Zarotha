import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
    EmptyState,
    FieldError,
    FormInput,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PagePanel,
    PaginationLinks,
    SearchFilterPanel,
    StatusBadge,
} from "@admin/Components/AdminPrimitives";
import type { Paginated } from "@admin/types";

type RedirectItem = {
    id: number;
    sourcePath: string;
    targetPath: string;
    redirectType: "slug_history" | "manual";
    httpStatus: 301 | 302;
    isActive: boolean;
};

type RedirectsIndexProps = {
    redirects: Paginated<RedirectItem>;
    filters: {
        search: string | null;
    };
};

export default function RedirectsIndex({
    redirects,
    filters,
}: RedirectsIndexProps) {
    const [selectedRedirect, setSelectedRedirect] =
        useState<RedirectItem | null>(null);
    const form = useForm({
        source_path: "",
        target_path: "",
        redirect_type: "manual",
        http_status: 301,
        is_active: true,
    });
    const redirectError = (form.errors as Record<string, string | undefined>)
        .redirect;

    return (
        <>
            <Head title="Redirects" />
            <AdminShell
                title="Redirects"
                description="Manage path redirects. Source paths stay unique and loops remain blocked server-side."
            >
                <PagePanel>
                    <form
                        className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post("/admin/redirects");
                        }}
                    >
                        <Field>
                            <Label>Source path</Label>
                            <FormInput
                                value={form.data.source_path}
                                onChange={(event) =>
                                    form.setData(
                                        "source_path",
                                        event.target.value,
                                    )
                                }
                                placeholder="/old-path"
                            />
                            <FieldError
                                message={
                                    form.errors.source_path ?? redirectError
                                }
                            />
                        </Field>
                        <Field>
                            <Label>Target path</Label>
                            <FormInput
                                value={form.data.target_path}
                                onChange={(event) =>
                                    form.setData(
                                        "target_path",
                                        event.target.value,
                                    )
                                }
                                placeholder="/new-path"
                            />
                            <FieldError message={form.errors.target_path} />
                        </Field>
                        <div className="flex items-end">
                            <Button
                                type="submit"
                                className="w-full justify-center lg:w-auto"
                            >
                                Add redirect
                            </Button>
                        </div>
                    </form>
                </PagePanel>

                <ListTablePanel
                    toolbar={
                        <SearchFilterPanel
                            action="/admin/redirects"
                            clearHref="/admin/redirects"
                            variant="toolbar"
                            searchValue={filters.search}
                            searchPlaceholder="Search redirects"
                            hasActiveFilters={Boolean(filters.search)}
                        />
                    }
                    footer={
                        <PaginationLinks
                            meta={redirects.meta}
                            baseUrl="/admin/redirects"
                        />
                    }
                >
                    {redirects.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No redirects found"
                                description="Create redirects for slug history or manual path changes."
                            />
                        </div>
                    ) : (
                        <>
                            <MobileTableList>
                                {redirects.data.map((redirect, index) => (
                                    <MobileTableRow
                                        key={redirect.id}
                                        number={
                                            (redirects.meta.from ?? 1) + index
                                        }
                                        title={redirect.sourcePath}
                                        subtitle={redirect.targetPath}
                                        badge={
                                            <StatusBadge
                                                tone={
                                                    redirect.isActive
                                                        ? "green"
                                                        : "amber"
                                                }
                                            >
                                                {redirect.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </StatusBadge>
                                        }
                                        onOpen={() =>
                                            setSelectedRedirect(redirect)
                                        }
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col />
                                        <col />
                                        <col className="w-[140px]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Source
                                            </th>
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Target
                                            </th>
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                        {redirects.data.map((redirect) => (
                                            <tr
                                                key={redirect.id}
                                                className="align-middle"
                                            >
                                                <td className="px-4 py-2.5 text-center">
                                                    <p className="font-medium text-zinc-950 dark:text-white">
                                                        {redirect.sourcePath}
                                                    </p>
                                                    <Text>
                                                        {redirect.redirectType}
                                                    </Text>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <p className="font-medium text-zinc-950 dark:text-white">
                                                        {redirect.targetPath}
                                                    </p>
                                                    <Text>
                                                        {redirect.httpStatus}
                                                    </Text>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <div className="flex justify-center">
                                                        <StatusBadge
                                                            tone={
                                                                redirect.isActive
                                                                    ? "green"
                                                                    : "amber"
                                                            }
                                                        >
                                                            {redirect.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </StatusBadge>
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

                {selectedRedirect ? (
                    <DetailModal
                        title={selectedRedirect.sourcePath}
                        subtitle={`To ${selectedRedirect.targetPath}`}
                        badge={
                            <StatusBadge
                                tone={
                                    selectedRedirect.isActive
                                        ? "green"
                                        : "amber"
                                }
                            >
                                {selectedRedirect.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </StatusBadge>
                        }
                        onClose={() => setSelectedRedirect(null)}
                        titleId="redirect-detail-title"
                    >
                        <DetailSection title="Redirect Details">
                            <DetailGrid>
                                <DetailItem label="No.">
                                    {redirects.data.findIndex(
                                        (redirect) =>
                                            redirect.id === selectedRedirect.id,
                                    ) + (redirects.meta.from ?? 1)}
                                </DetailItem>
                                <DetailItem label="HTTP Status">
                                    {selectedRedirect.httpStatus}
                                </DetailItem>
                                <DetailItem label="Source Path" full>
                                    {selectedRedirect.sourcePath}
                                </DetailItem>
                                <DetailItem label="Target Path" full>
                                    {selectedRedirect.targetPath}
                                </DetailItem>
                                <DetailItem label="Type">
                                    {selectedRedirect.redirectType}
                                </DetailItem>
                                <DetailItem label="Status">
                                    {selectedRedirect.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </DetailItem>
                            </DetailGrid>
                        </DetailSection>
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}
