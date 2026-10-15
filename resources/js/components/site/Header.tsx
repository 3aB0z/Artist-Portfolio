import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const { url } = usePage();

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 h-20 border-b border-stone/70 backdrop-blur-md ${
                menuOpen ? 'bg-ivory' : 'bg-ivory/95'
            }`}
        >
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
                <Link
                    href="/"
                    className="font-display text-[22px] tracking-[0.15em] uppercase"
                    onClick={closeMenu}
                >
                    Artist Portfolio
                </Link>

                <nav className="hidden items-center gap-10 md:flex">
                    <Link
                        href="/"
                        className={`group relative font-sans text-[13px] tracking-[0.12em] uppercase ${
                            url === '/' ? 'text-terracotta' : ''
                        }`}
                    >
                        Home
                        <span
                            className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-terracotta transition-transform duration-300 ${
                                url === '/'
                                    ? 'scale-x-100'
                                    : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                        />
                    </Link>

                    <Link
                        href="/gallery"
                        className={`group relative font-sans text-[13px] tracking-[0.12em] uppercase ${
                            url === '/gallery' ? 'text-terracotta' : ''
                        }`}
                    >
                        Gallery
                        <span
                            className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-terracotta transition-transform duration-300 ${
                                url === '/gallery'
                                    ? 'scale-x-100'
                                    : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                        />
                    </Link>

                    <Link
                        href="/about"
                        className={`group relative font-sans text-[13px] tracking-[0.12em] uppercase ${
                            url === '/about' ? 'text-terracotta' : ''
                        }`}
                    >
                        About
                        <span
                            className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-terracotta transition-transform duration-300 ${
                                url === '/about'
                                    ? 'scale-x-100'
                                    : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                        />
                    </Link>

                    <Link
                        href="/contact"
                        className={`group relative font-sans text-[13px] tracking-[0.12em] uppercase ${
                            url === '/contact' ? 'text-terracotta' : ''
                        }`}
                    >
                        Contact
                        <span
                            className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-terracotta transition-transform duration-300 ${
                                url === '/contact'
                                    ? 'scale-x-100'
                                    : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                        />
                    </Link>
                </nav>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="relative z-50 flex h-12 w-12 items-center justify-center md:hidden"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <nav
                className={`fixed inset-0 top-20 bottom-0 z-40 h-screen w-full bg-ivory px-8 pt-10 transition-transform duration-300 ease-out md:hidden ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col gap-8 font-display text-4xl">
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className={url === '/' ? 'text-terracotta' : ''}
                    >
                        Home
                    </Link>

                    <Link
                        href="/gallery"
                        onClick={closeMenu}
                        className={url === '/gallery' ? 'text-terracotta' : ''}
                    >
                        Gallery
                    </Link>

                    <Link
                        href="/about"
                        onClick={closeMenu}
                        className={url === '/about' ? 'text-terracotta' : ''}
                    >
                        About
                    </Link>

                    <Link
                        href="/contact"
                        onClick={closeMenu}
                        className={url === '/contact' ? 'text-terracotta' : ''}
                    >
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
}
