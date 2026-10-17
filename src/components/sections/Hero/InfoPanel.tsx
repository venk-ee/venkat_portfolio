
import { portfolio } from "../../../data/portfolio";

export default function InfoPanel(){
const email = portfolio.socials.find((s) => s.label === "Email");
const otherSocials = portfolio.socials.filter((s) => s.label !== "Email");

return(
    <div id="about" className="flex flex-col justify-center h-full max-w-lg space-y-6 text-left">
        <div className="w-12 h-1 bg-accent rounded"></div>
        <div>
            <h1 className="text-4xl font-black tracking-tight text-cream md:text-6xl font-sans">{portfolio.name}</h1>
            <p className="text-lg text-cream/70 mt-2">{portfolio.role}</p>
        </div>
        <p className="text-cream/60 leading-relaxed text-base font-sans">
            {portfolio.bio}
        </p>

        <div className="flex flex-wrap gap-3 pt-4 font-mono text-sm">
            {otherSocials.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-ink transition-colors duration-300"
                >
                    {link.label}
                </a>
            ))}

            {email && (
                <a
                    href={email.href}
                    className="px-5 py-2 rounded-full bg-accent text-ink hover:bg-accent-hover transition-colors duration-300"
                >
                    {email.label}
                </a>
            )}
        </div>
    </div>
)
}
