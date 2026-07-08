import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    KeyRound,
    type LucideIcon,
    LogOut,
    Save,
    ShieldAlert,
    Trash2,
    Upload,
    UserPen,
} from "lucide-react";
import { useId, useState, type ChangeEvent, type ReactNode } from "react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import { FieldError, FormInput } from "@admin/Components/AdminPrimitives";
import type { AppPageProps } from "@admin/types";

type AccountEditProps = {
    account: {
        name: string;
        email: string;
        roleName: string | null;
        avatarUrl: string | null;
    };
};

function AccountPanel({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`overflow-hidden rounded-lg border border-zinc-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/95 ${className}`}
        >
            {children}
        </section>
    );
}

function SectionHeader({
    icon: Icon,
    title,
    description,
    badge,
    tone = "neutral",
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    badge?: ReactNode;
    tone?: "neutral" | "danger";
}) {
    const iconClasses =
        tone === "danger"
            ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"
            : "border-zinc-950/10 bg-zinc-950/5 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300";

    return (
        <div className="flex items-start gap-3 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-5">
            <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${iconClasses}`}
            >
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                        {title}
                    </h2>
                    {badge}
                </div>
                <Text className="mt-0.5">{description}</Text>
            </div>
        </div>
    );
}

function ActionBar({
    children,
    align = "end",
}: {
    children: ReactNode;
    align?: "between" | "end";
}) {
    return (
        <div
            className={`flex flex-col gap-2 border-t border-zinc-950/8 pt-4 dark:border-white/10 sm:flex-row sm:items-center ${
                align === "between" ? "sm:justify-between" : "sm:justify-end"
            }`}
        >
            {children}
        </div>
    );
}

function InitialAvatar({
    name,
    avatarUrl,
    className = "",
}: {
    name: string;
    avatarUrl: string | null;
    className?: string;
}) {
    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            className={`grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-full border border-zinc-950/10 bg-zinc-100 text-3xl font-semibold text-zinc-700 shadow-sm sm:h-40 sm:w-40 sm:text-4xl dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 ${className}`}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                initials || "U"
            )}
        </div>
    );
}

export default function AccountEdit({ account }: AccountEditProps) {
    const page = usePage<AppPageProps>();
    const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
    const profileForm = useForm({
        name: account.name ?? "",
        email: account.email ?? "",
    });
    const avatarForm = useForm<{
        avatar: File | null;
    }>({
        avatar: null,
    });
    const avatarInputId = useId();
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const deleteForm = useForm({
        password: "",
    });

    const signOut = () => {
        router.post("/admin/logout");
    };

    const submitAvatar = (event: ChangeEvent<HTMLInputElement>): void => {
        const input = event.currentTarget;
        const file = input.files?.[0] ?? null;

        if (!file) {
            return;
        }

        avatarForm.setData("avatar", file);
        avatarForm.post("/admin/account/avatar", {
            forceFormData: true,
            onFinish: () => {
                input.value = "";
            },
            onSuccess: () => avatarForm.reset("avatar"),
        });
    };

    const submitProfile = () => {
        profileForm.patch("/admin/account/profile", {
            onFinish: () => setShowEmailChangeModal(false),
        });
    };

    return (
        <>
            <Head title="My Account" />
            <AdminShell
                title="My Account"
                description="Update your CMS profile, profile photo, password, and account access."
            >
                {page.props.flash.status ? (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                        {page.props.flash.status}
                    </div>
                ) : null}

                <div className="grid w-full gap-4 lg:gap-5">
                    <AccountPanel>
                        <SectionHeader
                            icon={UserPen}
                            title="Profile"
                            description="Manage the photo, name, and login email shown across the CMS."
                            badge={
                                account.roleName ? (
                                    <span className="inline-flex max-w-full items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                                        <span className="truncate">
                                            {account.roleName}
                                        </span>
                                    </span>
                                ) : undefined
                            }
                        />

                        <form
                            className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start xl:gap-8"
                            onSubmit={(event) => {
                                event.preventDefault();

                                if (profileForm.data.email !== account.email) {
                                    setShowEmailChangeModal(true);

                                    return;
                                }

                                submitProfile();
                            }}
                        >
                            <div className="grid justify-items-start gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center lg:grid-cols-1 lg:justify-items-center lg:self-start">
                                <label
                                    htmlFor={avatarInputId}
                                    className="group relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-zinc-950 dark:focus-within:outline-white"
                                    title="Change profile photo"
                                >
                                    <InitialAvatar
                                        name={account.name}
                                        avatarUrl={account.avatarUrl}
                                        className="transition group-hover:brightness-75"
                                    />
                                    <span className="absolute inset-0 grid place-items-center rounded-full bg-zinc-950/0 text-white opacity-0 transition group-hover:bg-zinc-950/45 group-hover:opacity-100 group-focus-within:bg-zinc-950/45 group-focus-within:opacity-100">
                                        <Upload
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="sr-only">
                                        Choose profile photo
                                    </span>
                                    <input
                                        id={avatarInputId}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="sr-only"
                                        disabled={avatarForm.processing}
                                        onChange={submitAvatar}
                                    />
                                </label>

                                <div className="grid min-w-0 gap-2 lg:justify-items-center">
                                    {account.avatarUrl ? (
                                        <Button
                                            href="/admin/account/avatar"
                                            method="delete"
                                            color="light"
                                            className="justify-center"
                                            aria-label="Remove profile photo"
                                            title="Remove profile photo"
                                        >
                                            <Trash2
                                                data-slot="icon"
                                                aria-hidden="true"
                                            />
                                            Remove photo
                                        </Button>
                                    ) : null}
                                    <FieldError
                                        message={avatarForm.errors.avatar}
                                    />
                                </div>
                            </div>

                            <div className="grid min-w-0 content-start gap-5 lg:min-h-48">
                                <div className="grid max-w-3xl gap-4 md:grid-cols-2">
                                    <Field>
                                        <Label>Name</Label>
                                        <FormInput
                                            autoComplete="name"
                                            value={profileForm.data.name}
                                            onChange={(event) =>
                                                profileForm.setData(
                                                    "name",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={profileForm.errors.name}
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Email</Label>
                                        <FormInput
                                            type="email"
                                            autoComplete="username"
                                            value={profileForm.data.email}
                                            onChange={(event) =>
                                                profileForm.setData(
                                                    "email",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={profileForm.errors.email}
                                        />
                                    </Field>
                                </div>

                                <ActionBar>
                                    <Button
                                        type="submit"
                                        className="w-full justify-center sm:w-auto"
                                        disabled={profileForm.processing}
                                    >
                                        <Save
                                            data-slot="icon"
                                            aria-hidden="true"
                                        />
                                        Save profile
                                    </Button>
                                </ActionBar>
                            </div>
                        </form>
                    </AccountPanel>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-5">
                        <AccountPanel>
                            <SectionHeader
                                icon={KeyRound}
                                title="Change password"
                                description="Use your current password before setting a new one."
                            />

                            <form
                                className="grid gap-4 p-4 sm:p-5"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    passwordForm.patch(
                                        "/admin/account/password",
                                        {
                                            onSuccess: () =>
                                                passwordForm.reset(),
                                        },
                                    );
                                }}
                            >
                                <Field>
                                    <Label>Current password</Label>
                                    <FormInput
                                        type="password"
                                        autoComplete="current-password"
                                        value={
                                            passwordForm.data.current_password
                                        }
                                        onChange={(event) =>
                                            passwordForm.setData(
                                                "current_password",
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        message={
                                            passwordForm.errors.current_password
                                        }
                                    />
                                </Field>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field>
                                        <Label>New password</Label>
                                        <FormInput
                                            type="password"
                                            autoComplete="new-password"
                                            value={passwordForm.data.password}
                                            onChange={(event) =>
                                                passwordForm.setData(
                                                    "password",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={
                                                passwordForm.errors.password
                                            }
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Confirm password</Label>
                                        <FormInput
                                            type="password"
                                            autoComplete="new-password"
                                            value={
                                                passwordForm.data
                                                    .password_confirmation
                                            }
                                            onChange={(event) =>
                                                passwordForm.setData(
                                                    "password_confirmation",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            message={
                                                passwordForm.errors
                                                    .password_confirmation
                                            }
                                        />
                                    </Field>
                                </div>
                                <ActionBar>
                                    <Button
                                        type="submit"
                                        className="w-full justify-center sm:w-auto"
                                        disabled={passwordForm.processing}
                                    >
                                        <Save
                                            data-slot="icon"
                                            aria-hidden="true"
                                        />
                                        Change password
                                    </Button>
                                </ActionBar>
                            </form>
                        </AccountPanel>

                        <AccountPanel className="border-red-200/80 dark:border-red-500/25">
                            <SectionHeader
                                icon={ShieldAlert}
                                title="Account access"
                                description="Log out or deactivate your CMS account."
                                tone="danger"
                            />

                            <div className="grid gap-5 p-4 sm:p-5">
                                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-zinc-950 dark:text-white">
                                            Log out
                                        </p>
                                        <Text className="mt-1">
                                            End your active CMS session.
                                        </Text>
                                    </div>
                                    <Button
                                        type="button"
                                        color="light"
                                        onClick={signOut}
                                        className="justify-center justify-self-start md:justify-self-end"
                                    >
                                        <LogOut
                                            data-slot="icon"
                                            aria-hidden="true"
                                        />
                                        Log out
                                    </Button>
                                </div>

                                <form
                                    className="grid gap-3 border-t border-zinc-950/8 pt-5 dark:border-white/10"
                                    onSubmit={(event) => {
                                        event.preventDefault();

                                        if (
                                            window.confirm(
                                                "Deactivate your CMS account and sign out?",
                                            )
                                        ) {
                                            deleteForm.delete("/admin/account");
                                        }
                                    }}
                                >
                                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                                        <Field className="min-w-0 md:max-w-xs">
                                            <Label>Password</Label>
                                            <FormInput
                                                type="password"
                                                autoComplete="current-password"
                                                value={deleteForm.data.password}
                                                onChange={(event) =>
                                                    deleteForm.setData(
                                                        "password",
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                message={
                                                    deleteForm.errors.password
                                                }
                                            />
                                        </Field>
                                        <Button
                                            type="submit"
                                            color="light"
                                            className="justify-center justify-self-start md:justify-self-end"
                                            disabled={deleteForm.processing}
                                        >
                                            <Trash2
                                                data-slot="icon"
                                                aria-hidden="true"
                                            />
                                            Delete account
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </AccountPanel>
                    </div>
                </div>
            </AdminShell>

            {showEmailChangeModal ? (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/70 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="email-change-modal-title"
                    onClick={() => {
                        if (!profileForm.processing) {
                            setShowEmailChangeModal(false);
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-lg border border-white/10 bg-white p-5 shadow-2xl dark:bg-zinc-950"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2
                            id="email-change-modal-title"
                            className="text-lg font-semibold text-zinc-950 dark:text-white"
                        >
                            Change login email?
                        </h2>
                        <Text className="mt-2">
                            Saving this email change will update the database,
                            log you out, and require you to sign in again with
                            the new email address.
                        </Text>

                        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                plain
                                className="justify-center"
                                onClick={() => setShowEmailChangeModal(false)}
                                disabled={profileForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="justify-center"
                                onClick={submitProfile}
                                disabled={profileForm.processing}
                            >
                                Change email
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
