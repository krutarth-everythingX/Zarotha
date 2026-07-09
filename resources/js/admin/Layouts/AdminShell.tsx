import { Link, router, usePage } from "@inertiajs/react";
import type React from "react";
import { useEffect, useState } from "react";
import {
    ChevronDown,
    CircleUserRound,
    FolderTree,
    Handshake,
    Inbox,
    LayoutDashboard,
    LogOut,
    Moon,
    Quote,
    Settings,
    ShoppingBag,
    Sun,
    UserPen,
} from "lucide-react";
import { Heading } from "@admin/Components/ui/heading";
import {
    Navbar,
    NavbarSection,
    NavbarSpacer,
} from "@admin/Components/ui/navbar";
import {
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    SidebarSpacer,
} from "@admin/Components/ui/sidebar";
import { SidebarLayout } from "@admin/Components/ui/sidebar-layout";
import { Text } from "@admin/Components/ui/text";
import { Button } from "@admin/Components/ui/button";
import type { AppPageProps } from "@admin/types";
import {
    initialAdminTheme,
    rememberAdminTheme,
    type AdminTheme,
} from "@admin/theme";

function UserAvatar({
    name,
    avatarUrl,
    size = "sm",
}: {
    name: string;
    avatarUrl?: string | null;
    size?: "sm" | "lg";
}) {
    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const sizeClass = size === "lg" ? "h-20 w-20 text-xl" : "h-8 w-8 text-xs";

    return (
        <div
            className={`${sizeClass} grid shrink-0 place-items-center overflow-hidden rounded-full border border-zinc-950/10 bg-zinc-100 font-semibold text-zinc-700 shadow-sm dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100`}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                initials || <CircleUserRound className="h-5 w-5" />
            )}
        </div>
    );
}

