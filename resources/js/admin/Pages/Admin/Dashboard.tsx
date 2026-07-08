import { Head, Link } from "@inertiajs/react";
import type React from "react";
import {
    Activity,
    ArrowUpRight,
    BadgeCheck,
    BarChart3,
    Boxes,
    FolderTree,
    Handshake,
    Inbox,
    PackageCheck,
    PieChart,
    Quote,
    Settings,
    Sparkles,
    Star,
    type LucideIcon,
} from "lucide-react";
import { Subheading } from "@admin/Components/ui/heading";
import { Text } from "@admin/Components/ui/text";
import { Button } from "@admin/Components/ui/button";
import { AdminShell } from "@admin/Layouts/AdminShell";
import { StatusBadge } from "@admin/Components/AdminPrimitives";

type Metric = {
    label: string;
    value: number;
    href: string;
    detail: string;
};

type HighlightTone = "amber" | "blue" | "green" | "zinc";

type Highlight = {
    label: string;
    value: number | string;
    href: string;
    detail: string;
    tone: HighlightTone;
};

type ChartDatum = {
    label: string;
    value: number;
};

type TrendDatum = ChartDatum & {
    date: string;
};

type CategoryDatum = ChartDatum & {
    active: boolean;
};

type RecentInquiry = {
    id: number;
    name: string;
    subject: string;
    status: string;
    createdAt: string | null;
    href: string;
};

type DashboardProps = {
    metrics: Metric[];
    inquiryStats: {
        total: number;
        unread: number;
        read: number;
        replied: number;
        archived: number;
    };
    highlights: Highlight[];
    charts: {
        inquiryTrend: TrendDatum[];
        inquiryStatus: ChartDatum[];
        productStatus: ChartDatum[];
        categoryMix: CategoryDatum[];
    };
    recentInquiries: RecentInquiry[];
};

const numberFormatter = new Intl.NumberFormat("en-IN");

const panelClass =
    "rounded-lg border border-zinc-950/8 bg-white/95 p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-zinc-900/95";

const statusColors = ["#f59e0b", "#38bdf8", "#22c55e", "#a1a1aa"];
const productColors = ["#22c55e", "#f59e0b", "#71717a"];
const categoryColors = ["#14b8a6", "#6366f1", "#f97316", "#ec4899", "#84cc16"];

const metricIcons: Record<string, LucideIcon> = {
    Products: Boxes,
    Category: FolderTree,
    Testimonials: Quote,
    Inquiries: Inbox,
    "Our Clients": Handshake,
    Settings,
};

const highlightIcons: Record<string, LucideIcon> = {
    "Open inquiries": Inbox,
    "Published catalog": PackageCheck,
    "Featured products": Star,
    "Response rate": BadgeCheck,
};

const toneStyles: Record<
    HighlightTone,
    {
        card: string;
        icon: string;
        value: string;
    }
> = {
    amber: {
        card: "border-amber-200/80 bg-amber-50/90 hover:border-amber-300 dark:border-amber-400/20 dark:bg-amber-400/10 dark:hover:border-amber-300/35",
        icon: "bg-amber-100 text-amber-700 dark:bg-amber-300/15 dark:text-amber-200",
        value: "text-amber-950 dark:text-amber-100",
    },
    blue: {
        card: "border-sky-200/80 bg-sky-50/90 hover:border-sky-300 dark:border-sky-400/20 dark:bg-sky-400/10 dark:hover:border-sky-300/35",
        icon: "bg-sky-100 text-sky-700 dark:bg-sky-300/15 dark:text-sky-200",
        value: "text-sky-950 dark:text-sky-100",
    },
    green: {
        card: "border-emerald-200/80 bg-emerald-50/90 hover:border-emerald-300 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:hover:border-emerald-300/35",
        icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-200",
        value: "text-emerald-950 dark:text-emerald-100",
    },
    zinc: {
        card: "border-zinc-950/8 bg-white/95 hover:border-zinc-950/20 dark:border-white/10 dark:bg-zinc-900/95 dark:hover:border-white/20",
        icon: "bg-zinc-950/5 text-zinc-700 dark:bg-white/10 dark:text-zinc-200",
        value: "text-zinc-950 dark:text-white",
    },
};

function formatNumber(value: number) {
    return numberFormatter.format(value);
}

