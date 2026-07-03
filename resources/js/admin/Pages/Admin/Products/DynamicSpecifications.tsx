import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Plus } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { FormInput } from '@admin/Components/AdminPrimitives';

export type DynamicSpec = {
    id: string;
    key: string;
    value: string;
};

type SortableItemProps = {
    spec: DynamicSpec;
    onChange: (id: string, field: 'key' | 'value', value: string) => void;
    onRemove: (id: string) => void;
};

function SortableSpecItem({ spec, onChange, onRemove }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: spec.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-md border border-zinc-950/10 dark:border-white/10 ${isDragging ? 'shadow-md ring-1 ring-zinc-950 dark:ring-white' : ''}`}>
            <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                <GripVertical className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
                <FormInput
                    placeholder="Specification Name (e.g., Weight)"
                    value={spec.key}
                    onChange={(e) => onChange(spec.id, 'key', e.target.value)}
                />
                <FormInput
                    placeholder="Value (e.g., 5 kg)"
                    value={spec.value}
                    onChange={(e) => onChange(spec.id, 'value', e.target.value)}
                />
            </div>
            <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => onRemove(spec.id)}>
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

type DynamicSpecificationsProps = {
    specs: DynamicSpec[];
    onChange: (specs: DynamicSpec[]) => void;
};

export default function DynamicSpecifications({ specs, onChange }: DynamicSpecificationsProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = specs.findIndex((i) => i.id === active.id);
            const newIndex = specs.findIndex((i) => i.id === over.id);
            onChange(arrayMove(specs, oldIndex, newIndex));
        }
    };

    const addSpec = () => {
        onChange([...specs, { id: `spec-${Date.now()}`, key: '', value: '' }]);
    };

    const updateSpec = (id: string, field: 'key' | 'value', value: string) => {
        onChange(specs.map(spec => spec.id === id ? { ...spec, [field]: value } : spec));
    };

    const removeSpec = (id: string) => {
        onChange(specs.filter(spec => spec.id !== id));
    };

    return (
        <div className="space-y-4">
            {specs.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={specs.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {specs.map((spec) => (
                                <SortableSpecItem
                                    key={spec.id}
                                    spec={spec}
                                    onChange={updateSpec}
                                    onRemove={removeSpec}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="text-center p-6 border rounded-lg border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-500">No custom specifications added yet.</p>
                </div>
            )}
            <Button outline type="button" className="w-full" onClick={addSpec}>
                <Plus className="h-4 w-4" /> Add Specification
            </Button>
        </div>
    );
}
