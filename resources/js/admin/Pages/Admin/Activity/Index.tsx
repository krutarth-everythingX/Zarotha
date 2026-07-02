import { Head } from '@inertiajs/react';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, PagePanel, PaginationLinks } from '@admin/Components/AdminPrimitives';
import type { Paginated } from '@admin/types';

type ActivityItem = {
    id: number;
    subjectType: string;
    subjectId: number | null;
    action: string;
    summary: string | null;
    createdAt: string | null;
};

type ActivityIndexProps = {
    activities: Paginated<ActivityItem>;
};

export default function ActivityIndex({ activities }: ActivityIndexProps) {
    return (
        <>
            <Head title="Activity" />
            <AdminShell title="Activity" description="Read-only administrative activity history for operational review.">
                <div className="overflow-hidden rounded-3xl border border-zinc-950/8 bg-white/90 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    {activities.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState title="No activity records yet" description="Activity appears here as admin workflows create audit entries." />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-950/8 dark:divide-white/10">
                            {activities.data.map((activity) => (
                                <PagePanel key={activity.id} className="rounded-none border-0 shadow-none">
                                    <p className="font-medium text-zinc-950 dark:text-white">{activity.action}</p>
                                    <Text>{activity.summary ?? `${activity.subjectType} #${activity.subjectId ?? '-'}`}</Text>
                                </PagePanel>
                            ))}
                        </div>
                    )}
                    <PaginationLinks meta={activities.meta} baseUrl="/admin/activity" />
                </div>
            </AdminShell>
        </>
    );
}
