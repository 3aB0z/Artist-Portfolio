import { Link, useForm } from '@inertiajs/react';
import type { Category } from '@/types/category';

interface Props {
    category: Category;
}

export default function Edit({ category }: Props) {
    const form = useForm({
        name: category.name,
    });

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        form.put(`/admin/categories/${category.slug}`);
    }

    return (
        <main className="mx-auto w-full max-w-300 px-6 py-12 md:px-8 md:py-16">
            <p className="mb-4 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                Portfolio
            </p>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="font-display text-4xl leading-none font-light md:text-5xl">
                        Edit Category
                    </h1>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Update the category name.
                    </p>
                </div>
                <Link
                    href="/admin/categories"
                    className="w-fit border-b border-ink pb-1 font-sans text-[13px] tracking-widest uppercase hover:border-b-terracotta hover:text-terracotta"
                >
                    Back to Categories
                </Link>
            </div>
            <form
                onSubmit={handleSubmit}
                className="mt-12 max-w-xl border-y border-stone"
            >
                <div className="flex flex-col gap-8 py-8">
                    <div>
                        <label
                            htmlFor="name"
                            className="font-sans text-[13px] tracking-widest uppercase"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            className="mt-3 block h-12 w-full border border-stone bg-white px-4 text-sm outline-none focus:border-terracotta"
                        />
                        {form.errors.name && (
                            <p className="mt-2 text-sm text-terracotta">
                                {form.errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="font-sans text-[13px] tracking-widest uppercase">
                            Slug
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={category.slug}
                            className="mt-3 block h-12 w-full border border-stone bg-[#f5f1ec] px-4 text-sm text-muted-foreground outline-none"
                        />
                    </div>
                </div>
                <div className="border-t border-stone py-6">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-11 items-center bg-terracotta px-6 font-sans text-[13px] tracking-widest text-white uppercase transition-colors hover:border-b-terracotta hover:bg-terracotta-hover disabled:opacity-50"
                    >
                        {form.processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </main>
    );
}
