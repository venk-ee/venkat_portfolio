
import { portfolio } from "../../data/portfolio";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        {/* Logo — left side */}
        <a href="#top" className="font-sans text-lg font-black text-cream">
          {portfolio.name}
        </a>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 font-mono text-sm md:flex">
          {portfolio.nav.map((link) => (
            <a key={link.label} href={link.href} className="text-cream/70 hover:text-accent">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Contact button */}
        <a
          href={portfolio.socials.find((s) => s.label === "Email")?.href ?? "#contact"}
          className="rounded-full bg-accent px-5 py-2 font-mono text-sm text-ink hover:bg-accent-hover"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
