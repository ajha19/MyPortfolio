import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Oneko } from "@/components/Oneko";
import { useReveal } from "@/hooks/useReveal";
import { getSiteContent } from "@/data/content";
import { TechPill } from "@/components/TechPill";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Aman Jha" },
      {
        name: "description",
        content:
          "Resume and CV of Aman Jha — Full Stack Developer with 4+ years across React, Next.js, Node.js and Python.",
      },
      { property: "og:title", content: "Resume — Aman Jha" },
      { property: "og:description", content: "Resume and CV of Aman Jha — Full Stack Developer." },
    ],
  }),
  loader: () => getSiteContent(),
  component: ResumePage,
});

function ResumePage() {
  useReveal();
  const content = Route.useLoaderData();
  const resumePdfUrl = `https://drive.google.com/file/d/${content.resumeDriveFileId}/view`;
  const resumePdfPreviewUrl = `https://drive.google.com/file/d/${content.resumeDriveFileId}/preview`;
  const resumePdfDownloadUrl = `https://drive.google.com/uc?export=download&id=${content.resumeDriveFileId}`;
  return (
    <>
      <Oneko />
      <nav
        className="sticky top-0 z-50 border-b border-border backdrop-blur-md"
        style={{ backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)" }}
      >
        <div className="mx-auto flex max-w-180 items-center justify-between px-5.5 py-3.25">
          <Link to="/" className="text-[0.95rem] font-semibold tracking-tight text-fg-strong">
            {content.heroName}
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.75 py-1.5 text-sm text-muted transition hover:bg-pill hover:text-fg-strong"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-180 px-5.5 pb-16 pt-14">
        {/* Header */}
        <header className="reveal mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
              Resume / CV
            </p>
            <h1 className="text-[clamp(1.9rem,5vw,2.4rem)] font-bold tracking-[-0.035em] text-fg-strong">
              {content.heroName}
            </h1>
            <p className="mt-1 text-fg">{content.heroTagline}</p>
            <p className="mt-2 max-w-130 text-[0.92rem] text-muted">{content.heroBio}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={resumePdfDownloadUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-[10px] bg-fg-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-bg transition hover:-translate-y-px hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </header>

        {/* Embedded PDF preview */}
        <div className="reveal mb-8 overflow-hidden rounded-[14px] border border-border bg-card">
          <iframe
            src={resumePdfPreviewUrl}
            title={`${content.heroName} — Resume PDF`}
            className="h-205 w-full"
            allow="autoplay"
          />
        </div>

        {/* Contact row */}
        <div className="reveal mb-8 flex flex-wrap gap-2">
          <IconLink href={content.githubUrl} label="GitHub">
            <Github className="h-4 w-4" /> GitHub
          </IconLink>
          <IconLink href={content.linkedinUrl} label="LinkedIn">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </IconLink>
          <IconLink href={content.email} label="Email">
            <Mail className="h-4 w-4" /> Email
          </IconLink>
        </div>

        {/* Experience */}
        <ResumeSection title="Experience">
          <div className="flex flex-col gap-3">
            {content.experience.map((x, i) => (
              <div key={i} className="rounded-[14px] border border-border bg-card p-5">
                <div className="flex gap-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[11px] border border-border bg-pill">
                    {x.logoUrl ? (
                      <img
                        src={x.logoUrl}
                        alt={`${x.company} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] text-muted font-bold">
                        EXP
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[1.02rem] font-semibold tracking-[-0.02em] text-fg-strong">
                        {x.company}
                      </span>
                      {x.current && <WorkingBadge />}
                    </div>
                    <div className="mt-px text-[0.92rem] text-fg">{x.role}</div>
                    <div className="mt-0.5 flex flex-wrap gap-2.5 font-mono text-[0.73rem] text-faint">
                      <span>{x.period}</span>
                      <span>{x.place}</span>
                    </div>
                  </div>
                </div>
                <TechLabel>Technologies</TechLabel>
                <Pills items={x.tech} />
                <ul className="mt-3.5 flex flex-col gap-1.75">
                  {x.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="relative pl-4 text-[0.9rem] text-muted before:absolute before:left-0.5 before:text-faint before:content-['•'] [&_b]:font-semibold [&_b]:text-fg"
                      dangerouslySetInnerHTML={{ __html: b }}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Education */}
        <ResumeSection title="Education">
          <div className="flex flex-col gap-3">
            {content.education.map((e, i) => (
              <div key={i} className="rounded-[14px] border border-border bg-card p-5">
                <div className="flex gap-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[11px] border border-border bg-pill">
                    {e.logoUrl ? (
                      <img
                        src={e.logoUrl}
                        alt={`${e.place} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] text-muted font-bold">
                        EDU
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <div className="text-[1rem] font-semibold text-fg-strong">{e.title}</div>
                        <div className="text-[0.9rem] text-muted">{e.place}</div>
                      </div>
                      <div className="font-mono text-[0.73rem] text-faint">{e.period}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Skills */}
        <ResumeSection title="Skills">
          <div className="rounded-[14px] border border-border bg-card p-5">
            <div className="flex flex-col gap-4">
              {content.skills.map((s) => (
                <div
                  key={s.category}
                  className="grid grid-cols-1 items-start gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-3.5"
                >
                  <div className="pt-1 font-mono text-[0.73rem] uppercase tracking-[0.08em] text-faint">
                    {s.category}
                  </div>
                  <Pills items={s.items} />
                </div>
              ))}
            </div>
          </div>
        </ResumeSection>

        {/* CTA */}
        <section className="reveal mt-4 rounded-[14px] border border-border bg-card p-6 text-center">
          <h2 className="mb-2 text-[1.2rem] font-semibold text-fg-strong">Want to talk?</h2>
          <p className="mx-auto mb-4 max-w-100 text-[0.9rem] text-muted">
            15 minutes. Zero pressure. Grab a slot that works for you.
          </p>
          <a
            href={content.calendlyUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-[10px] bg-fg-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-bg transition hover:-translate-y-px hover:opacity-90"
          >
            <CalendarDays className="h-4 w-4" />
            Book a free call
          </a>
        </section>
      </main>

      <footer className="border-t border-border py-6.5 pb-12 text-center font-mono text-[0.82rem] text-faint">
        Designed &amp; built by {content.heroName} · © {new Date().getFullYear()}
      </footer>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="reveal mb-8">
      <h2 className="mb-3 text-[1.1rem] font-semibold tracking-[-0.02em] text-fg-strong">
        {title}
      </h2>
      {children}
    </section>
  );
}

function WorkingBadge() {
  return (
    <span className="inline-flex items-center rounded-md bg-ok-faint px-1.5 py-0.5 text-[0.62rem] font-semibold text-ok uppercase tracking-wider">
      Present
    </span>
  );
}

function TechLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 mb-2.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-faint">
      {children}
    </div>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.75">
      {items.map((t) => (
        <TechPill key={t} name={t} />
      ))}
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-[10px] border border-border px-3 py-1.5 text-[0.82rem] text-muted transition hover:border-border-strong hover:text-fg-strong"
    >
      {children}
    </a>
  );
}
