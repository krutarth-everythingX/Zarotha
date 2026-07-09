import type React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@admin/Components/ui/button";
import { Field, Label } from "@admin/Components/ui/fieldset";
import { Text } from "@admin/Components/ui/text";
import type { PaginationMeta } from "@admin/types";

type PanelProps = {
    children: React.ReactNode;
    className?: string;
};

type EditableTableProps = {
    children: React.ReactNode;
    className?: string;
    minWidth?: string;
};

type DetailModalProps = {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    onClose: () => void;
    titleId?: string;
    maxWidthClass?: string;
    bodyClassName?: string;
};

type DetailItemProps = {
    label: string;
    children?: React.ReactNode;
    className?: string;
    full?: boolean;
};

type ListTablePanelProps = {
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    minHeightClass?: string;
    toolbar?: React.ReactNode;
};

type MobileTableListProps = {
    children: React.ReactNode;
    className?: string;
};

type MobileTableRowProps = {
    number?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    badge?: React.ReactNode;
    media?: React.ReactNode;
    onOpen: () => void;
    openLabel?: string;
};

type StatTone = "neutral" | "blue" | "green" | "amber" | "red";

export type StatStripItem = {
    label: string;
    value: React.ReactNode;
    tone?: StatTone;
};

type StatsStripProps = {
    items: StatStripItem[];
    className?: string;
};

type SearchFilterOption = {
    value: string | number;
    label: string;
};

type SearchFilterField = {
    name: string;
    label: string;
    value?: string | number | null;
    allLabel?: string;
    options: SearchFilterOption[];
};

type SearchFilterValues = {
    search: string;
    filters: Record<string, string>;
};

type MobileSettingsLinkKey =
    | "home"
    | "about"
    | "contact"
    | "socials"
    | "testimonials"
    | "settings";

type SearchFilterPanelProps = {
    action?: string;
    clearHref?: string;
    className?: string;
    variant?: "panel" | "toolbar";
    searchName?: string;
    searchPlaceholder?: string;
    searchValue?: string | null;
    filterFields?: SearchFilterField[];
    hasActiveFilters?: boolean;
    onApply?: (values: SearchFilterValues) => void;
    onClear?: () => void;
};

function filterDefaultsKeyFor(fields: SearchFilterField[]) {
    return JSON.stringify(
        fields.map((field) => [field.name, String(field.value ?? "")]),
    );
}

function filterDefaultsFromKey(key: string): Record<string, string> {
    return Object.fromEntries(JSON.parse(key) as Array<[string, string]>);
}

type SettingsSectionKey =
    "home" | "about" | "contact" | "socials" | "testimonials" | "settings";

const settingsSections: Array<{
    key: SettingsSectionKey;
    label: string;
    mobileLabel: string;
    href: string;
}> = [
    {
        key: "home",
        label: "HOME",
        mobileLabel: "Home",
        href: "/admin/settings/home",
    },
    {
        key: "about",
        label: "ABOUT",
        mobileLabel: "About",
        href: "/admin/settings/about",
    },
    {
        key: "contact",
        label: "CONTACT",
        mobileLabel: "Contact",
        href: "/admin/settings/contact",
    },
    {
        key: "socials",
        label: "SOCIALS",
        mobileLabel: "Socials",
        href: "/admin/settings/socials",
    },
    {
        key: "testimonials",
        label: "TESTIMONIALS",
        mobileLabel: "Testimonials",
        href: "/admin/settings/testimonials",
    },
    {
        key: "settings",
        label: "SETTINGS",
        mobileLabel: "Settings",
        href: "/admin/settings/general",
    },
];

export const mobileSettingsLinks: Array<{
    key: MobileSettingsLinkKey;
    label: string;
    href: string;
}> = settingsSections.map((section) => ({
    key: section.key,
    label: section.mobileLabel,
    href: section.href,
}));

