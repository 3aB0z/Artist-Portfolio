export default function Footer() {
    return (
        <footer className="bg-ink px-6 pb-10 text-ivory">
            <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 border-t border-white/10 pt-8 text-xs md:flex-row">
                <p className="text-muted">
                    © 2026 Artist Portfolio. All rights reserved.
                </p>

                <p className="tracking-[0.1em] text-muted uppercase">
                    Drawings · Clay · Handmade
                </p>
            </div>
        </footer>
    );
}
