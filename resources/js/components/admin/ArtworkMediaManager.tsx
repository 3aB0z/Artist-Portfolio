import { router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Star, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import type { ArtworkMedia } from '@/types/artwork-media';

interface Props {
    artworkSlug: string;
    media: ArtworkMedia[];
}

export default function ArtworkMediaManager({ artworkSlug, media }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const sortedMedia = [...media].sort((a, b) => a.sort_order - b.sort_order);

    const uploadImages = async (files: File[]) => {
        const imageFiles = files.filter((file) =>
            file.type.startsWith('image/'),
        );

        if (!imageFiles.length) {
            return;
        }

        setUploading(true);

        try {
            for (const file of imageFiles) {
                const formData = new FormData();

                formData.append('image', file);

                await fetch(`/admin/artworks/${artworkSlug}/media`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') ?? '',
                        Accept: 'application/json',
                    },
                    credentials: 'same-origin',
                });
            }

            router.reload({
                only: ['artwork'],
            });
        } finally {
            setUploading(false);

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    const setPrimary = async (item: ArtworkMedia) => {
        const response = await fetch(
            `/admin/artworks/${artworkSlug}/media/${item.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') ?? '',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    is_primary: true,
                }),
            },
        );

        if (!response.ok) {
            return;
        }

        router.reload({
            only: ['artwork'],
        });
    };

    const deleteMedia = async (item: ArtworkMedia) => {
        if (item.is_primary) {
            return;
        }

        if (!window.confirm('Delete this image?')) {
            return;
        }

        const response = await fetch(
            `/admin/artworks/${artworkSlug}/media/${item.id}`,
            {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') ?? '',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
            },
        );

        if (!response.ok) {
            return;
        }

        router.reload({
            only: ['artwork'],
        });
    };

    const reorderMedia = async (
        item: ArtworkMedia,
        direction: 'up' | 'down',
    ) => {
        const response = await fetch(
            `/admin/artworks/${artworkSlug}/media/${item.id}/reorder`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') ?? '',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    direction,
                }),
            },
        );

        if (!response.ok) {
            return;
        }

        router.reload({
            only: ['artwork'],
        });
    };

    return (
        <section className="space-y-10">
            <div>
                <p className="mb-3 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                    Media
                </p>
                <h2 className="font-display text-3xl font-light">
                    Artwork Images
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                    Manage the images displayed for this artwork.
                </p>
            </div>

            <div className="space-y-6">
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        void uploadImages(Array.from(event.dataTransfer.files));
                    }}
                    className={`border border-dashed p-8 text-center transition-colors ${
                        isDragging
                            ? 'border-terracotta bg-[#f5f1ec]'
                            : 'border-stone bg-white'
                    }`}
                >
                    <p className="text-sm">Drag and drop artwork images here</p>

                    <p className="mt-2 text-xs text-muted">or</p>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) =>
                            void uploadImages(
                                Array.from(event.target.files ?? []),
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="mt-4 inline-flex h-11 items-center gap-2 bg-ink px-5 font-sans text-[12px] tracking-widest text-white uppercase transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Upload size={15} />
                        {uploading ? 'Uploading...' : 'Choose Images'}
                    </button>
                </div>

                {sortedMedia.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedMedia.map((item) => (
                            <div
                                key={item.id}
                                className="overflow-hidden border border-stone bg-white"
                            >
                                <div className="aspect-square bg-stone">
                                    <img
                                        src={item.path}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex border-t border-stone">
                                    <button
                                        type="button"
                                        onClick={() => reorderMedia(item, 'up')}
                                        disabled={item === sortedMedia[0]}
                                        className="flex-1 border-r border-stone p-3 text-muted-foreground transition-colors hover:bg-[#f5f1ec] hover:text-ink disabled:cursor-not-allowed disabled:bg-accent disabled:opacity-30"
                                        title="Move up"
                                    >
                                        <ChevronUp
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            reorderMedia(item, 'down')
                                        }
                                        disabled={
                                            item ===
                                            sortedMedia[sortedMedia.length - 1]
                                        }
                                        className="flex-1 p-3 text-muted-foreground transition-colors hover:bg-[#f5f1ec] hover:text-ink disabled:cursor-not-allowed disabled:bg-accent disabled:opacity-30"
                                        title="Move down"
                                    >
                                        <ChevronDown
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-t border-stone p-4">
                                    <button
                                        type="button"
                                        onClick={() => setPrimary(item)}
                                        disabled={item.is_primary}
                                        className={
                                            item.is_primary
                                                ? 'inline-flex items-center gap-2 bg-[#f5f1ec] px-3 py-2 text-sm text-muted-foreground'
                                                : 'inline-flex items-center gap-2 border border-ink px-3 py-2 text-sm transition-colors hover:bg-ink hover:text-white'
                                        }
                                    >
                                        <Star
                                            size={15}
                                            fill={
                                                item.is_primary
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                        />
                                        {item.is_primary
                                            ? 'Primary'
                                            : 'Set primary'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteMedia(item)}
                                        disabled={item.is_primary}
                                        className="p-2 text-muted transition-colors hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-30"
                                        title={
                                            item.is_primary
                                                ? 'The primary image cannot be deleted'
                                                : 'Delete image'
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
