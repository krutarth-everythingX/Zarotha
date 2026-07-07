import { Head } from '@inertiajs/react';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { EmptyState, PaginationLinks } from '@admin/Components/AdminPrimitives';
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse">
                                <colgroup>
                                    <col className="w-[220px]" />
                                    <col />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Action</th>
                                        <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">Summary</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-950/8 dark:divide-white/10">
                                    {activities.data.map((activity) => (
                                        <tr key={activity.id} className="align-middle">
                                            <td className="px-4 py-2.5 text-center">
                                                <p className="font-medium text-zinc-950 dark:text-white">{activity.action}</p>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <Text>{activity.summary ?? `${activity.subjectType} #${activity.subjectId ?? '-'}`}</Text>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <PaginationLinks meta={activities.meta} baseUrl="/admin/activity" />
                </div>
            </AdminShell>
        </>
    );
}