export function PagePanel({ children, className = "" }: PanelProps) {
    return (
        <section
            className={`rounded-2xl border border-zinc-950/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6 dark:border-white/10 dark:bg-zinc-900/90 ${className}`}
        >
            {children}
        </section>
    );
}

export function getAdminScrollContainer() {
    if (typeof document === "undefined") {
        return null;
    }

    return document.querySelector<HTMLElement>("[data-admin-scroll-container]");
}

function adminSectionTop(element: HTMLElement, container: HTMLElement | null) {
    if (!container) {
        return element.offsetTop;
    }

    return (
        element.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop
    );
}

export function scrollToAdminSection(id: string, offset = 96) {
    if (typeof window === "undefined") {
        return;
    }

    const element = document.getElementById(id);
    const container = getAdminScrollContainer();

    if (!element) {
        return;
    }

    if (container) {
        container.scrollTo({
            top: Math.max(adminSectionTop(element, container) - offset, 0),
            behavior: "smooth",
        });
        return;
    }

    window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
    });
}

export function findActiveAdminSection<T extends string>(
    sections: ReadonlyArray<{ id: T }>,
    offset = 150,
): T | null {
    if (typeof window === "undefined") {
        return null;
    }

    const container = getAdminScrollContainer();
    const scrollPosition =
        (container ? container.scrollTop : window.scrollY) + offset;

    for (let i = sections.length - 1; i >= 0; i -= 1) {
        const sectionId = sections[i].id;
        const element = document.getElementById(sectionId);

        if (element && adminSectionTop(element, container) <= scrollPosition) {
            return sectionId;
        }
    }

    return null;
}

