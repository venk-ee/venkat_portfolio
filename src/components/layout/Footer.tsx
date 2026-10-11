import { portfolio } from "../../data/portfolio";

export default function Footer() {
  return (
    <footer id="contact" className="tl-fade relative z-10 -mt-10 rounded-t-[2.5rem]">
      <div className="mx-auto flex min-h-[45vh] max-w-6xl flex-col items-center justify-end px-8 pb-10 pt-32 text-center">
        {/* Name */}
        <p className="font-sans text-2xl font-black text-ink">{portfolio.name}</p>

        {/* Nav + socials */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-sm">
          {portfolio.nav.map((link) => (
            <a key={link.label} href={link.href} className="text-ink/70 hover:text-ink">
              {link.label}
            </a>
          ))}
          <span className="text-ink/30">•</span>
          {portfolio.socials.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-ink/70 hover:text-ink">
              {link.label}
            </a>
          ))}
        </div>

        <p className="mt-6 font-mono text-sm text-ink/60">{portfolio.copyright}</p>
      </div>
    </footer>
  );
}
