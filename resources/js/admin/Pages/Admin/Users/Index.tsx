import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, FormInput, FormSelect, PagePanel, PaginationLinks, StatusBadge } from '@admin/Components/AdminPrimitives';
import type { Paginated, SelectOption } from '@admin/types';

type UserItem = {
    id: number;
    name: string;
    email: string;
    roleSlug: string;
    isActive: boolean;
    lastLoginAt: string | null;
};

type UsersIndexProps = {
    users: Paginated<UserItem>;
    roleOptions: SelectOption[];
};

export default function UsersIndex({ users, roleOptions }: UsersIndexProps) {
    const form = useForm({
        name: '',
        email: '',
        role_id: '',
        password: '',
        password_confirmation: '',
        is_active: true,
    });

    return (
        <>
            <Head title="Users" />
            <AdminShell title="Users" description="Manage CMS users and roles. User management remains restricted to super administrators.">
                <PagePanel>
                    <form
                        className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_1fr_auto]"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/admin/users');
                        }}
                    >
                        <Field>
                            <Label>Name</Label>
                            <FormInput value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Email</Label>
                            <FormInput type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                        </Field>
                        <Field>
                            <Label>Role</Label>
                            <FormSelect value={form.data.role_id} onChange={(event) => form.setData('role_id', event.target.value)}>
                                <option value="">Choose role</option>
                                {roleOptions.map((role) => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                            </FormSelect>
                        </Field>
                        <Field>
                            <Label>Password</Label>
                            <FormInput type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} />
                        </Field>
                        <div className="flex items-end">
                            <Button type="submit">Create user</Button>
                        </div>
                    </form>
                </PagePanel>

                <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {users.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No users found" description="Create CMS users here when additional administrators are needed." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {users.data.map((user) => (
                                <article key={user.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_160px_140px_auto] lg:items-center">
                                    <div>
                                        <p className="font-medium text-zinc-950 dark:text-white">{user.name}</p>
                                        <Text>{user.email}</Text>
                                    </div>
                                    <Text>{user.roleSlug}</Text>
                                    <StatusBadge tone={user.isActive ? 'green' : 'amber'}>{user.isActive ? 'Active' : 'Inactive'}</StatusBadge>
                                    {user.isActive ? (
                                        <Button href={`/admin/users/${user.id}/deactivate`} method="post" color="light">
                                            Deactivate
                                        </Button>
                                    ) : null}
                                </article>
                            ))}
                        </div>
                    )}
                    <PaginationLinks meta={users.meta} baseUrl="/admin/users" />
                </div>
            </AdminShell>
        </>
    );
}
