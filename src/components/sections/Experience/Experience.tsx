import { experience, type ExperienceCompany, type ExperienceRole } from "../../../data/experience";

const COMPANY_KEYS = new Set(["company", "link", "logo", "location", "roles"]);
const ROLE_KEYS = new Set([
  "title",
  "period",
  "employmentType",
  "location",
  "summary",
  "bullets",
  "highlights",
  "tech",
]);

function extraEntries(source: Record<string, unknown>, known: Set<string>) {
  return Object.entries(source).filter(([key]) => !known.has(key));
}

function ExtraFields({ entries }: { entries: [string, unknown][] }) {
  if (entries.length === 0) return null;
  return (
    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-cream/50">
      {entries.map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <dt className="text-cream/40">{key}:</dt>
          <dd className="text-cream/60">
            {Array.isArray(value) ? value.join(", ") : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 bg-bg px-8 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            Experience
          </p>
          <h2 className="mt-3 font-sans text-4xl font-black tracking-tight text-cream md:text-6xl">
            Where I have been shipping.
          </h2>
        </div>

        <div className="space-y-12">
          {experience.map((company: ExperienceCompany) => (
            <article
              key={company.company}
              className="rounded-2xl border border-cream/10 bg-surface/40 p-6 md:p-8"
            >
              <header className="flex flex-col gap-1 border-b border-cream/10 pb-4 md:flex-row md:items-baseline md:justify-between">
                <div className="flex items-center gap-3">
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt={company.company}
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <h3 className="font-sans text-2xl font-bold text-cream md:text-3xl">
                    {company.link ? (
                      <a
                        href={company.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent"
                      >
                        {company.company}
                      </a>
                    ) : (
                      company.company
                    )}
                  </h3>
                </div>
                <div className="flex flex-col text-left md:text-right">
                  {company.location && (
                    <span className="font-mono text-xs text-cream/50">
                      {company.location}
                    </span>
                  )}
                </div>
              </header>

              <ExtraFields entries={extraEntries(company, COMPANY_KEYS)} />

              <div className="mt-6 space-y-8">
                {company.roles.map((role: ExperienceRole, roleIndex: number) => (
                  <div
                    key={`${role.title}-${role.period}`}
                    className="relative border-l border-cream/10 pl-6"
                  >
                    <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />

                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                      <div>
                        <h4 className="font-sans text-lg font-bold text-cream md:text-xl">
                          {role.title}
                        </h4>
                        {role.employmentType && (
                          <span className="font-mono text-xs text-cream/50">
                            {role.employmentType}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col text-left md:text-right">
                        <span className="font-mono text-sm text-accent">
                          {role.period}
                        </span>
                        {role.location && (
                          <span className="font-mono text-xs text-cream/50">
                            {role.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {role.summary && (
                      <p className="mt-2 font-sans text-sm leading-relaxed text-cream/70 md:text-base">
                        {role.summary}
                      </p>
                    )}

                    {role.bullets && role.bullets.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {role.bullets.map((bullet: string, i: number) => (
                          <li
                            key={i}
                            className="flex gap-3 font-sans text-sm leading-relaxed text-cream/70 md:text-base"
                          >
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/60" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {role.highlights && role.highlights.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="font-mono text-xs uppercase tracking-widest text-cream/40">
                          Shipped
                        </p>
                        {role.highlights.map((h) => (
                          <div
                            key={h.title}
                            className="rounded-lg border border-accent/20 bg-accent/5 p-4"
                          >
                            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                              <h5 className="font-sans text-sm font-bold text-cream md:text-base">
                                {h.link ? (
                                  <a
                                    href={h.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent"
                                  >
                                    {h.title}
                                  </a>
                                ) : (
                                  h.title
                                )}
                              </h5>
                              {h.tags && h.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {h.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-full border border-accent/30 px-2 py-0.5 font-mono text-[10px] text-accent"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {h.description && (
                              <p className="mt-1 font-sans text-sm text-cream/60">
                                {h.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {role.tech && role.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {role.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-cream/15 px-2.5 py-0.5 font-mono text-[11px] text-cream/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <ExtraFields entries={extraEntries(role, ROLE_KEYS)} />

                    {roleIndex < company.roles.length - 1 && (
                      <div className="mt-6 h-px w-full bg-cream/5" />
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