function sumValues(data: ChartDatum[]) {
    return data.reduce((total, item) => total + item.value, 0);
}

function statusTone(
    status: string,
): React.ComponentProps<typeof StatusBadge>["tone"] {
    if (status === "unread") {
        return "amber";
    }

    if (status === "replied") {
        return "green";
    }

    if (status === "archived") {
        return "red";
    }

    return "neutral";
}

function percentOf(value: number, total: number) {
    return total > 0 ? `${Math.round((value / total) * 100)}%` : "0%";
}

function KpiCard({ item }: { item: Highlight }) {
    const Icon = highlightIcons[item.label] ?? Activity;
    const styles = toneStyles[item.tone] ?? toneStyles.zinc;
    const displayValue =
        typeof item.value === "number" ? formatNumber(item.value) : item.value;

    return (
        <Link
            href={item.href}
            className={`group flex min-h-36 flex-col justify-between rounded-lg border p-4 no-underline shadow-sm transition sm:p-5 ${styles.card}`}
        >
            <div className="flex items-start justify-between gap-3">
                <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${styles.icon}`}
                >
                    <Icon
                        className="size-5"
                        aria-hidden="true"
                        strokeWidth={2}
                    />
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 transition group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-white">
                    Open
                    <ArrowUpRight
                        className="size-4"
                        aria-hidden="true"
                        strokeWidth={2}
                    />
                </span>
            </div>
            <div className="mt-5 min-w-0">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {item.label}
                </p>
                <p
                    className={`mt-2 text-3xl font-semibold sm:text-4xl ${styles.value}`}
                >
                    {displayValue}
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {item.detail}
                </p>
            </div>
        </Link>
    );
}

function InquiryTrendChart({ data }: { data: TrendDatum[] }) {
    const width = 440;
    const height = 230;
    const left = 34;
    const right = 18;
    const top = 18;
    const bottom = 190;
    const chartWidth = width - left - right;
    const chartHeight = bottom - top;
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const points = data.map((item, index) => {
        const x =
            data.length > 1
                ? left + (index * chartWidth) / (data.length - 1)
                : left + chartWidth / 2;
        const y = bottom - (item.value / maxValue) * chartHeight;

        return { ...item, x, y };
    });
    const linePath = points
        .map(
            (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
        )
        .join(" ");
    const areaPath =
        points.length > 0
            ? `${linePath} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`
            : "";
    const gridValues = Array.from(
        new Set([maxValue, Math.ceil(maxValue / 2), 0]),
    );

    return (
        <div className="mt-5 h-64 overflow-hidden rounded-lg bg-zinc-950/[0.02] p-2 dark:bg-white/[0.03]">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-full w-full"
                role="img"
                aria-label="Inquiries received over the last seven days"
            >
                <defs>
                    <linearGradient
                        id="inquiry-trend-fill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#14b8a6"
                            stopOpacity="0.28"
                        />
                        <stop
                            offset="100%"
                            stopColor="#14b8a6"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>
                {gridValues.map((value) => {
                    const y = bottom - (value / maxValue) * chartHeight;

                    return (
                        <g key={value}>
                            <line
                                x1={left}
                                x2={width - right}
                                y1={y}
                                y2={y}
                                stroke="currentColor"
                                className="text-zinc-950/8 dark:text-white/10"
                            />
                            <text
                                x={8}
                                y={y + 4}
                                className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}
                {areaPath ? (
                    <path d={areaPath} fill="url(#inquiry-trend-fill)" />
                ) : null}
                {linePath ? (
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#14b8a6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                    />
                ) : null}
                {points.map((point) => (
                    <g key={point.date}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#14b8a6"
                        />
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="7"
                            fill="#14b8a6"
                            opacity="0.12"
                        />
                        <text
                            x={point.x}
                            y={214}
                            textAnchor="middle"
                            className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
                        >
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function DonutChart({ data }: { data: ChartDatum[] }) {
    const total = sumValues(data);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <svg
                viewBox="0 0 120 120"
                className="size-44 shrink-0 text-zinc-950 dark:text-white"
                role="img"
                aria-label="Inquiry status distribution"
            >
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="14"
                />
                {data.map((item, index) => {
                    const dash =
                        total > 0 ? (item.value / total) * circumference : 0;
                    const segment = (
                        <circle
                            key={item.label}
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={statusColors[index % statusColors.length]}
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                            strokeWidth="14"
                            transform="rotate(-90 60 60)"
                        />
                    );
                    offset += dash;

                    return segment;
                })}
                <text
                    x="60"
                    y="57"
                    textAnchor="middle"
                    className="fill-zinc-950 text-2xl font-semibold dark:fill-white"
                >
                    {formatNumber(total)}
                </text>
                <text
                    x="60"
                    y="75"
                    textAnchor="middle"
                    className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
                >
                    total
                </text>
            </svg>
            <div className="w-full min-w-0 space-y-3">
                {data.map((item, index) => (
                    <div
                        key={item.label}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{
                                    backgroundColor:
                                        statusColors[
                                            index % statusColors.length
                                        ],
                                }}
                            />
                            <span className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                {item.label}
                            </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-sm">
                            <span className="font-semibold text-zinc-950 dark:text-white">
                                {formatNumber(item.value)}
                            </span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                                {percentOf(item.value, total)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HorizontalBars({
    data,
    colors,
    emptyLabel,
}: {
    data: ChartDatum[];
    colors: string[];
    emptyLabel: string;
}) {
    const maxValue = Math.max(...data.map((item) => item.value), 0);

    if (data.length === 0 || maxValue === 0) {
        return (
            <div className="mt-5 rounded-lg border border-dashed border-zinc-950/15 p-6 text-center text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                {emptyLabel}
            </div>
        );
    }

    return (
        <div className="mt-5 space-y-4">
            {data.map((item, index) => {
                const width = Math.max(
                    (item.value / maxValue) * 100,
                    item.value > 0 ? 7 : 0,
                );

                return (
                    <div key={item.label}>
                        <div className="flex items-center justify-between gap-3">
                            <p className="min-w-0 truncate text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                {item.label}
                            </p>
                            <p className="shrink-0 text-sm font-semibold text-zinc-950 dark:text-white">
                                {formatNumber(item.value)}
                            </p>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-950/8 dark:bg-white/10">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${width}%`,
                                    backgroundColor:
                                        colors[index % colors.length],
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function MetricShortcut({ metric }: { metric: Metric }) {
    const Icon = metricIcons[metric.label] ?? Boxes;

    return (
        <Link
            href={metric.href}
            className="group flex min-h-32 flex-col justify-between rounded-lg border border-zinc-950/8 bg-white/95 p-4 no-underline shadow-sm transition hover:border-zinc-950/20 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/95 dark:hover:border-white/20"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-zinc-950/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    <Icon
                        className="size-4"
                        aria-hidden="true"
                        strokeWidth={2}
                    />
                </span>
                <ArrowUpRight
                    className="size-4 text-zinc-400 transition group-hover:text-zinc-950 dark:group-hover:text-white"
                    aria-hidden="true"
                    strokeWidth={2}
                />
            </div>
            <div className="mt-4">
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-semibold text-zinc-950 dark:text-white">
                        {formatNumber(metric.value)}
                    </p>
                    <p className="pb-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        {metric.label}
                    </p>
                </div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {metric.detail}
                </p>
            </div>
        </Link>
    );
}

function RecentInquiryList({ inquiries }: { inquiries: RecentInquiry[] }) {
    if (inquiries.length === 0) {
        return (
            <div className="mt-5 rounded-lg border border-dashed border-zinc-950/15 p-6 text-center text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                No inquiries yet.
            </div>
        );
    }

    return (
        <div className="mt-5 [&>*]:border-b [&>*]:border-zinc-950/8 dark:[&>*]:border-white/10">
            {inquiries.map((inquiry) => (
                <Link
                    key={inquiry.id}
                    href={inquiry.href}
                    className="group flex items-start justify-between gap-3 py-3 no-underline first:pt-0"
                >
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-950 group-hover:underline dark:text-white">
                            {inquiry.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {inquiry.subject}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                            {inquiry.createdAt ?? "Recently"}
                        </p>
                    </div>
                    <StatusBadge tone={statusTone(inquiry.status)}>
                        {inquiry.status}
                    </StatusBadge>
                </Link>
            ))}
        </div>
    );
}

export default function Dashboard({
    metrics,
    inquiryStats,
    highlights,
    charts,
    recentInquiries,
}: DashboardProps) {
    const trendTotal = sumValues(charts.inquiryTrend);
    const peakDay = charts.inquiryTrend.reduce<TrendDatum | null>(
        (current, item) =>
            !current || item.value > current.value ? item : current,
        null,
    );

    return (
        <>
            <Head title="Dashboard" />
            <AdminShell
                title="Dashboard"
                description="CMS health, content readiness, and inquiry activity."
            >
                <div className="space-y-5 sm:space-y-6 lg:space-y-8">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {highlights.map((item) => (
                            <KpiCard key={item.label} item={item} />
                        ))}
                    </section>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.85fr)]">
                        <div className={panelClass}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <BarChart3
                                            className="size-5 text-teal-600 dark:text-teal-300"
                                            aria-hidden="true"
                                            strokeWidth={2}
                                        />
                                        <Subheading>Inquiry trend</Subheading>
                                    </div>
                                    <Text className="mt-1">
                                        New public website inquiries over the
                                        last seven days.
                                    </Text>
                                </div>
                                <Button
                                    href="/admin/inquiries"
                                    color="light"
                                    className="w-full justify-center sm:w-auto"
                                >
                                    View inquiries
                                    <ArrowUpRight
                                        data-slot="icon"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                            <InquiryTrendChart data={charts.inquiryTrend} />
                            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-950/8 pt-4 dark:border-white/10">
                                <div>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        7 day total
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                                        {formatNumber(trendTotal)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        Peak day
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                                        {peakDay?.label ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        Unread
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                                        {formatNumber(inquiryStats.unread)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={panelClass}>
                            <div className="flex items-center gap-2">
                                <PieChart
                                    className="size-5 text-amber-600 dark:text-amber-300"
                                    aria-hidden="true"
                                    strokeWidth={2}
                                />
                                <Subheading>Inquiry status</Subheading>
                            </div>
                            <Text className="mt-1">
                                Current pipeline split across inquiry stages.
                            </Text>
                            <DonutChart data={charts.inquiryStatus} />
                        </div>
                    </section>

                    <section className="grid gap-4 lg:grid-cols-2">
                        <div className={panelClass}>
                            <div className="flex items-center gap-2">
                                <PackageCheck
                                    className="size-5 text-emerald-600 dark:text-emerald-300"
                                    aria-hidden="true"
                                    strokeWidth={2}
                                />
                                <Subheading>Product publishing</Subheading>
                            </div>
                            <Text className="mt-1">
                                Catalog items grouped by publishing status.
                            </Text>
                            <HorizontalBars
                                data={charts.productStatus}
                                colors={productColors}
                                emptyLabel="No products are available yet."
                            />
                        </div>

                        <div className={panelClass}>
                            <div className="flex items-center gap-2">
                                <FolderTree
                                    className="size-5 text-indigo-600 dark:text-indigo-300"
                                    aria-hidden="true"
                                    strokeWidth={2}
                                />
                                <Subheading>Category mix</Subheading>
                            </div>
                            <Text className="mt-1">
                                Top categories by product count.
                            </Text>
                            <HorizontalBars
                                data={charts.categoryMix}
                                colors={categoryColors}
                                emptyLabel="No category product mix to show yet."
                            />
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Sparkles
                                    className="size-5 text-zinc-600 dark:text-zinc-300"
                                    aria-hidden="true"
                                    strokeWidth={2}
                                />
                                <Subheading>Management grid</Subheading>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                {metrics.map((metric) => (
                                    <MetricShortcut
                                        key={metric.label}
                                        metric={metric}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={panelClass}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between xl:flex-col xl:items-stretch 2xl:flex-row 2xl:items-start">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Inbox
                                            className="size-5 text-sky-600 dark:text-sky-300"
                                            aria-hidden="true"
                                            strokeWidth={2}
                                        />
                                        <Subheading>
                                            Recent inquiries
                                        </Subheading>
                                    </div>
                                    <Text className="mt-1">
                                        Latest messages from the website.
                                    </Text>
                                </div>
                                <Button
                                    href="/admin/inquiries"
                                    color="light"
                                    className="w-full justify-center sm:w-auto xl:w-full 2xl:w-auto"
                                >
                                    Open inbox
                                    <ArrowUpRight
                                        data-slot="icon"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                            <RecentInquiryList inquiries={recentInquiries} />
                        </div>
                    </section>
                </div>
            </AdminShell>
        </>
    );
}
