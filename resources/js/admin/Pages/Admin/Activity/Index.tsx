import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Text } from "@admin/Components/ui/text";
import { AdminShell } from "@admin/Layouts/AdminShell";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
    EmptyState,
    ListTablePanel,
    MobileTableList,
    MobileTableRow,
    PaginationLinks,
} from "@admin/Components/AdminPrimitives";
import type { Paginated } from "@admin/types";

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
    const [selectedActivity, setSelectedActivity] =
        useState<ActivityItem | null>(null);

    return (
        <>
            <Head title="Activity" />
            <AdminShell
                title="Activity"
                description="Read-only administrative activity history for operational review."
            >
                <ListTablePanel
                    footer={
                        <PaginationLinks
                            meta={activities.meta}
                            baseUrl="/admin/activity"
                        />
                    }
                >
                    {activities.data.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                title="No activity records yet"
                                description="Activity appears here as admin workflows create audit entries."
                            />
                        </div>
                    ) : (
                        <>
                            <MobileTableList>
                                {activities.data.map((activity, index) => (
                                    <MobileTableRow
                                        key={activity.id}
                                        number={
                                            (activities.meta.from ?? 1) + index
                                        }
                                        title={activity.action}
                                        subtitle={
                                            activity.summary ??
                                            `${activity.subjectType} #${activity.subjectId ?? "-"}`
                                        }
                                        onOpen={() =>
                                            setSelectedActivity(activity)
                                        }
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col className="w-[220px]" />
                                        <col />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-zinc-950/8 dark:border-white/10">
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Action
                                            </th>
                                            <th className="px-4 py-2.5 text-center text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                                Summary
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
                                        {activities.data.map((activity) => (
                                            <tr
                                                key={activity.id}
                                                className="align-middle"
                                            >
                                                <td className="px-4 py-2.5 text-center">
                                                    <p className="font-medium text-zinc-950 dark:text-white">
                                                        {activity.action}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <Text>
                                                        {activity.summary ??
                                                            `${activity.subjectType} #${activity.subjectId ?? "-"}`}
                                                    </Text>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </ListTablePanel>

                {selectedActivity ? (
                    <DetailModal
                        title={selectedActivity.action}
                        subtitle={
                            selectedActivity.summary ??
                            `${selectedActivity.subjectType} #${selectedActivity.subjectId ?? "-"}`
                        }
                        onClose={() => setSelectedActivity(null)}
                        titleId="activity-detail-title"
                    >
                        <DetailSection title="Activity Details">
                            <DetailGrid>
                                <DetailItem label="No.">
                                    {activities.data.findIndex(
                                        (activity) =>
                                            activity.id === selectedActivity.id,
                                    ) + (activities.meta.from ?? 1)}
                                </DetailItem>
                                <DetailItem label="Subject Type">
                                    {selectedActivity.subjectType}
                                </DetailItem>
                                <DetailItem label="Subject ID">
                                    {selectedActivity.subjectId}
                                </DetailItem>
                                <DetailItem label="Created At">
                                    {selectedActivity.createdAt}
                                </DetailItem>
                                <DetailItem label="Summary" full>
                                    {selectedActivity.summary}
                                </DetailItem>
                            </DetailGrid>
                        </DetailSection>
                    </DetailModal>
                ) : null}
            </AdminShell>
        </>
    );
}
