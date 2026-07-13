import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TechPill } from "@/components/TechPill";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Oneko } from "@/components/Oneko";
import { useReveal } from "@/hooks/useReveal";
import { getProjects } from "@/data/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Aman Jha" },
      {
        name: "description",
        content:
          "A collection of full-stack projects by Aman Jha — hospitality platforms, developer tools, SEO products and ecommerce.",
      },
      { property: "og:title", content: "Projects — Aman Jha" },
      { property: "og:description", content: "A collection of full-stack projects by Aman Jha." },
    ],
  }),
  loader: () => getProjects(),
  component: ProjectsPage,
});

function ProjectsPage() {
  useReveal();
  const projects = Route.useLoaderData();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  return (
    <>
      <Oneko />
      <nav
        className="sticky top-0 z-50 border-b border-border backdrop-blur-md"
        style={{ backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)" }}
      >
        <div className="mx-auto flex max-w-160 items-center justify-between px-5.5 py-3.25">
          <Link to="/" className="text-[0.95rem] font-semibold tracking-tight text-fg-strong">
            Aman Jha
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

      <main className="mx-auto max-w-160 px-5.5 pb-16 pt-14">
        <header className="reveal mb-8">
          <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
            Featured
          </p>
          <h1 className="text-[clamp(1.9rem,5vw,2.4rem)] font-bold tracking-[-0.035em] text-fg-strong">
            All Projects
          </h1>
          <p className="mt-2 text-muted">
            Everything I've shipped — from hospitality ordering platforms to developer tools,
            ecommerce apps and SEO products.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {projects.map((p) => (
            <article
              key={p.id}
              tabIndex={isTouch ? undefined : 0}
              className="reveal rounded-[14px] border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-card-hover focus-within:border-border-strong focus-within:bg-card-hover outline-none"
            >
              <a
                href={isTouch ? p.href : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/cover -mx-5 -mt-5 mb-4 block overflow-hidden rounded-t-[14px] border-b border-border relative ${
                  isTouch ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <img
                  src={p.coverUrl}
                  alt={`${p.title} cover`}
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                {!isTouch && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px] flex items-center justify-center opacity-0 group-hover/cover:opacity-100 group-focus-within/cover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover/cover:pointer-events-auto group-focus-within/cover:pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(p.href, "_blank", "noopener,noreferrer");
                      }}
                      className="px-4.25 py-2.25 bg-white text-black font-semibold rounded-full hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 outline-none duration-150 shadow-md text-sm cursor-pointer"
                      tabIndex={0}
                    >
                      Preview
                    </button>
                  </div>
                )}
              </a>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <a
                    href={isTouch ? p.href : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-[1.05rem] font-semibold tracking-[-0.02em] text-fg-strong ${
                      isTouch ? "hover:underline cursor-pointer" : "cursor-default"
                    }`}
                  >
                    {p.title}
                  </a>
                  <div className="mt-2 flex items-center gap-2 font-mono text-[0.68rem] text-muted">
                    <span
                      className={`h-1.75 w-1.75 rounded-full ${p.live ? "bg-ok" : "bg-faint"}`}
                      style={p.live ? { animation: "pulse-dot 2.4s infinite" } : undefined}
                    />
                    {p.status}
                  </div>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              <p className="mt-3 text-[0.9rem] text-muted">{p.description}</p>
              <div className="mb-2 mt-4 font-mono text-[0.66rem] uppercase tracking-widest text-faint">
                Technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <TechPill key={t} name={t} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6.5 pb-12 text-center font-mono text-[0.82rem] text-faint">
        Designed &amp; built by Aman Jha · © {new Date().getFullYear()}
      </footer>
    </>
  );
}
