import { router } from '@inertiajs/react';
import React from 'react';
import { Button } from '@admin/Components/ui/button';
import { Text } from '@admin/Components/ui/text';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { FormInput, FormSelect, PagePanel } from '@admin/Components/AdminPrimitives';
import { TrashIcon, PlusIcon, GripVerticalIcon } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SocialLink {
    id: number;
    platform_key: string;
    label: string | null;
    url: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    links: SocialLink[];
    settings: {
        showSocialLinksOnHero: boolean;
    };
}

type SocialLinkPayload = {
    platform_key: string;
    label: string | null;
    url: string;
    sort_order: number;
    is_active: boolean;
};

const AVAILABLE_PLATFORMS = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'twitter', label: 'Twitter / X' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'pinterest', label: 'Pinterest' },
    { key: 'whatsapp', label: 'WhatsApp' },
];

function SortableLinkItem({
    link,
    onUpdate,
    onRemove,
}: {
    link: SocialLink;
    onUpdate: (data: Partial<SocialLink>) => void;
    onRemove: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex gap-4 items-start rounded-2xl border border-zinc-950/8 p-4 dark:border-white/10">
            <div className="pt-2 cursor-grab" {...attributes} {...listeners}>
                <GripVerticalIcon className="w-5 h-5 text-zinc-400" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Field>
                        <Label>Platform</Label>
                        <FormSelect
                            value={link.platform_key}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdate({ platform_key: e.target.value })}
                        >
                            <option value="">Select platform</option>
                            {AVAILABLE_PLATFORMS.map((p) => (
                                <option key={p.key} value={p.key}>
                                    {p.label}
                                </option>
                            ))}
                        </FormSelect>
                    </Field>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Field>
                        <Label>URL</Label>
                        <FormInput
                            value={link.url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ url: e.target.value })}
                            placeholder="https://..."
                        />
                    </Field>
                </div>
            </div>

            <div className="pt-8 flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={link.is_active}
                        onChange={(e) => onUpdate({ is_active: e.target.checked })}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
                </label>
                
                <Button type="button" color="light" onClick={onRemove} className="text-red-500">
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default function SocialLinksIndex({ links, settings }: Props) {
    const [localLinks, setLocalLinks] = React.useState<SocialLink[]>(links);
    const [isSaving, setIsSaving] = React.useState(false);
    const [showHeroSocials, setShowHeroSocials] = React.useState(settings.showSocialLinksOnHero);

    React.useEffect(() => {
        setLocalLinks(links);
    }, [links]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalLinks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Reassign sort_order
                const reordered = newItems.map((item, idx) => ({ ...item, sort_order: idx }));
                
                // Save new order immediately if desired, or let the user click save all
                return reordered;
            });
        }
    };

    const handleAdd = () => {
        const newId = Math.min(-1, ...localLinks.map(l => l.id)) - 1; // negative IDs for unsaved items
        setLocalLinks([...localLinks, {
            id: newId,
            platform_key: 'facebook',
            label: '',
            url: '',
            sort_order: localLinks.length,
            is_active: true,
        }]);
    };

    const handleUpdate = (id: number, data: Partial<SocialLink>) => {
        setLocalLinks(localLinks.map(l => l.id === id ? { ...l, ...data } : l));
    };

    const handleRemove = (id: number) => {
        if (id > 0) {
            router.delete(`/admin/social-links/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalLinks(localLinks.filter(l => l.id !== id));
                }
            });
        } else {
            setLocalLinks(localLinks.filter(l => l.id !== id));
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        let hasError = false;
        for (const link of localLinks) {
            if (!link.url || link.url.trim() === '') {
                alert(`URL is required for platform: ${link.platform_key}`);
                hasError = true;
                break;
            }
            const payload: SocialLinkPayload = {
                platform_key: link.platform_key,
                label: link.label,
                url: link.url,
                sort_order: link.sort_order,
                is_active: link.is_active,
            };

            if (link.id < 0) {
                // new link
                await new Promise<void>((resolve) => router.post('/admin/social-links', payload, {
                    preserveScroll: true,
                    onError: (err) => {
                        console.error(err);
                        alert(`Failed to save ${link.platform_key}: ${Object.values(err)[0]}`);
                        hasError = true;
                    },
                    onFinish: () => resolve()
                }));
            } else {
                // update existing
                await new Promise<void>((resolve) => router.put(`/admin/social-links/${link.id}`, payload, {
                    preserveScroll: true,
                    onError: (err) => {
                        console.error(err);
                        alert(`Failed to update ${link.platform_key}: ${Object.values(err)[0]}`);
                        hasError = true;
                    },
                    onFinish: () => resolve()
                }));
            }
            if (hasError) break;
        }
        setIsSaving(false);
        if (!hasError) {
            router.reload({ only: ['links'] });
        }
    };

    return (
        <AdminShell title="Socials" description="Add social links, edit existing links, remove links, and switch them active or inactive.">
            <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
                <Button onClick={handleSaveAll} disabled={isSaving}>
                    Save socials
                </Button>
            </div>

            <PagePanel className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                            Social Display
                        </h2>
                        <Text>
                            Control where active social links appear on the public site.
                        </Text>
                    </div>
                    <label className="inline-flex items-center gap-3 rounded-xl border border-zinc-950/10 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                        <input
                            type="checkbox"
                            checked={showHeroSocials}
                            onChange={(event) => {
                                const checked = event.target.checked;
                                setShowHeroSocials(checked);
                                router.patch("/admin/social-links/settings", {
                                    show_social_links_on_hero: checked,
                                }, {
                                    preserveScroll: true,
                                });
                            }}
                        />
                        Show active social links on homepage hero
                    </label>
                </div>
            </PagePanel>

            <PagePanel>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={localLinks.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {localLinks.map((link) => (
                                <SortableLinkItem
                                    key={link.id}
                                    link={link}
                                    onUpdate={(data) => handleUpdate(link.id, data)}
                                    onRemove={() => handleRemove(link.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="mt-6 flex">
                    <Button type="button" color="light" onClick={handleAdd}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add social link
                    </Button>
                </div>
            </PagePanel>
        </AdminShell>
    );
}
