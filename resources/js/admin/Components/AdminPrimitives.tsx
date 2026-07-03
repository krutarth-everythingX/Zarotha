import type React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { Text } from '@admin/Components/ui/text';

type PanelProps = {
    children: React.ReactNode;
    className?: string;
};

export function PagePanel({ children, className = '' }: PanelProps) {
    return (
        <section
            className={`rounded-3xl border border-zinc-950/8 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/90 ${className}`}
        >
            {children}
        </section>
    );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">{title}</p>
            <Text className="mt-2">{description}</Text>
        </div>
    );
}

export function FieldError({ message }: { message?: string }) {
    return message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p> : null;
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:outline-white ${props.className ?? ''}`}
        />
    );
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={`block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:outline-white ${props.className ?? ''}`}
        />
    );
}

export function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={`block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:outline-white ${props.className ?? ''}`}
        />
    );
}

export function StatusBadge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'red' }) {
    const toneClasses = {
        neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
        green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
        amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
        red: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    };

    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>{children}</span>;
}

export function PaginationLinks({
    meta,
    baseUrl,
}: {
    meta: { currentPage: number; lastPage: number; total: number; from: number | null; to: number | null };
    baseUrl: string;
}) {
    const previous = Math.max(meta.currentPage - 1, 1);
    const next = Math.min(meta.currentPage + 1, meta.lastPage);

    return (
        <div className="flex flex-col gap-3 border-t border-zinc-950/8 px-5 py-4 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
            <span>
                Showing {meta.from ?? 0} to {meta.to ?? 0} of {meta.total}
            </span>
            <div className="flex gap-2">
                {meta.currentPage <= 1 ? (
                    <span className="rounded-lg border border-zinc-950/10 px-3 py-2 opacity-50 dark:border-white/15">Previous</span>
                ) : (
                    <Button href={`${baseUrl}?page=${previous}`} color="light">
                        Previous
                    </Button>
                )}
                {meta.currentPage >= meta.lastPage ? (
                    <span className="rounded-lg border border-zinc-950/10 px-3 py-2 opacity-50 dark:border-white/15">Next</span>
                ) : (
                    <Button href={`${baseUrl}?page=${next}`} color="light">
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950 dark:text-white dark:decoration-zinc-600">
            {children}
        </Link>
    );
}

export function FormCheckbox({ checked, onChange, label }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
        </label>
    );
}
