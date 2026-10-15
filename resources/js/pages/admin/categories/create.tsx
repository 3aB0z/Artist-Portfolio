import { Link, useForm } from '@inertiajs/react';

export default function Create() {
    const form = useForm({
        name: '',
    });

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/admin/categories');
    }

    return (
        <main className="mx-auto w-full max-w-300 px-6 py-12 md:px-8 md:py-16">
            <p className="mb-4 font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                Portfolio
            </p>
            <h1 className="font-display text-4xl leading-none font-light md:text-5xl">
                Create Category
            </h1>
            <form
                onSubmit={handleSubmit}
                className="mt-12 max-w-xl border-y border-stone"
            >
                <div className="py-8">
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
                <div className="flex items-center gap-6 border-t border-stone py-6">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-11 items-center bg-terracotta px-6 font-sans text-[13px] tracking-widest text-white uppercase transition-colors hover:bg-terracotta-hover disabled:opacity-50"
                    >
                        {form.processing ? 'Creating...' : 'Create Category'}
                    </button>
                    <Link
                        href="/admin/categories"
                        className="border-b border-ink pb-1 font-sans text-[13px] tracking-widest uppercase hover:text-terracotta hover:border-b-terracotta"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </main>
    );
}
