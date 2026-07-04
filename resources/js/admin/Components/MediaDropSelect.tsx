import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@admin/Components/ui/button';
import { Text } from '@admin/Components/ui/text';

export type MediaOption = {
    id: number;
    label: string;
    altText?: string | null;
    url?: string | null;
    previewUrl?: string | null;
    status?: string;
    width?: number | null;
    height?: number | null;
};

type MediaDropSelectProps = {
    value: number | '';
    options: MediaOption[];
    onChange: (value: number | '', media?: MediaOption | null) => void;
    onUploaded?: (media: MediaOption) => void;
    label?: string;
    preview?: MediaOption | null;
    className?: string;
};

function errorMessage(error: unknown, fallback: string) {
    if (!axios.isAxiosError(error)) {
        return fallback;
    }

    const responseData = error.response?.data;

    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        const message = responseData.message;

        if (typeof message === 'string') {
            return message;
        }
    }

    return fallback;
}

function selectedMedia(options: MediaOption[], value: number | '', preview?: MediaOption | null) {
    if (preview && preview.id === value) {
        return preview;
    }

    return value === '' ? null : options.find((media) => media.id === value) ?? preview ?? null;
}

function mediaPreviewUrl(media: MediaOption | null) {
    return media?.url ?? media?.previewUrl ?? null;
}

export function MediaDropSelect({
    value,
    options,
    onChange,
    onUploaded,
    label = 'Media',
    preview,
    className = '',
}: MediaDropSelectProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const media = useMemo(() => selectedMedia(options, value, preview), [options, preview, value]);
    const previewUrl = mediaPreviewUrl(media);

    useEffect(() => {
        if (!isPreviewOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPreviewOpen(false);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isPreviewOpen]);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));

        setIsUploading(true);
        setError(null);

        try {
            const response = await axios.post<MediaOption>('/admin/media', formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            const uploaded = response.data;
            onUploaded?.(uploaded);
            onChange(uploaded.id, uploaded);
        } catch (uploadError: unknown) {
            setError(errorMessage(uploadError, 'Image upload failed.'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleFiles = (files: FileList | null) => {
        const file = files?.[0];

        if (!file) {
            return;
        }

        void uploadFile(file);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <div
                className={`rounded-2xl border border-dashed p-4 transition-colors ${
                    isDraggingOver
                        ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-white/5'
                        : 'border-zinc-950/15 bg-white/70 dark:border-white/15 dark:bg-white/5'
                }`}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDraggingOver(false);
                    handleFiles(event.dataTransfer.files);
                }}
            >
                <div className="grid gap-4 sm:grid-cols-[8rem_1fr] sm:items-center">
                    <div className="aspect-video overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        {previewUrl ? (
                            <button
                                type="button"
                                className="block h-full w-full cursor-zoom-in"
                                onClick={() => setIsPreviewOpen(true)}
                                aria-label={`Preview ${media?.label ?? label}`}
                            >
                                <img src={previewUrl} alt={media?.altText ?? ''} className="h-full w-full object-cover" />
                            </button>
                        ) : (
                            <div className="grid h-full place-items-center text-zinc-400">
                                <ImagePlus className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-950 dark:text-white">
                            {media?.label ?? label}
                        </p>
                        <Text>{isUploading ? 'Uploading image...' : 'Drop an image here or upload a file.'}</Text>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                    handleFiles(event.currentTarget.files);
                                    event.currentTarget.value = '';
                                }}
                            />
                            <Button
                                type="button"
                                color="light"
                                disabled={isUploading}
                                onClick={() => inputRef.current?.click()}
                            >
                                {isUploading ? <Loader2 data-slot="icon" className="animate-spin" /> : <ImagePlus data-slot="icon" />}
                                {isUploading ? 'Uploading' : 'Upload image'}
                            </Button>
                            {value !== '' ? (
                                <Button type="button" plain onClick={() => onChange('', null)}>
                                    Clear
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

            {isPreviewOpen && previewUrl ? (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Image preview for ${media?.label ?? label}`}
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div className="relative max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm hover:bg-white"
                            onClick={() => setIsPreviewOpen(false)}
                            aria-label="Close image preview"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <img
                            src={previewUrl}
                            alt={media?.altText ?? ''}
                            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
