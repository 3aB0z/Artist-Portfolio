import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import type { Category } from '@/types/category';

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    return (
        <main className="mx-auto w-full max-w-300 px-6 py-12 md:px-8 md:py-16">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <p className="mb-4 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                        Portfolio
                    </p>
                    <h1 className="font-display text-4xl leading-none font-light md:text-5xl">
                        Categories
                    </h1>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Organize the artwork collection.
                    </p>
                </div>
                <Link
                    href="/admin/categories/create"
                    className="inline-flex h-12 w-fit items-center gap-2 bg-terracotta px-6 font-sans text-[13px] tracking-widest text-white uppercase transition-colors hover:bg-terracotta-hover"
                >
                    <Plus className="h-4 w-4" /> Create Category
                </Link>
            </div>
            <div className="mt-12 divide-y divide-stone border-y border-stone">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between gap-6 py-5"
                    >
                        <div>
                            <h2 className="font-display text-2xl">
                                {category.name}
                            </h2>
                            <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">
                                {category.slug}
                            </p>
                        </div>
                        <div className="flex items-center gap-5">
                            <Link
                                href={`/admin/categories/${category.slug}/edit`}
                                className="inline-flex items-center gap-2 border-b border-ink pb-1 font-sans text-[12px] tracking-widest uppercase transition-colors hover:text-terracotta hover:border-terracotta"
                            >
                                <Edit className="h-4 w-4" /> Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            `Delete "${category.name}"?`,
                                        )
                                    ) {
                                        router.delete(
                                            `/admin/categories/${category.slug}`,
                                        );
                                    }
                                }}
                                className="cursor-pointer text-terracotta transition-colors hover:text-terracotta-hover"
                                title="Delete category"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
