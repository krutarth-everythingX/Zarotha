import { Head } from '@inertiajs/react';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { Text } from '@admin/Components/ui/text';

type CmsPlaceholderProps = {
    title: string;
    description: string;
    items?: readonly string[];
};

export function CmsPlaceholder({ title, description, items = [] }: CmsPlaceholderProps) {
    return (
        <>
            <Head title={title} />
            <AdminShell title={title} description={description}>
                <section className="rounded-3xl border border-zinc-950/8 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
                    <Text>
                        Stage 9 exposes the secured backend workflow and typed Inertia payload for this CMS area. The
                        complete editing interface remains reserved for the approved admin UI stage.
                    </Text>
                    {items.length > 0 ? (
                        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                            {items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    ) : null}
                </section>
            </AdminShell>
        </>
    );
}
