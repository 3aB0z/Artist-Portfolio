import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { Category } from '@/types/category';

interface Props {
    categories: Category[];
}

interface SelectedImage {
    file: File;
    preview: string;
}

export default function Create({ categories }: Props) {
    const form = useForm({
        slug: '',
        title: '',
        category_id: categories[0]?.id ?? 0,
        description: '',
        artwork_date: '',
        started_at: '',
        completed_at: '',
        duration: '',
        price: '',
    });

    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);

    function addImages(files: File[]) {
        const imageFiles = files.filter((file) =>
            file.type.startsWith('image/'),
        );

        const newImages = imageFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setSelectedImages((current) => [...current, ...newImages]);
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        addImages(Array.from(event.target.files ?? []));
        event.target.value = '';
    }

    function removeSelectedImage(index: number) {
        setSelectedImages((current) => {
            const image = current[index];

            if (image) {
                URL.revokeObjectURL(image.preview);
            }

            return current.filter((_, imageIndex) => imageIndex !== index);
        });
    }

    async function uploadImages(slug: string) {
        if (!selectedImages.length) {
            return;
        }

        setUploadingImages(true);

        try {
            for (const selectedImage of selectedImages) {
                const formData = new FormData();

                formData.append('image', selectedImage.file);

                const response = await fetch(`/admin/artworks/${slug}/media`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') ?? '',
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to upload artwork image.');
                }
            }
        } finally {
            setUploadingImages(false);
        }
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/admin/artworks', {
            onSuccess: async () => {
                try {
                    await uploadImages(form.data.slug);

                    selectedImages.forEach((image) =>
                        URL.revokeObjectURL(image.preview),
                    );

                    setSelectedImages([]);
                } catch {
                    // The artwork was created successfully.
                    // Image upload errors remain visible through the failed request.
                }
            },
        });
    }

    return (
        <main className="mx-auto w-full max-w-300 px-6 py-12 md:px-8 md:py-16">
            <div>
                <p className="mb-4 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                    Portfolio
                </p>

                <h1 className="font-display text-4xl leading-none font-light md:text-5xl">
                    Create Artwork
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                    Add a new piece to the artist's collection.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 max-w-4xl">
                <div className="border-y border-stone">
                    <div className="grid gap-8 border-b border-stone py-8 md:grid-cols-2">
                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Title
                            </label>

                            <input
                                type="text"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm transition-colors outline-none focus:border-terracotta"
                            />
                        </div>

                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Slug
                            </label>

                            <input
                                type="text"
                                value={form.data.slug}
                                onChange={(e) =>
                                    form.setData('slug', e.target.value)
                                }
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm transition-colors outline-none focus:border-terracotta"
                            />
                        </div>
                    </div>

                    <div className="border-b border-stone py-8">
                        <label className="font-sans text-[13px] tracking-widest uppercase">
                            Category
                        </label>

                        <select
                            value={form.data.category_id}
                            onChange={(e) =>
                                form.setData(
                                    'category_id',
                                    Number(e.target.value),
                                )
                            }
                            className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm transition-colors outline-none focus:border-terracotta"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="border-b border-stone py-8">
                        <label className="font-sans text-[13px] tracking-widest uppercase">
                            Images
                        </label>

                        <div
                            onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(event) => {
                                event.preventDefault();
                                setIsDragging(false);
                                addImages(Array.from(event.dataTransfer.files));
                            }}
                            className={`mt-3 border border-dashed p-8 text-center transition-colors ${
                                isDragging
                                    ? 'border-terracotta bg-[#f5f1ec]'
                                    : 'border-stone bg-white'
                            }`}
                        >
                            <p className="text-sm">
                                Drag and drop artwork images here
                            </p>

                            <p className="mt-2 text-xs text-muted">or</p>

                            <label className="mt-4 inline-flex h-11 cursor-pointer items-center bg-ink px-5 font-sans text-[12px] tracking-widest text-white uppercase transition-colors hover:bg-charcoal">
                                Choose Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {selectedImages.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                                {selectedImages.map((image, index) => (
                                    <div
                                        key={`${image.file.name}-${index}`}
                                        className="relative bg-stone p-2"
                                    >
                                        <img
                                            src={image.preview}
                                            alt={image.file.name}
                                            className="aspect-square w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSelectedImage(index)
                                            }
                                            className="absolute top-3 right-3 bg-ink px-3 py-2 font-sans text-[11px] tracking-widest text-white uppercase transition-colors hover:bg-charcoal"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-b border-stone py-8">
                        <label className="font-sans text-[13px] tracking-widest uppercase">
                            Description
                        </label>

                        <textarea
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            rows={6}
                            className="mt-3 w-full border border-stone bg-white px-4 py-3 text-sm leading-7 transition-colors outline-none focus:border-terracotta"
                        />
                    </div>

                    <div className="grid gap-8 border-b border-stone py-8 md:grid-cols-2">
                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Artwork Date
                            </label>

                            <input
                                type="date"
                                value={form.data.artwork_date}
                                onChange={(e) =>
                                    form.setData('artwork_date', e.target.value)
                                }
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
                            />
                        </div>

                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Duration
                            </label>

                            <input
                                type="text"
                                value={form.data.duration}
                                onChange={(e) =>
                                    form.setData('duration', e.target.value)
                                }
                                placeholder="e.g. 5 days"
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-terracotta"
                            />
                        </div>

                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Started At
                            </label>

                            <input
                                type="date"
                                value={form.data.started_at}
                                onChange={(e) =>
                                    form.setData('started_at', e.target.value)
                                }
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
                            />
                        </div>

                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Completed At
                            </label>

                            <input
                                type="date"
                                value={form.data.completed_at}
                                onChange={(e) =>
                                    form.setData('completed_at', e.target.value)
                                }
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
                            />
                        </div>
                    </div>

                    <div className="grid gap-8 py-8 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.data.price}
                                onChange={(e) =>
                                    form.setData('price', e.target.value)
                                }
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-6">
                    <button
                        type="submit"
                        disabled={form.processing || uploadingImages}
                        className="inline-flex h-12 items-center bg-terracotta px-7 font-sans text-[13px] tracking-widest text-white uppercase transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {form.processing
                            ? 'Creating...'
                            : uploadingImages
                              ? 'Uploading Images...'
                              : 'Create Artwork'}
                    </button>

                    <a
                        href="/admin/artworks"
                        className="border-b border-ink pb-1 font-sans text-[13px] tracking-widest uppercase transition-colors hover:border-b-terracotta hover:text-terracotta"
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </main>
    );
}
