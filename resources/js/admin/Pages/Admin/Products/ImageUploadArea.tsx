import React, { useEffect, useRef, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImagePlus, X, Star } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { Text } from '@admin/Components/ui/text';
import type { MediaOption } from '@admin/Components/MediaDropSelect';
import axios from 'axios';

export type ProductImage = {
    id: number | string;
    url: string;
    isPrimary: boolean;
    label?: string;
    altText?: string | null;
    status?: string;
    file?: File;
    uploading?: boolean;
};

type SortableItemProps = {
    image: ProductImage;
    onRemove: (id: number | string) => void;
    onSetPrimary: (id: number | string) => void;
    onPreview: (image: ProductImage) => void;
};

function SortableImageItem({ image, onRemove, onSetPrimary, onPreview }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative group aspect-square rounded-lg border overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${isDragging ? 'opacity-50 ring-2 ring-zinc-950 dark:ring-white' : ''}`}>
            <button
                type="button"
                className="block h-full w-full cursor-zoom-in"
                onClick={() => onPreview(image)}
                aria-label={`Preview ${image.label ?? 'product image'}`}
                {...attributes}
                {...listeners}
            >
                <img src={image.url} alt={image.altText ?? ''} className="object-cover w-full h-full" />
            </button>

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
    maxImages?: number;
};

function uploadErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) {
        return 'Image upload failed.';
    }

    const responseData = error.response?.data;

    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        const message = responseData.message;

        if (typeof message === 'string') {
            return message;
        }
    }

    return 'Image upload failed.';
}

export default function ImageUploadArea({ images, onChange, maxImages = 10 }: ImageUploadAreaProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const remainingSlots = Math.max(maxImages - images.length, 0);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (!previewImage) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setPreviewImage(null);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [previewImage]);

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

        setUploadError(null);

        if (remainingSlots <= 0) {
            setUploadError(`You can upload up to ${maxImages} product images.`);
            return;
        }

        const acceptedFiles = Array.from(files).slice(0, remainingSlots);

        if (files.length > remainingSlots) {
            setUploadError(`Only ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} can be added.`);
        }

        const newImages: ProductImage[] = acceptedFiles.map((file, index) => ({
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
                const response = await axios.post<MediaOption>('/admin/media', formData, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    }
                });

                updatedImages = updatedImages.map(img => {
                    if (img.id === image.id) {
                        return {
                            ...img,
                            id: response.data.id,
                            uploading: false,
                            url: response.data.url ?? img.url,
                            label: response.data.label,
                            altText: response.data.altText ?? null,
                            status: response.data.status,
                        };
                    }
                    return img;
                });
                onChange(updatedImages);
            } catch (error: unknown) {
                setUploadError(uploadErrorMessage(error));
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
                className={`rounded-xl border border-dashed p-5 text-center transition-colors ${remainingSlots <= 0 ? 'border-zinc-200 bg-zinc-50 opacity-75 dark:border-zinc-800 dark:bg-white/5' : isDraggingOver ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-white/5' : 'border-zinc-300 dark:border-zinc-700'}`}
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
                    <Text className="font-medium">{remainingSlots > 0 ? 'Upload product images' : 'Image limit reached'}</Text>
                    <Text className="text-sm text-zinc-500">
                        {images.length}/{maxImages} images selected. First image is primary unless you choose another.
                    </Text>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            e.currentTarget.value = '';
                        }}
                        disabled={remainingSlots <= 0}
                    />
                    <Button outline type="button" onClick={() => fileInputRef.current?.click()} disabled={remainingSlots <= 0}>
                        <ImagePlus data-slot="icon" />
                        <span>Browse files</span>
                    </Button>
                </div>
            </div>

            {uploadError ? <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p> : null}

            {images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {images.map((image) => (
                                <SortableImageItem
                                    key={image.id}
                                    image={image}
                                    onRemove={removeImage}
                                    onSetPrimary={setPrimary}
                                    onPreview={setPreviewImage}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {previewImage ? (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Image preview for ${previewImage.label ?? 'product image'}`}
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm hover:bg-white"
                            onClick={() => setPreviewImage(null)}
                            aria-label="Close image preview"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <img
                            src={previewImage.url}
                            alt={previewImage.altText ?? ''}
                            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
