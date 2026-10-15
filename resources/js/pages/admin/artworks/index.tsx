import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Artwork } from '@/types/artwork';
import type { Category } from '@/types/category';
import type { Paginated } from '@/types/pagination';

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const [artworks, setArtworks] = useState<Paginated<Artwork> | null>(null);
    const [search, setSearch] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [page, setPage] = useState(1);
    const [reloadKey, setReloadKey] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function loadArtworks() {
            const params = new URLSearchParams({
                page: String(page),
                per_page: '20',
            });

            if (submittedSearch.trim()) {
                params.set('search', submittedSearch.trim());
            }

            if (categoryId) {
                params.set('category_id', categoryId);
            }

            try {
                const response = await fetch(
                    `/api/admin/artworks?${params.toString()}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error('Failed to load artworks.');
                }

                const data: Paginated<Artwork> = await response.json();

                if (!controller.signal.aborted) {
                    setArtworks(data);
                }
            } catch {
                // Keep the current results visible on error or abort.
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadArtworks();

        return () => controller.abort();
    }, [page, submittedSearch, categoryId, reloadKey]);

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setPage(1);
        setSubmittedSearch(search);
    }

    function handleCategoryChange(value: string) {
        setLoading(true);
        setPage(1);
        setCategoryId(value);
    }

    return (
        <main className="mx-auto w-full max-w-300 px-6 py-12 md:px-8 md:py-16">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <p className="mb-4 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                        Portfolio
                    </p>

                    <h1 className="font-display text-4xl leading-none font-light md:text-5xl">
                        Artworks
                    </h1>

                    {artworks && (
                        <p className="mt-4 text-sm text-muted-foreground">
                            {artworks.total} artwork
                            {artworks.total === 1 ? '' : 's'}
                        </p>
                    )}
                </div>

                <Link
                    href="/admin/artworks/create"
                    className="inline-flex h-12 w-fit items-center gap-2 bg-terracotta px-6 font-sans text-[13px] tracking-widest text-white uppercase transition-colors duration-300 hover:bg-terracotta-hover"
                >
                    <Plus className="h-4 w-4" />
                    Create Artwork
                </Link>
            </div>

            <form
                onSubmit={handleSearch}
                className="mt-12 grid gap-3 border-y border-stone bg-[#f5f1ec] p-5 md:grid-cols-[1fr_auto_auto]"
            >
                <div className="relative">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search artworks..."
                        className="h-11 w-full border border-stone bg-white py-2 pr-4 pl-11 text-sm transition-colors outline-none focus:border-terracotta"
                    />
                </div>

                <select
                    value={categoryId}
                    onChange={(event) =>
                        handleCategoryChange(event.target.value)
                    }
                    className="h-11 border border-stone bg-white px-4 text-sm transition-colors outline-none focus:border-terracotta"
                >
                    <option value="">All categories</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="h-11 bg-ink px-6 font-sans text-[13px] tracking-widest text-white uppercase transition-colors duration-300 hover:bg-charcoal"
                >
                    Search
                </button>
            </form>

            <div className="mt-10">
                {loading ? (
                    <div className="border-y border-stone py-8 text-sm text-muted">
                        Loading artworks...
                    </div>
                ) : artworks?.data.length ? (
                    <div className="divide-y divide-stone border-y border-stone">
                        {artworks.data.map((artwork) => (
                            <div
                                key={artwork.id}
                                className="flex items-center justify-between gap-6 py-5"
                            >
                                <div className="flex min-w-0 items-center gap-5">
                                    <Link
                                        href={`/artwork/${artwork.slug}`}
                                        className="group shrink-0"
                                    >
                                        <div className="h-20 w-20 overflow-hidden bg-stone">
                                            {artwork.image ? (
                                                <img
                                                    src={artwork.image}
                                                    alt={artwork.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] tracking-widest text-muted uppercase">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="min-w-0">
                                        <Link
                                            href={`/artwork/${artwork.slug}`}
                                            className="group"
                                        >
                                            <h2 className="font-display text-2xl font-normal">
                                                {artwork.title}
                                            </h2>
                                        </Link>

                                        <p className="mt-1 font-sans text-xs tracking-widest text-muted-foreground uppercase">
                                            {artwork.category.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-4">
                                    <Link
                                        href={`/admin/artworks/${artwork.slug}/edit`}
                                        className="inline-flex items-center gap-2 border-b border-ink pb-1 font-sans text-[12px] tracking-widest uppercase transition-colors hover:border-terracotta hover:text-terracotta"
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            Edit
                                        </span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    `Delete "${artwork.title}"?`,
                                                )
                                            ) {
                                                setLoading(true);

                                                router.delete(
                                                    `/admin/artworks/${artwork.slug}`,
                                                    {
                                                        onFinish: () =>
                                                            setReloadKey(
                                                                (key) =>
                                                                    key + 1,
                                                            ),
                                                    },
                                                );
                                            }
                                        }}
                                        className="cursor-pointer p-1 text-terracotta transition-colors hover:text-terracotta-hover"
                                        title="Delete artwork"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-y border-stone py-12 text-center">
                        <p className="font-display text-2xl font-light">
                            No artworks found.
                        </p>

                        <p className="mt-2 text-sm text-muted">
                            Try changing your search or category filter.
                        </p>
                    </div>
                )}
            </div>

            {artworks && artworks.last_page > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-stone pt-6">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => {
                            setLoading(true);
                            setPage((current) => current - 1);
                        }}
                        className="border-b border-ink pb-1 font-sans text-[12px] tracking-widest uppercase transition-colors hover:text-terracotta disabled:cursor-not-allowed disabled:border-muted disabled:text-muted"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-muted">
                        Page {artworks.current_page} of {artworks.last_page}
                    </span>

                    <button
                        type="button"
                        disabled={page === artworks.last_page}
                        onClick={() => {
                            setLoading(true);
                            setPage((current) => current + 1);
                        }}
                        className="border-b border-ink pb-1 font-sans text-[12px] tracking-widest uppercase transition-colors hover:text-terracotta disabled:cursor-not-allowed disabled:border-muted disabled:text-muted"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}
