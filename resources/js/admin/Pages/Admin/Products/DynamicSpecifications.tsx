import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";
import { Button } from "@admin/Components/ui/button";
import {
    DetailGrid,
    DetailItem,
    DetailModal,
    DetailSection,
    EditableTable,
    EditableTableBody,
    EditableTableCell,
    EditableTableHead,
    EditableTableHeader,
    FormInput,
    MobileTableList,
    MobileTableRow,
} from "@admin/Components/AdminPrimitives";

export type DynamicSpec = {
    id: string;
    key: string;
    value: string;
};

type SortableItemProps = {
    spec: DynamicSpec;
    onChange: (id: string, field: "key" | "value", value: string) => void;
    onRemove: (id: string) => void;
};

function SortableSpecItem({ spec, onChange, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: spec.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`align-top ${isDragging ? "shadow-md ring-1 ring-zinc-950 dark:ring-white" : ""}`}
        >
            <EditableTableCell>
                <div
                    {...attributes}
                    {...listeners}
                    className="inline-flex cursor-grab rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label={`Reorder ${spec.key || "specification"}`}
                >
                    <GripVertical className="h-4 w-4 text-zinc-400" />
                </div>
            </EditableTableCell>
            <EditableTableCell>
                <FormInput
                    placeholder="Specification Name (e.g., Weight)"
                    value={spec.key}
                    onChange={(e) => onChange(spec.id, "key", e.target.value)}
                />
            </EditableTableCell>
            <EditableTableCell>
                <FormInput
                    placeholder="Value (e.g., 5 kg)"
                    value={spec.value}
                    onChange={(e) => onChange(spec.id, "value", e.target.value)}
                />
            </EditableTableCell>
            <EditableTableCell className="text-right">
                <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={() => onRemove(spec.id)}
                    aria-label="Remove specification"
                >
                    <X className="h-4 w-4" />
                </button>
            </EditableTableCell>
        </tr>
    );
}

type DynamicSpecificationsProps = {
    specs: DynamicSpec[];
    onChange: (specs: DynamicSpec[]) => void;
};

export default function DynamicSpecifications({
    specs,
    onChange,
}: DynamicSpecificationsProps) {
    const [selectedSpecId, setSelectedSpecId] = React.useState<string | null>(
        null,
    );
    const selectedSpec =
        selectedSpecId === null
            ? null
            : (specs.find((spec) => spec.id === selectedSpecId) ?? null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
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
        onChange([...specs, { id: `spec-${Date.now()}`, key: "", value: "" }]);
    };

    const updateSpec = (id: string, field: "key" | "value", value: string) => {
        onChange(
            specs.map((spec) =>
                spec.id === id ? { ...spec, [field]: value } : spec,
            ),
        );
    };

    const removeSpec = (id: string) => {
        onChange(specs.filter((spec) => spec.id !== id));
    };

    return (
        <div className="space-y-4">
            {specs.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={specs.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <>
                            <MobileTableList className="p-0">
                                {specs.map((spec, index) => (
                                    <MobileTableRow
                                        key={spec.id}
                                        number={index + 1}
                                        title={spec.key || "Specification"}
                                        subtitle={spec.value || "No value"}
                                        onOpen={() =>
                                            setSelectedSpecId(spec.id)
                                        }
                                    />
                                ))}
                            </MobileTableList>
                            <div className="hidden md:block">
                                <EditableTable minWidth="42rem">
                                    <colgroup>
                                        <col className="w-[72px]" />
                                        <col />
                                        <col />
                                        <col className="w-[88px]" />
                                    </colgroup>
                                    <EditableTableHead>
                                        <EditableTableHeader>
                                            Move
                                        </EditableTableHeader>
                                        <EditableTableHeader>
                                            Name
                                        </EditableTableHeader>
                                        <EditableTableHeader>
                                            Value
                                        </EditableTableHeader>
                                        <EditableTableHeader className="text-right">
                                            Actions
                                        </EditableTableHeader>
                                    </EditableTableHead>
                                    <EditableTableBody>
                                        {specs.map((spec) => (
                                            <SortableSpecItem
                                                key={spec.id}
                                                spec={spec}
                                                onChange={updateSpec}
                                                onRemove={removeSpec}
                                            />
                                        ))}
                                    </EditableTableBody>
                                </EditableTable>
                            </div>
                        </>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="text-center p-6 border rounded-lg border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-500">
                        No custom specifications added yet.
                    </p>
                </div>
            )}
            <Button outline type="button" className="w-full" onClick={addSpec}>
                <Plus className="h-4 w-4" /> Add Specification
            </Button>
            {selectedSpec ? (
                <DetailModal
                    title={selectedSpec.key || "Specification"}
                    subtitle={selectedSpec.value || "No value"}
                    onClose={() => setSelectedSpecId(null)}
                    titleId="specification-detail-title"
                    actions={
                        <Button
                            type="button"
                            plain
                            className="justify-center"
                            onClick={() => {
                                removeSpec(selectedSpec.id);
                                setSelectedSpecId(null);
                            }}
                        >
                            <X data-slot="icon" />
                            Remove
                        </Button>
                    }
                >
                    <DetailSection title="Specification Detail">
                        <div className="grid gap-4">
                            <DetailGrid>
                                <DetailItem label="No.">
                                    {specs.findIndex(
                                        (spec) => spec.id === selectedSpec.id,
                                    ) + 1}
                                </DetailItem>
                            </DetailGrid>
                            <FormInput
                                placeholder="Specification Name (e.g., Weight)"
                                value={selectedSpec.key}
                                onChange={(event) =>
                                    updateSpec(
                                        selectedSpec.id,
                                        "key",
                                        event.target.value,
                                    )
                                }
                            />
                            <FormInput
                                placeholder="Value (e.g., 5 kg)"
                                value={selectedSpec.value}
                                onChange={(event) =>
                                    updateSpec(
                                        selectedSpec.id,
                                        "value",
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </DetailSection>
                </DetailModal>
            ) : null}
        </div>
    );
}
