import { Head } from '@inertiajs/react';
import { Heading, Subheading } from '@admin/Components/ui/heading';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, PagePanel, TextLink } from '@admin/Components/AdminPrimitives';

type DashboardProps = {
    metrics: {
        products: number;
        publishedProducts: number;
        categories: number;
        mediaAssets: number;
        unreadInquiries: number;
    };
    recentActivity: Array<{
        id: number;
        action: string;
        summary: string | null;
        createdAt: string | null;
    }>;
};

export default function Dashboard({ metrics, recentActivity }: DashboardProps) {
    const metricCards = [
        ['Products', metrics.products, '/admin/products'],
        ['Published', metrics.publishedProducts, '/admin/products?status=published'],
        ['Categories', metrics.categories, '/admin/categories'],
        ['Media assets', metrics.mediaAssets, '/admin/media'],
        ['Unread inquiries', metrics.unreadInquiries, '/admin/inquiries?status=unread'],
    ] as const;

    return (
        <>
            <Head title="Dashboard" />
            <AdminShell
                title="Dashboard"
                description="Safe CMS overview for the inquiry catalogue. No sales, order, cart, inventory, or customer-account metrics are shown."
            >
                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                    {metricCards.map(([label, value, href]) => (
                        <PagePanel key={label}>
                            <Subheading>{label}</Subheading>
                            <p className="mt-4 text-3xl font-semibold text-zinc-950 dark:text-white">{value}</p>
                            <div className="mt-4">
                                <TextLink href={href}>Open</TextLink>
                            </div>
                        </PagePanel>
                    ))}
                </section>

                <PagePanel className="mt-8">
                    <Heading level={2} className="text-lg/7 sm:text-lg/7">
                        Recent activity
                    </Heading>
                    {recentActivity.length === 0 ? (
                        <div className="mt-5">
                            <EmptyState title="No activity yet" description="Admin activity appears here as workflows create audit records." />
                        </div>
                    ) : (
                        <div className="mt-5 divide-y divide-zinc-950/8 dark:divide-white/10">
                            {recentActivity.map((activity) => (
                                <article key={activity.id} className="py-3">
                                    <p className="font-medium text-zinc-950 dark:text-white">{activity.action}</p>
                                    <Text>{activity.summary ?? 'No summary supplied.'}</Text>
                                </article>
                            ))}
                        </div>
                    )}
                </PagePanel>
            </AdminShell>
        </>
    );
}