export function SettingsSubsectionTabs<T extends string>({
    activeSection,
    label,
    onSelect,
    sections,
    className = "",
}: {
    activeSection: T;
    label: string;
    onSelect: (id: T) => void;
    sections: ReadonlyArray<{ id: T; label: string }>;
    className?: string;
}) {
    return (
        <div
            className={`rounded-lg border border-zinc-950/10 bg-white/98 p-2 shadow-sm dark:border-white/12 dark:bg-zinc-900/70 ${className}`}
        >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <p className="shrink-0 px-2 text-sm font-semibold text-zinc-950 dark:text-white">
                    {label}
                </p>
                <nav
                    aria-label={label}
                    className="admin-subsection-tabs flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 sm:pb-0"
                >
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onSelect(section.id)}
                            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                    : "bg-transparent text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-white"
                            }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export function StatsStrip({ items, className = "" }: StatsStripProps) {
    const toneClasses: Record<
        StatTone,
        { item: string; label: string; value: string }
    > = {
        neutral: {
            item: "border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-white/5",
            label: "text-zinc-500 dark:text-zinc-400",
            value: "text-zinc-950 dark:text-white",
        },
        blue: {
            item: "border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10",
            label: "text-sky-700 dark:text-sky-300",
            value: "text-sky-800 dark:text-sky-200",
        },
        green: {
            item: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
            label: "text-emerald-700 dark:text-emerald-300",
            value: "text-emerald-800 dark:text-emerald-200",
        },
        amber: {
            item: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
            label: "text-amber-700 dark:text-amber-300",
            value: "text-amber-800 dark:text-amber-200",
        },
        red: {
            item: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
            label: "text-red-700 dark:text-red-300",
            value: "text-red-800 dark:text-red-200",
        },
    };

    return (
        <section
            aria-label="Summary statistics"
            className={`w-full rounded-lg border border-zinc-950/10 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900/90 ${className}`}
        >
            <div className="grid grid-cols-2 gap-2 sm:[grid-template-columns:repeat(auto-fit,minmax(8rem,1fr))]">
                {items.map((item, index) => {
                    const tone = toneClasses[item.tone ?? "neutral"];

                    return (
                        <div
                            key={`${item.label}-${index}`}
                            className={`inline-flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border px-3 py-1.5 ${tone.item}`}
                        >
                            <span
                                className={`text-xs font-medium ${tone.label}`}
                            >
                                {item.label}
                            </span>
                            <span
                                className={`text-lg font-semibold tabular-nums leading-none ${tone.value}`}
                            >
                                {item.value}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export function SearchFilterPanel({
    action,
    clearHref,
    className = "",
    variant = "panel",
    searchName = "search",
    searchPlaceholder = "Search",
    searchValue = null,
    filterFields = [],
    hasActiveFilters,
    onApply,
    onClear,
}: SearchFilterPanelProps) {
    const titleId = useId();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState(searchValue ?? "");
    const filterDefaultsKey = filterDefaultsKeyFor(filterFields);
    const [filters, setFilters] = useState<Record<string, string>>(
        filterDefaultsFromKey(filterDefaultsKey),
    );

    useEffect(() => {
        setSearch(searchValue ?? "");
    }, [searchValue]);

    useEffect(() => {
        setFilters(filterDefaultsFromKey(filterDefaultsKey));
    }, [filterDefaultsKey]);

    useEffect(() => {
        if (!isFilterOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsFilterOpen(false);
            }
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isFilterOpen]);

    const filterCount = Object.values(filters).filter(
        (value) => value !== "",
    ).length;
    const isActive =
        hasActiveFilters ?? (search.trim() !== "" || filterCount > 0);
    const hasModalFilters = filterFields.length > 0;
    const actionButtonClass =
        "h-[38px] shrink-0 !items-center justify-center !px-3 !py-0 !text-sm";

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        if (onApply) {
            event.preventDefault();
            onApply({
                search: search.trim(),
                filters,
            });
        }

        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setSearch("");
        setFilters(
            Object.fromEntries(filterFields.map((field) => [field.name, ""])),
        );
        setIsFilterOpen(false);
        onClear?.();
    };

    const renderClearControl = (className = actionButtonClass) =>
        isActive ? (
            onClear ? (
                <Button
                    type="button"
                    plain
                    className={className}
                    onClick={clearFilters}
                >
                    Clear
                </Button>
            ) : clearHref ? (
                <Button
                    href={clearHref}
                    plain
                    className={className}
                    preserveScroll
                >
                    Clear
                </Button>
            ) : null
        ) : null;

    const form = (
        <form
            method={onApply ? undefined : "get"}
            action={onApply ? undefined : action}
            onSubmit={submitForm}
            className={`flex flex-wrap items-end gap-2 sm:flex-nowrap sm:justify-between ${variant === "toolbar" ? className : ""}`}
        >
            <Field className="min-w-0 flex-1 basis-[10rem] sm:w-96 sm:flex-none lg:w-[26rem]">
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                        aria-hidden="true"
                    />
                    <FormInput
                        type="search"
                        name={searchName}
                        value={search}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className="pl-9"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </Field>

            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                {hasModalFilters ? (
                    <Button
                        type="button"
                        color="light"
                        className={actionButtonClass}
                        aria-expanded={isFilterOpen}
                        aria-controls={titleId}
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <SlidersHorizontal data-slot="icon" />
                        Filter
                        {filterCount > 0 ? (
                            <span className="ml-1 rounded-full bg-zinc-950 px-1.5 py-0.5 text-xs leading-none text-white dark:bg-white dark:text-zinc-950">
                                {filterCount}
                            </span>
                        ) : null}
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        color="light"
                        className={actionButtonClass}
                    >
                        Search
                    </Button>
                )}
                {renderClearControl()}
            </div>

            {hasModalFilters ? (
                <div
                    className={
                        isFilterOpen
                            ? "fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
                            : "hidden"
                    }
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-zinc-950/35 dark:bg-zinc-950/60"
                        aria-label="Close filters"
                        onClick={() => setIsFilterOpen(false)}
                    />
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-5">
                            <div>
                                <h2
                                    id={titleId}
                                    className="text-base font-semibold text-zinc-950 dark:text-white"
                                >
                                    Filters
                                </h2>
                                <Text className="mt-1">
                                    Narrow the table results.
                                </Text>
                            </div>
                            <Button
                                type="button"
                                plain
                                className="h-10 w-10 px-0"
                                aria-label="Close filters"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                <X data-slot="icon" />
                            </Button>
                        </div>

                        <div className="grid gap-4 px-4 py-5 sm:grid-cols-2 sm:px-5">
                            {filterFields.map((field) => (
                                <Field key={field.name}>
                                    <Label>{field.label}</Label>
                                    <FormSelect
                                        name={field.name}
                                        value={filters[field.name] ?? ""}
                                        onChange={(event) =>
                                            setFilters((current) => ({
                                                ...current,
                                                [field.name]:
                                                    event.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">
                                            {field.allLabel ?? "All"}
                                        </option>
                                        {field.options.map((option) => (
                                            <option
                                                key={`${field.name}-${option.value}`}
                                                value={String(option.value)}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </FormSelect>
                                </Field>
                            ))}
                        </div>

                        <div className="grid gap-2 border-t border-zinc-950/8 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-5 dark:border-white/10">
                            <Button type="submit" className="justify-center">
                                Apply filters
                            </Button>
                            {renderClearControl("justify-center")}
                            <Button
                                type="button"
                                color="light"
                                className="justify-center"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </form>
    );

    if (variant === "toolbar") {
        return form;
    }

    return <PagePanel className={className}>{form}</PagePanel>;
}

export function ListTablePanel({
    children,
    className = "",
    footer,
    minHeightClass = "min-h-[70dvh]",
    toolbar,
}: ListTablePanelProps) {
    return (
        <section
            className={`mt-4 flex ${minHeightClass} flex-col overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-sm sm:mt-6 dark:border-white/10 dark:bg-zinc-900/90 ${className}`}
        >
            {toolbar ? (
                <div className="shrink-0 border-b border-zinc-950/10 bg-zinc-50/80 px-4 py-4 dark:border-white/10 dark:bg-zinc-900/95 sm:px-5">
                    {toolbar}
                </div>
            ) : null}
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
            {footer ? <div className="mt-auto shrink-0">{footer}</div> : null}
        </section>
    );
}

export function ListTableFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3 border-t border-zinc-950/10 bg-zinc-50 px-4 py-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-white/10 dark:bg-zinc-900/95 dark:text-zinc-300">
            {children}
        </div>
    );
}

export function SettingsSectionTabs({
    active,
    className = "",
    orientation = "horizontal",
}: {
    active: SettingsSectionKey;
    className?: string;
    orientation?: "horizontal" | "vertical";
}) {
    const isVertical = orientation === "vertical";

    return (
        <nav
            aria-label="Settings sections"
            className={`${
                isVertical
                    ? "flex flex-col gap-1"
                    : "mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-zinc-950/10 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5"
            } ${className}`}
        >
            {settingsSections.map((section) => {
                const isActive = section.key === active;

                return (
                    <Link
                        key={section.key}
                        href={section.href}
                        className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold tracking-normal no-underline transition ${
                            isVertical ? "block w-full" : "sm:px-4"
                        } ${
                            isActive
                                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                : "text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                        }`}
                    >
                        {section.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export function SettingsSectionLayout({
    active,
    children,
    contentClassName = "",
}: {
    active: SettingsSectionKey;
    children: React.ReactNode;
    contentClassName?: string;
}) {
    const currentSection = settingsSections.find(
        (section) => section.key === active,
    );

    return (
        <>
            <div className="sticky top-0 z-30 hidden md:block xl:hidden">
                <SettingsSectionTabs active={active} />
            </div>

            {active !== "home" && currentSection ? (
                <div className="mb-4 md:hidden">
                    <PagePanel className="p-4">
                        <Link
                            href="/admin/settings/home"
                            className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-semibold text-zinc-600 no-underline transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                        >
                            <ChevronLeft
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Settings
                        </Link>
                    </PagePanel>
                </div>
            ) : null}

            <div className="grid min-h-0 grid-cols-1 gap-5 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-start">
                <div className="hidden xl:sticky xl:top-0 xl:block">
                    <PagePanel className="max-h-dvh overflow-y-auto p-3">
                        <p className="mb-3 px-2 text-sm font-semibold text-zinc-950 dark:text-white">
                            Settings
                        </p>
                        <SettingsSectionTabs
                            active={active}
                            orientation="vertical"
                        />
                    </PagePanel>
                </div>

                <div className={`min-w-0 ${contentClassName}`}>{children}</div>
            </div>
        </>
    );
}

export function MobileSettingsBackButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            onClick={onClick}
        >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {children}
        </button>
    );
}

export function MobileSettingsBreadcrumbs({
    items,
}: {
    items: Array<{
        label: React.ReactNode;
        onClick?: () => void;
        current?: boolean;
    }>;
}) {
    return (
        <nav
            aria-label="Mobile settings breadcrumbs"
            className="flex flex-wrap items-center gap-1 text-sm font-semibold"
        >
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    {index > 0 ? (
                        <ChevronRight
                            className="h-3.5 w-3.5 text-zinc-400"
                            aria-hidden="true"
                        />
                    ) : null}
                    {item.onClick && !item.current ? (
                        <button
                            type="button"
                            className="rounded-md px-1 py-0.5 text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                            onClick={item.onClick}
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span
                            className={
                                item.current
                                    ? "rounded-md px-1 py-0.5 text-zinc-950 dark:text-white"
                                    : "rounded-md px-1 py-0.5 text-zinc-600 dark:text-zinc-300"
                            }
                        >
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}

export function MobileSettingsListItem({
    children,
    href,
    onClick,
}: {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
}) {
    const className =
        "flex w-full items-center justify-between gap-3 border-b border-zinc-950/8 px-4 py-4 text-left text-base font-semibold text-zinc-950 transition last:border-b-0 hover:bg-zinc-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5";
    const icon = (
        <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
    );

    if (href) {
        return (
            <Link href={href} className={`${className} no-underline`}>
                <span>{children}</span>
                {icon}
            </Link>
        );
    }

    return (
        <button type="button" className={className} onClick={onClick}>
            <span>{children}</span>
            {icon}
        </button>
    );
}

export function MobileSettingsScreen({
    backLabel,
    children,
    onBack,
    title,
}: {
    backLabel?: string;
    children: React.ReactNode;
    onBack?: () => void;
    title?: string;
}) {
    const hasHeader = Boolean((onBack && backLabel) || title);

    return (
        <div className="space-y-4 md:hidden">
            <PagePanel className="p-0">
                {hasHeader ? (
                    <div className="border-b border-zinc-950/8 px-4 py-3 dark:border-white/10">
                        {onBack && backLabel ? (
                            <MobileSettingsBackButton onClick={onBack}>
                                {backLabel}
                            </MobileSettingsBackButton>
                        ) : null}
                        {title ? (
                            <h2 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                                {title}
                            </h2>
                        ) : null}
                    </div>
                ) : null}
                <div>{children}</div>
            </PagePanel>
        </div>
    );
}

export function MobileTableList({
    children,
    className = "",
}: MobileTableListProps) {
    return (
        <div className={`grid gap-2 p-3 md:hidden ${className}`}>
            {children}
        </div>
    );
}

export function MobileTableRow({
    number,
    title,
    subtitle,
    badge,
    media,
    onOpen,
    openLabel,
}: MobileTableRowProps) {
    return (
        <button
            type="button"
            className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-zinc-950/8 bg-white/85 px-3 py-3 text-left shadow-sm transition hover:border-zinc-950/15 hover:bg-white focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10 dark:focus:outline-white"
            aria-label={
                openLabel ??
                (typeof title === "string" ? `View ${title}` : "View details")
            }
            onClick={onOpen}
        >
            {media ? (
                <span className="shrink-0">{media}</span>
            ) : number !== undefined ? (
                <span className="w-12 shrink-0 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                    No. {number}
                </span>
            ) : null}
            <span className="min-w-0">
                {media && number !== undefined ? (
                    <span className="mb-0.5 block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                        No. {number}
                    </span>
                ) : null}
                <span className="block truncate text-sm font-semibold text-zinc-950 dark:text-white">
                    {title}
                </span>
                {subtitle ? (
                    <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {subtitle}
                    </span>
                ) : null}
            </span>
            <span className="shrink-0 justify-self-end">{badge}</span>
        </button>
    );
}

export function DetailModal({
    title,
    subtitle,
    badge,
    children,
    actions,
    onClose,
    titleId = "detail-modal-title",
    maxWidthClass = "max-w-2xl",
    bodyClassName = "",
}: DetailModalProps) {
    return (
        <div
            className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <button
                type="button"
                className="absolute inset-0 bg-zinc-950/60"
                aria-label="Close details"
                onClick={onClose}
            />
            <div
                className={`relative flex max-h-[92dvh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-zinc-950/8 px-4 py-4 dark:border-white/10 sm:px-5">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2
                                id={titleId}
                                className="min-w-0 truncate text-base font-semibold text-zinc-950 dark:text-white"
                            >
                                {title}
                            </h2>
                            {badge}
                        </div>
                        {subtitle ? (
                            <Text className="mt-1">{subtitle}</Text>
                        ) : null}
                    </div>
                    <Button
                        type="button"
                        plain
                        className="h-10 w-10 shrink-0 px-0"
                        aria-label="Close details"
                        onClick={onClose}
                    >
                        <X data-slot="icon" />
                    </Button>
                </div>
                <div
                    className={`min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5 ${bodyClassName}`}
                >
                    {children}
                </div>
                {actions ? (
                    <div className="grid gap-2 border-t border-zinc-950/8 bg-zinc-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:flex-wrap sm:px-5 dark:border-white/10 dark:bg-white/5">
                        {actions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-zinc-950/8 bg-white p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                {title}
            </h3>
            <div className="mt-3">{children}</div>
        </section>
    );
}

export function DetailGrid({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
            {children}
        </div>
    );
}

export function DetailItem({
    label,
    children,
    className = "",
    full = false,
}: DetailItemProps) {
    const hasContent =
        children !== null && children !== undefined && children !== "";

    return (
        <div
            className={`rounded-lg border border-zinc-950/8 bg-zinc-50/70 p-3 dark:border-white/10 dark:bg-zinc-950/40 ${full ? "sm:col-span-2" : ""} ${className}`}
        >
            <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            <div className="mt-1 break-words text-sm font-medium text-zinc-950 dark:text-white">
                {hasContent ? (
                    children
                ) : (
                    <span className="font-normal text-zinc-500 dark:text-zinc-400">
                        Not provided
                    </span>
                )}
            </div>
        </div>
    );
}

export function EditableTable({
    children,
    className = "",
    minWidth = "56rem",
}: EditableTableProps) {
    return (
        <div
            className={`w-full overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-white/5 ${className}`}
        >
            <div className="w-full overflow-x-auto">
                <table
                    className="w-full table-fixed border-collapse"
                    style={{ minWidth: `max(100%, ${minWidth})` }}
                >
                    {children}
                </table>
            </div>
        </div>
    );
}

export function EditableTableHead({ children }: { children: React.ReactNode }) {
    return (
        <thead>
            <tr className="border-b border-zinc-950/8 dark:border-white/10">
                {children}
            </tr>
        </thead>
    );
}

export function EditableTableHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`px-4 py-2.5 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 ${className}`}
        >
            {children}
        </th>
    );
}

export function EditableTableBody({ children }: { children: React.ReactNode }) {
    return (
        <tbody className="[&>tr]:border-b [&>tr]:border-zinc-950/8 dark:[&>tr]:border-white/10">
            {children}
        </tbody>
    );
}

export function EditableTableCell({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

export function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                {title}
            </p>
            <Text className="mt-2">{description}</Text>
        </div>
    );
}

export function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p>
    ) : null;
}

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

function colorPickerValue(
    value: React.InputHTMLAttributes<HTMLInputElement>["value"],
) {
    return typeof value === "string" && hexColorPattern.test(value)
        ? value
        : "#ffffff";
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-zinc-950/40 dark:text-white dark:focus:outline-white ${props.className ?? ""}`}
        />
    );
}

export function FormColorInput({
    className = "",
    pickerLabel = "Pick color",
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { pickerLabel?: string }) {
    return (
        <div className={`flex w-full items-center gap-2 ${className}`}>
            <label className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-zinc-950/10 bg-white p-1 shadow-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-zinc-950 dark:border-white/10 dark:bg-zinc-950/40 dark:focus-within:outline-white">
                <span className="sr-only">{pickerLabel}</span>
                <input
                    type="color"
                    value={colorPickerValue(props.value)}
                    onChange={props.onChange}
                    disabled={props.disabled}
                    aria-label={pickerLabel}
                    className="h-full w-full cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 disabled:cursor-not-allowed [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                />
            </label>
            <FormInput {...props} type="text" className="min-w-0 flex-1" />
        </div>
    );
}

export function FormTextarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
    return (
        <textarea
            {...props}
            className={`block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-zinc-950/40 dark:text-white dark:focus:outline-white ${props.className ?? ""}`}
        />
    );
}

export function FormSelect(
    props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
    return (
        <select
            {...props}
            className={`block w-full rounded-lg border border-zinc-950/10 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:outline-white ${props.className ?? ""}`}
        />
    );
}

export function StatusBadge({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "green" | "amber" | "red";
}) {
    const toneClasses = {
        neutral:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
        red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
        >
            {children}
        </span>
    );
}

export function PaginationLinks({
    meta,
    baseUrl,
}: {
    meta: PaginationMeta;
    baseUrl: string;
}) {
    const page = usePage();
    const previous = Math.max(meta.currentPage - 1, 1);
    const next = Math.min(meta.currentPage + 1, meta.lastPage);
    const lastPage = Math.max(meta.lastPage, 1);
    const firstItem = meta.from ?? 0;
    const lastItem = meta.to ?? 0;

    const pageHref = (targetPage: number) => {
        const currentUrl = new URL(page.url, "http://admin.local");
        const nextUrl = new URL(baseUrl, "http://admin.local");

        nextUrl.search = currentUrl.search;
        nextUrl.searchParams.set("page", String(targetPage));

        return `${nextUrl.pathname}${nextUrl.search}`;
    };

    return (
        <ListTableFooter>
            <div className="flex flex-col gap-1">
                <span>
                    Showing {firstItem} to {lastItem} of {meta.total}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {meta.perPage} per page | Page {meta.currentPage} of{" "}
                    {lastPage}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {meta.currentPage <= 1 ? (
                    <span className="inline-flex justify-center rounded-lg border border-zinc-950/10 px-3 py-2 opacity-50 dark:border-white/15">
                        Previous
                    </span>
                ) : (
                    <Button
                        href={pageHref(previous)}
                        color="light"
                        preserveScroll
                        className="justify-center"
                    >
                        Previous
                    </Button>
                )}
                {meta.currentPage >= meta.lastPage ? (
                    <span className="inline-flex justify-center rounded-lg border border-zinc-950/10 px-3 py-2 opacity-50 dark:border-white/15">
                        Next
                    </span>
                ) : (
                    <Button
                        href={pageHref(next)}
                        color="light"
                        preserveScroll
                        className="justify-center"
                    >
                        Next
                    </Button>
                )}
            </div>
        </ListTableFooter>
    );
}

export function TextLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950 dark:text-white dark:decoration-zinc-600"
        >
            {children}
        </Link>
    );
}

export function FormCheckbox({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {label}
            </span>
        </label>
    );
}