const navigation = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Category", href: "/admin/categories", icon: FolderTree },
    { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
    { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
    { label: "Our Clients", href: "/admin/clients", icon: Handshake },
    { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

function AdminBrandLogo({ className = "" }: { className?: string }) {
    const page = usePage<AppPageProps>();

    return (
        <Link
            href="/admin"
            className="inline-flex min-w-0 items-center rounded-lg no-underline"
        >
            <img
                src="/images/admin-sidebar-logo.webp"
                alt={page.props.appName}
                width={367}
                height={128}
                loading="eager"
                decoding="async"
                className={`h-auto w-auto max-w-full object-contain object-left ${className}`}
            />
        </Link>
    );
}

type AdminShellProps = {
    title: string;
    description: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    containedScroll?: boolean;
    mobileTitle?: string;
    mobileDescription?: React.ReactNode;
    mobileActions?: React.ReactNode | null;
    mobileBreadcrumbs?: React.ReactNode;
};

export function AdminShell({
    title,
    description,
    children,
    actions,
    containedScroll = false,
    mobileTitle,
    mobileDescription,
    mobileActions,
    mobileBreadcrumbs,
}: AdminShellProps) {
    const page = usePage<AppPageProps>();
    const user = page.props.auth.user;
    const userId = user?.id;
    const userTheme = user?.admin_theme;
    const userName = user?.name ?? "CMS User";
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [theme, setTheme] = useState<AdminTheme>(() =>
        initialAdminTheme(userId, userTheme),
    );

    useEffect(() => {
        const nextTheme = initialAdminTheme(userId, userTheme);

        setTheme(nextTheme);
        rememberAdminTheme(nextTheme, userId);

        if (userId && nextTheme !== userTheme) {
            router.patch(
                "/admin/account/theme",
                { theme: nextTheme },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    }, [userId, userTheme]);

    const signOut = () => {
        window.location.assign("/admin/logout");
    };

    const nextTheme = theme === "dark" ? "light" : "dark";
    const NextThemeIcon = nextTheme === "dark" ? Moon : Sun;

    const selectTheme = (nextTheme: AdminTheme) => {
        if (nextTheme === theme) {
            return;
        }

        const previousTheme = theme;

        setTheme(nextTheme);
        rememberAdminTheme(nextTheme, userId);
        router.patch(
            "/admin/account/theme",
            { theme: nextTheme },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setTheme(previousTheme);
                    rememberAdminTheme(previousTheme, userId);
                },
            },
        );
    };

    const sidebar = (
        <Sidebar>
            <SidebarHeader className="max-lg:hidden">
                <SidebarSection>
                    <AdminBrandLogo className="max-h-14 max-w-[12rem]" />
                </SidebarSection>
            </SidebarHeader>
            <SidebarBody>
                <SidebarSection>
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <SidebarItem
                                key={item.href}
                                href={item.href}
                                current={
                                    item.href === "/admin"
                                        ? page.url === "/admin"
                                        : item.href === "/admin/settings"
                                            ? page.url.startsWith(
                                                "/admin/settings",
                                            ) ||
                                            page.url.startsWith(
                                                "/admin/homepage",
                                            ) ||
                                            page.url.startsWith(
                                                "/admin/pages",
                                            ) ||
                                            page.url.startsWith(
                                                "/admin/social-links",
                                            ) ||
                                            page.url.startsWith(
                                                "/admin/contact-socials",
                                            )
                                            : page.url.startsWith(item.href)
                                }
                            >
                                <Icon
                                    data-slot="icon"
                                    aria-hidden="true"
                                    strokeWidth={2}
                                />
                                <SidebarLabel>{item.label}</SidebarLabel>
                            </SidebarItem>
                        );
                    })}
                </SidebarSection>
                <SidebarSpacer />
            </SidebarBody>
            <SidebarFooter>
                <SidebarSection className="relative gap-3">
                    {showAccountMenu ? (
                        <div className="absolute bottom-full left-0 right-0 mb-8 rounded-xl border border-zinc-950/10 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-zinc-950">
                            <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-normal text-zinc-700 transition hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white"
                                onClick={() => {
                                    selectTheme(nextTheme);
                                    setShowAccountMenu(false);
                                }}
                            >
                                <NextThemeIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                {nextTheme === "dark"
                                    ? "Dark theme"
                                    : "Light theme"}
                            </button>
                            <Link
                                href="/admin/account"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-normal text-zinc-700 no-underline transition hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white"
                                onClick={() => setShowAccountMenu(false)}
                            >
                                <UserPen
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                My Account
                            </Link>
                            <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-normal text-zinc-700 transition hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white"
                                onClick={() => {
                                    setShowAccountMenu(false);
                                    setShowSignOutModal(true);
                                }}
                            >
                                <LogOut
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                Sign out
                            </button>
                        </div>
                    ) : null}

                    <button
                        type="button"
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1 text-left transition hover:bg-zinc-950/5 dark:hover:bg-white/5"
                        onClick={() =>
                            setShowAccountMenu((current) => !current)
                        }
                        aria-expanded={showAccountMenu}
                    >
                        <UserAvatar
                            name={userName}
                            avatarUrl={user?.avatarUrl}
                        />
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm/5 font-normal text-zinc-950 dark:text-white">
                                    {userName}
                                </p>
                                <p className="truncate text-xs/4 text-zinc-500 dark:text-zinc-400">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${showAccountMenu ? "rotate-180" : ""}`}
                                aria-hidden="true"
                            />
                        </div>
                    </button>
                </SidebarSection>
            </SidebarFooter>
        </Sidebar>
    );

    const navbar = (
        <Navbar>
            <NavbarSection>
                <AdminBrandLogo className="max-h-11 max-w-[8.75rem] sm:max-w-[10rem]" />
            </NavbarSection>
            <NavbarSpacer />
        </Navbar>
    );

    const mobileSidebarHeader = (
        <AdminBrandLogo className="max-h-11 max-w-[8.75rem] sm:max-w-[10rem]" />
    );

    return (
        <>
            <SidebarLayout
                navbar={navbar}
                sidebar={sidebar}
                mobileSidebarHeader={mobileSidebarHeader}
                containedScroll={containedScroll}
            >
                <header
                    className={`space-y-3 ${containedScroll ? "lg:shrink-0" : ""}`}
                >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                        {mobileTitle ? (
                            <>
                                <Heading className="hidden min-w-0 flex-1 truncate md:block">
                                    {title}
                                </Heading>
                                <Heading className="min-w-0 flex-1 truncate md:hidden">
                                    {mobileTitle}
                                </Heading>
                            </>
                        ) : (
                            <Heading className="min-w-0 flex-1 truncate">
                                {title}
                            </Heading>
                        )}
                        {actions && (
                            <div
                                className={`shrink-0 items-center ${mobileActions !== undefined
                                    ? "hidden md:flex"
                                    : "flex"
                                    }`}
                            >
                                {actions}
                            </div>
                        )}
                        {mobileActions ? (
                            <div className="flex shrink-0 items-center md:hidden">
                                {mobileActions}
                            </div>
                        ) : null}
                    </div>
                    <div className="min-w-0 space-y-2">
                        {mobileBreadcrumbs ? (
                            <div className="md:hidden">{mobileBreadcrumbs}</div>
                        ) : null}
                        {mobileDescription !== undefined ? (
                            <>
                                <Text className="hidden md:block">
                                    {description}
                                </Text>
                                {mobileDescription ? (
                                    <Text className="md:hidden">
                                        {mobileDescription}
                                    </Text>
                                ) : null}
                            </>
                        ) : (
                            <Text>{description}</Text>
                        )}
                    </div>
                </header>
                {containedScroll ? (
                    <div
                        data-admin-scroll-container
                        className="admin-editor-scroll mt-6 min-h-0 flex-1 overflow-visible sm:mt-8 lg:mt-10 lg:overflow-y-auto lg:pr-2"
                    >
                        {children}
                    </div>
                ) : (
                    <div className="mt-6 sm:mt-8 lg:mt-10">{children}</div>
                )}
            </SidebarLayout>

            {showSignOutModal ? (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/70 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="signout-modal-title"
                    onClick={() => setShowSignOutModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-5 shadow-2xl dark:bg-zinc-950"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2
                            id="signout-modal-title"
                            className="text-lg font-semibold text-zinc-950 dark:text-white"
                        >
                            Sign out
                        </h2>
                        <Text className="mt-2">
                            Are you sure you want to sign out from the CMS?
                        </Text>

                        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                plain
                                className="justify-center"
                                onClick={() => setShowSignOutModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="justify-center"
                                onClick={signOut}
                            >
                                Yes, sign out
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
