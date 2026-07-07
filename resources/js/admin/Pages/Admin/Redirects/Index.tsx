import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FieldError, FormInput, PagePanel, PaginationLinks, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { Paginated } from '@admin/types';

type RedirectItem = {
    id: number;
    sourcePath: string;
    targetPath: string;
    redirectType: 'slug_history' | 'manual';
    httpStatus: 301 | 302;
    isActive: boolean;
};

type RedirectsIndexProps = {
    redirects: Paginated<RedirectItem>;
    filters: {
        search: string | null;
    };
};

export default function RedirectsIndex({ redirects, filters }: RedirectsIndexProps) {
    const form = useForm({
        source_path: '',
        target_path: '',
        redirect_type: 'manual',
        http_status: 301,
        is_active: true,
    });
    const redirectError = (form.errors as Record<string, string | undefined>).redirect;

    return (
        <>
            <Head title="Redirects" />
            <AdminShell title="Redirects" description="Manage path redirects. Source paths stay unique and loops remain blocked server-side.">
                <PagePanel>
                    <form
                        className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/admin/redirects');
                        }}
                    >
                        <Field>
                            <Label>Source path</Label>
                            <FormInput value={form.data.source_path} onChange={(event) => form.setData('source_path', event.target.value)} placeholder="/old-path" />
                            <FieldError message={form.errors.source_path ?? redirectError} />
                        </Field>
                        <Field>
                            <Label>Target path</Label>
                            <FormInput value={form.data.target_path} onChange={(event) => form.setData('target_path', event.target.value)} placeholder="/new-path" />
                            <FieldError message={form.errors.target_path} />
                        </Field>
                        <div className="flex items-end">
                            <Button type="submit">Add redirect</Button>
                        </div>
                    </form>
                </PagePanel>

                <PagePanel className="mt-6">
                    <form className="grid gap-4 sm:grid-cols-[1fr_auto]" method="get" action="/admin/redirects">
                        <Field>
                            <Label>Search redirects</Label>
                            <FormInput name="search" defaultValue={filters.search ?? ''} />
                        </Field>
                        <div className="flex items-end gap-2">
                            <Button type="submit" color="light">Search</Button>
                            <Button href="/admin/redirects" plain>Clear</Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {redirects.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No redirects found" description="Create redirects for slug history or manual path changes." />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col className="w-[140px]" />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Source</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Target</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-950/8 dark:divide-white/10">
                                    {redirects.data.map((redirect) => (
                                        <tr key={redirect.id} className="align-middle">
                                            <td className="px-4 py-2.5 text-center">
                                                <p className="font-medium text-zinc-950 dark:text-white">{redirect.sourcePath}</p>
                                                <Text>{redirect.redirectType}</Text>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <p className="font-medium text-zinc-950 dark:text-white">{redirect.targetPath}</p>
                                                <Text>{redirect.httpStatus}</Text>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <div className="flex justify-center">
                                                    <StatusBadge tone={redirect.isActive ? 'green' : 'amber'}>
                                                        {redirect.isActive ? 'Active' : 'Inactive'}
                                                    </StatusBadge>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <PaginationLinks meta={redirects.meta} baseUrl="/admin/redirects" />
                </div>
            </AdminShell>
        </>
    );
}
