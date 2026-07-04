import { Head } from '@inertiajs/react';
import { Subheading } from '@admin/Components/ui/heading';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { PagePanel, TextLink } from '@admin/Components/AdminPrimitives';

type DashboardProps = {
    metrics: Array<{
        label: string;
        value: number;
        href: string;
        detail: string;
    }>;
    inquiryStats: {
        total: number;
        unread: number;
        read: number;
        replied: number;
        archived: number;
    };
};

export default function Dashboard({ metrics, inquiryStats }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <AdminShell title="Dashboard" description="CMS overview with counts for the active management sections.">
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {metrics.map((metric) => (
                        <PagePanel key={metric.label}>
                            <div className="flex items-start justify-between gap-4">
                                <Subheading>{metric.label}</Subheading>
                                <TextLink href={metric.href}>Open</TextLink>
                            </div>
                            <p className="mt-4 text-4xl font-semibold text-zinc-950 dark:text-white">{metric.value}</p>
                            <Text className="mt-2">{metric.detail}</Text>
                        </PagePanel>
                    ))}
                </section>

                <PagePanel className="mt-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <Subheading>Inquiry Stats</Subheading>
                            <Text className="mt-2">Public website inquiries by status.</Text>
                        </div>
                        <TextLink href="/admin/inquiries">View inquiries</TextLink>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {[
                            ['Total', inquiryStats.total],
                            ['Unread', inquiryStats.unread],
                            ['Read', inquiryStats.read],
                            ['Replied', inquiryStats.replied],
                            ['Archived', inquiryStats.archived],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
                                <Text>{label}</Text>
                                <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">{value}</p>
                            </div>
                        ))}
                    </div>
                </PagePanel>
            </AdminShell>
        </>
    );
}
