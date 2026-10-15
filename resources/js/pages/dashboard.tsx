import { Link } from '@inertiajs/react';
import { FolderPlus, Palette, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Artwork } from '@/types/artwork';

interface DashboardData {
    stats: {
        artworks: number;
        categories: number;
    };
    recentArtworks: Artwork[];
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load dashboard data.');
                }

                return response.json();
            })
            .then((dashboardData: DashboardData) => {
                setData(dashboardData);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="mx-auto w-full max-w-300 px-6 py-12 md:py-16">
            {/* Header */}
            <div>
                <p className="font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                    Studio
                </p>
                <h1 className="mt-3 font-display text-4xl font-light text-ink md:text-5xl">
                    Dashboard
                </h1>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                    Overview of your artwork portfolio and studio content.
                </p>
            </div>
            {/* Stats */}
            <section className="mt-12 grid gap-px border border-stone bg-stone md:grid-cols-2">
                <div className="bg-white p-7 md:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-sans text-[13px] tracking-widest text-terracotta uppercase">
                                Artworks
                            </p>
                            <p className="mt-4 font-display text-5xl font-light text-ink">
                                {loading ? '—' : (data?.stats.artworks ?? 0)}
                            </p>
                        </div>
                        <Palette className="h-5 w-5 text-terracotta" />
                    </div>
                    <Link
                        href="/admin/artworks"
                        className="mt-6 inline-block border-b border-ink pb-1 font-sans text-[13px] tracking-widest text-ink uppercase transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                        Manage artworks
                    </Link>
                </div>
                <div className="bg-white p-7 md:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-sans text-[13px] tracking-widest text-terracotta uppercase">
                                Categories
                            </p>
                            <p className="mt-4 font-display text-5xl font-light text-ink">
                                {loading ? '—' : (data?.stats.categories ?? 0)}
                            </p>
                        </div>
                        <FolderPlus className="h-5 w-5 text-terracotta" />
                    </div>
                    <Link
                        href="/admin/categories"
                        className="mt-6 inline-block border-b border-ink pb-1 font-sans text-[13px] tracking-widest text-ink uppercase transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                        Manage categories
                    </Link>
                </div>
            </section>
            {/* Recent artworks */}
            <section className="mt-16">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                            Collection
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-light text-ink md:text-4xl">
                            Recent artworks
                        </h2>
                    </div>
                    <Link
                        href="/admin/artworks"
                        className="hidden border-b border-ink pb-1 font-sans text-[13px] tracking-widest text-ink uppercase transition-colors hover:border-terracotta hover:text-terracotta sm:inline-block"
                    >
                        View all
                    </Link>
                </div>
                <div className="mt-8 border-y border-stone">
                    {loading ? (
                        <div className="py-8 text-sm text-muted-foreground">
                            Loading artworks...
                        </div>
                    ) : data?.recentArtworks.length ? (
                        data.recentArtworks.map((artwork) => (
                            <div
                                key={artwork.id}
                                className="flex items-center gap-5 border-b border-stone py-5 last:border-b-0"
                            >
                                <Link
                                    href={`/artwork/${artwork.slug}`}
                                    className="block h-20 w-20 shrink-0 overflow-hidden bg-stone"
                                >
                                    <img
                                        src={artwork.image}
                                        alt={artwork.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                                    />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/artwork/${artwork.slug}`}
                                        className="font-display text-2xl text-ink transition-colors hover:text-terracotta"
                                    >
                                        {artwork.title}
                                    </Link>
                                    <p className="mt-1 font-sans text-xs tracking-widest text-muted-foreground uppercase">
                                        {artwork.category.name}
                                    </p>
                                </div>
                                <Link
                                    href={`/admin/artworks/${artwork.slug}/edit`}
                                    className="hidden border-b border-ink pb-1 font-sans text-[12px] tracking-widest text-ink uppercase transition-colors hover:border-terracotta hover:text-terracotta sm:block"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-sm text-muted">
                            No artworks found.
                        </div>
                    )}
                </div>
                <Link
                    href="/admin/artworks"
                    className="mt-6 inline-block border-b border-ink pb-1 font-sans text-[13px] tracking-widest text-ink uppercase transition-colors hover:border-terracotta hover:text-terracotta sm:hidden"
                >
                    View all artworks
                </Link>
            </section>
            {/* Quick actions */}
            <section className="mt-16 border-y border-stone bg-[#f5f1ec] px-6 py-10 md:px-8">
                <div>
                    <p className="font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                        Quick actions
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-light text-ink">
                        Manage your studio
                    </h2>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/admin/artworks/create"
                        className="inline-flex h-12 items-center justify-center gap-2 bg-terracotta px-6 font-sans text-[13px] tracking-widest text-white uppercase transition-colors hover:bg-terracotta-hover"
                    >
                        <Plus className="h-4 w-4" /> Create artwork
                    </Link>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex h-12 items-center justify-center gap-2 border border-ink px-6 font-sans text-[13px] tracking-widest text-ink uppercase transition-colors hover:bg-ink hover:text-white"
                    >
                        <FolderPlus className="h-4 w-4" /> Create category
                    </Link>
                </div>
            </section>
        </div>
    );
}
