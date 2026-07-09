import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  FileText,
  ExternalLink,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Oneko } from "@/components/Oneko";
import { TechPill } from "@/components/TechPill";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatWidget } from "@/components/ChatWidget";
import { GitaQuote } from "@/components/GitaQuote";
import { useReveal } from "@/hooks/useReveal";
import amanPhoto from "@/assets/aman.jpeg";
import { getProjects } from "@/data/projects";
import { getSiteContent } from "@/data/content";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [projects, content] = await Promise.all([getProjects(), getSiteContent()]);
    return { projects, content };
  },
  component: Portfolio,
});

/* ------------------------------------------------------------- */
/*  PAGE                                                          */
/* ------------------------------------------------------------- */

function Portfolio() {
  useReveal();
  const { projects, content } = Route.useLoaderData();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Oneko />
      <ChatWidget />

      {/* NAV */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md transition-colors ${
          scrolled ? "border-b border-border" : "border-b border-transparent"
        }`}
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-160 items-center justify-between px-5.5 py-3.25">
          <a href="#top" className="text-[0.95rem] font-semibold tracking-tight text-fg-strong">
            {content.heroName}
          </a>
          <div className="flex items-center gap-0.5">
            {[
              ["Work", "#experience"],
              ["Projects", "#projects"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="hidden rounded-lg px-2.75 py-1.5 text-sm text-muted transition hover:bg-pill hover:text-fg-strong sm:inline-block"
              >
                {label}
              </a>
            ))}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main id="top" className="mx-auto max-w-160 px-5.5">
        {/* HERO */}
        <header className="pt-18 pb-7.5">
          <div className="reveal mb-5.5 h-19 w-19 overflow-hidden rounded-[20px] border border-border bg-card">
            <img src={amanPhoto} alt={content.heroName} className="h-full w-full object-cover" />
          </div>
          <h1 className="reveal mb-1.5 text-[clamp(2.1rem,6.5vw,2.9rem)] font-bold leading-[1.05] tracking-[-0.045em] text-fg-strong">
            {content.heroName}
          </h1>
          <p className="reveal mb-4.5 text-[1.15rem] font-medium tracking-[-0.02em] text-fg">
            {content.heroTagline}
          </p>
          <p className="reveal mb-6 max-w-140 text-base text-muted">{content.heroBio}</p>

          <div className="reveal mb-6 flex gap-2">
            <SocialLink href={content.githubUrl} label="GitHub">
              <Github className="h-4.25 w-4.25" />
            </SocialLink>
            <SocialLink href={content.linkedinUrl} label="LinkedIn">
              <Linkedin className="h-4.25 w-4.25" />
            </SocialLink>
            <SocialLink href={content.email} label="Email">
              <Mail className="h-4.25 w-4.25" />
            </SocialLink>
          </div>

          <div className="reveal flex flex-wrap gap-2.5">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-[10px] border border-border-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-fg transition hover:-translate-y-px hover:bg-pill"
            >
              <FileText className="h-4 w-4" />
              Resume / CV
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-[10px] bg-fg-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-bg transition hover:-translate-y-px hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Get in touch
            </a>
          </div>
        </header>

        {/* EXPERIENCE */}
        <Section id="experience" eyebrow="Featured" title="Experience">
          <div className="flex flex-col gap-3">
            {content.experience.map((x, i) => (
              <Card key={i}>
                <div className="flex gap-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[11px] border border-border bg-pill">
                    <img
                      src={x.logoUrl}
                      alt={`${x.company} logo`}
                      className="h-full w-full object-cover"
                    />
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
              </Card>
            ))}
          </div>
        </Section>

        {/* ABOUT */}
        <Section id="about" eyebrow="About" title="Me">
          <Card>
            <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="h-21 w-21 shrink-0 overflow-hidden rounded-[14px] border border-border">
                <img
                  src={amanPhoto}
                  alt={content.heroName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3.5 text-base text-muted [&_b]:font-semibold [&_b]:text-fg">
                {content.aboutParagraphs.map((paragraph, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </div>
          </Card>
        </Section>

        {/* SKILLS */}
        <Section id="skills" eyebrow="Toolbox" title="Skills">
          <Card>
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
          </Card>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" eyebrow="Featured" title="Projects">
          <div className="flex flex-col gap-4">
            {projects.slice(0, 2).map((p) => (
              <Card key={p.id}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener"
                  data-analytics-click={`click:project:${p.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")}`}
                  className="group -mx-5 -mt-5 mb-4 block overflow-hidden rounded-t-[14px] border-b border-border"
                >
                  <img
                    src={p.coverUrl}
                    alt={`${p.title} cover`}
                    loading="lazy"
                    width={1280}
                    height={720}
                    className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </a>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      data-analytics-click={`click:project:${p.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}`}
                      className="text-[1.05rem] font-semibold tracking-[-0.02em] text-fg-strong hover:underline"
                    >
                      {p.title}
                    </a>
                    <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted">
                      <span
                        className={`h-1.75 w-1.75 rounded-full ${p.live ? "bg-ok" : "bg-faint"}`}
                        style={p.live ? { animation: "pulse-dot 2.4s infinite" } : undefined}
                      />
                      {p.status}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      data-analytics-click={`click:project:${p.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}`}
                      aria-label="Open live site"
                      className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-border text-muted transition hover:border-border-strong hover:text-fg-strong"
                    >
                      <ExternalLink className="h-3.75 w-3.75" />
                    </a>
                  </div>
                </div>
                <p className="mt-3 text-[0.9rem] text-muted">{p.description}</p>
                <TechLabel>Technologies</TechLabel>
                <Pills items={p.tech} />
              </Card>
            ))}
          </div>
          <div className="reveal mt-4 flex justify-center">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-[10px] border border-border-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-fg transition hover:-translate-y-px hover:bg-pill"
            >
              Show all projects
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Section>

        {/* GITHUB */}
        <Section id="github" eyebrow="Activity" title="On GitHub">
          <Card>
            <p className="mb-4 text-[0.95rem] text-muted [&_b]:font-semibold [&_b]:text-fg-strong">
              In <b>2026</b>, I've been shipping consistently across client work, side projects and
              open-source explorations — tracking every commit, PR and code review on GitHub. Below
              is my live contribution activity for the past year.
            </p>
            <div className="overflow-x-auto rounded-[10px] border border-border bg-pill/40 p-3">
              <img
                src={`https://ghchart.rshah.org/26a641/${content.githubChartUsername}`}
                alt={`${content.heroName} GitHub contribution graph`}
                loading="lazy"
                className="w-full min-w-140"
              />
            </div>
            <p className="mt-3 font-mono text-[0.7rem] text-faint">Green = contribution activity</p>
          </Card>
        </Section>

        {/* BOOK A CALL */}
        <Section id="book" eyebrow="Let's chat" title="Book a free call">
          <Card>
            <div className="reveal flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[1rem] font-semibold text-fg-strong">
                  15 minutes. Zero pressure.
                </p>
                <p className="mt-1 text-[0.9rem] text-muted">
                  Discussing a role, a product idea, or just want to say hi? Grab a slot that works
                  for you and let's talk.
                </p>
              </div>
              <a
                href={content.calendlyUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-fg-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-bg transition hover:-translate-y-px hover:opacity-90"
              >
                <CalendarDays className="h-4 w-4" />
                Book a free call
              </a>
            </div>
          </Card>
        </Section>

        {/* GITA QUOTE */}
        <GitaQuote />

        {/* CONTACT */}
        <Section id="contact">
          <Card>
            <div className="reveal px-6 py-12 text-center">
              <h2 className="mb-2 text-[clamp(1.6rem,4.5vw,2.1rem)] font-bold tracking-[-0.035em] text-fg-strong">
                Hey, you scrolled this far — let's talk.
              </h2>
              <p className="mx-auto mb-5 max-w-100 text-muted">
                I'm open to interesting full-stack roles and collaborations. The quickest way to
                reach me is below.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <a
                  href={content.linkedinUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-fg-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-bg transition hover:-translate-y-px hover:opacity-90"
                >
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
                <a
                  href={content.email}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-border-strong px-4.25 py-2.5 text-[0.9rem] font-medium text-fg transition hover:-translate-y-px hover:bg-pill"
                >
                  <Mail className="h-4 w-4" />
                  Email me
                </a>
              </div>
            </div>
          </Card>
        </Section>
      </main>

      <footer className="mt-8 border-t border-border py-6.5 pb-12 text-center font-mono text-[0.82rem] text-faint">
        Designed &amp; &lt;/&gt; by{" "}
        <a
          href={content.githubUrl}
          target="_blank"
          rel="noopener"
          className="text-fg underline-offset-2 hover:underline"
        >
          {content.heroName}
        </a>{" "}
        · © {new Date().getFullYear()}
      </footer>
    </>
  );
}

/* ------------------------------------------------------------- */
/*  PRIMITIVES                                                    */
/* ------------------------------------------------------------- */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-10">
      {(eyebrow || title) && (
        <div className="reveal mb-6.5">
          {eyebrow && (
            <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-[1.6rem] font-bold tracking-[-0.035em] text-fg-strong">{title}</h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <article className="reveal rounded-[14px] border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-card-hover">
      {children}
    </article>
  );
}

function TechLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 mt-4 font-mono text-[0.66rem] uppercase tracking-widest text-faint">
      {children}
    </div>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((p) => (
        <TechPill key={p} name={p} />
      ))}
    </div>
  );
}

function WorkingBadge() {
  return (
    <span
      className="rounded-full border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.06em] text-ok"
      style={{
        borderColor: "color-mix(in srgb, var(--ok) 40%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--ok) 12%, transparent)",
      }}
    >
      Working
    </span>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener"
      aria-label={label}
      className="grid h-9.5 w-9.5 place-items-center rounded-[10px] border border-border text-muted transition hover:-translate-y-0.5 hover:border-border-strong hover:text-fg-strong"
    >
      {children}
    </a>
  );
}
