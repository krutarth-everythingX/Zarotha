import { Link, usePage } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { Heading } from '@admin/Components/ui/heading';
import { Navbar, NavbarLabel, NavbarSection, NavbarSpacer } from '@admin/Components/ui/navbar';
import {
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarHeading,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    SidebarSpacer,
} from '@admin/Components/ui/sidebar';
import { SidebarLayout } from '@admin/Components/ui/sidebar-layout';
import { Text } from '@admin/Components/ui/text';
import { Button } from '@admin/Components/ui/button';
import type { AppPageProps } from '@admin/types';

function GridIcon() {
    return (
        <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 3.5A1.5 1.5 0 0 0 2.5 5v2A1.5 1.5 0 0 0 4 8.5h2A1.5 1.5 0 0 0 7.5 7V5A1.5 1.5 0 0 0 6 3.5H4Zm10 0A1.5 1.5 0 0 0 12.5 5v2A1.5 1.5 0 0 0 14 8.5h2A1.5 1.5 0 0 0 17.5 7V5A1.5 1.5 0 0 0 16 3.5h-2ZM4 11.5A1.5 1.5 0 0 0 2.5 13v2A1.5 1.5 0 0 0 4 16.5h2A1.5 1.5 0 0 0 7.5 15v-2A1.5 1.5 0 0 0 6 11.5H4Zm10 0A1.5 1.5 0 0 0 12.5 13v2A1.5 1.5 0 0 0 14 16.5h2A1.5 1.5 0 0 0 17.5 15v-2A1.5 1.5 0 0 0 16 11.5h-2Z" />
        </svg>
    );
}

const navigation = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Homepage', href: '/admin/homepage' },
    { label: 'Product Page', href: '/admin/products' },
    { label: 'Category', href: '/admin/categories' },
    { label: 'About Page', href: '/admin/pages/about-us' },
    { label: 'Contact Page', href: '/admin/pages/contact' },
    { label: 'Socials', href: '/admin/social-links' },
    { label: 'Contact & Socials', href: '/admin/contact-socials' },
    { label: 'Testimonial', href: '/admin/testimonials' },
    { label: 'Our Client', href: '/admin/clients' },
    { label: 'Setting', href: '/admin/settings' },
    { label: 'Inquiries', href: '/admin/inquiries' },
] as const;

type AdminShellProps = {
    title: string;
    description: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
};

export function AdminShell({ title, description, children, actions }: AdminShellProps) {
    const page = usePage<AppPageProps>();
    const user = page.props.auth.user;
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const handleSignOut = () => {
        window.location.assign('/admin/logout');
    };

    const sidebar = (
        <Sidebar>
            <SidebarHeader>
                <SidebarSection>
                    <Link href="/admin" className="rounded-lg px-2 py-1.5 no-underline">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                            Zarokha CMS
                        </p>
                        <p className="mt-1 text-sm font-medium text-zinc-950 dark:text-white">{page.props.appName}</p>
                    </Link>
                </SidebarSection>
            </SidebarHeader>
            <SidebarBody>
                <SidebarSection>
                    <SidebarHeading>CMS</SidebarHeading>
                    {navigation.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            current={item.href === '/admin' ? page.url === '/admin' : page.url.startsWith(item.href)}
                        >
                            <GridIcon />
                            <SidebarLabel>{item.label}</SidebarLabel>
                        </SidebarItem>
                    ))}
                </SidebarSection>
                <SidebarSpacer />
            </SidebarBody>
            <SidebarFooter>
                <SidebarSection className="gap-3">
                    <div className="px-2">
                        <p className="text-sm font-medium text-zinc-950 dark:text-white">{user?.name ?? 'CMS User'}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email ?? ''}</p>
                    </div>
                    <Button type="button" color="light" onClick={() => setShowSignOutModal(true)}>
                        Sign out
                    </Button>
                </SidebarSection>
            </SidebarFooter>
        </Sidebar>
    );

    const navbar = (
        <Navbar>
            <NavbarSection>
                <NavbarLabel>{title}</NavbarLabel>
            </NavbarSection>
            <NavbarSpacer />
        </Navbar>
    );

    return (
        <>
            <SidebarLayout navbar={navbar} sidebar={sidebar}>
                <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-2">
                        <Heading>{title}</Heading>
                        <Text>{description}</Text>
                    </div>
                    {actions && <div className="min-w-0 sm:flex-shrink-0">{actions}</div>}
                </header>
                <div className="mt-6 sm:mt-8 lg:mt-10">{children}</div>
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
                        <h2 id="signout-modal-title" className="text-lg font-semibold text-zinc-950 dark:text-white">
                            Sign out
                        </h2>
                        <Text className="mt-2">Are you sure you want to sign out from the CMS?</Text>

                        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                plain
                                className="justify-center"
                                onClick={() => setShowSignOutModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="button" className="justify-center" onClick={handleSignOut}>
                                Yes, sign out
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
