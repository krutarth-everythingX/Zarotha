import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImagePlus, X, Star } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { Text } from '@admin/Components/ui/text';
import axios from 'axios';

export type ProductImage = {
    id: number | string;
    url: string;
    isPrimary: boolean;
    file?: File;
    uploading?: boolean;
};

type SortableItemProps = {
    image: ProductImage;
    onRemove: (id: number | string) => void;
    onSetPrimary: (id: number | string) => void;
};

function SortableImageItem({ image, onRemove, onSetPrimary }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative group aspect-square rounded-lg border overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${isDragging ? 'opacity-50 ring-2 ring-zinc-950 dark:ring-white' : ''}`}>
            <img src={image.url} alt="" className="object-cover w-full h-full" {...attributes} {...listeners} />

            {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Text className="text-white">Uploading...</Text>
                </div>
            )}

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/90 shadow-sm hover:bg-white" onClick={() => onSetPrimary(image.id)} title="Set as primary">
                    <Star className={`h-4 w-4 ${image.isPrimary ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`} />
                </button>
                <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white shadow-sm hover:bg-red-600" onClick={() => onRemove(image.id)}>
                    <X className="h-4 w-4" />
                </button>
            </div>
            {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                    Primary
                </div>
            )}
        </div>
    );
}

type ImageUploadAreaProps = {
    images: ProductImage[];
    onChange: (images: ProductImage[]) => void;
};

export default function ImageUploadArea({ images, onChange }: ImageUploadAreaProps) {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((i) => i.id === active.id);
            const newIndex = images.findIndex((i) => i.id === over.id);
            onChange(arrayMove(images, oldIndex, newIndex));
        }
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
            id: `temp-${Date.now()}-${index}`,
            url: URL.createObjectURL(file),
            isPrimary: images.length === 0 && index === 0,
            file,
            uploading: true
        }));

        let updatedImages = [...images, ...newImages];
        onChange(updatedImages);

        for (const image of newImages) {
            const formData = new FormData();
            formData.append('file', image.file as File);
            formData.append('alt_text', '');

            try {
                const response = await axios.post('/admin/media', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                updatedImages = updatedImages.map(img => {
                    if (img.id === image.id) {
                        return { ...img, id: response.data.id, uploading: false, url: response.data.url ?? img.url };
                    }
                    return img;
                });
                onChange(updatedImages);
            } catch (error) {
                console.error("Failed to upload image", error);
                updatedImages = updatedImages.filter(img => img.id !== image.id);
                onChange(updatedImages);
            }
        }
    };

    const removeImage = (id: number | string) => {
        const nextImages = images.filter(img => img.id !== id);
        if (images.find(img => img.id === id)?.isPrimary && nextImages.length > 0) {
            nextImages[0].isPrimary = true;
        }
        onChange(nextImages);
    };

    const setPrimary = (id: number | string) => {
        onChange(images.map(img => ({ ...img, isPrimary: img.id === id })));
    };

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-white/5' : 'border-zinc-300 dark:border-zinc-700'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    handleFiles(e.dataTransfer.files);
                }}
            >
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <ImagePlus className="h-5 w-5 text-zinc-500" />
                    </div>
                    <Text className="font-medium">Drag & drop images here</Text>
                    <Text className="text-sm text-zinc-500">or click to browse</Text>
                    <label className="cursor-pointer mt-2">
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                        <Button outline type="button">
                            <span>Browse Files</span>
                        </Button>
                    </label>
                </div>
            </div>

            {images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((image) => (
                                <SortableImageItem
                                    key={image.id}
                                    image={image}
                                    onRemove={removeImage}
                                    onSetPrimary={setPrimary}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
