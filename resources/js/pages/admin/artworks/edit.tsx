import { useForm } from '@inertiajs/react';
import ArtworkMediaManager from '@/components/admin/ArtworkMediaManager';
import type { AdminArtwork } from '@/types/artwork';
import type { Category } from '@/types/category';

interface Props {
    artwork: AdminArtwork;
    categories: Category[];
}

export default function Edit({ artwork, categories }: Props) {
    const form = useForm({
        _method: 'put' as const,
        slug: artwork.slug,
        title: artwork.title,
        category_id: artwork.category_id,
        description: artwork.description,
        artwork_date: artwork.artwork_date,
        started_at: artwork.started_at ?? '',
        completed_at: artwork.completed_at ?? '',
        duration: artwork.duration ?? '',
        price: artwork.price?.toString() ?? '',
    });

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(`/admin/artworks/${artwork.slug}`, {
            forceFormData: true,
        });
    }

    return (
        <main className="mx-auto w-full max-w-300 px-6 py-12 md:px-8 md:py-16">
            <div>
                <p className="mb-4 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                    Portfolio
                </p>

                <h1 className="font-display text-4xl leading-none font-light md:text-5xl">
                    Edit Artwork
                </h1>

                <p className="mt-4 text-sm text-muted-foreground">
                    Update the artwork details and manage its images.
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
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
                            />
                        </div>

                        <div>
                            <label className="font-sans text-[13px] tracking-widest uppercase">
                                Slug
                            </label>

                            <input
                                type="text"
                                value={artwork.slug}
                                readOnly
                                className="mt-3 h-12 w-full border border-stone bg-[#f5f1ec] px-4 text-sm text-muted-foreground outline-none"
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
                            className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
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
                            Description
                        </label>

                        <textarea
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            rows={6}
                            className="mt-3 w-full border border-stone bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-terracotta"
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
                                className="mt-3 h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
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
                                className="mt-3 h-12 w-full border border-stone bg-white text-sm outline-none focus:border-terracotta"
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
                                className="mt-3 h-12 w-full border border-stone bg-white text-sm outline-none focus:border-terracotta"
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
                        disabled={form.processing}
                        className="inline-flex h-12 items-center bg-terracotta px-7 font-sans text-[13px] tracking-widest text-white uppercase transition-colors hover:bg-terracotta-hover disabled:opacity-50"
                    >
                        {form.processing ? 'Saving...' : 'Save Changes'}
                    </button>

                    <a
                        href="/admin/artworks"
                        className="border-b border-ink pb-1 font-sans text-[13px] tracking-widest uppercase transition-colors hover:border-b-terracotta hover:text-terracotta"
                    >
                        Back to Artworks
                    </a>
                </div>
            </form>

            <div className="mt-20 border-t border-stone pt-12">
                <ArtworkMediaManager
                    artworkSlug={artwork.slug}
                    media={artwork.media}
                />
            </div>
        </main>
    );
}
