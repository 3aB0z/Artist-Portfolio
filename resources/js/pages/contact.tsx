import { Head, Link } from '@inertiajs/react';

export default function Contact() {
    return (
        <>
            <Head title="Contact" />

            <main className="mx-auto max-w-300 px-6 pt-36 pb-24 md:pt-40 md:pb-30">
                <div>
                    <p className="font-sans text-[13px] tracking-[0.12em] text-terracotta uppercase">
                        Get in Touch
                    </p>

                    <div className="mt-8 grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
                        <div className="overflow-hidden bg-stone">
                            <img
                                src="/images/contact.jpg"
                                alt="The artist"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div>
                            <h1 className="font-display text-5xl leading-none font-light md:text-[64px]">
                                Let&apos;s talk about art.
                            </h1>

                            <p className="mt-8 max-w-2xl text-base leading-[1.8] text-charcoal">
                                For questions about the artwork, commissions, or
                                collaborations, feel free to get in touch.
                            </p>

                            <div className="mt-12">
                                <p className="font-sans text-[13px] tracking-widest text-muted uppercase">
                                    Email
                                </p>

                                <a
                                    href="mailto:hello@artistportfolio.example"
                                    className="mt-2 inline-block font-display text-2xl transition-colors hover:text-terracotta"
                                >
                                    hello@artistportfolio.example
                                </a>
                            </div>

                            <div className="mt-10">
                                <p className="font-sans text-[13px] tracking-widest text-muted uppercase">
                                    Social
                                </p>

                                <a
                                    href="https://example.com/artist-portfolio"
                                    className="mt-2 inline-block border-b border-ink pb-1 font-sans text-[13px] tracking-widest uppercase transition-colors hover:border-terracotta hover:text-terracotta"
                                    title="Temporary link"
                                >
                                    Instagram (temporary)
                                </a>
                            </div>

                            <Link
                                href="/gallery"
                                className="mt-12 inline-block border-b border-ink pb-1 font-sans text-[13px] tracking-widest uppercase transition-colors hover:border-terracotta hover:text-terracotta"
                            >
                                View the Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
