import { Link, usePage } from '@inertiajs/react';
import type React from 'react';
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
                    <Button href="/admin/logout" method="post" color="light">
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
        <SidebarLayout navbar={navbar} sidebar={sidebar}>
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <Heading>{title}</Heading>
                    <Text>{description}</Text>
                </div>
                {actions && <div className="flex-shrink-0">{actions}</div>}
            </header>
            <div className="mt-10">{children}</div>
        </SidebarLayout>
    );
}
